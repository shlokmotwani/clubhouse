const { pool } = require("../config/pool");

const addAdmin = async (params) => {
  await pool.query(
    "INSERT INTO users (first_name, last_name, email, password, membership, isadmin) VALUES ($1, $2, $3, $4, $5, $6)",
    [
      params.firstName,
      params.lastName,
      params.email,
      params.hashedPassword,
      params.membership,
      params.isadmin,
    ]
  );
};

const addUser = async (params) => {
  await pool.query(
    "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",
    [params.firstName, params.lastName, params.email, params.hashedPassword]
  );
};

const updateMembership = async (params) => {
  await pool.query(`UPDATE users SET membership = 'y' WHERE email = $1`, [
    params.email,
  ]);
};

const deleteMessage = async (params) => {
  await pool.query("DELETE FROM messages WHERE id = $1", [
    String(params.messageID),
  ]);
};

const displayMessagesToUsers = async () => {
  const data = await pool.query(
    "SELECT messages.title, messages.content FROM MESSAGES"
  );
  return data;
};

const displayMessagesToMembers = async () => {
  const data = await pool.query(
    "SELECT users.first_name, users.last_name, users.email, messages.id, messages.title, messages.content, messages.timestamp FROM MESSAGES LEFT JOIN users ON messages.user_id = users.id"
  );
  return data;
};

const addMessage = async (params) => {
  await pool.query(
    "INSERT INTO messages(title, content, timestamp, user_id) VALUES ($1, $2, $3, $4)",
    [params.title, params.content, params.timestamp, params.userID]
  );
};

const queries = {
  addAdmin,
  addUser,
  updateMembership,
  deleteMessage,
  displayMessagesToUsers,
  displayMessagesToMembers,
  addMessage,
};

module.exports = {
  queries,
};
