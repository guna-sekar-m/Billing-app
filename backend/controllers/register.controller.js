const { Sequelize } = require("sequelize");
const { User } = require("../models/users.model.js");
const { mail } = require("../services/Email/Email.service.js");
const { generateOTP } = require("../services/otp/otp.service.js");
const dotenv = require('dotenv');
dotenv.config();

const sendotp = async (req,res,next)=>{
    try{
        var verifymail = await User.findOne({where:{Email : req.body.Email},raw:true});
        if(verifymail == null){
            var savedata = await User.create({Email : req.body.Email, OTP : generateOTP()})
            await mail(savedata.OTP,req.body.Email)
            res.send({msg:"OTP sended"})
        }
        else if(verifymail && verifymail.OTP_Status == 'Notverified'){
            var updateotp = await User.update({OTP : generateOTP()},{where :{Email : req.body.Email},raw:true});
            var otp = await User.findOne({where :{Email : req.body.Email},raw:true})
            await mail(otp.OTP,req.body.Email)
            res.send({msg:"OTP sended"})
        }
        else{
            res.send({msg:"Email already exist"})
        }
    }
    catch(err){
        console.log(err)
    }
}

const verifyotp = async (req,res,next)=>{
    try{

        var verify = await User.findOne(req.body,{raw:true});
        //console.log(verify)
        if(verify){
            res.send({msg:'OTP Verified'})
        }
        else{
            res.send({msg:'Invalid OTP'})
        }
    }
    catch(err){
        console.log(err)
    }
}

const completeregister = async (req,res,next) =>{
    try{
        var data = req.body.data;
        var complete = await User.update(data,{where:req.body.id})
        res.send({msg:'succes'})
    }
    catch(err){
        console.log(err)
    }
}

const makeid = ()=> {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 3) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return 'db_'+result;
}

module.exports = { sendotp, verifyotp, completeregister }