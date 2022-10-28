const path = require('path')
const autoBind = require('auto-bind');
module.exports = class Helpers {

    constructor(req, res) {
        this.req = req;
        this.res = res;
        autoBind(this);
        this.formData = req.flash('formData')[0]
    }


    getObjects() {
        return {
            auth: this.auth(),
            viewPath: this.viewPath,
            ...this.getGlobalVariables(),
            old: this.old,
            req: this.req
        }
    }
 
    auth() {
        return {
            check: this.req.isAuthenticated(),
            user: this.req.user
        }
    }
    viewPath(dir) {
        return path.resolve(path.resolve('./src/views') + '/' + dir)

    }
    getGlobalVariables() {
        return {
            errors: this.req.flash('errors')
        }
    }
    old(field , defaultValue = '') {
        return this.formData && this.formData.hasOwnProperty(field) ? this.formData[field] : defaultValue;
    }

}