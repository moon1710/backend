const express=require("express");
const usersRoutes=require('./routes/users');

//staff
const staffRoutes = require('./routes/staff');

class Server{
    constructor (){
        this.app=express();
        this.port=3000;
        this. middlewares();
        //this.app.use(express.json()); //Metodo express, es un middleware
        this.routes();
    }


    middlewares(){
        this.app.use(express.json());
    }

    /*routes (){
        this.app.get("/", (req, res)=> {
            res.send('Hello world!');
        });
    }*/

    routes(){
        this.app.use('/users', usersRoutes);

        //staff
        this.app.use('/staff', staffRoutes);
    }

start() {
    this.app.listen(this.port, ()=>{
        console.log('Server listening on port ' + this.port);
    });
}
}

module.exports={Server};
