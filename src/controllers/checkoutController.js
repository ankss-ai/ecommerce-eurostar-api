const checkoutService = require('../services/checkoutService');

function checkout(req, res, next) {
  try {
    const order = checkoutService.checkout(req.body || {});
    res.status(201).json({
      message: 'Checkout successful',
      customer: req.user,
      order,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { checkout };
