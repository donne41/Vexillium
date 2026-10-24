/**
* attachUser sätter req.user till den inloggade användaren från sessionen,
* eller null om ingen är inloggad. Körs för alla requests så att controllers
* kan läsa req.user utan att behöva känna till sessionen.
*/
function attachUser(req, res, next) {
    req.user = req.session.user ?? null;
    next();
}

module.exports = attachUser;