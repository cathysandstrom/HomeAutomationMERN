import axios from 'axios'

const device = axios.create({
    baseURL: 'http://localhost:4000/devices',
})

export const refreshDevices = function() { device.post(`/refresh`) }
export const refreshDeviceById = function(id) { device.post(`/refresh/${id}`) }
export const getKnownDevices = function() { device.get(`/known`) }
export const getKnownDeviceById = function(id) { device.get(`/known/${id}`)}

export const getAllGroups = function() { device.get(`/groups`)}
export const getDeviceGroups = function(id) { device.get(`/groups/${id}`)}
export const addDeviceGroups = function(id, payload) { device.post(`/groups/${id}`, payload)}
export const deleteDeviceGroups = function(id, payload) { device.delete(`/groups/${id}`, payload)}

export const getAllCommands = function() { device.get(`/commands`)}
export const getDeviceCommands = function(id) { device.get(`/commands/${id}`)}
export const sendAllCommand = function(command) { device.post(`/all/${command}`)}
export const sendDeviceCommand = function(id, command, value) {
    if(value) device.post(`/set/${id}/${command}/${value}`)
    else device.post(`/set/${id}/${command}`)
}

const apis = {
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

export default apis 
