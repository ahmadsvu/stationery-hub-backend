const axios = require('axios');
const mongoose = require('mongoose');
const {Order } = require('../db');
require('dotenv').config();
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;  
const order={
    saveOrder:async(area,address,phone,name,products,subtotal,total)=>{
     const newOrder = await Order.create({
      area,
      address,
      phone,
      name,
      products,
      subtotal,
      total
    });
     const savedOrder = await newOrder.save();
    return savedOrder._id.toString();
    },
sendOrderToTelegram: async (orderId, area, address, phone, name, products, subtotal, total) => {
  
  const message = `
🛒 *New Order*:${orderId}

👤 *Name:* ${name}
📞 *Phone:* ${phone}
.......................................
📍 *City:* ${area}
📍 *Address:* ${address}
.......................................
📦 *Products:*
${products.map(p => `- *${p.quantity}* x ${p.name}`).join('\n')}
---------------------------------------
💰 Subtotal: ${subtotal}$
💰 *TOTAL: ${total}$*
---------------------------------------

🕒 *Time:* ${new Date().toLocaleString()}
`;

  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '✅ Delivered',
              callback_data: `update_status:Delivered:${orderId}`
            }
          ],
          [
            {
              text: '❌ Cancel order',
              callback_data: `update_status:cancelled:${orderId}`
            }
          ]
        ]
      }
    });
    console.log("✅ order sent to Telegram");
  } catch (err) {
    console.error("❌ error sending order to Telegram:", err.message);
  }
},

    getAllOrders:async()=>{
          try{
            const orders=Order.find({}).sort({ createdAt: -1 });
            return orders;

        }
        catch (err){
          console.error(" Error fetching orders :", err);
          throw err;
        }
    },
  getOrderById: async (order_id) => {
  try {
    const order = await Order.findById(order_id);
    
    return order;
  } catch (error) {
    console.error(error);
    throw error;
  }
},
 updateOrderStatus: async (orderId, status) => {
  const objectId = new mongoose.Types.ObjectId(orderId);
  await Order.findByIdAndUpdate(objectId, { status: status });
  console.log(`✅ Order ${orderId} updated to ${status}`);
}
}

module.exports = { order };

