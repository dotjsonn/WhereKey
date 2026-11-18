const express = require('express')
const cookieParser = require('cookie-parser')
const verifyOrigin = require('./middleware/verifyOrigin')

const authRouter = require('./controllers/auth')
const keyRouter = require('./controllers/keys')
const checkoutRouter = require('./controllers/checkout')
const app = express()

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use(express.json())
app.use(cookieParser())
app.use('/api', verifyOrigin)

app.use('/api/auth', authRouter)
app.use('/api/keys', keyRouter)
app.use('/api/checkouts', checkoutRouter)

module.exports = app