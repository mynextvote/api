import cors from 'cors'
import express from 'express'
import graphQLHTTP from 'express-graphql'

import schema from './schema'

const PORT = process.env.PORT || 5000

let app = express()

app.use(cors())

const graphql = graphQLHTTP({
  schema,
  graphiql: process.env.NODE_ENV === 'development'
})

app.use('/', graphql)

app.listen(PORT)
