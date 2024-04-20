const express = require('express');

const app = express();

const persons = [
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
    // console.log(req.headers);
    res.json(persons);
})

app.get('/info', (req, res) => {
    // console.log(req.headers);
    res.status(200).send(`<div><p>Phonebook has info for ${persons.length} people </p> <p>${Date()}</p> </div>`);
})

const PORT = 3002;

app.listen(PORT, ()=>{
    console.log(`listen on port ${PORT}`);
});