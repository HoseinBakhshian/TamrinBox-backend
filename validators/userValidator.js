// let autoBind = require('auto-bind');
const validator = require("./validator")
const { body } = require('express-validator');


class userValidator extends validator {
    handle() {
        return [body('email', process.env.EMAIL_MSG).isEmail(), body('password', process.env.PASSWORD_MSG).isLength({ min: 5 })]
    }
}

module.exports = new userValidator;

