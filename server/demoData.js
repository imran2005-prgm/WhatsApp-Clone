// In-memory demo data store (when MongoDB is not available)
const users = [
  {
    _id: "1",
    username: "john_doe",
    email: "john@example.com",
    password: "$2a$10$N9qo8uLOickgx2ZMRZoMye", // demo hashed password
    avatar: ""
  },
  {
    _id: "2",
    username: "jane_smith",
    email: "jane@example.com",
    password: "$2a$10$N9qo8uLOickgx2ZMRZoMye",
    avatar: ""
  },
  {
    _id: "3",
    username: "bob_wilson",
    email: "bob@example.com",
    password: "$2a$10$N9qo8uLOickgx2ZMRZoMye",
    avatar: ""
  }
];

const messages = [];

module.exports = { users, messages };
