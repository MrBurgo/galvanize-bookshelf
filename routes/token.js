'use strict';

const express = require('express')
const humps = require('humps')
const camelCase = require('camelcase-keys')
const knex = require('../knex')
const decamelize = require('decamelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// eslint-disable-next-line new-cap
const router = express.Router();
const key = process.env.JWT_KEY

// YOUR CODE HERE
router.get('/token', (req, res, next) => {
  if (!req.cookies.token) {
    res.json(false)
  } else {
    res.json(true)
  }
})

// const checkPass = (req, res, next) => {
//   let passCheck;
//   knex('users')
//     .then((users) => {
//       passCheck = bcrypt.compareSync(req.body.password, users[0].hashed_password)
//     })
// }

router.post('/token', (req, res, next) => {
  const user = {
    email: req.body.email
  }
  knex('users')
    .then((users) => {
      bcrypt.compare(req.body.password, users[0].hashed_password, (err, response) => {
        if (req.body.email === users[0].email && response) {
          user.id = users[0].id
          user.firstName = users[0].first_name
          user.lastName = users[0].last_name
          const signedUser = jwt.sign(user, key)
          res.cookie('token', signedUser, { path: '/', httpOnly: true }).json(user)
        } else {
          res.status(400).type('text/plain').send('Bad email or password')
        }
      })
    })
})

router.delete('/token', (req, res, next) => {
  res.cookie('token', '').json(true)
})
module.exports = router;
