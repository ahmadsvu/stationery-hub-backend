const { order } = require('../models/orderModel');
require('dotenv').config();
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const axios = require('axios'); 


exports.sendOrder = async (req, res) => {
  try {
    const { area, address, phone, name, products, subtotal, total } = req.body;

    const orderId = await order.saveOrder(area, address, phone, name, products, subtotal, total);

    await order.sendOrderToTelegram(orderId, area, address, phone, name, products, subtotal, total);

    res.status(200).json({ message: "✅ تم إرسال الطلب" });
  } catch (err) {
    console.error("❌ خطأ:", err.message);
    res.status(500).json({ error: "فشل في إرسال الطلب" });
  }
};

exports.getOrders =async(req,res)=>{
     try {
    const orders = await order.getAllOrders();
    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders    :", err);
    res.status(500).json({ error: "Error fetching orders     " });
  }
};
exports.getOrder =async(req,res)=>{
     try {
    const { id } = req.params;
    const orderDetiles = await order.getOrderById(id);
    res.status(200).json(orderDetiles);
  } catch (err) {
    console.error("Error fetching order   :", err);
    res.status(500).json({ error: "Error fetching order     " });
  }
};

exports.handleTelegramUpdate = async (req, res) => {
  const body = req.body;
  if (body.callback_query) {
    const { data, message, id } = body.callback_query;
    const chat_id = message.chat.id;

    const [, status, orderId] = data.split(':');
console.log("🔄 Changing order:", orderId, "to status:", status);

    try {
      // تحديث الطلب في قاعدة البيانات
      await order.updateOrderStatus(orderId, status);

      // تعديل الرسالة في Telegram
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/editMessageText`, {
        chat_id,
        message_id: message.message_id,
        text: message.text + `\n\n✅ *Status updated to:* ${status.toUpperCase()}`,
        parse_mode: "Markdown"
      });

      // الرد على الضغط
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/answerCallbackQuery`, {
        callback_query_id: id,
        text: `تم تحديث الحالة إلى ${status}`
      });

    } catch (error) {
      console.error("❌ Telegram callback error:", error.message);
    }
  }

  res.sendStatus(200);
};
