import express from 'express'
import cors from 'cors'
import router from './rest/routes.js'

export default function createApplication(prisma) {
  const app = express()
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(cors())
  app.use((req, res, next) => {
    req.context = { req, res, prisma }
    next()
  })
  app.use(router)
  return app
}
