require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

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

app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => res.json(result));
});

app.get('/info', (req, res) => {
    Person.find({}).then(result => res.status(200).send(`<div><p>Phonebook has info for ${result.length} people </p> <p>${Date()}</p> </div>`));
});

app.get('/api/persons/:id', (req, res, next) => {
    const searchedId = req.params.id;
    Person.findById(searchedId).then(found => {
        if (found) {
            res.json(found);
        }
        else {
            res.status(404).end();
        }
    })
        .catch(err => next(err));

});

app.delete('/api/persons/:id', (req, res, next) => {
    const deletedId = req.params.id;
    Person.findByIdAndDelete(deletedId).then(result => {
        res.status(204).send();
    })
        .catch(err => next(err));
});

app.post('/api/persons', (req, res) => {
    const newPerson = req.body;
    if (newPerson.name && newPerson.number) {
        const newPersonInDB = new Person({ name: newPerson.name, number: newPerson.number });
        newPersonInDB.save().then(savedPerson => {
            res.json(savedPerson);
        })
            .catch(err => {
                console.log(err);
            });
    }
    else {
        return res.status(400).json({ error: "name and number should not be empty" });
    }
});

app.put('/api/persons/:id', (req, res) => {
    const updatedPerson = req.body;
    const updatedId = req.params.id;

    Person.findByIdAndUpdate(updatedId, { name: updatedPerson.name, number: updatedPerson.number }, { returnDocument: 'after' })
        .then(result => {
            res.json(result);
            // console.log(result);
        })
        .catch(err => next(err));
});

const errorHandler = (err, req, res, next) => {
    console.error(err.message);

    if (err.name === 'CastError') {
        return res.status(400).send({ error: `malformatted id` });
    }

    next(err);
}

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`listen on port ${PORT}`);
});