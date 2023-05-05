const RefreshToken = require("../models/refreshToken.js");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const deleteRefreshToken = async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization)
    return res.status(401).json({ error: "Необходим refreshToken" });
  const refreshToken = authorization.split(" ")[1];
  await RefreshToken.deleteOne({ refreshToken }); //если некорректный, то его и так не будет в БД
  res.status(200).json({ message: "RefreshToken удален" });
};

const updateTokens = async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken)
    return {error: 'Необходимо предоставить refreshToken'}

  let _id;
  try {
    _id = jwt.verify(refreshToken, process.env.SECRET_FOR_REFRESH_TOKEN)._id;
  } catch (error) {
    console.error(error);
    return {error: 'Необходимо повторно осуществить вход111'}
  }

  const refreshTokenExists = await RefreshToken.findOne({
    refreshToken,
  });
  if (!refreshTokenExists)
    return {error: 'Необходимо повторно осуществить вход'}


  const newToken = jwt.sign({ _id }, process.env.SECRET_FOR_TOKEN, {
    expiresIn: "15m",
  });
  const newRefreshToken = jwt.sign(
    { _id },
    process.env.SECRET_FOR_REFRESH_TOKEN,
    { expiresIn: "7d" }
  );

  await RefreshToken.updateOne(
    { user_id: _id },
    { $set: { refreshToken: newRefreshToken } }
  );

  req.newTokens = {
    token: newToken,
    refreshToken: newRefreshToken,
  };
  return {_id}
};

module.exports = {
  deleteRefreshToken,
  updateTokens,
};
