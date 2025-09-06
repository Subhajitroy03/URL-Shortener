const express=require('express');
const router=express.Router();
const {getshorturl,getlongurl,geturl,deleteurl}=require('../controller/controller');
router.post('/',getshorturl);
router.get('/urls',geturl);
router.get('/:shorturl',getlongurl);
router.delete('/:id',deleteurl);
module.exports=router;