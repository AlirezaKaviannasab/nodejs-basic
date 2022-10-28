const Validator = require('./validator');
const { check } = require('express-validator');

class signupValidator extends Validator {
    handle() {
        return [
            check('name')
                .isLength({ min: 2 })
                .withMessage('نام و نام خانوادگی نمیتواند خالی بماند'),
            check('email')
                .isEmail()
                .withMessage('ایمیل معتبر نیست'),
            check('password')
                .isLength({ min: 8 })
                .withMessage('پسورد نمیتواند کمتر از 8 کاراکتر باشد'),
            check('phoneNumber')
                .isLength({ min: 11 , max : 11 })
                .withMessage('فرمت شماره همراه اشتباه است'),
        ]
    }

}
module.exports = new signupValidator();