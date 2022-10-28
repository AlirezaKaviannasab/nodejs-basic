const Validator = require('./validator');
const { check } = require('express-validator');

class resetPasswordValidator extends Validator {
    handle() {
        return [
            check('email')
                .isEmail()
                .withMessage('ایمیل معتبر نیست')
                ,
            check('password')
                .isLength({ min: 8 })
                .withMessage('پسورد نمیتواند کمتر از 8 کاراکتر باشد')
                ,
            check('token')
                .not().isEmpty()
                .withMessage('توکن نمیتواند خالی بماند')
                ,
        ] 
    }
}
module.exports = new resetPasswordValidator();