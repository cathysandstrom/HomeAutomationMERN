const Device = require('../models/device-model')
const makerapi = require('./makerapi-ctrl.js');

function ErrorMessage(err, errCode) {
    console.log(err)
    if(errCode) return result(errCode, {error:err});
    return result(400, {error:err});
}

function result(num, msg) {
    return {
        status: num,
        json: msg
    }
}

async function refreshDevices() {
    const allDevices = await makerapi.getAllDevices();
    if(!allDevices) return ErrorMessage({section: "loading current devices", error:"failed to load devices"})

    const allIDs = allDevices.map(a => a.id)

    var deleted = 0;
    try {
        var del = await Device.deleteMany({"id": { $nin: allIDs }})
        deleted += del.deletedCount
    }
    catch (err) {
        return ErrorMessage({section:"remove missing devices", error: err})
    }

    var updates = []

    allDevices.forEach(d => {
        getmod = async () => {
            try {
                let added = await Device.updateOne( {id: d.id}, d, {upsert: true, new: true, runValidators: true})
                return [added.nModified, added.upserted]
            }
            catch (err) {
                console.log(err)
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

    //modified is always true even if nothing changes unless its upserted
    return result(200, {
        deleted: deleted,
        added: added,
        modified: modified,
        failed: failed
    })
}

async function getKnownDevices() {
    var device = await Device.find({}).catch(err => {return ErrorMessage(err)})
    return result(200, device)
}

async function getAllCommands() {
    console.log("got here")
     Device.aggregate([
        {$unwind: "$commands"},{$project: {
            id: "$id",
            name: "$name",
            label:"$label",
            command: "$commands.command"
        }},
        {$group: {
            _id: "$command",
            devices: { $addToSet: {
                id: "$id",
                name: "$name",
                label:"$label",
            } }
        }},
    ], (err, list) => {
        if(err) return ErrorMessage(err);  
        console.log(err)
        return result(200, list)
    }).catch(err => {return ErrorMessage(err)})
}

async function sendAllCommand(command) {
    var devices = await Device.find({}).catch(err => {return ErrorMessage(err)})
    if(!devices.length) 
        return ErrorMessage("No devices to command.", 404)


    var commands = []
    devices.forEach(d => {
        commands.push(makerapi.sendDeviceCommand(d.id, command))
    });

    var values = await Promise.all(commands)
    .catch(err => {
        return ErrorMessage(err) 
    })
    return result(200, {values: values})
}   

async function getAllGroups() {
    console.log("got here")
    await Device.aggregate([
        {$unwind: "$groups"},{$project: {
            id: "$id",
            name: "$name",
            label:"$label",
            group: "$groups"
        }},
        {$group: {
            _id: "$group",
            devices: { $addToSet: {
                id: "$id",
                name: "$name",
                label:"$label",
            } }
        }},
    ], (err, list) => {
        if(err) return ErrorMessage(err);
        console.log(list)
        return result(200, list)
    }).catch(err => {return ErrorMessage(err)})
}

async function refreshDeviceById(id) {
    const newData = await makerapi.getDeviceByID(id)
    if(!newData) return ErrorMessage("failed to load device data to update")

    await Device.updateOne( {id: id}, newData, function(err, doc) {
        if(err) return ErrorMessage(err)
        if(!doc) return ErrorMessage("Device not found", 404)
        return result(200, {result: doc})
    }).catch(err => {return ErrorMessage(err)})
}

async function getDeviceGroups(id) {
    await Device.findOne({id: id}, (err, device) => {
        if(err) return ErrorMessage(err);
        if(!device) return ErrorMessage("Device not found", 404)
        return result(200, {groups: device.groups})
    }).catch(err => {return ErrorMessage(err)})
}

async function addDeviceGroups(id, groups) {
    if(!groups) return ErrorMessage({error:"bad json body"})

    await Device.updateOne({id: id}, { $addToSet: { groups: { $each: body['groups']}} }, (err, doc) => {
        if(err) return ErrorMessage(err)
        return result(200, {result: doc})
    }).catch(err => {return ErrorMessage(err)})
}

async function deleteDeviceGroups(id, groups) {
    if(!groups) return ErrorMessage({error:"bad json body"})

    await Device.updateOne({id: id}, { $pull: { groups: { $in: body['groups']}} }, (err, doc) => {
        if(err) return ErrorMessage(err)
        return result(200, {result: doc})
    }).catch(err => {return ErrorMessage(err)})
}

async function getDeviceCommands(id) {
    await Device.findOne({id: id}, "commands.command", (err, device) => {
        if(err) return ErrorMessage(err);
        if(!device) return ErrorMessage("Device not found", 404)
        return result(200, {commands: device.commands})
    }).catch(err => {return ErrorMessage(err)})
}

async function sendDeviceCommand(id, command, value) {
    var result = await makerapi.sendDeviceCommand(id, command, value)
    if(!result) return ErrorMessage("failed to send device command")
    return result(200, result)
}

async function getKnownDeviceById(id) {
    await Device.findOne({id: id}, (err, device) => {
        if(err) return ErrorMessage(err);
        return result(200, device)
    }).catch(err => {return ErrorMessage(err)})
}

module.exports = {
    refreshDevices, 
    refreshDeviceById,
    addDeviceGroups,
    deleteDeviceGroups,
    getKnownDeviceById,
    getKnownDevices,
    sendAllCommand,
    sendDeviceCommand,
    getAllCommands,
    getAllGroups,
    getDeviceCommands,
    getDeviceGroups,
}