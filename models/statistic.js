const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const statisticSchema = new Schema({
  user_id: {
    type: String,
    required: true,
    unique: true
  },
  statistic: {
    averagePoints: {
      type: Array,
      required: false,
    },
    averagePointsWinLegs: {
      type: Array,
      required: false,
    },
    averagePointsLoseLegs: {
      type: Array,
      required: false,
    },
    averageFirstNineDarts: {
      type: Array,
      required: false,
    },
    p180: {
      type: Array,
      required: false,
    },
    p171: {
      type: Array,
      required: false,
    },
    p131: {
      type: Array,
      required: false,
    },
    p96: {
      type: Array,
      required: false,
    },
    percentDouble: {
      type: Array,
      required: false,
    },
    highestCheckout: {
      type: Array,
      required: false,
    },    
  }
});

module.exports = mongoose.model('Statistic', statisticSchema);