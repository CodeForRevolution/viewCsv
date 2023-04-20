const express=require('express');
const route=express.Router();
const upload=require('../config/multer');
const homecontroller=require('../controller/homeController');
route.get('/',homecontroller.home);
route.post('/',homecontroller.upload);
route.get('/view/:id',homecontroller.view);
route.get('/delete/:id',homecontroller.delete);
route.post('/upload',upload.single('csv_file'),homecontroller.upload);

module.exports=route;