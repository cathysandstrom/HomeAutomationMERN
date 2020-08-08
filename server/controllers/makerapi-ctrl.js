const axios = require('axios');

require('dotenv').config()

//The details are stored in .env for privacy
const path = process.env.CONTROLLER
const token = process.env.ACCESS_TOKEN

//https://docs.hubitat.com/index.php?title=Maker_API

//simple concat of url parameters
function createURL() {
    if(arguments.length == 0) {
        return path+token;
    }
    
    let args = [...arguments];
    let pathargs = "/"+args.join("/")

    return path+pathargs+token
}

//in case the get method is changed. Also, don't let errors propogate. 
async function performGet(url) {
    try {
        var req = await axios.get(url)
        return req.data
    }
    catch(err) {
        console.log(err)
    }
}

async function getDevices() {
    url = createURL()
    return await performGet(url)
}

async function getAllDevices() {
    url = createURL("all")
    return await performGet(url)
}

async function getDeviceByID(id) {
    url = createURL(id)
    return await performGet(url)
}

async function getDeviceEvents(id) {
    url = createURL(id, "events")
    var res = await performGet(url)
    return res;
}

async function getDeviceCommands(id) {
    url = createURL(id, "commands")
    return await performGet(url)
}

async function sendDeviceCommand(id, command, value) {
    var url;
    if(value)
        url = createURL(id, command, value)
    else 
        url = createURL(id, command)
    
    return await performGet(url)
}


module.exports = {
    getDevices,
    getAllDevices,
    getDeviceByID,
    getDeviceEvents,
    getDeviceCommands,
    sendDeviceCommand
}