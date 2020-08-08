const express = require('express')

const DeviceCtrl = require('../controllers/device-ctrl')

const router = express.Router()

router.post('/devices', DeviceCtrl.refreshDevices)
router.post('/commandall', DeviceCtrl.sendAllCommand)
router.get('/devices/:id', DeviceCtrl.getDeviceById)
router.get('/devices', DeviceCtrl.getKnownDevices)

module.exports = router