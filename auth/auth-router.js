const bcrypt = require("bcryptjs")
const express = require("express")
const usersModel = require("../users/users-model")

const router = express.Router()



router.post("/register", async (req, res, next) => {
  try {
    const saved = await usersModel.add(req.body)
    
    res.status(201).json(saved)
  } catch (err) {
    next(err)
  }
})

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await usersModel.findBy({ username }).first()
    // since bcrypt hashes generate different results due to the salting,
    // we rely on the magic internals to compare hashes (rather than doing
    // it manulally by re-hashing and comparing)
    const passwordValid = await bcrypt.compare(password, user.password)

    if (user && passwordValid) {
      //after authen, store the user data in current session
      //so it persists between requests
      req.session.user = user
      //since we instlaled the middleware 
      //it's available in all route handlers
      //anything that comes after session in our middleware chain has access to it
      res.status(200).json({
        message: `Welcome ${user.username}!`,
      })
    } else {
      res.status(401).json({
        message: "Invalid Credentials",
      })
    }
  } catch (err) {
    next(err)
  }
})

router.get("/protected", async (req, res, next) => {
  try {
    if(!req.session || !req.session.user){
      return res.status(403).json({
            message: "You are not authorized"
          })
    }
    res.json({
      message: "You are authorized",
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router