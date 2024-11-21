const{Router}=require('express');
const { getAllUsers, getUserById, createUser,loginUser, updateUser, deleteUser } = require('../controllers/users');

//anterior : const{getAll, getById}=require('../controllers/users');

const router=Router();

router.get('/',getAllUsers);

router.get('/:id',getUserById);

//tarea
router.post('/', createUser);
router.post('/login', loginUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);


module.exports=router;