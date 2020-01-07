const express = require("express");
const massive = require("massive");

const users = require("./controllers/users.js");
const posts = require("./controllers/posts.js");
const comments = require("./controllers/comments.js");

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

    //Create
    app.post("/api/users", users.create);
    app.post("/api/posts/:userId", posts.create);
    app.post("/api/comments/:userId/:postId", comments.create);

    //Get all
    app.get("/api/users", users.list);
    app.get("/api/posts", posts.allPosts);

    //Get One
    app.get("/api/users/:id", users.getById);
    app.get("/api/users/:id/profile", users.getProfile);
    app.get("/api/posts/:id/comments", posts.viewPostByPostId);

    //get all posts of specific user
    app.get("/api/users/:userId/posts", posts.viewPostsByUserId);

    //Patch
    app.patch("/api/posts/:postId", posts.updatePost);
    app.patch("/api/comments/:commentId", comments.updateComment);

    //Node-4 Part 3
    app.post("/api/login", users.login);
    app.get("/api/loginList", users.loginList);
    app.get("/api/protected/data", users.auth);

    const PORT = 3001;
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch(console.error);
