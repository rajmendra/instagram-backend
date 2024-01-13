const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");
const User = require("../src/models/User");
const Status = require("../src/models/Status");
const Follow = require("../src/models/Follow");
const Comment = require("../src/models/Comment");
const Like = require("../src/models/Like");

mongoose.connect("mongodb://localhost:27017/insta-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
  generateData();
});

async function createUserAndStatus() {
  const users = [];
  for (let i = 0; i < 50; i++) {
    const user = {
      username: faker.internet.userName(),
      password:
        "$2b$10$OnPIlU8fzEPXei6UKc83yuCxDRLcZ6dBxbiAn.4olleuLJrkRTl7a", // 123456 this is the default password for all
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      bio: faker.person.bio(),
      profilePicture: faker.image.avatar(),
    };
    users.push(user);
  }

  console.log("User Data Generation Finished");
  await User.insertMany(users);

  // Now, let's generate status data
  const statuses = [];
  const allUsers = await User.find({});
  for (const user of allUsers) {
    for (let i = 0; i < 5; i++) {
      statuses.push({
        postedBy: user._id,
        type: "image",
        content: faker.image.url(),
      });
    }
  }

  console.log("Status Data Generation Finished");
  await Status.insertMany(statuses);
}

async function createFollowData() {
  const allUsers = await User.find({});
  for (const user of allUsers) {
    const randomInteger = Math.floor(Math.random() * allUsers.length);
    const randomUsers = allUsers
      .filter((_, index) => index !== randomInteger)
      .slice(0, 10);

    const followData = randomUsers.map((randomUser) => ({
      followerId: user._id,
      followingId: randomUser._id,
    }));

    await Follow.insertMany(followData);
  }

  console.log("Follow Data Generation Finished");
}

async function createLikeAndComment() {
  console.log("Updating Likes and Status...");

  const allUsers = await User.find({});
  const allStatuses = await Status.find({});

  const likeAndCommentData = allStatuses.flatMap((status) => {
    const likeData = Array.from({ length: 5 }, () => {
      const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
      return {
        userId: randomUser._id,
        statusId: status._id,
      };
    });

    const commentData = Array.from({ length: 5 }, () => {
      const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
      return {
        userId: randomUser._id,
        statusId: status._id,
        content: faker.lorem.sentence(),
      };
    });
    console.log('commentData', commentData);
    return [...likeData, ...commentData];
  });

  console.log("Creating Likes and Comments...");
  await Promise.all([
    Like.insertMany(likeAndCommentData.slice(0, likeAndCommentData.length / 2)),
    Comment.insertMany(likeAndCommentData.slice(likeAndCommentData.length / 2)),
  ]);

  console.log("Updating Likes and Comments for Statuses...");
  await Promise.all(
    allStatuses.map((status) =>
      Status.findByIdAndUpdate(status._id, {
        $push: {
          likes: { $each: likeAndCommentData.slice(0, likeAndCommentData.length / 2).map((l) => l._id) },
          comments: { $each: likeAndCommentData.slice(likeAndCommentData.length / 2).map((c) => c._id) },
        },
      })
    )
  );
}

async function updateFollows() {
  console.log("Updating Follows...");

  const allUsers = await User.find({});
  for (const user of allUsers) {
    const updatedFollowerCount = await Follow.countDocuments({ followingId: user._id });
    await User.findByIdAndUpdate(user._id, { followerCount: updatedFollowerCount });
  }

  console.log("Follows Update Finished");
}

async function generateData() {
  await User.deleteMany({});
  await Status.deleteMany({});
  await Follow.deleteMany({});
  await Comment.deleteMany({});
  await Like.deleteMany({});

  try {
    await createUserAndStatus();
    await createFollowData();
    await createLikeAndComment();
    await updateFollows();

    console.log("Data Generation Finished");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.disconnect();
  }
}
