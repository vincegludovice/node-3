const express = require("express");
const massive = require("massive");

const users = require("./controllers/users.js");
const posts = require("./controllers/posts.js");
const comments = require("./controllers/comments.js");

const jwt = require("jsonwebtoken");
const secret = require("../secret");

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

    const auth = (req, res, next) => {
      if (!req.headers.authorization) {
        return res.status(401).end();
      }
      try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, secret);
        next();
      } catch (err) {
        console.error(err);
        res.status(401).end();
      }
    };

    //Create
    app.post("/api/users", users.create);
    app.post("/api/posts/:userId", auth, posts.create);
    app.post("/api/comments/:userId/:postId", auth, comments.create);

    //Get all
    app.get("/api/users", auth, users.list);
    app.get("/api/posts", auth, posts.allPosts);

    //Get One
    app.get("/api/users/:id", auth, users.getById);
    app.get("/api/users/:id/profile", auth, users.getProfile);
    app.get("/api/posts/:id/comments", auth, posts.viewPostByPostId);

    //get all posts of specific user
    app.get("/api/users/:userId/posts", auth, posts.viewPostsByUserId);

    //Patch
    app.patch("/api/posts/:postId", auth, posts.updatePost);
    app.patch("/api/comments/:commentId", auth, comments.updateComment);

    //Node-4 Part 3
    app.post("/api/login", auth, users.login);
    app.get("/api/loginList", auth, users.loginList);

    const PORT = 3001;
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch(console.error);
