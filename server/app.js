require('dotenv/config')

const express = require('express')
const path = require('node:path')
const cookieParser = require('cookie-parser')
const verifyOrigin = require('./middleware/verifyOrigin')

const authRouter = require('./controllers/auth')
const keyRouter = require('./controllers/keys')
const checkoutRouter = require('./controllers/checkout')

const app = express()
const publicDirectory = path.join(__dirname, 'public')


app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use(express.json())
app.use(cookieParser())
app.use('/api', verifyOrigin)

app.use('/api/auth', authRouter)
app.use('/api/keys', keyRouter)
app.use('/api/checkouts', checkoutRouter)

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API endpoint not found' })
})

app.use(express.static(publicDirectory))

app.get('/{*splat}', (_req, res) => {
  res.sendFile(path.join(publicDirectory, 'index.html'))
})

module.exports = app