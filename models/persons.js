const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const uri = process.env.MONGODB_URI;
mongoose
  .connect(uri)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB", error.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObjects) => {
    returnedObjects.id = returnedObjects._id.toString();
    delete returnedObjects._id;
    delete returnedObjects.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
