const moment = require("moment-timezone");
const {User} = require("../models/users.model.js");
const fs = require("fs");

const getusersdt = async (req,res,next)=>{
    try{
        var email = req.user.data.Email;
        var data = await User.findOne({where:{Email : email},raw:true});
        res.send(data)
    }
    catch(err){
        console.log(err)
    }
}

const updateuser = async (req,res,next)=>{
    try{
        //var email = req.user.data.Email
        var logo = req.files;
        var data = JSON.parse(req.body.data);
        var update_data;
        //console.log(logo, data)
        if(logo){
            var dir = "./upload/images/"+moment().tz('Asia/Calcutta').format("YYYY-MM");
     
            if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            }

            var newfiles = "/images/"+moment().tz('Asia/Calcutta').format("YYYY-MM")+"/"+data.Organization_Name+"-"+logo.file.name;
            logo.file.mv(dir+'/'+data.Organization_Name+"-"+logo.file.name, async (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
            });

            update_data = {...data,logo : newfiles}
        }
        else{
            update_data = {...data}
        }
        
        var update = await User.update(update_data,{where: {Email : req.user.data.Email}});
        var finddata = await User.findOne({where:{Email : req.user.data.Email}, raw : true})

        res.send(finddata);
    }
    catch(err){
        console.log(err)
    }
}

const get_theme = async (req,res,next)=>{
    try{
        var data = await User.findOne({where : {Email : req.user.data.Email},attributes:{exclude:['password','Email','OTP','OTP_Status','Role','Status','Mobile_Number']}})
        res.send(data)
    }
    catch(err){
        console.log(err)
    }
}

const updatethemes = async (req,res,next)=>{
    try{
        var data = await User.update(req.body,{where : {Email : req.user.data.Email}})
        res.send(data)
    }
    catch(err){
        console.log(err)
    }
}

module.exports = {getusersdt, updateuser, get_theme, updatethemes}