const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const { updateTokens } = require("../controllers/refreshToken.js");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization)
    return res
      .status(401)
      .json({ error: "Необходимо предоставить токен авторизации" });
  const token = authorization.split(" ")[1];

  let _id;
  try {
    _id = jwt.verify(token, process.env.SECRET_FOR_TOKEN)._id;
  } catch (error) {
    _id = await updateTokens(req, res)
    if (Object.hasOwn(_id, 'error'))
      return res.status(404).json({ error: _id.error });
  }

  req.user = await User.findOne({ _id }).select("_id"); //создаем объект user в запросе, чтобы следующие маршруты если они выполняются могли его использовать
  if (!req.user)
    return res
      .status(401)
      .json({ error: "Информация о пользователе отсутствует" });
  next();
};

module.exports = requireAuth;
