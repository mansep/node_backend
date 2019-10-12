import 'dotenv/config'

import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import jwt from 'express-jwt'

import { secure, open } from './router'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())

const jwtAuth = jwt({
    secret: process.env.JWT_SECRET,
})

app.use('/', open())
app.use('/api', jwtAuth, secure())
app.use(function(req, res) {
    res.status(404).json({
        status: 404,
        message: 'Not Found',
    })
})
// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
    res.status(err.status).json({
        status: err.status,
        message: err.message,
    })
})
mongoose
    .connect(process.env.MONGO_URL, { useNewUrlParser: true })
    .then(() => {
        app.listen(process.env.PORT, () =>
            console.log(`API iniciada en puerto ${process.env.PORT}`)
        )
    })
    .catch(err => {
        console.error(err)
    })
