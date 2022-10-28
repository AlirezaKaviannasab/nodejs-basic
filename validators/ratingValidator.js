const Validator = require('./validator');
const { check } = require('express-validator');
const path = require('path')
class ratingValidator extends Validator {
    handle() {
        return [
            check('rating')
                .not().isEmpty()
                .withMessage('امتیاز چک شود'),
            
        ]
    }

}
module.exports = new ratingValidator();