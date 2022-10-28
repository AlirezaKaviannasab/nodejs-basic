const Validator = require('./validator');
const { check } = require('express-validator');
const roles = require('./../models/roles')
class rolesValidator extends Validator {
    handle() {
        return [
            check('name')
                .isLength({ min : 3 })
                .withMessage('عنوان نمیتواند کمتر از 3 کاراکتر باشد')
                .custom(async (value , { req }) => {
                    if(req.query._method === 'post') {
                        let roless = await roles.findById(req.params.id);
                        if(roless.name === value) return;
                    }
                    
                    let Roles = await roles.findOne({ name : value });
                    if(Roles) {
                        throw new Error('چنین دسته ای با این عنوان قبلا در سایت قرار داد شده است')
                    }
                }),

            check('label')
                .not().isEmpty()
                .withMessage('فیلد توضیح نمیتواند خالی بماند'),
            check('permissions')
                .not().isEmpty()
                .withMessage('فیلد پرمیشن ها نمیتواند خالی بماند')
        ]
    }


}
module.exports = new rolesValidator();