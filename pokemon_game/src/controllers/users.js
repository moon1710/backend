const{request, response}=require('express');
const bcrypt=require('bcrypt');
const pool=require('../db/connection');
const userQueries = require('../models/users');

const SALT_ROUNDS = 10;


const getAllUsers=async(req=request, res=response)=>{
    let conn;
    try{
        conn=await pool.getConnection();
        const users=await conn.query(userQueries.getAll);

        res.json(users);
        return;

    }catch(err){
        res.status(500).json(err);
        return;

    }finally{
        if(conn) conn.end();

    }
};

const createUser = async (req = request, res = response) => {
    const {
        first_name,
        last_name,
        email,
        password
} = req.body;

if (!first_name || !last_name || !email || !password){
    res.status(400).send({message: 'missing required field'});//json
    return;
}

let conn;
try{
    conn = await pool.getConnection();
    const [user_exists] = await conn.query(userQueries.getByEmail, [email]);

    if (user_exists){
        res.status(409).send({message: 'USER ALREADY EXISTS'});//json
        return;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await conn.query(userQueries.addUser, [first_name, last_name, email, hashedPassword]);

    if (newUser.affectedRows === 0){
        res.status(500).send({message: 'error adding user'});
        return;
    }

    res.status(201).send({message: 'user created'});
}catch(err){
    res.status(500).json(err);
    return;
} finally {
    if (conn) conn.end();
}
};

const getUser = async (req = request, res = response) => {
    const {id} = req.params;

    if (isNaN(id)) {
        res.status(400).send({message: 'invalid user ID'});
        return;
    }

    let conn;
    try{
        conn = await pool.getConnection();
        const [user] = await conn.query(userQueries.getById, [id]);

    if (!user){
        res.status(404).send({message: 'User not found'});
        return;
    }

    res.json(user);
    }catch(err){
        res.status(500).json(err);
        return;
    }finally{
        if (conn) conn.end();
    }
};

const updateUser = async (req = request, res = response) => {
    const { id } = req.params;
    const {
        first_name,
        last_name,
        email
} = req.body;

if (isNaN(id)){
    res.status(400).send({message: 'invalid user ID'});
    return;
}
  
if (!first_name || !last_name || !email){
    res.status(400).send({message: 'missing required field'});
    return;
}
  
    let conn;
    try {
      conn = await pool.getConnection();
      const [user] = await conn.query(userQueries.getById, [id]);

      if (!user) {
        res.status(404).send({message: 'user not found'});
        return;
      }

      const [emailExists]=await conn.query(userQueries.emailValid, [email, id]);
      if (emailExists) {
        res.status(400).send({message: 'email already in use'});
        return;
      }

      const updatedUser= await conn.query(userQueries.editUser, [first_name, last_name, email, id]);
      if (updatedUser.affectedRows === 0) {
        res.status(500).send({message: 'user not update'});
        return;
      }
  
      res.send({message: 'user update'});
    } catch (err) {
      res.status(500).json(err);
    } finally {
      if (conn) conn.end();
    }
};

const destroyUser = async(req = request, res = response) => {
    const {id} = req.params;
  
    if (isNaN(id)) {
        res.status(400).send({message: 'Invalid ID'});
        return;
    }

  let conn;
    try{
      conn=await pool.getConnection();
          const [user]=await conn.query(userQueries.getById, [id]);

          if (!user) {
            res.status(400).send({message: 'user not found'});
            return;
          }

          const deletedUser = await conn.query(userQueries.deleteUser, [id]);
          if (deletedUser.affectedRows === 0) {
        res.status(500).send({message: 'Error deleting user'});
        return;
      }
        res.send({message: 'user deleted'});

    }catch(err){
      res.status(500).send(err);//send
    }finally{
      if (conn) conn.end();
    }
}
  
module.exports = {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    destroyUser,

};