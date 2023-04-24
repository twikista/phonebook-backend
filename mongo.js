const mongoose = require("mongoose");

const argsLength = process.argv.length;
if (argsLength < 3) {
  console.log("input password arguement");
  process.exit(1);
}

const password = process.argv[2];

const uri = `mongodb+srv://twikista:${password}@cluster0.cxggszr.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(uri);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const name = process.argv[3];
const number = process.argv[4];

const person = new Person({
  name,
  number,
});

argsLength > 3
  ? person.save().then((response) => {
      console.log(`added ${response.name} to phonebook`);

      mongoose.connection.close();
    })
  : Person.find({}).then((result) => {
      console.log("phonebook:");
      result.forEach((i) => console.log(`${i.name} ${i.number}`));
      mongoose.connection.close();
    });
