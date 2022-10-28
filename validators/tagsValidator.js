const Validator = require('./validator');
const { check } = require('express-validator');
const tags = require('./../models/tags')
class loginValidator extends Validator {
    handle() {
        return [
            check('name')
                .isLength({ min : 3 })
                .withMessage('عنوان نمیتواند کمتر از 3 کاراکتر باشد')
                .custom(async (value , { req }) => {
                    if(req.query._method === 'post') {
                        let tag = await tags.findById(req.params.id);
                        if(tag.name === value) return;
                    }
                    
                    let Tags = await tags.findOne({ name : value });
                    if(Tags) {
                        throw new Error('چنین تگی با این عنوان قبلا در سایت قرار داد شده است')
                    }
                }),

            check('parent')
                .not().isEmpty()
                .withMessage('فیلد پدر تگ نمیتواند خالی بماند')
        ]
    }


}
module.exports = new loginValidator();