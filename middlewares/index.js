const Joi = require("joi");

const validateBody = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
        return next(res.status(400).json({ message: "missing fields" }));
        }

        return next();
    };
};

const addContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string(),
    phone: Joi.string(),
});

const updateStatusSchema = Joi.object({
    favorite: Joi.boolean().required(),
});

module.exports = {
    validateBody,
    addContactSchema,
    updateStatusSchema,
};