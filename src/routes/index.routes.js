const {Router} = require('express');
const {getinfo,login,comments,signUp,auth,auth2,logOut,isAuthenticate,index,commentsPost,commentPut,commentDelete,home} = require('../controllers/index.controller')

const router = Router();
router.get('/home',home)
router.get('/',getinfo)
router.get('/api/comments', index);
router.get('/admin/comments',isAuthenticate,index);
router.get('/admin/signIn',login);
router.get('/admin/logOut',logOut)
router.get('/admin/signUp',signUp);
router.post('/admin/signIn',auth2);
router.post('/admin/signUp',auth);
router.post('/api/comments', commentsPost);
router.put('/api/comments:id', commentPut)
router.put('/admin/comments/:id', commentPut)
router.delete('/api/comments/:id', commentDelete)
router.delete('/admin/comments/:id', commentDelete)




module.exports = router;