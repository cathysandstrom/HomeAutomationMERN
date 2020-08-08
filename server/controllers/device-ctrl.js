// router.post('/devices', DeviceCtrl.refreshDevices)
// router.get('/devices/:id', DeviceCtrl.getDeviceById)
// router.get('/devices', DeviceCtrl.getKnownDevices)

const Device = require('../models/device-model')
const makerapi = require('./makerapi-ctrl.js');

async function refreshDevices(req, res) {
    const allDevices = await makerapi.getAllDevices();
    if(!allDevices) return res.status(400).json({section: "loading current devices", error:"failed to load devices"})

    const allIDs = allDevices.map(a => a.id)

    var deleted = 0;
    try {
        var del = await Device.deleteMany({"id": { $nin: allIDs }})
        deleted += del.deletedCount
    }
    catch (err) {
        return res.status(400).json({section:"remove missing devices", error: err})
    }

    var updates = []

    allDevices.forEach(d => {
        getmod = async () => {
            try {
                let added = await Device.updateOne( {id: d.id}, d, {upsert: true, new: true, runValidators: true})
                return [added.nModified, added.upserted]
            }
            catch (err) {
                return [1]
            }
        }
        updates.push(getmod())
    })

    var values = await Promise.all(updates)

    var added = 0, modified = 0, failed = 0;

    values.forEach(v => {
        if(v.length == 1) failed += v[0]
        else {
            modified += v[0]
            if(v[1]) added += v[1].length
        }
    })

    return res.status(200).json({
        deleted: deleted,
        added: added,
        modified: modified,
        failed: failed
    })
}

async function refreshDeviceById(req, res) {
    const newData = await makerapi.getDeviceByID(req.id)
    if(!newData) return res.status(400).json({error:"failed to load device data to update"});

    Device.updateOne( {id: newData.id}, newData, function(err, doc) {
        if(err) return res.status(400).json({error:err})
        console.log(doc)
    })

    return res.status(200).json({msg: "device updated"})
}

async function addDeviceGroups(req, res) {
    
}

async function deleteDeviceGroup(req, res) {
    
}

async function sendAllCommand(req, res) {
    const body = req.body 
    if(!body) return res.status(400).json({error:"no command provided"})

    await Device.find({}, (err, devices) => {
        if(err) return res.status(400).json({error: err});
        if(!devices.length) 
            return res.status(400).json({error: "No devices to command."});

        var commands = []
        devices.forEach(d => {
            commands.push(makerapi.sendDeviceCommand(d.id, body.command))
        });

        Promise.all(commands).then(values => {
            return res.status(200).json({values: values})
        })
        .catch(err => {
            return res.status(400).json({error:err})
        })
    }).catch(err => console.log(err))
}

async function getDeviceById(req, res) {

}

async function getKnownDevices(req, res) {

}

module.exports = {
    refreshDevices, 
    updateDeviceGroup,
    getDeviceById,
    getKnownDevices,
    sendAllCommand
}