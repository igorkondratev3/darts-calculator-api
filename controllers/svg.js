const Svg = require("../models/svg.js");
const mongoose = require("mongoose");

const getSvg = async (req, res) => {
  try {
    const { name } = req.query;
    const svg = await Svg.findOne({
      name: name,
    });
    if (!svg)
      throw new Error("Не удалось получить иконку", { cause: "custom error" });
    res.status(200).type("svg+xml").send(svg.value);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getSvg
};