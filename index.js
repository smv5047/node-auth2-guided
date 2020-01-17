const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const session = require("express-session")

const authRouter = require("./auth/auth-router")
const usersRouter = require("./users/users-router")

const server = express()
const port = process.env.PORT || 5000

server.use(helmet())
server.use(cors())
server.use(express.json())
server.use(session({
  resave: false,
  saveUnintialized:false, //GDPR laws against setting cookies
  secret: "keep it secret, keep it safe!",
  cookie: {
    httpOnly: true,// cannot acces the cookie from JS (more secure)
    maxAge: 1000*60*60 *24*7, // keep session for a week
    secure: false, // in prod this should be true
  }
}))

server.use("/auth", authRouter)
server.use("/users", usersRouter)

server.get("/", (req, res, next) => {
  res.json({
    message: "Welcome to our API",
  })
})

server.use((err, req, res, next) => {
  console.log("Error:", err)

  res.status(500).json({
    message: "Something went wrong",
  })
})


server.listen(port, () => {
  console.log(`\n** Running on http://localhost:${port} **\n`)
})