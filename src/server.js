import * as dotenv from 'dotenv'
import prisma from '@prisma/client'
import createApplication from './app.js'

dotenv.config()
const { PrismaClient } = prisma
const PORT = process.env.PORT

const prismaClient = new PrismaClient()

function handleListening() {
  const app = createApplication(prismaClient)
  app.listen(PORT, () => {
    console.log(`✅ Server Listening on port http://localhost:${PORT}/`)
  })
}

handleListening()
