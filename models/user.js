const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

userSchema.statics.signup = async function (email, password, name) {
  const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const regexPassword =
    /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}/;

  if (!email || !password || !name)
    throw new Error("Все поля должны быть заполнены", {
      cause: "custom error",
    });
  if (!regexEmail.test(email))
    throw new Error("Некорректный email", {
      cause: "custom error",
    });
  if (!regexPassword.test(password))
    throw new Error("Пароль не соответствует требованиям", {
      cause: "custom error",
    });

  const emailExists = await this.findOne({ email });
  if (emailExists)
    throw new Error("Email уже используется", {
      cause: "custom error",
    });

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await this.create({ email, password: hash, name });

  return user;
};

userSchema.statics.signin = async function (email, password) {
  const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const regexPassword =
    /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}/;

  if (!email || !password)
    throw new Error("Все поля должны быть заполнены", {
      cause: "custom error",
    });

  if (!regexEmail.test(email) || !regexPassword.test(password))
    throw new Error("Некорректное имя пользователя и/или пароль", {
      cause: "custom error",
    });

  const user = await this.findOne({ email });

  if (!user)
    throw new Error("Некорректное имя пользователя и/или пароль", {
      cause: "custom error",
    });

  const match = await bcrypt.compare(password, user.password);

  if (!match)
    throw new Error("Некорректное имя пользователя и/или пароль", {
      cause: "custom error",
    });

  return user;
};

module.exports = mongoose.model("User", userSchema);
