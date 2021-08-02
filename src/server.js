require("dotenv").config();
const { PrismaClient } = require('@prisma/client');
const createApplication = require('./app');
const PORT = process.env.PORT

const prisma = new PrismaClient()

async function handleListening() {
  const app = createApplication(prisma)
  app.listen(PORT, () => {
    console.log('✅ Sever Listening on port http://localhost:3000/')
  })
}

handleListening()

// const handleListening = () => {
//   const app = createApplication(prisma)
// }
