const { faker } = require('@faker-js/faker');
const mongoose = require("mongoose");
const User = require('../src/models/User');
const Status = require('../src/models/Status');
mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/insta-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
async function generateStatus(){
  const users = await User.find({});
  console.log('users', users.length)
  users.map( async (u)=>{
    const statuses = [];
    for(let i=0;i<5;i++){
      statuses.push(new Status({
        "postedBy": u._id,
        "type": "image",
        "content": faker.image.url(),
      }));  
    }
    console.log("user", u);
    console.log("================================================");
    await  Status.insertMany(statuses);
  })
  console.log("Finished");
}

generateStatus();