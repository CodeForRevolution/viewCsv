
const multer=require('multer');

var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./upload')
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname);
    }
})

var  upload=multer(
    {storage:storage,
        fileFilter: function (req, file, cb) {
            console.log('filtering the file on',file.mimetype);
          if(file.mimetype!=='text/csv'){
            console.log('filtering the file on',file.mimetype);
            req.fileValidationError = 'Only CSV files are allowed!';
            return cb(null, false);          
          }
            cb(null, true);
          }
}




);


module.exports=upload;
