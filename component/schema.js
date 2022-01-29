const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
// creating schema
const UserInfo = new mongoose.Schema({
  name: String,
  password: String,
  token: String,
});
//token generation
UserInfo.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    );
    this.token = token;
    return token;
  } catch (e) {
    console.log("this error is " + e);
  }
};
// creating collection and defining its schema
const Credential = new mongoose.model("Credential", UserInfo);

module.exports = Credential;
