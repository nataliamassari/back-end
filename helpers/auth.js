module.exports = {
  /*session authentication*/

  isLogged: function (req, res, next) {
    let error = req.body;

    if (req.session && req.session.user) {
      return next();
    } else {
      return res.render("login", { error: "Usuário não autenticado!" });
    }
  },
};
