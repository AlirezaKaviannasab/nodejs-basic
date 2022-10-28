const Validator = require('./validator');
const { check } = require('express-validator');
const path = require('path')
class commentValidator extends Validator {
    handle() {
        return [
            check('body')
                .isLength({min : 5})
                .withMessage('کامنت نباید از 5 کاراکتر کمتر باشد.'),
            
        ]
    }

}
module.exports = new commentValidator();