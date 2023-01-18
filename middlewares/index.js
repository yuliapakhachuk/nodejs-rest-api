const validateBody = (schema) => {
    return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return next(res.status(400).json({ message: "missing fields" }));
    }

    return next();
    };
};

module.exports = {
    validateBody,
};