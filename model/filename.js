const mongoose=require('mongoose');
const filenameSchema=new mongoose.Schema({
   name:String,
   pathName:String,
   csvPath:String
},
)

const Filename=mongoose.model('filename',filenameSchema);

module.exports=Filename;

