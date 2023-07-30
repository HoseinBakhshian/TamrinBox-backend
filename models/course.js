const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    class_id: { type: "String", required: true },
    course_name: { type: "String", required: true },
    file: { type: "String", required: true },
    description: { type: "String" },
    deadline: { type: "String" },
    inbox: [{
        user_id: { type: "String" },
        file_id: { type: "String" },
        latest_upload: { type: "String" } 
    }],

})

module.exports = mongoose.model("course", courseSchema)