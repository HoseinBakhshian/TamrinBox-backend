const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classSchema = new Schema({
    class_name: { type: "String", required: true },
    owner: { type: "String", required: true },
    password: { type: "String" },
    capacity: { type: "String" },
    thumbnail: { type: "String" },
    memebers: [String],

})

module.exports = mongoose.model("class", classSchema)