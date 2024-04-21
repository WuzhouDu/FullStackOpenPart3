const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(express.static('dist'));
app.use(express.json());
app.use(cors());

morgan.token('body', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body);
    }
    else {
        return '';
    }
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/info', (req, res) => {
    res.status(200).send(`<div><p>Phonebook has info for ${persons.length} people </p> <p>${Date()}</p> </div>`);
});

app.get('/api/persons/:id', (req, res) => {
    const searchedId = Number(req.params.id);
    const searchedPerson = persons.find(each => {
        return each.id === searchedId;
    });

    if (searchedPerson) {
        res.status(200).json(searchedPerson);
    }
    else {
        res.status(404).send("Sorry, not found");
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const deletedId = Number(req.params.id);
    persons = persons.filter(each => each.id !== deletedId);
    res.status(204).send();
});

app.post('/api/persons', (req, res) => {
    const newPerson = req.body;
    if (newPerson.name && newPerson.number) {
        if (!persons.find(each => each.name == newPerson.name)) {
            const newId = Math.random() * (1 << 32 - 1);
            newPerson.id = newId;
            persons = persons.concat(newPerson);
            res.json(newPerson);
        }
        else {
            return res.status(400).json({ error: "name should be unique" });
        }
    }
    else {
        return res.status(400).json({error: "name and number should not be empty"});
    }
});

app.put('/api/persons/:id', (req, res) => {
    const updatedPerson = req.body;
    const updatedId = Number(req.params.id);
    const updatedPersonIndex = persons.findIndex(each => each.id === updatedId);
    if (updatedPersonIndex !== -1) {
        persons[updatedPersonIndex] = updatedPerson;
        res.json(updatedPerson);
    }
    else {
        res.status(404).send("Sorry, not found");
    }
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`listen on port ${PORT}`);
});