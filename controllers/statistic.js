const Statistic = require("../models/statistic.js");
const mongoose = require("mongoose");

const setStatistic = async (req, res) => {
  const { statistic, legs, legsWon, legsLose, timeZone } = req.body;
  try {
    const user_id = req.user._id;
    let statisticFromDB = await Statistic.findOne({
      user_id: user_id,
    });
    const userDate = new Date(
      Date.now() +
        new Date().getTimezoneOffset() * 60 * 1000 -
        60 * 60 * 1000 * timeZone
    );
    let date = `${userDate.getDate()}-${
      userDate.getMonth() + 1
    }-${userDate.getFullYear()}`;
    date = date
      .split("-")
      .map((dateP) => (dateP.length === 1 ? "0" + dateP : dateP))
      .join("-");

    const newStatistic = {};
    for (const parameterName in statistic) {
      let count = legs;
      if (parameterName === "averagePointsWinLegs") count = legsWon;
      if (parameterName === "averagePointsLoseLegs") count = legsLose;
      newStatistic[parameterName] = {
        date,
        value: statistic[parameterName],
        count,
      };
    }

    if (!statisticFromDB) {
      await Statistic.create({
        user_id,
        statistic: newStatistic,
      });
    }

    if (statisticFromDB) {
      const statisticForDb = statisticFromDB.statistic;
      for (const parameterName in newStatistic) {
        if (!Object.hasOwn(statisticForDb, parameterName)) {
          statisticForDb[parameterName] = [newStatistic[parameterName]];
          continue;
        }
        if (statisticForDb[parameterName].at(-1)?.date !== date) {
          statisticForDb[parameterName].push(newStatistic[parameterName]);
          continue;
        }
        if (statisticForDb[parameterName].at(-1).date === date) {
          const oldStatistic = statisticForDb[parameterName].at(-1);
          if (
            parameterName.charAt(0) === "p" &&
            parameterName.charAt(1) !== "e"
          ) {
            oldStatistic.value =
              oldStatistic.value + newStatistic[parameterName].value;
            oldStatistic.count =
              oldStatistic.count + newStatistic[parameterName].count;
            continue;
          }
          if (parameterName === "highestCheckout") {
            oldStatistic.value =
              oldStatistic.value > newStatistic[parameterName].value
                ? oldStatistic.value
                : newStatistic[parameterName].value;
            oldStatistic.count =
              oldStatistic.count + newStatistic[parameterName].count;
            continue;
          }
          oldStatistic.value =
            (oldStatistic.value * oldStatistic.count +
              newStatistic[parameterName].value *
                newStatistic[parameterName].count) /
              (oldStatistic.count + newStatistic[parameterName].count) || 0;
          //|| 0 нужен при делении на 0 - чтобы не было NaN
          oldStatistic.count =
            oldStatistic.count + newStatistic[parameterName].count;
          continue;
        }
      }
      const currentStatistic = await Statistic.findOneAndUpdate(
        { _id: statisticFromDB._id },
        { statistic: statisticForDb }
      );
    }

    let response = {
      message: "Статистика сохранена",
    };
    if (req.newTokens)
      response.newTokens = {
        token: req.newTokens.token,
        refreshToken: req.newTokens.refreshToken,
      };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    let response = {
      error: "Ошибка при попытке сохранить статистику",
    };
    if (req.newTokens)
      response.newTokens = {
        token: req.newTokens.token,
        refreshToken: req.newTokens.refreshToken,
      };
    res.status(500).json(response);
  }
};

const getStatistic = async (req, res) => {
  try {
    const user_id = req.user._id;
    let statistic = await Statistic.findOne({
      user_id: user_id,
    });
    if (!statistic)
      throw new Error("Статистика отсутствует", { cause: "custom error" });

    let response = {
      statistic: statistic.statistic,
    };
    if (req.newTokens)
      response.newTokens = {
        token: req.newTokens.token,
        refreshToken: req.newTokens.refreshToken,
      };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    let response = {};
    if (req.newTokens)
      response.newTokens = {
        token: req.newTokens.token,
        refreshToken: req.newTokens.refreshToken,
      };
    if (error.cause === "custom error") {
      response.error = error.message;
      res.status(404).json(response);
    } else {
      response.error = "Ошибка сервера";
      res.status(500).json(response);
    }
  }
};

module.exports = {
  setStatistic,
  getStatistic,
};
