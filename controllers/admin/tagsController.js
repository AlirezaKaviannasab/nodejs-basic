const tags = require('./../../models/tags')
const controller = require("./../controller");
exports.showAll = async (req,res,next)=>{
    let page = req.query.page || 1;
  let Tags= await tags.paginate(
    {},
    { page, sort: { createdAt: -1 }, limit: 10 , populate : 'parent' }
  );
  res.render("admin/tags/tags", { Tags, layout : 'layoutAdmin' ,user: req.user.name } );
};

exports.createShow = async (req,res,next)=>{
    let Tags = await tags.find({ parent : null });
    res.render("admin/tags/createtags", {
        layout: "layoutAdmin",
        user: req.user.name,
        Tags
      });
}
exports.create = async (req,res,next)=>{
    try {
        let status = await controller.validationData(req);
        if(! status) return controller.back(req,res);
    
        let { name , parent } = req.body;

        let newTags = new tags({ 
            name,
            parent : parent !== 'none' ? parent : null
         });

        await newTags.save();

        return res.redirect('/admin/tags/tags');  
    } catch(err) {
        next(err);
    }
}
exports.editShow = async (req,res,next)=>{
    try {
        controller.isMongoId(req.params.id);

        let Tag = await tags.findById(req.params.id);
        let Tags = await tags.find({ parent : null });
        if( ! Tag ) this.error('چنین دسته ای وجود ندارد' , 404);


        return res.render('admin/tags/edittags' , { Tag , Tags,layout: "layoutAdmin",
        user: req.user.name, });
    } catch (err) {
        next(err);
    }
}
exports.edit = async (req,res,next)=>{
    try {
        let status = await controller.validationData(req);
        if(! status) return controller.back(req,res);

        let { name , parent } = req.body;
        
        await tags.findByIdAndUpdate(req.params.id , { $set : { 
            name,
            parent : parent !== 'none' ? parent : null
         }})

        return res.redirect('/admin/tags/tags');
    } catch(err) {
        next(err);
    }
}
exports.delete = async (req,res,next)=>{
    try {
        this.isMongoId(req.params.id);

        let Tags = await tags.findById(req.params.id).populate('childs').exec();
        if( ! Tags ) this.error('چنین دسته ای وجود ندارد' , 404);

        Tags.childs.forEach(tags => tags.remove() );

        // delete category
        Tags.remove();

        return res.redirect('/admin/tags/tags');
    } catch (err) {
        next(err);
    }
}

