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
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function(v) {
                return /\d{2,3}-\d+/g.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`,
        },
        required: [true, `phone number is required!`]
    },
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