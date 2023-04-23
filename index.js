const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

//morgan tokens
morgan.token("data", (req) => JSON.stringify(req.body));

app.use(cors());
app.use(express.json());
app.use(
  morgan(`:method :url :status :res[content-length] - :response-time ms :data`)
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((i) => i.id === id);
  if (person) {
    response.json(person);
  } else {
    response.statusMessage = "Person not in phonebook";
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  persons = persons.filter((i) => i.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;
  const alreadyExist = persons.find((i) => i.name === name);

  if (!name) {
    return response.status(400).json({ error: "name is required" });
  }

  if (!number) {
    return response.status(400).json({ error: "number is required" });
  }

  if (alreadyExist) {
    return response.status(400).json({ error: "name must be unique" });
  }

  const person = { id: Math.floor(Math.random() * 100), name, number };
  persons = persons.concat(person);
  response.json(persons);
});

app.get("/info", (request, response) => {
  const requestTime = new Date();
  const numberOfPersons = persons.length;
  response.send(`
  <p>phonebook has infor for ${numberOfPersons}</p>
  <p>${requestTime}</p>`);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
