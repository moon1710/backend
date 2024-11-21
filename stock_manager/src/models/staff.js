const staffQueries = {
    getAll: 'SELECT * FROM staff', //SELECT * FROM staff WHERE is_active = 1
    getById: 'SELECT * FROM staff WHERE id = ?', // AND is_active = 1
    getByEmail: 'SELECT * FROM staff WHERE email=?',
    create: 'INSERT INTO staff (first_name, last_name, birth_date, gender, phone_number, email, address, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    update: 'UPDATE staff SET first_name = ?, last_name = ?, birth_date = ?, gender = ?, phone_number = ?, email = ?, address = ?, user_id = ? WHERE id = ?',
    delete: 'UPDATE staff SET is_active = 0 WHERE id = ?'
  };
  
  module.exports = { staffQueries };