const { Op, where } = require('sequelize');
const moment = require('moment-timezone');
const { Invoices, InvoicesMaster } = require('../models/invoice.model.js');
const { invoiceslipdesign } = require("../services/invoice/invoice.service.js");
const {resetAutoIncrement} = require('./resetid.js');
const { Item } = require("../models/items.model.js");
const { User } = require('../models/users.model.js');

const getallinvoices = async (req, res, next) => {
  const { page, pageSize, search } = req.query; // Extract the page number and page size from the query parameters
  try {
    console.log(req.user.data)
    const db = req.user.data.db;
    const columns = Object.keys(Invoices.rawAttributes);
    const whereCondition = search ? {
      [Op.or]: columns
        .filter((column) => column !== 'id')
        .map((column) => ({
          [column]: {
            [Op.like]: `%${search}%`,
          },
        })),
    } : {};
    const response = await Invoices.findAndCountAll({
      where: whereCondition,
      limit: Number(pageSize), // Convert the page size to a number
      offset: (Number(page) - 1) * Number(pageSize), // Calculate the offset based on the page number and page size
    });
    if(req.user.data.Product_Status=='Expired'){
      res.status(200).send({ msg:'License Expired' });
    }
    else{
      res.status(200).send({ data: response.rows, totalRecords: response.count });
    }

  } catch (err) {
    console.log(err);
  }
}

const getnewinvoice=async(req,res,next)=>{
  try {
    const db = req.user.data.db;
    const latestInvoice = await Invoices.findOne({
      attributes: ['Invoice_ID'],
      order: [['Invoice_ID', 'DESC']],
    });

    res.status(200).send(latestInvoice);
  } catch (err) {
    console.log(err);
  }
};

const addnewinvoice = async (req, res, next) => {
  try {
  //update stack qty stats
    const db = req.user.data.db;
    var latestInvoice_Num = await Invoices.findOne({ attributes: ['Invoice_ID'], order: [['Invoice_ID', 'DESC']],raw:true  });

    var find_id = req.body.invoicemaster.map(res => res.Item_Code);
    var sub_qty = req.body.invoicemaster.map(res => {return {Item_Code:res.Item_Code, Item_Stock:res.Quantity}});
    var previous_stack = await Item.findAll({ where : { Item_Code: { [Op.or]: find_id } },attributes: ['Item_Code', 'Item_Stock'], raw : true });

    const subtractedResult = previous_stack.reduce((result, item1) => {
      const matchingItem2 = sub_qty.find(item2 => item2.Item_Code === item1.Item_Code);
      if (matchingItem2) {
        const subtractedStock = parseInt(item1.Item_Stock) - parseInt(matchingItem2.Item_Stock);
        result.push({ Item_Code: item1.Item_Code, Item_Stock: subtractedStock.toString() });
      }
      return result;
    }, []);

    subtractedResult.map(async (res) => {
      var update_stack = await Item.update(
        { Item_Stock: res.Item_Stock },
        { where: { Item_Code: res.Item_Code } }
      );
    })
    //update stack qty Ends

    var invoicedata = Object.assign(req.body.invoice,{Invoice_Date:moment(req.body.invoice.Invoice_Date).tz('Asia/Kolkata').format('YYYY-MM-DD'),Invoice_ID:latestInvoice_Num?((latestInvoice_Num.Invoice_ID*1)+1):1});
    //console.log(invoicedata)

    var invoicemasterdata = req.body.invoicemaster.map(res => ({...res,Invoice_ID:latestInvoice_Num?((latestInvoice_Num.Invoice_ID*1)+1):1}))
    //console.log(invoicemasterdata)

    var response=await Invoices.create(invoicedata);
    var response1 = await InvoicesMaster.bulkCreate(invoicemasterdata);

    const latestInvoice = await Invoices.findOne({ attributes: ['Invoice_ID'], order: [['Invoice_ID', 'DESC']], });

    // Sequelize query equivalent to MongoDB's findOne
    const response2 = await Invoices.findOne({ where: { Invoice_ID: latestInvoice['Invoice_ID'] }, attributes: { exclude: ["id"] },  raw: true,});

    // Sequelize query equivalent to MongoDB's find
    const response3 = await InvoicesMaster.findAll({ where: { Invoice_ID: latestInvoice['Invoice_ID'] }, attributes: { exclude: ["id"] }, raw: true, });

    const userdts = await User.findOne({where:{Email:req.user.data.Email},raw:true})
    var html=await invoiceslipdesign({...response2,...{items: response3},Organization : userdts});
    res.status(200).send({message:"invoice Sucessfully Saved",id:latestInvoice['Invoice_ID'],data:html});
  } catch (err) {
    console.log(err);
  }
};


//Update Invoice
const updateinvoice = async(req,res,next)=>{
  try {
    const db = req.user.data.db;

    var find_id = req.body.invoicemaster.map(res => res.Item_Code);
    var sub_qty = req.body.invoicemaster.map(res => {return {Item_Code:res.Item_Code, Item_Stock:res.Quantity}});
    var invoice = await Invoices.findOne({ where : { Invoice_ID: req.body.invoice.Invoice_ID }, raw : true })
    var perv_invoice = await InvoicesMaster.findAll({ where : { Invoice_ID: req.body.invoice.Invoice_ID },attributes: ['Item_Code', 'Quantity','id'], raw : true });
    var previous_stack = await Item.findAll({ where : { Item_Code: { [Op.or]: find_id } },attributes: ['Item_Code', 'Item_Stock'], raw : true });

    if(req.body.invoice['Paid_Status'] != 'Cancelled'){
      const greaterThan = [];
      const lessThan = [];
      
      sub_qty.map(item1 => {
        const matchingItem2 = perv_invoice.find(item2 => item2.Item_Code === item1.Item_Code);
        const notmatchingItem2 = perv_invoice.find(item2 => item2.Item_Code != item1.Item_Code);

        if (matchingItem2) {
          const diff = parseInt(matchingItem2.Quantity) - parseInt(item1.Item_Stock);
          const modifiedItem = { ...item1, differ: Math.abs(diff).toString() };
          if (diff > 0 ) {
            lessThan.push(modifiedItem);
          } else if(diff != 0) {
            greaterThan.push(modifiedItem);
          }
        }
                
      });

      const notInArray2 = perv_invoice.filter((obj1) => !sub_qty.find((obj2) => obj2.Item_Code === obj1.Item_Code));
      if(notInArray2.length !=0){
        var mapid=notInArray2.map(d=>d.id);
        var deleteid=await InvoicesMaster.destroy({where: { id: { [Op.in]: mapid } }});
      }

      if(greaterThan.length != 0){
        const subtractedResult = previous_stack.reduce((result, item1) => {
          const matchingItem2 = greaterThan.find(item2 => item2.Item_Code === item1.Item_Code);
          if (matchingItem2) {
            const subtractedStock = parseInt(item1.Item_Stock) - parseInt(matchingItem2.differ);
            result.push({ Item_Code: item1.Item_Code, Item_Stock: subtractedStock.toString() });
          }
          return result;
        }, []);

        subtractedResult.map(async (res) => { var update_stack = await Item.update( { Item_Stock: res.Item_Stock }, { where: { Item_Code: res.Item_Code } } ) });
      }
  
      if(lessThan.length != 0){
        const subtractedResult = previous_stack.reduce((result, item1) => {
          const matchingItem2 = lessThan.find(item2 => item2.Item_Code === item1.Item_Code);
          if (matchingItem2) {
            const subtractedStock = parseInt(item1.Item_Stock) + parseInt(matchingItem2.differ);
            result.push({ Item_Code: item1.Item_Code, Item_Stock: subtractedStock.toString() });
          }
          return result;
        }, []);

        subtractedResult.map(async (res) => { var update_stack = await Item.update( { Item_Stock: res.Item_Stock }, { where: { Item_Code: res.Item_Code } } ) })
      }
    }
    else if(invoice['Paid_Status'] !='Cancelled' && req.body.invoice['Paid_Status'] == 'Cancelled'){
      const subtractedResult = previous_stack.reduce((result, item1) => {
        const matchingItem2 = (req.body.invoicemaster).find(item2 => item2.Item_Code === item1.Item_Code);
        if (matchingItem2) {
          const subtractedStock = parseInt(item1.Item_Stock) + parseInt(matchingItem2.Quantity);
          result.push({ Item_Code: item1.Item_Code, Item_Stock: subtractedStock.toString() });
        }
        return result;
      }, []);

      subtractedResult.map(async (res) => { var update_stack = await Item.update( { Item_Stock: res.Item_Stock }, { where: { Item_Code: res.Item_Code } } ) })
    }

    // update stack End
    await resetAutoIncrement('InvoicesMasters');
    const updatedInvoice = await Invoices.update({
        Invoice_Date: moment(req.body.invoice.Invoice_Date).tz('Asia/Kolkata').format('YYYY-MM-DD'),
        ...req.body.invoice
      },
      {where: { id: req.body.invoice.id },
      
    });
    var mapid=req.body.invoicemaster.map(d=>d.id);

    var deleteid=await InvoicesMaster.destroy({where: { id: { [Op.in]: mapid } }});
    if(deleteid["deletedCount"]!=0){
      var response1 = await InvoicesMaster.bulkCreate(req.body.invoicemaster);

      // Sequelize query equivalent to MongoDB's findOne
      const response = await Invoices.findOne({
        where: { Invoice_ID: req.body.invoice.id },
        attributes: { exclude: ["id"] },
        raw: true,
      });

      // Sequelize query equivalent to MongoDB's find
      const response2 = await InvoicesMaster.findAll({
        where: { Invoice_ID: req.body.invoice.id },
        attributes: { exclude: ["id"] },
        raw: true,
      });

      const userdts = await User.findOne({where:{Email:req.user.data.Email},raw:true})
      var html=await invoiceslipdesign({...response,...{items: response2},Organization : userdts});
    
      res.status(200).send({message:"invoice Sucessfully Updated",data:html});
    }
    else{
      res.status(200).send({message:"Error"});
    }
  } catch (err) {
    console.log(err);
  }
}

const getinvoicebyid=async(req,res,next)=>{
   try{
    const db = req.user.data.db;
      const invoiceId = req.query.invoiceid;
      const response = await Invoices.findOne({
        where: {
          Invoice_ID: invoiceId,
        },
      });

      const response1 = await InvoicesMaster.findAll({
        where: {
          Invoice_ID: invoiceId,
        },
      });
    res.status(200).send({invoice:response,invoicemaster:response1});
   }
   catch(err){
      console.log(err);
   }
}
const printpdf = async(req,res,next)=>{
  try{
    const db = req.user.data.db;
    // Sequelize query equivalent to MongoDB's findOne
    const response = await Invoices.findOne({
      where: { Invoice_ID: req.body.id },
      attributes: { exclude: ["id"] },
      raw: true,
    });

    // Sequelize query equivalent to MongoDB's find
    const response1 = await InvoicesMaster.findAll({
      where: { Invoice_ID: req.body.id },
      attributes: { exclude: ["id"] },
      raw: true,
    });

    const userdts = await User.findOne({where:{Email:req.user.data.Email},raw:true})
    var html = await invoiceslipdesign({...response,...{items: response1},Organization : userdts});
    res.send(html);
   }
   catch(err){
      console.log(err);
   }
}

const itemsqtyvalidation  = async(req,res,next)=>{
  try{
    const db = req.user.data.db;
    var stackqty = await Item.findOne({where:{Item_Code:req.body.Item_Code},raw: true, attributes:['Item_Stock']});
    var invoiceqty = await InvoicesMaster.findOne({where:req.body,raw: true, attributes:['Quantity']})
    var qty = stackqty.Item_Stock + (invoiceqty? invoiceqty.Quantity:0)
    res.send({qty:qty})
    
  }
  catch(err){
     console.log(err);
  }
}

module.exports = {getallinvoices,getnewinvoice,addnewinvoice,updateinvoice,getinvoicebyid,printpdf, itemsqtyvalidation}