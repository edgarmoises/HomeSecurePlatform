var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var Visit = require("../models/visit");

router.get('/', passport.authenticate('jwt', { session: false }), function(req, res) {
    var token = getToken(req.headers);
    if(token) {
        console.log(req.body);

        Visit.find(function(err, visits) {
            if(err) return res.status(500).send({success: false, msg: 'Server error'});

            res.json(visits);
        })
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'})
    }
});

router.post('/', passport.authenticate('jwt', { session: false }), function(req, res) {
    var token = getToken(req.headers);
    if(token) {
        console.log(req.body);

        if(!req.body.calle || !req.body.colonia || !req.body.nombreVisitante || !req.body.nombreResidente || !req.body.idResidente) {
            res.json({success: false, msg: 'Provide all visit information'});
        } else {
            var newVisit = new Visit({
                calle: req.body.calle,
                colonia: req.body.colonia,
                nombreVisitante: req.body.nombreVisitante,
                nombreResidente: req.body.nombreVisitante,
                idResidente: req.body.idResidente,
                status: req.body.status
            });

            newVisit.save(function(err) {
                if (err) {
                    return res.json({success: false, msg: 'Error saving new visit'})
                }
    
                res.status(200).send({success: true, msg: 'Successful created new visit'});
            });
        }
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'})
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