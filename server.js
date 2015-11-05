// ALWAYS CHECK VERSIONS OF PACKAGES ARE UP TO DATE
//server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

var mongoose = require('mongoose');
db = mongoose.connect('mongodb://<user>:<password>@ds049864.mongolab.com:49864/drwow'); // connect to our database
//modulus 'mongodb://alexlemons1:modulus@apollo.modulusmongo.net:27017/vebEb2ex'

// console.log(db)
// console.log(db.connection.readyState); //logs connection status to db - 0 is disconnected, 1 is connected, 2 is connecting

var User = require('./app/models/user');
var Consultation = require('./app/models/consultation');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('request was sent to our API');
    next(); // make sure we go to the next routes and don't stop here
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

router.route('/users')

  // create a user (accessed at POST http://localhost:8080/api/users)
  .post(function(req, res) {

      var user = new User();   // create a new instance of the User model
      user.name = req.body.name;  // set the users name (comes from the request)

      console.log(user);
      console.log(db.connection.readyState);

      // save the user and check for errors
      user.save(function(err) {
          if (err)
            res.send(err);

          res.json({ message: 'User created!' });
      });
  })    //adding a semi-colon here raises error

  // get all the users (accessed at GET http://localhost:8080/api/users)
  .get(function(req, res) {
    User.find(function(err, users) {
        if (err)
          res.send(err);

        res.json(users);
    });
  });

router.route('/users/:user_id')

  // get the user with that id (accessed at GET http://localhost:8080/api/users/:user_id)
  .get(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err)
        res.send(err);
      res.json(user);
    });
  })

  // update the user with this id (accessed at PUT http://localhost:8080/api/users/:user_id)
  .put(function(req, res) {

    // use our user model to find the user we want
    User.findById(req.params.user_id, function(err, user) {
      if (err)
        res.send(err);
      user.name = req.body.name;  // update the users info

    // save the user
      user.save(function(err) {
      if (err)
         res.send(err);

      res.json({ message: 'User updated!' });
      });
    });
  })

  // delete the user with this id (accessed at DELETE http://localhost:8080/api/users/:user_id)
  .delete(function(req, res) {

    User.remove({
      _id: req.params.user_id
    }, function(err, user) {
      if (err)
        res.send(err);

      res.json({ message: 'Successfully deleted' });
    });
  });

router.route('/consultations')

  // create a consultation (accessed at POST http://localhost:8080/api/consultations)
  .post(function(req, res) {

      var consultation = new Consultation();   // create a new instance of the Consultation model
      consultation.description = req.body.description;  // set the consultation description (comes from the request)
      consultation.patientID = req.body.patientID; //pass in id as string eg.JSON in request body = {"description":"TEST2", "patientID": "563a1a850d5fa4860f26d81c"}
      consultation.drID = req.body.drID;

      console.log(consultation);

      // save the consultation and check for errors
      consultation.save(function(err) {
          if (err)
            res.send(err);

          res.json({ message: 'Consultation created!' });
      });
  })

  // get all the consultations (accessed at GET http://localhost:8080/api/consultations)
  .get(function(req, res) {
    Consultation.find(function(err, consultations) {
        if (err)
          res.send(err);

        res.json(consultations);
    });
  });

router.route('/consultations/:consultation_id')

  // get the consultation with that id (accessed at GET http://localhost:8080/api/consultations/:consultation_id)
  .get(function(req, res) {
    Consultation.findById(req.params.consultation_id, function(err, consultation) {
      if (err)
        res.send(err);
      res.json(consultation);
    });
  })

  // update the consultation with this id (accessed at PUT http://localhost:8080/api/consultations/:consultation_id)
  .put(function(req, res) {

    // use our consultation model to find the consultation we want
    Consultation.findById(req.params.consultation_id, function(err, consultation) {
      if (err)
        res.send(err);
      consultation.description = req.body.description; //update consultation data
      consultation.patientID = req.body.patientID;
      consultation.drID = req.body.drID;

    // save the consultation
      consultation.save(function(err) {
      if (err)
         res.send(err);

      res.json({ message: 'Consultation updated!' });
      });
    });
  })

  // delete the consultation with this id (accessed at DELETE http://localhost:8080/api/consultations/:consultation_id)
  .delete(function(req, res) {

    Consultation.remove({
      _id: req.params.consultation_id
    }, function(err, consultation) {
      if (err)
        res.send(err);

      res.json({ message: 'Successfully deleted' });
    });
  });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server port is ' + port);
