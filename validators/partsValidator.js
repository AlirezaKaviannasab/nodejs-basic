const Validator = require('./validator');
const { check } = require('express-validator');
const parts = require('./../models/parts');
const path = require('path')
class partsValidator extends Validator {
    handle() {
        return [
            check('title')
                .isLength({ min: 3 })
                .withMessage('عنوان نباید خالی بماند')
                .custom(async (value, { req }) => {
                    if (req.query._method === 'post') {
                        let Parts = await parts.findById(req.params.id)
                        if (Parts.title === value) return
                    }
                    let Parts = await parts.findOne({ slug: this.slug(value) })
                    if (Parts)
                        throw new Error('چنین پارتی با این عنوان وجود دارد')
                }),
            check('description')
                .not().isEmpty()
                .withMessage('توضیحات باید نوشته شوند'),
            check('price')
                .not().isEmpty()
                .withMessage('قیمت را تایین کنید'),
            check('tags')
                .not().isEmpty()
                .withMessage('تگ نباید خالی بماند'),
        ]
    }
    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, "-")
    }

}
module.exports = new partsValidator();