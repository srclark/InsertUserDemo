var express = require('express');
var router = express.Router();
var model = require('../models/index');
//var mysql = require('mysql');

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

/*
 * GET all the users
 */
router.get('/', function(req, res, next) {
	model.users.findAll({})
    .then(users => res.json(users
		))
    .catch(error => res.send(
      JSON.stringify({"status": 500, "error": error, "response": null})
  ));

});

/*
 * Post add users
 *
 * We are going to do as much verification of the data as we
 * can before we send the data through sequalize.  Sequelize
 * should prevent SQL injections.
 */
router.post('/adduser', [
  sanitize('first_name').trim(),
  sanitize('first_name').escape(),
  check('first_name', 'First name is too long').isLength({max:20}),
  sanitize('last_name').trim(),
  sanitize('last_name').escape(),
  check('last_name', 'Last name is too long').isLength({max:20}),
  sanitize('street_addr').trim(),
  sanitize('street_addr').escape(),
  check('street_addr', 'Street address is too long').isLength({max:80}),
  sanitize('city').trim(),
  sanitize('city').escape(),
  check('city', 'City name is too long').isLength({max:20}),
  sanitize('state').trim(),
  sanitize('state').escape(),
  check('state', 'State name is too long').isLength({max:15}),
  sanitize('zip').trim(),
  // Zip code needs to be a very specific format
  check('zip', 'Zip code is not valid').matches(/^\d{5}(-\d{4})?$/)
], (req, res, next) => {

  var user = req.body;
  //console.log(user);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.mapped());
    return res.send({msg: errors.mapped()});
  } else {
		model.users.create({
    	first_name: user.first_name,
			last_name: user.last_name,
			street_addr: user.street_addr,
			city:	user.city,
			state: user.state,
			zip: user.zip
  	}).then(users => res.send({
        msg: ''
    })).catch(error => {
      var msg = JSON.stringify({"status": 500, "error": error, "response": null})
      res.send({msg: msg});
  	});
  }
});

router.delete('/deleteuser/:id', (req, res, next) => {
  var userId = req.params.id;
  model.users.destroy({
    where: {
      id:  userId
    }
  }).then(users => res.send({
    msg: ''
  })).catch(error => {
    console.log(error);
    var msg = JSON.stringify({"status": 500, "error": error, "response": null})
    res.send({msg: msg});
  });
});

module.exports = router;
