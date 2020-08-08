const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Device = new Schema(
    {
        id: { type: String, required: true },
        name: { type: String, required: true },
        label: { type: String, required: true },
        type: { type: String, required: false },
        date: { type: Date, required: false },
        model: { type: String, required: false },
        manufacturer: { type: String, required: false },
        capabilities: { type: [String], required: false },
        attributes: { type: Schema.Types.Mixed, required: false},
        commands: { type: [
            {command: {type: String, required: true}}
        ], required: false},
        groups: { type: [String], required: false}
    },
    { timestamps: true },
)

module.exports = mongoose.model('devices', Device)