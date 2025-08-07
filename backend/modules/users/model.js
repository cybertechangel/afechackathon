import db_sql from '../../database.js'
import crypto from 'crypto'
import  argon2  from 'argon2';
class UserModel{

async findUserByEmail(email) {
    const sql = `SELECT * FROM users WHERE email = ?`;
    const [rows] = await db_sql.execute(sql, [email]);
    return rows[0] || null;
  }

 async findUserById(userId) {
  const sql = `SELECT * FROM users WHERE id = ? LIMIT 1`;
  const [rows] = await db_sql.execute(sql, [userId]);
  return rows[0]; 
}


async createUser({lastname, firstname, email, password}) {
  try { 
    
    const sql = `
      INSERT INTO users (lastname, firstname, email, password)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db_sql.execute(sql, [lastname, firstname, email, password]);

    console.log('Utilisateur créé avec ID :', result.insertId);    

    return { success: true, userId: result.insertId };

  } catch (error) {
    console.error('Erreur :', error.message);
    return { success: false, error: error.message };
  }
}

 async  savePasswordResetToken(userId, token) {
  const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const expiration = new Date(Date.now() + 604800000); 

  await db_sql.execute(`
    UPDATE users 
    SET resetPasswordToken = ?, resetPasswordExpire = ? 
    WHERE id = ?
  `, [resetTokenHash, expiration, userId]);

  return resetTokenHash;
}
 async  findUserByResetToken(tokenHash) {
  const sql = `
    SELECT * FROM users 
    WHERE resetPasswordToken = ? AND resetPasswordExpire > NOW()
    LIMIT 1
  `;
  const [rows] = await db_sql.execute(sql, [tokenHash]);
  return rows[0]; 
}

async  updateUserPassword(userId, newPassword) {
  const hashedPassword = await argon2.hash(newPassword); 
  const sql = `
    UPDATE users 
    SET password = ?, resetPasswordToken = NULL, resetPasswordExpire = NULL 
    WHERE id = ?
  `;
  await db_sql.execute(sql, [hashedPassword, userId]);
}

 async  markUserAsVerified(userId) {
  const sql = `UPDATE users SET isVerified = 1 WHERE id = ?`;
  const [result] = await db_sql.execute(sql, [userId]);
  return result;
}

}
export default new UserModel()