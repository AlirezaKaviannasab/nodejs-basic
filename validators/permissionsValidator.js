const Validator = require('./validator');
const { check } = require('express-validator');
const permissions = require('./../models/permissions')
class permissionsValidator extends Validator {
    handle() {
        return [
            check('name')
                .isLength({ min : 3 })
                .withMessage('عنوان نمیتواند کمتر از 3 کاراکتر باشد')
                .custom(async (value , { req }) => {
                    if(req.query._method === 'post') {
                        let permissionss = await permissions.findById(req.params.id);
                        if(permissionss.name === value) return;
                    }
                    
                    let Permissions = await permissions.findOne({ name : value });
                    if(Permissions) {
                        throw new Error('چنین دسته ای با این عنوان قبلا در سایت قرار داد شده است')
                    }
                }),

            check('label')
                .not().isEmpty()
                .withMessage('فیلد توضیح نمیتواند خالی بماند')
        ]
    }


}
module.exports = new permissionsValidator();