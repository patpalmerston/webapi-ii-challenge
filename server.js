const express = require(`express`);
const server = express();
// server.use(express.json());

const postsRouter = require(`./data/posts-router.js`)

server.use(express.json());
server.use('/api/posts', postsRouter)

server.get('/', (req, res) => {
  res.send(`
    <h2>Web Api II Challenge</h2>
    <p>Welcome to the Thunderdome<p>
  `);
});

module.exports = server;
