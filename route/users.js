const errors=require('restify-errors');
const bcrypt=require('bcryptjs');
const User=require('../model/User');
const auth=require('../auth');

module.exports=server=>{
    // register users
    server.post('/register',(req,res,next)=>{
        const{email,password}=req.body;

        const user=new User({
            email,password
        });

        bcrypt.genSalt(10,(e,salt)=>{
            bcrypt.hash(user.password,salt,async(e,hash)=>{
                //hash password
                user.password=hash;
                //save user
                try{
                    const newUser=await user.save();
                    res.send(201);
                    next();
                }catch(err){
                    return next(new errors.InternalError(err.message));
                }
            });
        });

    });

    //authentication
    server.post('/auth',async(req,res,next)=>{
        const{email,password}=req.body;

        try{
            //authenticate user
            const user=auth.authenticate(email,password);
            console.log('authenticated user',user);
            next();

        }catch(e){
            //user unauthorized
            return next(new errors.UnauthorizedError(e));
        }
    });
};



