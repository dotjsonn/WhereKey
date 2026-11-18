const appOrigin = process.env.APP_ORIGIN

if (!appOrigin) {
  throw new Error('APP_Origin is required for CSRF protection')
}

const safeMethods = new Set(['GET', 'HEAD', 'OPTIONS'])

const verifyOrigin = (req, res, next) => {
  if (safeMethods.has(req.method)) {
    return next()
  }

  let requestOrigin = req.get('origin')
  if (!requestOrigin) {
    try {
      const referer = req.get('referer')
      requestOrigin = referer
        ? new URL(referer).origin
        : undefined
    } catch (error) {
      requestOrigin = undefined
    }
  }

  if (requestOrigin !== appOrigin) {
    return res.status(403).json({
      error: 'CSRF validation failed'
    })
  }

  return next()
}

module.exports = verifyOrigin