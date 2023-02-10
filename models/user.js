const { Schema, model } = require("mongoose");


const schema = Schema(
  {
    password: {
        type: String,
        required: [true, 'Set password for user'],
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/[a-z0-9]+@[a-z0-9]+/, "Email is not valid"]
      },
      subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
      },
      token: {
        type: String,
        default: null,
      },
      avatarURL: {
        type: String,
      },
  },
  { 
    timetamps: true,
    versionKey: false 
  }
);

const User = model("user", schema);

module.exports = {
  User,
};