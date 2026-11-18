const authRouter = require('express').Router()
const { pool } = require('../db/pool')
const verifyToken = require('../middleware/authMiddleware')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const tokenLifetimeSeconds = 30 * 60

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/'
}

const readCredentials = (body) => {
  if (typeof body?.email !== 'string' ||
    typeof body?.password !== 'string'
  ) {
    return null
  }

  const email = body.email.trim()
  const password = body.password

  if (!email || !password) {
    return null
  }

  return { email, password }
}

authRouter.post('/register', async (req, res) => {
  const credentials = readCredentials(req.body)

  if (!credentials) {
    return res.status(400).json({ error: 'Enter email and password' })
  }

  const { email, password } = credentials

  try {
    const password_hash = await bcrypt.hash(password, 10)

    const result = await pool.query(`
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING id, email
    `, [email.trim(), password_hash])

    res.status(201).json(result.rows[0])
  } catch (error) {
    if (error.code === '23505' &&
      error.constraint === 'users_email_key'
    ) {
      return res.status(409).json({
        error: 'Email is already registered'
      })
    }

    console.error('Registration failed:', error)
    return res.status(500).json({ error: 'Registration failed' })
  }  
})

authRouter.post('/login', async (req, res) => {
  const credentials = readCredentials(req.body)

  if (!credentials) {
    return res.status(400).json({ error: 'Enter email and password' })
  }

  const { email, password } = credentials

  try {
    const result = await pool.query(`
      SELECT id, email, password_hash
      FROM users
      WHERE email = $1
    `, [email])
    
    const user = result.rows[0]
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      })
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash)
    if (!passwordMatches) {
      return res.status(401).json({
        error: 'Invalid email or password'
      })
    }

    const payload = {
      email: user.email,
      id: user.id
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: tokenLifetimeSeconds
    })

    res.cookie('token', token, {
      ...cookieOptions,
      maxAge: tokenLifetimeSeconds * 1000
    })

    res.status(200).json({ message: 'Logged in successfully' })
  } catch (error) {
    console.error('Login failed:', error)
    return res.status(500).json({ error: 'Login failed' })
  }
})

authRouter.post('/logout', (req, res) => {
  res.clearCookie('token', cookieOptions);
  return res.status(200).json({ message: 'Logged out successfully' });
})

authRouter.get('/me', verifyToken, (req, res) => {
  res.set('Cache-Control', 'no-store')

  return res.status(200).json({
    id: req.user.id,
    email: req.user.email
  })
})

module.exports = authRouter