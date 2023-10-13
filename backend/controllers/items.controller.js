const { Op, Sequelize, where } = require('sequelize');
const { Item } = require("../models/items.model.js");
const { Purchase } = require('../models/purchase.model.js')
const moment = require('moment-timezone');

const searchitems= async (req, res, next) => {
  try {
    const db = req.user.data.db;
    const { data, field } = req.body;
    const response = await Item.findAll({
      where: {
        [field]: {
          [Op.like]: `%${data}%`,
        },
        Item_Status: 'Active',
      },
      attributes: {
        exclude: ['id', '__v', 'createdAt', 'updatedAt', 'Item_Status', 'Purchase_Price'],
      },
    });

    res.status(200).send(response);
  } catch (err) {
    console.log(err);
  }
};

const getitems = async (req, res, next) => {
  const db = req.user.data.db;
  const { page, pageSize,search} = req.query; // Extract the page number and page size from the query parameters

   try {
    //console.log(Item(db))
    const columns = Object.keys(Item.rawAttributes);

    const whereCondition = search
    ? {
        [Op.or]: columns
          .filter((column) => column !== 'id')
          .map((column) => ({
            [column]: {
              [Op.like]: `%${search}%`,
            },
          })),
      }
    : {};

    const response = await Item.findAndCountAll({
      where: whereCondition,
      limit: Number(pageSize), // Convert the page size to a number
      offset: (Number(page) - 1) * Number(pageSize), // Calculate the offset based on the page number and page size
    });
    if(req.user.data.Product_Status=='Expired'){
      res.status(200).send({ msg:'License Expired' });
    }
    else{
      res.status(200).send({data:response.rows,totalRecords:response.count});
    }
  } catch (err) {
    console.log(err);
  }
};

const saveitems = async (req, res, next) => {
  try {
    const db = req.user.data.db;
    const findid = await Item.findOne({ where:{Item_Code:req.body.Item_Code},raw : true})
    if(!findid){
      const newItem = await Item.create(req.body);
      res.status(200).send(newItem);
    }
    else{
      res.status(200).send({msg:'Item Code already exist'});
    }
    
  } catch (err) {
    console.log(err);
  }
};

const importitems = async (req, res, next) => {
  try {
    const db = req.user.data.db;
    const newItem = await Item.bulkCreate(req.body);
    res.status(200).send(newItem);
  }
  catch (err) {
    console.log(err);
  }
};

const updateitems = async (req, res, next) => {
  try {
    const { id, data } = req.body;
    const db = req.user.data.db;
    //console.log(data)
    const updatedItems = await Item.update(data, { where: { id } });
    var response = await Item.findOne({where:{id}});
   // console.log(response)
    res.status(200).send(response);
   
  } catch (err) {
    console.log(err);
  }
};

const deleteitems = async (req, res, next) => {
  try {
    const db = req.user.data.db;
    const { id } = req.body;
    await Item.destroy({ where: { id } });
    res.status(200).send({ id });
  } catch (err) {
    console.log(err);
  }
};

const getpurchase = async (req, res, next) => {
  try {
    const { page, pageSize, search} = req.query; // Extract the page number and page size from the query parameters
    const db = req.user.data.db;

    const columns = Object.keys(Item.rawAttributes);
    const whereCondition = search
    ? {
        [Op.or]: columns
          .filter((column) => column !== 'id')
          .map((column) => ({
            [column]: {
              [Op.like]: `%${search}%`,
            },
          })),
      }
    : {};

    const response = await Purchase.findAndCountAll({
      where: whereCondition,
      limit: Number(pageSize), // Convert the page size to a number
      offset: (Number(page) - 1) * Number(pageSize), // Calculate the offset based on the page number and page size
    });
    if(req.user.data.Product_Status=='Expired'){
      res.status(200).send({ msg:'License Expired' });
    }
    else{
      res.status(200).send({data:response.rows,totalRecords:response.count});
    }
  } catch (err) {
    console.log(err);
  }
};


const savepurchase = async (req, res, next) => {
  try {
    // update stock count

    const db = req.user.data.db;
    var prve_stock = await Item.findOne({where: {Item_Code:req.body.Item_Code,Item_Name:req.body.Item_Name},raw:true});
    //console.log(prve_stock)
    const subtractedStock = parseInt(prve_stock.Item_Stock) + parseInt(req.body.Purchase_qty);
    const subtractedResult = { Item_Code: prve_stock.Item_Code, Item_Stock: subtractedStock.toString() };
    var update_stack = await Item.update( { Item_Stock: subtractedResult.Item_Stock }, { where: { Item_Code: subtractedResult.Item_Code },raw:true } )
    //console.log(update_stack)

    var savedata = {...req.body,Purchase_date: new Date(moment(req.body.Purchase_date).format('YYYY-MM-DD'))};
    //console.log(savedata)
    var saveres = await Purchase.create(savedata);
    //console.log(saveres)
    res.status(200).send(saveres);
  } catch (err) {
    console.log(err);
  }
};

const deletepurchase = async (req, res, next) => {
  try {
    const db = req.user.data.db;
    const { id } = req.body;
    await Purchase.destroy({ where: { id:id } });
    res.status(200).send({ id });
  } catch (err) {
    console.log(err);
  }
};

const getfilteritems = async (req, res, next) => {
  try {
    const db = req.user.data.db;
    var data = await Item.findAll({raw:true,attributes: [ [Sequelize.fn('DISTINCT', Sequelize.col(req.body.field)) ,req.body.field]]})
    res.status(200).send(data);
  } catch (err) {
    console.log(err);
  }
};

const downloadxls = async (req, res, next) => {
  try {
    //console.log(req.body)
    var data;
    const db = req.user.data.db;
    if(req.body.field == 'items'){
      data = await Item.findAll({raw:true,attributes: {exclude :['id','Stock_added_date','createdAt','updatedAt']}});
    }
    else{
      data = await Purchase.findAll({raw:true,attributes: {exclude :['id','createdAt','updatedAt']}});
    }

    //console.log(data)
    res.status(200).send(data);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {searchitems,getitems,saveitems,importitems,updateitems,deleteitems,getpurchase,savepurchase, deletepurchase, getfilteritems, downloadxls}