const { Invoices, InvoicesMaster } = require("../models/invoice.model.js")
const { Op, Sequelize } = require("sequelize");
const { Purchase } = require("../models/purchase.model.js");
const moment = require("moment-timezone");
const { Item } = require("../models/items.model.js");
const { User } = require("../models/users.model.js");

const getdashboard = async (req,res,next)=>{
    try{
        //console.log(req.user.data)

        var findkey = await User.findOne({where:{Email : req.user.data.Email},raw:true});
        var msg;
        var datstogo = moment(findkey.Expiry_Date).diff(moment(new Date()), 'days');
        console.log(req.user.data)
        if(findkey&&findkey.Product_Status == 'Active'){
            if(datstogo < 0){
                //console.log(datstogo < 0)
                var findkey = await User.update({Product_Status:'Expired'},{where:{Email : req.user.data.Email},raw:true});
                msg = {msg :'Product License Expired!!'}
            }
            else if(datstogo < 30){
                //console.log('hiiiiiiiiiii',datstogo<30)
                msg = {msg :'Product License Expired in '+ datstogo+' Days'}
            }
            
        }

        const db = req.user.data.db;
        const startOfMonth = new Date(moment().startOf('month').format('YYYY-MM-DD'));
        const endOfMonth   = new Date(moment().endOf('month').format('YYYY-MM-DD'));

        var stock = await Purchase.findAndCountAll({
            where : { Purchase_date : { [Op.between] : [startOfMonth,endOfMonth] } },
            attributes:[ [Sequelize.fn('SUM', Sequelize.col('Purchase_Price')),'Total_Purchese_Price'] ],
            raw: true
        });

        var salse = await Invoices.findAndCountAll({
            where : { Invoice_Date : { [Op.between] : [startOfMonth,endOfMonth] } },
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.col('Paid_Status')), 'Invoicecount'],
                [Sequelize.fn('SUM', Sequelize.literal('Paid_Status = "Paid"')), 'Paid_Status_Paid'],
                [Sequelize.fn('SUM', Sequelize.literal('Paid_Status = "Unpaid"')), 'Paid_Status_Unpaid'],
                [Sequelize.fn('SUM', Sequelize.literal('Paid_Status = "Cancelled"')), 'Paid_Status_Cancelled'],
                [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN Paid_Status IN ("Paid", "Unpaid") THEN Total_Amount ELSE 0 END')), 'Total_Amount'],
                [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN Paid_Status = "Paid" THEN Total_Amount ELSE 0 END')), 'Total_Amount_Paid'],
                [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN Paid_Status = "Unpaid" THEN Total_Amount ELSE 0 END')), 'Total_Amount_Unpaid'],
            ],
            raw: true
        });

        var dashboard_count = {...salse.rows[0],...stock.rows[0]};
        dashboard_count = msg?{...dashboard_count,...msg}:dashboard_count;
        console.log(dashboard_count)
        res.send(dashboard_count)
    }
    catch(err){
        console.log(err)
    }
}

const Purchase_Sales_Report = async (req,res,next) =>{
    try{
        const db = req.user.data.db;
        var startOfMonth, endOfMonth, purchase,sales;

        if(!req.body.selectedCharttype ||req.body.selectedCharttype == "Current Month"){
            startOfMonth = new Date(moment().startOf('month').format('YYYY-MM-DD'));
            endOfMonth = new Date(moment().endOf('month').format('YYYY-MM-DD'));
         }
        else if(req.body.selectedCharttype == "Current Week"){
            startOfMonth = new Date(moment().startOf('week').format('YYYY-MM-DD'));
            endOfMonth = new Date(moment().endOf('week').format('YYYY-MM-DD'));
        }
        else if(req.body.selectedCharttype == "Last Week"){
            startOfMonth = new Date(moment().startOf('week').subtract(7,'days').format('YYYY-MM-DD'));
            endOfMonth = new Date(moment().endOf('week').subtract(7,'days').format('YYYY-MM-DD'));
        }
        else if(req.body.selectedCharttype == "Last Month"){
            startOfMonth = new Date(moment().startOf('month').subtract(1,'month').format('YYYY-MM-DD'));
            endOfMonth = new Date(moment().endOf('month').subtract(1,'month').format('YYYY-MM-DD'));
        }
        else if(req.body.selectedCharttype == "Select Month"){
            startOfMonth = new Date(req.body.selecteMonth[0]);
            endOfMonth = new Date(req.body.selecteMonth[1]);
        }

        if(req.body.selectedCharttype&&req.body.selectedCharttype == "Select Month"){
            purchase = await Purchase.findAndCountAll({
                where: {
                  Purchase_date: { [Op.between]: [startOfMonth, endOfMonth] }
                },
                attributes: [
                  [Sequelize.literal('DATE_FORMAT(Purchase_date, "%Y-%m")'), 'date'],
                  [Sequelize.literal('SUM(Purchase_Price)'), 'purchase']
                ],
                group: [Sequelize.literal('DATE_FORMAT(Purchase_date, "%Y-%m")')],
                raw: true
            });

            sales = await Invoices.findAndCountAll({
                where : { Invoice_Date : { [Op.between] : [startOfMonth,endOfMonth] },Paid_Status : 'Paid' },
                attributes: [
                  [Sequelize.literal('DATE_FORMAT(Invoice_Date, "%Y-%m")'), 'date'],
                  [Sequelize.literal('SUM(Total_Amount)'), 'sales']
                ],
                group: [Sequelize.literal('DATE_FORMAT(Invoice_Date, "%Y-%m")')],
                raw: true
            });
    
        }
        else{
            purchase = await Purchase.findAndCountAll({
                where : { Purchase_date : { [Op.between] : [startOfMonth,endOfMonth] } },
                attributes: [
                    [Sequelize.literal('DATE(Purchase_date)'), 'date'],
                    [Sequelize.literal('SUM(Purchase_Price)'), 'purchase']
                ],
                group: [Sequelize.literal('DATE(Purchase_date)')],
                raw: true
            });
    
            sales = await Invoices.findAndCountAll({
                where : { Invoice_Date : { [Op.between] : [startOfMonth,endOfMonth] },Paid_Status : 'Paid' },
                attributes: [
                    [Sequelize.literal('DATE(Invoice_Date)'), 'date'],
                    [Sequelize.literal('SUM(Total_Amount)'), 'sales']
                ],
                group: [Sequelize.literal('DATE(Invoice_Date)')],
                raw: true
            });
        }

        // Create a map using the 'date' field as the key
        const resultMap = new Map();
        purchase.rows.forEach(item => {
        resultMap.set(item.date, { ...item, sales: 0 });
        });

        // Merge data from dataArray2 into resultMap
        sales.rows.forEach(item => {
        if (resultMap.has(item.date)) {
            const mergedItem = { ...resultMap.get(item.date), ...item };
            resultMap.set(item.date, mergedItem);
        } else {
            resultMap.set(item.date, item);
        }
        });

        // Convert resultMap back to an array
        const combinedArray = Array.from(resultMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));

        //console.log(combinedArray)
        res.send(combinedArray)
    }
    catch(err){
        console.log(err)
    }
}

const recentbestsales = async (req,res,next) =>{
    try{

        const db = req.user.data.db;
        var startdate = new Date(moment(new Date()).subtract(30,'day').format('YYYY-MM-DD'))
        var enddate = new Date()
        var resent = await InvoicesMaster.findAll({
            where : {createdAt:{[Op.between]: [startdate,enddate]}},
            attributes: [
                'Item_Name',
                [Sequelize.fn('SUM', Sequelize.col('Amount')), 'Price']
            ],
            group: ['Item_Name'],
            order: [[Sequelize.fn('COUNT', Sequelize.col('Item_Name')), 'DESC']],
            limit: 5,
            raw: true
        })
        //console.group(resent)
        res.send(resent)
    }
    catch(err){

    }
}

const getinvoices = async (req,res,next) =>{
    try{
        const db = req.user.data.db;
        const startOfMonth = new Date(moment().startOf('month').format('YYYY-MM-DD'));
        const endOfMonth   = new Date(moment().endOf('month').format('YYYY-MM-DD'));

        var resent = await Invoices.findAll({
            where : {Invoice_Date:{[Op.between]: [startOfMonth,endOfMonth]}},
            raw: true
        })
        res.send(resent)
    }
    catch(err){

    }
}

const notsoldproducts = async (req,res,next) =>{
    try{
        const db = req.user.data.db;
        const startOfMonth = new Date(moment().subtract(30,'days').format('YYYY-MM-DD'));
        const endOfMonth   = new Date(moment().format('YYYY-MM-DD'));

        var getids = await InvoicesMaster.findAll({
            where : {createdAt:{[Op.between]: [startOfMonth,endOfMonth]} },
            attributes:['Item_Code'],
            group:['Item_Code'],
            raw: true
        })

        var ids= getids.map(res=>res.Item_Code)
        var getproducts = await Item.findAll({
            where: {Item_Code:{[Op.notIn]: ids},Item_Stock : {[Op.ne]:0}},
            attributes:{
                include: ['Item_Code','Item_Name','Brand_Name','Item_Stock'],
                exclude:['HSN','Item_Category','Purchase_Price','Sale_Price','Tax_Rate','Tax_Status','Discount','Item_Status','Stock_added_date','createdAt','updatedAt']
            },
            raw:true
        })

        res.send(getproducts)
    }
    catch(err){
        console.log(err)
    }
}

const outofstock = async (req,res,next) =>{
    try{
        const db = req.user.data.db
        var getproducts = await Item.findAll({
            where: {Item_Stock : {[Op.lte]:10}},
            attributes:{
                include:[
                    'Item_Code',
                    'Item_Name',
                    'Brand_Name',
                    'Item_Stock',
                    [Sequelize.literal('CASE WHEN Item_Stock = 0 THEN "Out Of Stock" ELSE "Low Stock" END'), 'Stock_Status']
                ],
                //exclude:['HSN','Item_Category','Purchase_Price','Sale_Price','Tax_Rate','Tax_Status','Discount','Item_Status','Stock_added_date','createdAt','updatedAt']
            },
            raw:true
        })

        res.send(getproducts)
    }
    catch(err){
        console.log(err)
    }
}

const getinvoicebydb = async (req,res,next)=>{
    try{
        const db = req.user.data.db;
        const startOfMonth = new Date(moment().startOf('month').format('YYYY-MM-DD'));
        const endOfMonth   = new Date(moment().endOf('month').format('YYYY-MM-DD'));
        var query;
        
        query = req.body.data == 'all'? {Invoice_Date:{[Op.between]: [startOfMonth,endOfMonth]}}:query = {Invoice_Date:{[Op.between]: [startOfMonth,endOfMonth]}, Paid_Status :req.body.data}
        
        var resent = await Invoices.findAll({
            where : query,
            raw: true
        })
        res.send(resent)
    }
    catch(err){
        console.log(err)
    }
}

module.exports = {getdashboard, Purchase_Sales_Report, recentbestsales,getinvoices, notsoldproducts,outofstock, getinvoicebydb}