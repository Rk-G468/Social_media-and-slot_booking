import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'password',
  database: 'social_media',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function readPosts() {
  try {
    const [rows] = await pool.query('SELECT * FROM posts');
    return rows;
  } catch (error) {
    console.error('Error in readPosts:', error.message);
    throw error; // Rethrow the error for higher-level handling
  }
}

export async function readUser(profile) {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE profile = ?', [profile]);
    return rows;
  } catch (error) {
    console.error('Error in readUser:', error.message);
    throw error;
  }
}

export async function insertUser(name, profile, password, headline) {
  try {
    await pool.query('INSERT INTO users (name, profile, password, headline) VALUES (?, ?, ?, ?)', [
      name,
      profile,
      password,
      headline,
    ]);
  } catch (error) {
    console.error('Error in insertUser:', error.message);
    throw error;
  }
}

export async function insertPost(profile, content) {
  try {
    await pool.query('INSERT INTO posts (profile, content, likes, shares) VALUES (?, ?, 0, 0)', [profile, content]);
  } catch (error) {
    console.error('Error in insertPost:', error.message);
    throw error;
  }
}

export async function likeFun(content) {
  try {
    const output = await pool.query('SELECT likes FROM posts WHERE content = ?', [content]);
    const likes = output[0][0].likes;
    const incLikes = likes + 1;
    await pool.query('UPDATE posts SET likes = ? WHERE content = ?', [incLikes, content]);
  } catch (error) {
    console.error('Error in likeFun:', error.message);
    throw error;
  }
}

export async function shareFun(content) {
  try {
    const output = await pool.query('SELECT shares FROM posts WHERE content = ?', [content]);
    const shares = output[0][0].shares;
    const incShares = shares + 1;
    await pool.query('UPDATE posts SET shares = ? WHERE content = ?', [incShares, content]);
  } catch (error) {
    console.error('Error in shareFun:', error.message);
    throw error;
  }
}



export async function deleteFun(content) {
  try {
    
    await pool.query('DELETE from posts WHERE content = ?', [content]);
  } catch (error) {
    console.error('Error in shareFun:', error.message);
    throw error;
  }
}

// Similar modifications for other functions...

// Example of releasing a connection back to the pool
async function someAsyncFunction() {
  const connection = await pool.getConnection();
  try {
    // Your code using the connection
  } finally {
    connection.release(); // Always release the connection, even if an error occurs
  }
}
