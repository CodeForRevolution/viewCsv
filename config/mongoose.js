const mongoose=require('mongoose');
//mongoose.connect('mongodb+srv://viewcsv:zttp1gUGNYZB1wSr@clusterviewcsv.84jsxgc.mongodb.net/?retryWrites=true&w=majority');
mongoose.connect('mongodb+srv://shakir973019:QyBrdTW3oNuVoStS@cluster0.755yziu.mongodb.net/?retryWrites=true&w=majority');
//mongoose.connect('mongodb+srv://viewcsv:zttp1gUGNYZB1wSr@clusterviewcsv.84jsxgc.mongodb.net/test');
const db=mongoose.connection;
// db.on('error',console.error.bind(console,"error in staring the mongodb"));
db.on('error',function(){
    console.log('error is encounter in config the mongodb',);
});
db.once('open',function(){
    console.log('***DATA BASE CONNECTED*****');
})
module.exports=db;

