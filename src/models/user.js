const {Schema,model} = require('mongoose')
const bcryp = require('bcrypt-nodejs')

const user_schema = new Schema({
    email: String,
    pass: String
})

user_schema.methods.encryptPass = (pass) =>{
   return bcryp.hashSync(pass, bcryp.genSaltSync(10));
}
user_schema.methods.validatepass = function(pass){
    return bcryp.compareSync(pass,this.pass)
}


module.exports = model('User', user_schema);