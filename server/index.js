require('dotenv/config')

const { connectDatabase } = require('./db/pool')
const app = require('./app')

async function startServer() {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is required')
    }

    await connectDatabase()
    console.log('Connected to database')

    const PORT = Number(process.env.PORT) || 3001

    app.listen(PORT, '0.0.0.0', error => {
      if (error) {
        console.error('Server failed to start:', error)
        process.exit(1)
      }

      console.log(`Server listening on port ${PORT}`)
    })
  } catch (error) {
    console.error('Startup failed:', error)
    process.exit(1)
  }
}

startServer()