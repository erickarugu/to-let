const Joi = require('joi');

module.exports = {
  validateBody: (schema) => (req, res, next) => {
    const data = Joi.validate(req.body, schema);
    if (data.error) {
      return res.status(422).json({
        status: 'error',
        message: 'invalid request data',
        error: data.error,
        data: data.value

      });
    }
    if (!req.value) { req.value = {}; }
    req.value.body = data.value;
    next();
  },
  schemas: {
    authSchema:
            Joi.object().keys({
              name: Joi.string(),
              email: Joi.string().email().required(),
              password: Joi.string().required().min(6).max(25)
            })
  }


};
