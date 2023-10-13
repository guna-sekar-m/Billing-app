
const { User, subusers } = require('../models/users.model.js');
const jwt = require("jsonwebtoken");
const accessTokenSecret = 'Billingappsecret';

const login = async(req, res, next) => {
  try {
    var usersd = await User.findOne({where:{Email: req.body.Email,Password:req.body.Password,Status:"Active"}});
    if(usersd){
      const token = jwt.sign({data:{ Email: usersd.Email, Name:usersd.Name, Role:usersd.Role, Organization_Name:usersd.Organization_Name, db:usersd.Database_Name,Product_Status : usersd.Product_Status,Expiry_Date : usersd.Expiry_Date}}, accessTokenSecret);
      res.send({message : "Success", token : token});
    }
    else{
      res.send({message : "Invalid Email or Password"});
    }
  } 
  catch (err) {
    console.log(err);
  }
};

module.exports = { login };

