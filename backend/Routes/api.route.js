const express = require("express");
const { login } = require("../controllers/authentication.controller.js");
const { searchitems,getitems,saveitems,importitems,updateitems,deleteitems, getpurchase, savepurchase, deletepurchase, getfilteritems, downloadxls } = require("../controllers/items.controller.js");
const {getallinvoices, getnewinvoice,addnewinvoice,updateinvoice,getinvoicebyid,printpdf, itemsqtyvalidation} = require("../controllers/invoice.controller.js");
const { getdashboard, Purchase_Sales_Report, recentbestsales,getinvoices,notsoldproducts, outofstock, getinvoicebydb } = require("../controllers/dashboard.controller.js");
const { getusersdt, updateuser, get_theme, updatethemes } = require("../controllers/settings.controller.js");
const { authenticateJWT } = require("../services/token/token.service.js");
const { sendotp, verifyotp, completeregister } = require("../controllers/register.controller.js");
const { getlicensedt,GenerateKey, ActivateKey } = require("../controllers/licensekey.controller.js");

const apirouter=express.Router()

//login;
apirouter.post('/login',login);

//register
apirouter.post('/sendotp',sendotp);
apirouter.post('/verifyotp',verifyotp);
apirouter.put('/completeregister',completeregister);

//dashboard
apirouter.get('/getdashboard',authenticateJWT,getdashboard);
apirouter.get('/pruchase&salesreport',authenticateJWT,Purchase_Sales_Report);
apirouter.get('/recentbestsales',authenticateJWT,recentbestsales);
apirouter.post('/pruchase&salesreport',authenticateJWT,Purchase_Sales_Report);
apirouter.get('/getinvoices',authenticateJWT,getinvoices);
apirouter.get('/notsoldproducts',authenticateJWT,notsoldproducts);
apirouter.get('/outofstock',authenticateJWT,outofstock);
apirouter.post('/getinvoicebydb',authenticateJWT,getinvoicebydb);

//items crud;
apirouter.post('/searchitems',authenticateJWT,searchitems);
apirouter.get('/getitems',authenticateJWT,getitems);
apirouter.post('/saveitems',authenticateJWT,saveitems);
apirouter.post('/importitems',authenticateJWT,importitems);
apirouter.put('/updateitems',authenticateJWT,updateitems);
apirouter.delete('/deleteitems',authenticateJWT,deleteitems);
apirouter.post('/getfilteritems',authenticateJWT,getfilteritems);
apirouter.post('/downloadxls',authenticateJWT,downloadxls);

//Purchase Crud
apirouter.get('/getpurchase',authenticateJWT,getpurchase)
apirouter.post('/savepurchase',authenticateJWT,savepurchase);
apirouter.delete('/deletepurchase',authenticateJWT,deletepurchase);

//invoice;
apirouter.get('/getallinvoices',authenticateJWT,getallinvoices);
apirouter.get('/getnewinvoice',authenticateJWT,getnewinvoice);
apirouter.post('/addnewinvoice',authenticateJWT,addnewinvoice);
apirouter.put('/updateinvoice',authenticateJWT,updateinvoice);
apirouter.get('/getinvoicebyid',authenticateJWT,getinvoicebyid);
apirouter.post('/printpdf',authenticateJWT,authenticateJWT,printpdf);
apirouter.post('/itemsqtyvalidation',authenticateJWT,itemsqtyvalidation);

//setting
apirouter.get('/getusersdt',authenticateJWT,getusersdt);
apirouter.get('/get_theme',authenticateJWT,get_theme);
apirouter.put('/updateuser',authenticateJWT,updateuser);
apirouter.put('/updatethemes',authenticateJWT,updatethemes);

//getlicensedt
apirouter.get('/getlicensedt',authenticateJWT,getlicensedt);
apirouter.post('/generatekey',authenticateJWT,GenerateKey);
apirouter.post('/activatekey',authenticateJWT,ActivateKey);
module.exports = apirouter;