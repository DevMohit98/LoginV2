const mongoose = require("mongoose");
// Database
// connection and creating database
mongoose
  .connect("mongodb://localhost:27017/User", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connection established with DataBase");
  })
  .catch((e) => {
    console.log(e);
  });
