const restify=require('restify');
const mongoose=require('mongoose');
const config=require('./config');
const restjwt=require('restify-jwt-community');

const server=restify.createServer();

// middleware
server.use(restify.plugins.bodyParser());

//protect routes
// server.use(restjwt({secret:config.JWT_SECRET}).unless({path:['/auth']}));

// server
server.listen(config.PORT,()=>{
    mongoose.set('useFindAndModify',false);
    mongoose.connect(config.MONGODB_URI,{useNewUrlParser:true});
    console.log('Server up up and away!');
});

// mongo database connection
const db=mongoose.connection;

db.on('error',(e)=>{
    console.log('database error',e);
});

//successful mongo connection
db.once('open',()=>{
    // run server exported function
    require('./route/customers')(server);
    require('./route/users')(server);
    console.log(`Mongo up up and away on port ${config.PORT}!`);
});
