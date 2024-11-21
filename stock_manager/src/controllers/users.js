const{request, response}=require('express');
const bcrypt=require('bcrypt');
const pool = require('../db/connection');
const { usersQueries } = require('../models/users');

const saltRounds=10;
/*const users=[
    {id: 1, name: 'lady'},
    {id: 2, name: 'Sthefany'},
    {id: 3, name: 'Agustin'},
];*/

/*const getAll=(req=request, res=response)=>{
  res.send(users);
}*/

const getAllUsers=async(req=request, res=response)=>{
  let conn;
  try{
    conn=await pool.getConnection();
    const users=await conn.query(usersQueries.getAll);
    res.send(users);

  } catch(error){
    res.status(500).send(error);//'Internal server error'
    return;
  }finally{
    if(conn) conn.end();

  }
}

const getUserById=async(req=request, res=response)=>{
    const {id}=req.params;

    if(isNaN(id)){
        res.status(400).send('Invalid ID');
        return;
      }

      let conn;
      try{
        conn=await pool.getConnection();
        const user=await conn.query(usersQueries.getById, [+id]);
        if(user.length===0){
          res.status(404).send('User not found');
          return;
        }

        res.send(user);

      }catch(error){
        res.status(500).send(error);

      }finally{
        if(conn) conn.end();
      }

      //const user  = users.find(user => user.id === +id); 
}

// TAREA que explico el profesor en clase
// Crear un nuevo usuario
//const user= users.find(user=>user.name===name);

const createUser = async(req = request, res = response) => {
  const {username,password,email} = req.body;

  if (!username || !password || !email) {
      res.status(400).send('Bad request');
      return;
  }

  let conn;

  try{
    conn=await pool.getConnection();

    const user=await conn.query(usersQueries.getByUsername,[username]);

    if(user.length>0){
      res.status(409).send('User alredy exists');
      return;
    }

    const hashPassword= await bcrypt.hash(password, saltRounds);


    const newUser=await conn.query(usersQueries.create, [username,hashPassword,email]);

    if(newUser.affecteRows===0){
      res.status(500).send('User not be created');
      return;
    }
    //console.log(newUser);

    res.status(201).send("User Created succesfully")

  }catch(error){
    res.status(500).send(error);
    return;

  }finally{
    if(conn) conn.end();
  }

  //users.push({id:users.length+1, name});
  //res.send('User created succesfully');
}

const loginUser = async (req = request, res = response) => {
  const {username, password} = req.body;

  if(!username || !password){
    res.status(400).send('User and Password are mandatoty');
    return;
  }

let conn;
  try{
    conn = await pool.getConnection();

    const user = await conn.query(usersQueries.getByUsername, [username]);

    if (user.length === 0){
      res.status(404).send('Bad username or password');
      return
    }

    const passwordMatch = await bcrypt.compare(password, user[0].password);

    if (!passwordMatch){
      res.status(403).send('Bad username or password');
    }

    res.send('Loged in');

  }catch(error){
    res.status(500).send(error);
  } finally{
    if (conn) conn.end()
  }
}


const updateUser = async (req = request, res = response) => {
  const { id } = req.params;
  const { username } = req.body;

  if (isNaN(id) || !username ) {
      res.status(400).send('Invalid request');
      return;
  }

  let conn;
  try {
      conn = await pool.getConnection();
      // Verificar si el usuario existe
      const user = await conn.query(usersQueries.getById, [+id]);
      if (user.length === 0) {
          res.status(404).send('not found');
          return;
      }
      // Actualizar usuario
      const result = await conn.query(usersQueries.update, [username, +id]);
      
      if (result.affectedRows === 0) {
          res.status(500).send('not be updated');
          return;
      }
      res.send('User updated ');
  } catch (error) {
      res.status(500).send(error);
  } finally {
      if (conn) conn.end();
  }
};

// Eliminar un usuario por ID
const deleteUser = async(req = request, res = response) => {
  const {id} = req.params;

  if (isNaN(id)) {
      res.status(400).send('Invalid ID');
      return;
  }
let conn;
  try{
    conn=await pool.getConnection();
        const user=await conn.query(usersQueries.getById, [+id]);
        if(user.length===0){
          res.status(404).send('User not found');
          return;
        }
        const deleteUser = await conn.query(usersQueries.delete, [+id]);
      if (deleteUser.affectedRows === 0) {
          res.status(500).send('User could not be deleted');
          return;
      }
      res.send('User deleted ');
  }catch(error){
    res.status(500).send(error);
  }finally{
    if (conn) conn.end();
  }
  //const user = users.find(user => user.id === +id);
  /*if (!user) {
    res.status(404).send('User not found');
    return;
}
  users.splice(users.findIndex ((user)=>user.id===+id),1);
  res.send('User deleted');*/
};

module.exports = { getAllUsers, getUserById, createUser,loginUser, updateUser, deleteUser };

