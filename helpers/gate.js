let ConnectRoles = require("connect-roles");
let permissions = require('./../models/permissions')
let gate = new ConnectRoles({
  failureHandler: function (req, res, action) {
    var accept = req.headers.accept || "";
    res.locals.layout = 'errors/master'
    res.status(403);
    if (~accept.indexOf("html")) {
      res.render('errors/403', { action });
    } else {
      res.json("Access Denied - You don't have permission to: " + action);
    }
  },
});
const Permissions = async () => {
    return await permissions.find({}).populate('roles').exec();
}
Permissions().then(permissions => {
    permissions.forEach(per =>{
        let Roles = per.roles.map(item => item._id)
        gate.use(per.label, (req) => {
            if(req.isAuthenticated()){
                return req.user.hasRole(Roles)
            }else{
                return false
            } ;
          });
    })
})
gate.use("show-posts", (req) => {
  return true;
});

module.exports = gate;
