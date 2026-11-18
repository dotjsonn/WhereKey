const { connectDatabase } = require('./db/pool')
const app = require('./app')

async function startServer() {
  try {
    await connectDatabase()
    console.log('Connected to database')
    const PORT = 3001
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`)
    })
  } catch (error) {
    console.error(error)
  }
}

startServer()