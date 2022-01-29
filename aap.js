require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Credential = require("./component/schema");
const bcrypt = require("bcryptjs");
const app = express();

//middleware
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
require("./component/db");

// api
app.get("/", (request, respond) => {
  respond.sendFile(path.resolve(__dirname, "./public/index.html"));
});
app.get("/signup", (request, respond) => {
  respond.sendFile(path.resolve(__dirname, "./public/signup.html"));
});
app.get("/forgot", (request, respond) => {
  respond.sendFile(path.resolve(__dirname, "./public/forgot.html"));
});
app.post("/signup", (request, respond) => {
  const { name, password } = request.body;

  // inserting user data
  const data = async () => {
    const hash = await bcrypt.hash(password, 10);
    try {
      const user = new Credential({
        name: name,
        password: hash,
      });
      const token = await user.generateAuthToken();
      console.log(token);
      const result = await Credential.insertMany([user]);
      respond.sendFile(path.resolve(__dirname, "./public/index.html"));
    } catch (e) {
      console.log(e);
    }
  };
  data();
});
app.post("/", (request, respond) => {
  const { username, password } = request.body;
  const isLogin = async (name) => {
    try {
      const userinfo = await Credential.findOne({ name });
      const isMatch = await bcrypt.compare(password, userinfo.password);
      const token = await userinfo.generateAuthToken();
      if (isMatch) {
        respond.sendFile(path.resolve(__dirname, "./public/index.html"));
      } else {
        respond.sendFile(path.resolve(__dirname, "./public/forgot.html"));
      }
    } catch (e) {
      respond.sendFile(path.resolve(__dirname, "./public/forgot.html"));
      console.log("Invalid credentials");
    }
  };
  isLogin(username);
});
app.post("/forgot", (request, respond) => {
  const { password, name } = request.body;
  const UpdatePassword = async (name) => {
    const Hash = await bcrypt.hash(password, 10);
    const user = await Credential.updateOne(
      { name },
      { $set: { password: Hash } }
    );
    respond.sendFile(path.resolve(__dirname, "./public/index.html"));
  };
  UpdatePassword(name);
});
app.listen(8080, () => {
  console.log("server started");
});
