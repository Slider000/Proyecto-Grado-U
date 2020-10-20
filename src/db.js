require('dotenv').config({path: 'src/.env'})
const mongoose = require('mongoose');
mongoose.connect(process.env.DB,
 {useNewUrlParser: true, useUnifiedTopology: true});
//  .then(()=>{
//      console.log('-db up-');
     
//  })
