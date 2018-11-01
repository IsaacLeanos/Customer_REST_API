const errors=require('restify-errors');
const Customer=require('../model/Customer');

module.exports=server=>{
    //get all customers
    server.get('/customers',async(req,res,next)=>{
        try{
            const customers=await Customer.find({});
            res.send(customers);
            next();            
        }catch(e){
            return next(new errors.InvalidContentError(e));
        }
    });

    //get single customer
    server.get('/customers/:id',async(req,res,next)=>{
        try{
            const customer=await Customer.findById(req.params.id);
            res.send(customer);
            next();            
        }catch(e){
            return next(new errors.ResourceNotFoundError(`There is no customer with the id of ${req.params.id}`));
        }
    });

    //add customer
    server.post('/customers',async(req,res,next)=>{
        //check for json
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }

        const{name,email,balance}=req.body

        const customer=new Customer({
            name,email,balance
        });
        
        try{
            const newCustomer=await customer.save();
            res.send(201);
            next();
        }catch(e){
            return next(new errors.InternalError(e.message));
        }
    });

    //update customer
    server.put('/customers/:id',async(req,res,next)=>{
        // check for json
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }
        
        try{
            const customer=await Customer.findOneAndUpdate({_id:req.params.id},req.body);
            res.send(200);
            next();
        }catch(e){
            return next(new errors.ResourceNotFoundError(`There is no customer with the id of ${req.params.id}`));
        }
    });

    //delete customer
    server.del('/customers/:id',async(req,res,next)=>{
        try{
            const customer=await Customer.findOneAndRemove({_id:req.params.id});
            res.send(204);
            next();
        }catch(e){
            return next(new errors.ResourceNotFoundError(`There is no customer with the id of ${req.params.id}`));
        }
    })
};