require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const Person = require("./models/persons");

//morgan tokens
morgan.token("data", (req) => JSON.stringify(req.body));

app.use(cors());
app.use(express.json());
app.use(express.static("build"));
app.use(
  morgan(`:method :url :status :res[content-length] - :response-time ms :data`)
);

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => response.json(persons));
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findById(id).then((person) => {
    if (person) {
      response.status(400).json(person);
    } else {
      response.statusMessage = "Person not in phonebook";
      response.status(404).end();
    }
  });
});

// app.delete("/api/persons/:id", (request, response) => {
//   const id = Number(request.params.id);

//   persons = persons.filter((i) => i.id !== id);
//   response.status(204).end();
// });

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;

  if (!name) {
    return response.status(400).json({ error: "name is required" });
  }

  if (!number) {
    return response.status(400).json({ error: "number is required" });
  }

  Person.find({ name: name }).then((personExist) => {
    if (personExist.length) {
      console.log(personExist[0]?.name, "already exist");
      console.log(personExist);
      return response.status(400).json({ error: "name must be unique" });
    } else {
      const person = new Person({
        name,
        number,
      });

      person.save().then((newPerson) => {
        console.log(newPerson);
        response.json(newPerson);
      });
    }
  });
});

/*app.get("/info", (request, response) => {
  const requestTime = new Date();
  const numberOfPersons = persons.length;
  response.send(`
  <p>phonebook has infor for ${numberOfPersons}</p>
  <p>${requestTime}</p>`);
});*/

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
