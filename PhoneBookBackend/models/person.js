const mongoose = require('mongoose');

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false);
mongoose.connect(url)
    .then(res => {
        console.log(`connected to ${url}`);
    })
    .catch(err => {
        console.log(`error when connecting to ${url}, msg: ${err.message}`);
    });
const phoneBookPersonSchema = new mongoose.Schema({
    name: String,
    number: String,
});
phoneBookPersonSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});
const Person = mongoose.model('Person', phoneBookPersonSchema);

module.exports = Person;