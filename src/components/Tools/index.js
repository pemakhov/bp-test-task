const https = require('https');

const TARGET = 'https://www.google.com/';

/**
 * A function measuring latency for the TARGET website
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 */
const measureLatency = async (req, res, next) => {
  try {
    const startTime = Date.now();
    await https.get(TARGET).on('response', () => {
      const latency = Date.now() - startTime;
      res.status(200).json({ latency });
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  measureLatency,
};
