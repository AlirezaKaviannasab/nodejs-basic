class errorHandler {
    async error404(req, res, next) {
        try {
            res.statusCode = 404
            throw new Error('page not found');
        }
        catch (err) {
            next(err)
        }
    }
    async handler(err, req, res, next) {
        const statusCode = res.statusCode || 500;
        const message = err.message || '';
        const stack = err.stack || '';

        const layouts = {
            layout: 'layout',
            extractScripts: false,
            extractStyles: false
        }
        
        return res.render('errors/stack', { ...layouts, message, stack });
    }
}

module.exports = new errorHandler()