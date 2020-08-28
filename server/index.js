require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

var reload = require('express-reload')
const db = require('./db')
const makerapi = require('./controllers/makerapi-ctrl.js')
const router = require('./routes/router.js')

const app = express()
const apiPort = require('./globals.js').port

const skillBuilder = require('./alexa').AlexaHandler
const requestHandlers = require('./alexa').handlers
const { ExpressAdapter } = require('ask-sdk-express-adapter');


db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const skill = skillBuilder.create()
const adapter = new ExpressAdapter(skill, true, true);

app.post('/', adapter.getRequestHandlers());

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})



//http://localhost:3001/oauth2/callback
//?access_token=Atza%7CIwEBIFkpKiPpqtxQfIOMz0mXnE8a7TNZALmXlDgUWWY98scNp9_7kmVi6eQZgqhtcyB5lKcYjb1FPnKnH8Ll70n0ngPpjrySmcgfVfil5o1YdR5oM7HSKoB73UinOPwkdcw8AWnirTX6nE_QiQEVrfAIvRWa6tj2alVMgQhF4ZkluYPxLK_bWoCJViT0M53_4jMQMIiYvXymc9TFaKoPfskq46dRIlS2k8TLwd030OKqOdgN35QBFT8NA6oHCiv1b-Q96_svO2YwJwPjor8dDfrRdNCZzO6h3tqy2lzuoO27lcecrxXAJaZOTMr-BvBQOc5SnuYjbE8AqzMvdNPvLO_7zyF_QB9XK5MWZW55gXSYIJeJaSL8OU_tM7L493XV9eKHJeZTghNiPv7uL9wQV9uFuDP2&
//token_type=bearer&
//expires_in=975&
//scope=alexa%3A%3Aask%3Askills%3Areadwrite

app.use('/devices', router.devices) 

const path = __dirname
app.use(reload(path))

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
