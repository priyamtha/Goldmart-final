import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Memory store for orders when MongoDB is offline
const memoryOrders = [];

// @desc    Create new order
// @route   POST /api/orders
router.post('/', protect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      totalPrice,
      goldRateApplied
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ message: 'Shipping address is incomplete' });
    }

    const orderData = {
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'UPI',
      goldRateApplied: goldRateApplied || 7200,
      itemsPrice: Number(itemsPrice),
      taxPrice: Number(taxPrice),
      totalPrice: Number(totalPrice),
      isPaid: paymentMethod !== 'Cash on Delivery',
      paidAt: paymentMethod !== 'Cash on Delivery' ? new Date() : null,
      orderStatus: 'Processing'
    };

    if (mongoose.connection.readyState === 1) {
      const createdOrder = await Order.create(orderData);
      return res.status(201).json(createdOrder);
    } else {
      const mockOrder = {
        _id: `ord_${Date.now()}`,
        ...orderData,
        createdAt: new Date().toISOString()
      };
      memoryOrders.unshift(mockOrder);
      return res.status(201).json(mockOrder);
    }
  } catch (error) {
    console.error('[OrderRoute] Create order error:', error);
    res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
router.get('/myorders', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
      return res.json(orders);
    } else {
      const userOrders = memoryOrders.filter((o) => o.user.toString() === req.user._id.toString());
      return res.json(userOrders);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user orders' });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const order = await Order.findById(req.params.id).populate('user', 'name email');
      if (order) return res.json(order);
      return res.status(404).json({ message: 'Order not found' });
    } else {
      const order = memoryOrders.find((o) => o._id.toString() === req.params.id);
      if (order) return res.json(order);
      return res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving order' });
  }
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
      return res.json(orders);
    } else {
      return res.json(memoryOrders);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all orders' });
  }
});

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { orderStatus, isDelivered } = req.body;

    if (mongoose.connection.readyState === 1) {
      const order = await Order.findById(req.params.id);
      if (order) {
        if (orderStatus) order.orderStatus = orderStatus;
        if (isDelivered !== undefined) {
          order.isDelivered = isDelivered;
          if (isDelivered) order.deliveredAt = Date.now();
        }
        const updated = await order.save();
        return res.json(updated);
      }
      return res.status(404).json({ message: 'Order not found' });
    } else {
      const index = memoryOrders.findIndex((o) => o._id.toString() === req.params.id);
      if (index !== -1) {
        if (orderStatus) memoryOrders[index].orderStatus = orderStatus;
        if (isDelivered) {
          memoryOrders[index].isDelivered = true;
          memoryOrders[index].deliveredAt = new Date().toISOString();
        }
        return res.json(memoryOrders[index]);
      }
      return res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status' });
  }
});

export default router;
