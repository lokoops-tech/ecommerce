// analyticsRouter.js
const express = require('express');
const router = express.Router();
const Users = require('../Models/User'); 
const Order = require('../Models/Order'); 
const Newsletter = require('../Models/Newsletter'); 
const Product = require('../Models/Product'); 

// Analytics route
router.get('/adminAnalytics', async (_req, res) => {
  try {
    const users = await Users.countDocuments();
    const orders = await Order.countDocuments();
    const emails = await Newsletter.countDocuments();
    const products = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ status: 'delivered' });

    // Sample time series data (replace with actual data)
    const timeSeriesData = [
      { name: 'Jan', orders: 400, users: 240 },
      { name: 'Feb', orders: 500, users: 320 },
      { name: 'Mar', orders: 600, users: 380 },
      { name: 'Apr', orders: 780, users: 420 },
      { name: 'May', orders: 850, users: 450 },
      { name: 'Jun', orders: 900, users: 520 },
    ];

    res.json({
      users,
      orders,
      emails,
      products,
      totalOrders,
      completedOrders,
      timeSeriesData,
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch analytics data' });
  }
});

module.exports = router;