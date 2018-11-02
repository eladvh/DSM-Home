 //-----------------------------------------------Main page----------------------------------------------------------------
exports.index = function(req, res){

  var answer = {sendName: '', message:''};

  userId = req.session.userId;
  if(userId != null){
    res.redirect("/home/dashboard");
    return;
 }

  userSession = {
    id: null,
    first_name: null,
    last_name: null,
    user_name: null}
  req.session.user = userSession;
  //console.log(req.session);
  
  res.render('new_login',{answer:answer});
};