const { faker } = require('@faker-js/faker');
const mongoose = require("mongoose");
const User = require('../src/models/User');
mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/insta-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
async function generateData(){
for (i = 0; i < 1000; i++) {
  const user = {
    "username": faker.internet.userName(),
    "password": "$2b$10$OnPIlU8fzEPXei6UKc83yuCxDRLcZ6dBxbiAn.4olleuLJrkRTl7a", // 123456 this is default pass for all 
    "fullName": faker.person.fullName(),
    "email": faker.internet.email(),
    "bio": faker.person.bio(),
    "profilePicture": faker.image.avatar(),
  }
  const newUser = new User(user);
  console.log("user", user);
  console.log("================================================");
  console.log("i", i);
  await newUser.save();
}


console.log("Finished");
}
generateData();