const bcrypt=require('bcryptjs');
const mongoose=require('mongoose');
const User=require('./model/User');

// const User=mongoose.model('User');

exports.authenticate=(email,password)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            //get user via email
            const user=await User.findOne({email});

            //match password
            bcrypt.compare(password,user.password,(e,isMatch)=>{
                if(e) throw err;
                if(isMatch){
                    resolve(user);
                }else{
                    //pass 'didn't match'
                    reject('1 Authentication Failed');
                }
            });

        }catch(e){
            //email not found
            reject('2 Authentication Failed',e);
        }
    });
};
