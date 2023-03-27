const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const classSchema = new Schema({
    class_name: { type: "String", required: true },
    master: { type: "String", required: true },
    // institution: { type: "String", required: true },
    password: { type: "String", required: true },
    owner:{type: "String", required: true},
    memebers: [String],
    url:{type: "String"}

})

module.exports = mongoose.model("class", classSchema)