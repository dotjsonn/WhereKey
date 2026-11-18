const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token
  if(!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decodedToken
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  return next()
}

module.exports = verifyToken