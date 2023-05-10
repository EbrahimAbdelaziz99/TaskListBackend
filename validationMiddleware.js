const { taskSchema,userSchema } = require("./validation/validation")
module.exports.validateTask = (req, res, next) => {
    const { error } = taskSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        return res.status(400).json({
            error : msg
        })
    } else {
        next();
    }
}

module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        return res.status(400).json({
            error : msg
        })
    } else {
        next();
    }
}

