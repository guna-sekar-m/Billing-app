const moment = require("moment-timezone");
const {User} = require("../models/users.model.js");
const { raw } = require("body-parser");

const generateRandomKey = async ()=>{
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const keyParts = [];
    
    // Generate four parts of the key
    for (let i = 0; i < 4; i++) {
      let keyPart = '';
      for (let j = 0; j < 4; j++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        keyPart += characters.charAt(randomIndex);
      }
      keyParts.push(keyPart);
    }
    
    return keyParts.join('-');
  }
  

const getlicensedt = async (req,res,next)=>{
    try{
        var email = req.user.data.Email;
        var data = await User.findOne({where:{Email : email},attributes:{exclude:['Password','Name','Email','Organization_Name','Mobile_Number','Address','Role','Status','OTP_Status','OTP']},raw:true});
        res.send(data)
    }
    catch(err){
        console.log(err)
    }
}

const ActivateKey = async (req,res,next)=>{
    try{
        var email = req.user.data.Email;
        var check_key = await User.findOne({where:{Email : email},raw:true});

        if(check_key.Product_Key&&check_key.Product_Key == req.body.Product_Key){
            var data = {Product_Key:'',Expiry_Date: moment(new Date()).add(365,'days').format('MM-DD-YYYY'),Product_Status : 'Active'};
            var update = await User.update(data,{where:{Email : req.user.data.Email}})
            res.send({msg:'License Activated Successfully'})
        }
        else{
            res.send({msg:'Invalid License Key!!'})
        }
    }
    catch(err){
        console.log(err)
    }
}

const GenerateKey = async (req,res,next)=>{
    try{
        //console.log(req.body, await generateRandomKey())
        var Role = req.user.data.Role;
        if(Role == 'Admin'){
            var data = await User.update({'Product_Key' : await generateRandomKey()},{where: req.body});
            var response = await User.findOne({where: req.body,attributes:['Product_Key'],raw : true});
            res.send({...response,msg : 'Key Generated Successfully'})
        }
        else{
            res.send({msg : 'Access Denied'})
        }
    }
    catch(err){
        console.log(err)
    }
}

module.exports = {getlicensedt,ActivateKey,GenerateKey}