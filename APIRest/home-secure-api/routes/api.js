var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");

router.post('/signup', function(req, res) {
    if(!req.body.name || !req.body.email || !req.body.password || !req.body.calle || !req.body.colonia) {
        res.json({success: false, msg: 'Provide a name, username, a password and home info.'});
    } else {
        var newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            calle: req.body.calle,
            colonia: req.body.colonia
        });
        
        // Save the user
        newUser.save(function(err) {
            if (err) {
              console.log(err);
                return res.json({success: false, msg: 'Email already exists.'})
            }

            res.json({success: true, msg: 'Successful created new user'});
        });
    }
});

router.post('/signin', function(req, res) {
    User.findOne({
      email: req.body.email
    }, function(err, user) {
      if (err) throw err;
  
      if (!user) {
        res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
      } else {
        // check if password matches
        console.log(req.body.password);
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.sign(user.toJSON(), config.secret);
            // return the information including token as JSON
            res.json({success: true, token: token, id: user._id, name: user.name, street: user.calle, address: user.colonia});
          } else {
            res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
        });
      }
    });
  });

  module.exports = router;