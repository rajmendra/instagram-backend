const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Status = require('../src/models/Status');
const Follow = require('../src/models/Follow');
const Comment = require('../src/models/Comment');
const Like = require('../src/models/Like');


mongoose.connect('mongodb://localhost:27017/insta-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

async function generateData() {
  try {
    for (let i = 0; i < 1000; i++) {
      try{
      const user = {
        username: faker.internet.userName(),
        password: '$2b$10$OnPIlU8fzEPXei6UKc83yuCxDRLcZ6dBxbiAn.4olleuLJrkRTl7a', // 123456 this is the default password for all
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        bio: faker.person.bio(),
        profilePicture: faker.image.avatar(),
      };

      const newUser = new User(user);
      console.log('user', user);
      console.log('================================================');
      console.log('i', i);
      await newUser.save();
    }catch(e){
      console.log(e)
    }
    }

    console.log('User Data Generation Finished');

    // Now, let's generate status data
    const users = await User.find({});
    console.log('users', users.length);

    const statusPromises = users.map(async (u) => {
      const statuses = [];
      for (let i = 0; i < 5; i++) {
        statuses.push(
          new Status({
            postedBy: u._id,
            type: 'image',
            content: faker.image.url(),
          })
        );
      }
      console.log('user', u);
      console.log('================================================');
      await Status.insertMany(statuses);
    });

    await Promise.all(statusPromises);

        // Generate follow data
    const users_s = await User.find({});
    console.log('users_s', users_s.length);
    const min = 1;
    const max = 1000;

    for (let i = 0; i < users_s.length; i++) {
      const randomInteger = Math.floor(Math.random() * (max - min + 1)) + min;
      const random_users = await User.find().skip(randomInteger).limit(10);
    
      const followPromises = random_users.map(async (u) => {
        // Check if the follow already exists
        const existingFollow = await Follow.findOne({ followerId: users_s[i]._id, followingId: u._id });
    
        if (!existingFollow) {
          // Create a new follow only if it doesn't already exist
          await Follow.create({
            followerId: users_s[i]._id,
            followingId: u._id,
          });
        }
      });
    
      await Promise.all(followPromises);
    }

    console.log('Follow Data Generation Finished');
    console.log('Updating Likes and Status...');
    // Generate like and comment data
    const statuses_s = await Status.find({});
    console.log('statuses_s', statuses_s.length);

    const likeAndCommentPromises = statuses_s.map(async (s) => {
      // Generate 5 likes for each status
      const likeIds = [];
      const likePromises = Array.from({ length: 5 }, async () => {
        const randomUser = users_s[Math.floor(Math.random() * users_s.length)];
        const like = await Like.create({
          userId: randomUser._id,
          statusId: s._id,
        });
        likeIds.push(like._id);
      });
      // Generate 5 comments for each status
      const commentIds = [];
      const commentPromises = Array.from({ length: 5 }, async () => {
        const randomUser = users_s[Math.floor(Math.random() * users_s.length)];
        const comment = await Comment.create({
          userId: randomUser._id,
          statusId: s._id,
          content: faker.lorem.sentence(),
        });
        commentIds.push(comment._id);
      });

      await Promise.all([...likePromises, ...commentPromises]);

      console.log('Creating likes and comments for', s._id);
      // Update Status model with like and comment IDs
      await Status.findByIdAndUpdate(s._id, {
      $push: { likes: { $each: likeIds }, comments: { $each: commentIds } },
      });
    });

    await Promise.all(likeAndCommentPromises);
    console.log('Updating follows...');
    for (let i = 0; i < users_s.length; i++) {
      const followingUser = await User.findById(users_s[i]._id);
      const updatedFollowerCount = await Follow.countDocuments({ followingId: followingUser._id });
      await User.findByIdAndUpdate(users_s[i]._id, { followerCount: updatedFollowerCount });
    }

    console.log('Data Generation Finished');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect(); // Close the MongoDB connection after the script finishes
  }
}

generateData();
