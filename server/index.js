const express = require("express");
const massive = require("massive");

const users = require("./controllers/users.js");
const posts = require("./controllers/posts.js");

massive({
  host: "localhost",
  port: 5432,
  database: "node3",
  user: "postgres",
  password: "node3db"
})
  .then(db => {
    const app = express();

    app.set("db", db);

    app.use(express.json());

    app.post("/api/users", users.create);
    app.get("/api/users", users.list);
    app.get("/api/users/:id", users.getById);
    app.get("/api/users/:id/profile", users.getProfile);

    //POSTS ENDPOINTS
    app.post("/api/posts/:userId", posts.create);
    app.get("/api/posts", posts.allPosts);
    app.get("/api/posts/:postId", posts.viewPostByPostId);
    app.get("/api/users/:userId/posts", posts.viewPostsByUserId);
    app.patch("/api/posts/:postId", posts.updatePost);

    const PORT = 3001;
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch(console.error);
