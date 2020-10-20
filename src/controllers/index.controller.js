const commentS = require('../models/comments');
const passport = require('passport');

const login = (req, res)=>{
    res.render('../views/login.ejs');
}
const comments = (req, res)=>{
    res.render('../views/comments.ejs');
}
const signUp = (req, res)=>{
    res.render('../views/signUp.ejs');
}
const auth = passport.authenticate('auth-local', {
    successRedirect: '/admin/signIn',
    failureRedirect: '/admin/signUp',
    passReqToCallback: true
})
const auth2 = passport.authenticate('auth-local2', {
    successRedirect: '/admin/comments',
    failureRedirect: '/admin/signIn',
    passReqToCallback: true
})
const logOut = (req, res, next)=>{
    req.logout();
    res.redirect('/admin/comments');
}

const isAuthenticate = (req, res, next)=>{
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/admin/signIn')
}
const getinfo = (req, res)=>{
    res.render('../views/kerass.ejs')
}
// endpoint get para la visualizacion de los comentarios 
const index = async(req, res, next)=>{
    // buscando en la base de datos los comentarios
    await commentS.find({}, (err, data)=>{

        //  validacion de respuestas con mongo y el servidor
         if(err) res.status(500).send({message: 'error con la peticion'});
         if(!data) res.status(404).send({message: 'no se encontro elemento'});
         res.render('../views/kerass.ejs')
        // res.status(200).send({data});
    });
}
// endpoint post para la creacion del comentario
const commentsPost = async(req, res, next) =>{
    // instanciando el schema de la bd para crear un mensaje
    const comment = new commentS();
    // datos de la peticion del usuario
    const {correo,titulo,descripcion} = req.body;

    comment.email = correo;
    comment.title = titulo;
    comment.desc = descripcion;
    // Guardando el comentario
   await comment.save((err, pStorage)=>{
        if (err) res.status(500).send({message:`error al guardar`});
        res.redirect('/')
    }); 
}

// endpoint para actualizar
const commentPut = async (req, res)=>{
    await commentS.findByIdAndUpdate(req.params.id, req.body)
    
    res.json({
        status: 'comment update'
    });
}
// endpoint para eliminar
const commentDelete = async (req, res) =>{
    await commentS.findByIdAndRemove(req.params.id);
    res.json({
        status: 'comment deleted'
    })
}
const home = (req, res) =>{
    res.render('../views/home.ejs')
}

module.exports = {
    login,
    comments,
    signUp,
    auth,
    auth2,
    logOut,
    isAuthenticate,
    getinfo,
    index,
    commentsPost,
    commentPut,
    commentDelete,
    home
}