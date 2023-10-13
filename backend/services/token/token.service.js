const jwt = require('jsonwebtoken');
const {verify} = jwt;
const accessTokenSecret = 'Billingappsecret';

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      //console.log("auth");
      const token = authHeader.split(" ")[1];
      verify(token, accessTokenSecret, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }

        req.user = user;
        next();
      });
    } else {
      res.send("authentication to access");
    }
}
module.exports = {authenticateJWT};