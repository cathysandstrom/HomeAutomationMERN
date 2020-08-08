require('dotenv').config()
const mongoose = require('mongoose')

mongoose
    .connect(process.env.DATABASE, { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db