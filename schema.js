const Joi = require('joi');

module.exports.journalSchema = Joi.object({
    title: Joi.string().required(),
    entry: Joi.string().required()
});