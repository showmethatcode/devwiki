require("dotenv").config();
const { PrismaClient } = require('@prisma/client');
const createApplication = require('./app');
const PORT = process.env.PORT

const prisma = new PrismaClient()

function handleListening() {
  const app = createApplication(prisma)
  app.listen(PORT, () => {
    console.log('✅ Sever Listening on port http://localhost:3000/')
  })
}

handleListening()
