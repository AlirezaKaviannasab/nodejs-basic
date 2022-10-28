const Validator = require('./validator');
const { check } = require('express-validator');
const sections = require('./../models/sections');
const path = require('path')
class sectionsValidator extends Validator {
    handle() {
        return [
            check('title')
                .isLength({ min: 3 })
                .withMessage('عنوان نباید خالی بماند')
                .custom(async (value, { req }) => {
                    if (req.query._method === 'post') {
                        let Sections = await sections.findById(req.params.id)
                        if (Sections.title === value) return
                    }
                    let Sections = await sections.findOne({ slug: this.slug(value) })
                    if (Sections)
                        throw new Error('چنین بخشی با این عنوان وجود دارد')
                }),
            check('description')
                .not().isEmpty()
                .withMessage('توضیحات باید نوشته شوند'),
            check('posts')
                .not().isEmpty()
                .withMessage('پست ها باید انتخاب شوند'),
            check('tags')
                .not().isEmpty()
                .withMessage('تگ نباید خالی بماند'),
        ]
    }
    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, "-")
    }

}
module.exports = new sectionsValidator();