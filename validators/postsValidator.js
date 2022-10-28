const Validator = require('./validator');
const { check } = require('express-validator');
const posts = require('./../models/posts');
const path = require('path')
class postsValidator extends Validator {
    handle() {
        return [
            check('title')
                .isLength({ min: 3 })
                .withMessage('عنوان نباید خالی بماند')
                .custom(async (value, { req }) => {
                    if (req.query._method === 'post') {
                        let Posts = await posts.findById(req.params.id)
                        if (Posts.title === value) return
                    }
                    let Posts = await posts.findOne({ slug: this.slug(value) })
                    if (Posts)
                        throw new Error('چنین پستی با این عنوان وجود دارد')
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
module.exports = new postsValidator();