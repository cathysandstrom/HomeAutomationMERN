const express = require('express')

//-----------------------------------------------------------------//
const DeviceCtrl = require('../controllers/device-ctrl')
const deviceRouter = express.Router()

async function result(res, fn) {
    var args = Array.prototype.slice.call(arguments, 2)
    let val = await fn(...args)
    return res.status(val.status).json(val.json)
}

deviceRouter.post('/refresh', async(req, res) => {
    return await result(res, DeviceCtrl.refreshDevices)
})

deviceRouter.post('/refresh/:id', async(req, res) => {
    return await result(res, DeviceCtrl.refreshDeviceById, req.params.id)
})

deviceRouter.get('/known', async(req, res) =>{
    return await result(res, DeviceCtrl.getKnownDevices)
})

deviceRouter.get('/known/:id', async(req, res) =>{
    return await result(res, DeviceCtrl.getKnownDeviceById, req.params.id)
})

deviceRouter.post('/groups/:id', async(req, res) => {
    const body = req.body 
    if(!body) {console.log(err); return res.status(400).json({error:"no groups provided"})}
    return await result(res, DeviceCtrl.addDeviceGroups, req.params.id, body.groups)
})

deviceRouter.delete('/groups/:id', async(req, res) =>{
    const body = req.body 
    if(!body) {console.log(err); return res.status(400).json({error:"no groups provided"})}
    return await result(res, DeviceCtrl.deleteDeviceGroups, req.params.id, body.groups)
})

deviceRouter.get('/groups/:id', async(req, res) =>{
    return await result(res, DeviceCtrl.getDeviceGroups, req.params.id)
})

deviceRouter.get('/groups', async(req, res) =>{
    return await result(res, DeviceCtrl.getAllGroups)
})

deviceRouter.post('/all/:command', async(req, res) =>{
    return await result(res, DeviceCtrl.sendAllCommand, req.params.command)
})

deviceRouter.post('/set/:id/:command/:value', async(req, res) =>{
    return await result(res, DeviceCtrl.sendDeviceCommand, req.params.id, req.params.command, req.params.value)
})

deviceRouter.get('/commands', async(req, res) =>{
    return await result(res, DeviceCtrl.getAllCommands)
})

deviceRouter.get('/commands/:id', async(req, res) =>{
    return await result(res,DeviceCtrl.getDeviceCommands, req.params.id)
})

//-----------------------------------------------------------------//


module.exports = {
    devices: deviceRouter
}