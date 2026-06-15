const bcrypt = require('bcryptjs');

// In-memory user store. Passwords are hashed at startup so the rest of the
// app only ever deals with hashes. The plaintext values are documented in the
// README under "Existent Data" for demo logins.
const seedUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', password: 'alice123' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', password: 'bob123' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', password: 'carol123' },
];

const users = seedUsers.map((user) => ({
  ...user,
  password: bcrypt.hashSync(user.password, 10),
}));

function findByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === String(email).toLowerCase());
}

function findById(id) {
  return users.find((user) => user.id === id);
}

function create({ name, email, password }) {
  const id = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
  const user = { id, name, email, password: bcrypt.hashSync(password, 10) };
  users.push(user);
  return user;
}

module.exports = { users, findByEmail, findById, create };
