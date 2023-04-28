require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const Person = require("./models/persons");

//morgan tokens
morgan.token("data", (req) => JSON.stringify(req.body));

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(
  morgan(`:method :url :status :res[content-length] - :response-time ms :data`)
);

const errorHandler = (error, request, response, next) => {
  console.log(error);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "invalid id type" });
  } else if (error.name === "ValidationError") {
    // console.log(error);
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => response.json(persons));
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.status(400).json(person);
      } else {
        response.statusMessage = "Person not in phonebook";
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findByIdAndRemove(id)
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).send({ error: "person not found" });
      }
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

app.post("/api/persons", (request, response, next) => {
  const { name, number } = request.body;

  // if (!name) {
  //   return response.status(400).json({ error: "name is required" });
  // }

  // if (!number) {
  //   return response.status(400).json({ error: "number is required" });
  // }

  const person = new Person({
    name,
    number,
  });

  person
    .save()
    .then((newPerson) => {
      console.log(newPerson);
      response.json(newPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const person = request.body;
  Person.findByIdAndUpdate(id, person, {
    new: "true",
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response) => {
  const requestTime = new Date();
  Person.find({}).then((persons) => {
    const numberOfPersons = persons.length;
    response.send(`
  <p>phonebook has infor for ${numberOfPersons}</p>
  <p>${requestTime}</p>`);
  });
});

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
