const fedexAPI  = require('./soap.js');
const config = require('../../../config');

let fedex = new fedexAPI({
  environment:    'sandbox', // or live
  key:            config.FEDEX.key,
  password:       config.FEDEX.password,
  account_number: config.FEDEX.account_number,
  meter_number:   config.FEDEX.meter_number
});

module.exports = fedex;
