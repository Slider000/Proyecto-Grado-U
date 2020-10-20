// mongoose para crear modelos y schemas
const {Schema,model} = require('mongoose');

// creando schema para trabajar la bd
const commentSchema = new Schema({
    email: {type: String, lowercase: true},
    title: {type: String},
    desc: {type: String},
    fecha: {type:Date, default: Date.now()}
});

// exportando el schema
module.exports = model('commentS', commentSchema);
