const Validator = require('./validator');
const { check } = require('express-validator');
const categories = require('./../models/categories')
class loginValidator extends Validator {
    handle() {
        return [
            check('name')
                .isLength({ min : 3 })
                .withMessage('عنوان نمیتواند کمتر از 3 کاراکتر باشد')
                .custom(async (value , { req }) => {
                    if(req.query._method === 'put') {
                        let category = await categories.findById(req.params.id);
                        if(category.name === value) return;
                    }
                    
                    let Categories = await categories.findOne({ name : value });
                    if(Categories) {
                        throw new Error('چنین دسته ای با این عنوان قبلا در سایت قرار داد شده است')
                    }
                }),

            check('parent')
                .not().isEmpty()
                .withMessage('فیلد پدر دسته نمیتواند خالی بماند')
        ]
    }


}
module.exports = new loginValidator();