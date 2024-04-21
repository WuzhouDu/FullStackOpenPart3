const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2];

const url = `mongodb+srv://dwz:${password}@fullstackopen.1osvxcf.mongodb.net/?retryWrites=true&w=majority&appName=fullStackOpen`;

mongoose.connect(url);

const phoneBookPersonSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', phoneBookPersonSchema);

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log("phonebook:");
        result.forEach(each => {
            console.log(`${each.name} ${each.number}`);
        });
        mongoose.connection.close();
    }).catch(err => {
        mongoose.connection.close();
    });
}
else if (process.argv.length === 5) {
    const newPerson = new Person({
        name: process.argv[3],
        number: process.argv[4],
    });

    newPerson.save().then(res => {
        console.log(`added ${newPerson.name} ${newPerson.number} to phonebook`);
        mongoose.connection.close();
    })
}