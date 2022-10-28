const Validator = require('./validator');
const { check } = require('express-validator');

class loginValidator extends Validator {
    handle() {
        return [
            check('email')
                .isEmail()
                .withMessage('ایمیل معتبر نیست'),
            check('password')
                .isLength({ min: 8 })
                .withMessage('پسورد نمیتواند کمتر از 8 کاراکتر باشد'),
        ]
    }

}
module.exports = new loginValidator();