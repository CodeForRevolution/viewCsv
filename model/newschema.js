const mongoose=require('mongoose');

const dynamic=new mongoose.Schema({
data:mongoose.Schema.Types.Mixed,
column:mongoose.Schema.Types.Mixed
});

const Dynamic= mongoose.model('dynamic',dynamic);
module.exports=Dynamic;
