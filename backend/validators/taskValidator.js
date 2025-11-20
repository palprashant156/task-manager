const Joi = require('joi');

const taskValidationSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 3 characters',
    'any.required': 'Title is required'
  }),
  description: Joi.string().max(500).allow('').optional(),
  status: Joi.string().valid('pending', 'in-progress', 'completed').optional()
});

const validateTask = (req, res, next) => {
  const { error } = taskValidationSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  
  next();
};

module.exports = validateTask;
