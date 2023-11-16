const Order = require('../models/order');
const Product = require('../models/products');

const ErrorHandler = require('../utils/errorHandler');

//create a new order   => /api/v1/order/new

exports.newOrder = async(req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;


    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(200).json({
        success: true,
        order
    })
}



//get single order  => /api/v1/order/:id

exports.getSingleOrder = async(req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if(!order){
        return res.status(404).json({
            message: "No order found with this ID"
        })
    }

    res.status(200).json({
        success:true,
        order
    })
} 


//get logged in user all orders  => /api/v1/orders/me

exports.myOrders = async(req, res, next) => {
    const orders = await Order.find({user: req.user.id});

    if(!orders){
        return res.status(404).json({
            message: "No order found with this ID"
        })
    }

    res.status(200).json({
        success:true,
        orders
    })
} 




//**************admin routes  ******************//

//get all orders  => /api/v1/admin/orders

exports.allOrders = async(req, res, next) => {
    const orders = await Order.find();

    if(!orders){
        return res.status(404).json({
            message: "No order found"
        })
    }

    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice 
    })

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
} 

 
//update / process orders  => /api/v1/admin/order/:id

exports.updateOrder = async(req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(!order){
        return res.status(404).json({
            message: "No order found"
        })
    } 

    if(order.orderStatus === 'Delivered'){
        return res.status(400).json({
            message: "The order has already been delivered"
        })
    }

    order.orderItems.forEach(async item => {
        await updateStock(item.product, item.quantity, req.user._id);
    })
    
    order.orderStatus = req.body.status,
    order.deliveredAt = Date.now()
    
    await order.save()


    res.status(200).json({
        success:true
    })
} 

async function updateStock(id, quantity, userId) {
    const product = await Product.findById(id);
    product.stock = product.stock - quantity;
    product.user = userId; // Set the user field

    await product.save({ validationBeforeSave: false });
}




//delete order  => /api/v1/order/:id

exports.deleteOrder = async(req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if(!order){
        return res.status(404).json({
            message: "No order found with this ID"
        })
    }

    await order.deleteOne();

    res.status(200).json({
        success:true
    })
} 
