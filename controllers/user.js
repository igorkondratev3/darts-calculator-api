const User = require("../models/user.js");
const RefreshToken = require("../models/refreshToken.js");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET_FOR_TOKEN, { expiresIn: "15m" });
};

const createRefreshToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET_FOR_REFRESH_TOKEN, {
    expiresIn: "7d",
  });
};

const addRefreshTokenInDB = async (user_id, refreshToken) => {
  const refreshTokenExists = await RefreshToken.findOne({ user_id });
  if (refreshTokenExists)
    await RefreshToken.updateOne({ user_id }, { $set: { refreshToken } });
  else await RefreshToken.create({ user_id, refreshToken });
};

const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const user = await User.signup(email, password, name);
    const token = createToken(user._id);
    const refreshTokenValue = createRefreshToken(user._id);
    await addRefreshTokenInDB(user._id, refreshTokenValue);
    res
      .status(200)
      .json({ email, name, token, refreshToken: refreshTokenValue });
  } catch (error) {
    console.error(error);
    if (error.cause === "custom error")
      res.status(404).json({ error: error.message });
    else res.status(500).json({ error: "Ошибка сервера" });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.signin(email, password);
    const token = createToken(user._id);
    const refreshTokenValue = createRefreshToken(user._id);
    await addRefreshTokenInDB(user._id, refreshTokenValue);
    res
      .status(200)
      .json({ email, name: user.name, token, refreshToken: refreshTokenValue });
  } catch (error) {
    console.error(error);
    if (error.cause === "custom error")
      res.status(404).json({ error: error.message });
    else res.status(500).json({ error: "Ошибка сервера" });
  }
};

module.exports = {
  signin,
  signup,
};
