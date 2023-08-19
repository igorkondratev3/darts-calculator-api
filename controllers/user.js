const User = require("../models/user.js");
const RefreshToken = require("../models/refreshToken.js");
const Statistic = require("../models/statistic.js");
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

const changeUserInformation = async (req, res) => {
  try {
    const changableParameter = req.body.changableParameter;
    const parameterKey = Object.keys(changableParameter)[0];
    if (!changableParameter[parameterKey])
      return res
        .status(400)
        .json({ error: "Предоставлены некорректные данные" });
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      changableParameter,
      { new: true }
    );

    const payload = { [parameterKey]: user[parameterKey] };
    if (req.newTokens)
      payload.newTokens = {
        token: req.newTokens.token,
        refreshToken: req.newTokens.refreshToken,
      };

    res.status(200).json(payload);
  } catch (error) {
    console.error(error);
    let response = {
      error: "Ошибка при попытке изменить параметр",
    };
    if (req.newTokens)
      response.newTokens = {
        token: req.newTokens.token,
        refreshToken: req.newTokens.refreshToken,
      };
    res.status(500).json(response);
  }
};

const deleteUser = async (req, res) => {
  try {
    await RefreshToken.deleteOne({ user_id: req.user._id });
    await Statistic.deleteOne({ user_id: req.user._id });
    await User.deleteOne({ _id: req.user._id });
    res.status(200).json({ message: "Профиль удален" });
  } catch (error) {
    console.error(error);
    let response = {
      error: "Ошибка при удалении профиля",
    };
    if (req.newTokens)
      response.newTokens = {
        token: req.newTokens.token,
        refreshToken: req.newTokens.refreshToken,
      };
    res.status(500).json(response);
  }
};

module.exports = {
  signin,
  signup,
  changeUserInformation,
  deleteUser,
};
