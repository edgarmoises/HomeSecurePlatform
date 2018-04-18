var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
var email = require('./email');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");
var Visit = require("../models/visit");

router.get('/', passport.authenticate('jwt', { session: false }), function(req, res) {
    var token = getToken(req.headers);
    if(token) {
        console.log(req.body);

        User.find(function(err, users) {
            if(err) return res.status(500).send({success: false, msg: 'Server error'});

            res.json(users);
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'})
    }
});

router.get('/:id', passport.authenticate('jwt', { session: false }), function(req, res) {
    var token = getToken(req.headers);
    if(token) {
        console.log(req.body);

        User.findById(req.params.id, function(err, user) {
            if(err) res.status(500).send({success: false, msg: 'Server error'});

            res.json(user);
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'})
    }
});

router.get('/visit/:id', passport.authenticate('jwt', { session: false }), function(req, res) {
    var token = getToken(req.headers);
    if(token) {
        console.log(req.body);

        User.findById(req.params.id, function(err, user) {
            if(err) res.status(500).send({success: false, msg: 'Server error'});

            Visit.find({ idResidente: req.params.id }, function(err, visits) {
                if(err) res.status(500).send({success: false, msg: 'Server error'});

                res.json(visits);
            });
        })
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'})
    }
});

router.put('/:id', passport.authenticate('jwt', { session: false }), function(req, res) {
    var token = getToken(req.headers);
    if(token) {
        User.findById(req.params.id, function(err, user) {
            if(err) res.status(500).send({success: false, msg: 'Server error'});

            if(req.body.name){
                user.name = req.body.name;
            }

            if(req.body.email) {
                user.email = req.body.email;
            }

            if(req.body.calle) {
                user.calle = req.body.calle;
            }

            if(req.body.colonia) {
                user.colonia = req.body.colonia;
            }

            if(req.body.status) {
                user.status = req.body.status;
            }

            user.save(function(err) {
                if(err) res.status(500).send({success: false, msg: 'Server error'});

                res.status(200).send({success: true, msg: 'User info updated'});
            });
        })
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'})
    }
});

router.get('/activateUserAccount/:id', passport.authenticate('jwt', { session: false }), function(req, res) {
    var token = getToken(req.headers);
    if(token) {
        User.findById(req.params.id, function(err, user) {
            if(err) res.status(500).send({success: false, msg: 'Server error'});

            user.estatus = 'activo';
            user.save(function(err, user) {
                if(err) res.status(500).send({success: false, msg: 'Server error'});
                console.log(user);
                email.sendMail(user.email, 'Activación de cuenta', 'Tu cuenta ha sido activada');

                res.status(200).send({success: true, msg: 'User info updated'});
            });
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

getToken = function (headers) {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
};

module.exports = router;