const bodyParser = require('body-parser');
const express=require('express');
const App=express();
const cookieParser=require('cookie-parser');
App.use(express.static('assets'));
const db=require('./config/mongoose');
const session=require('express-session');
const Port= process.env.PORT ||3000;

App.set('view engine','ejs');
App.set('views','view');
const custmiddleweare=require('./config/middleweare');
App.set(bodyParser.urlencoded({extended:true}));
App.use(cookieParser());
const MongoStore=require('connect-mongo')(session);
const flash=require('connect-flash');
const upload=require('./config/multer');
App.use(session({
    name:'OWNSCIAL',
    secret:'shakir',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(100*60*100)   
    },
    store:new MongoStore({
       mongooseConnection:db,
       autoRemove:'disabled' 
    },function(err){
        console.log('err in setting the mongo db sesstion',err);
    })
}));
 
App.use(flash()) ;  //setting flash for flash message
App.use(custmiddleweare.setFlash);
App.use('/',require('./route/index'));
App.listen(Port,function(err){
    if(err){
        console.log('error in starting the server')
    }

    console.log('***server is started successfully***')

})