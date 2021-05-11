var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//Set up mongoose connection
var mongoDB = 'mongodb+srv://nonso1:pipper@cluster0.h3kxv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err) => {
  if (!err) {
    console.log('database connection successful')
  }
});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const personSchema = new mongoose.Schema({
  name: String,
  email: String,
  country: String
})

const Person = mongoose.model('Person', personSchema)

/* Add New User. */
router.post('/users', function (req, res) {
  const person = req.body
  Person.create({
    name: person.name,
    email: person.email,
    country: person.country
  }, (err, newPerson) => {
    if (err) {
      return res.status(500).json({ message: err })
    }
    else {
      return res.status(200).json({ message: 'You successfully added a new person', newPerson })
    }
  })
});

/* Get All Users. */
router.get('/users', (req, res) => {
  Person.find({}, (err, people) => {
    if (err) {
      return res.status(500).json({ message: err })
    }
    else if(people.length == 0){
      return res.status(404).json({message: 'There is no user currently in database'})
    }
    else {
      return res.status(200).json({ message: 'You successfully querried all users on database', people })
    }
  })
})

/* Get a User by Id. */
router.get('/users/:id', (req, res) => {
  Person.findOne({ _id: req.params.id }, (err, person) => {
    if (err) {
      return res.status(500).json({ message: err })
    }
    else if (!person) {
      return res.status(404).json({ message: 'User not found' })
    }
    else {
      return res.status(200).json({ message: "You successfully queried User", person })
    }
  })
})

/* Update a User by Id. */
router.put('/users/:id', (req, res) => {
  Person.findByIdAndUpdate(req.params.id, { name: req.body.name, email: req.body.email, country: req.body.country },
    (err, person) => {
      if (err) {
        return res.status(500).json({ message: err })
      }
      else if (!person) {
        return res.status(404).json({ message: "User not found" })
      }
      else {
        person.save((err, person) => {
          if (err) {
            return res.status(400).json({ message: err })
          }
          else {
            return res.status(200).json({ message: 'User updated successfully' })
          }
        })
      }
    })
})

/* Delete a User by Id. */
router.delete('/users/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id, (err, person) => {
    if (err) {
      return res.status(500).json({ message: err })
    }
    else if (!person) {
      return res.status(404).json({ message: "User not found" })
    }
    else {
      return res.status(200).json({ message: 'User successfully deleted' })
    }
  })
})

/* GET home page. */
router.get('/', function (req, res) {
  res.send('A SIMPLE USER DATBASE ')
});

module.exports = router;
