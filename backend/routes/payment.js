import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import 'dotenv/config';

const router = express.Router();

const razorpayInstance = new Razorpay({
    key_id: "rzp_test_F2JLfZCsE7MDUw",
    key_secret: "MW2RrLGry8juV1MH0JSnbzOH"
});

router.get('/get-payment', (req, res) => {
    res.json("Payment Details");
})

router.post('/order', (req, res) => {
    const { amount } = req.body;
    try {
        const options = {
            amount: Number(amount * 100),
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        }

        razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Something Went Wrong!" });
            }
            res.status(200).json({ data: order });
            console.log(order)
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }
})

router.post('/verify', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    console.log(req);
    try {
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        console.log("sign " + sign);
        
        const expectedSign = crypto.createHmac("sha256", "MW2RrLGry8juV1MH0JSnbzOH")
            .update(sign.toString())
            .digest("hex");
        console.log("expected sign " + expectedSign);
        const isAuthentic = expectedSign === razorpay_signature;
        console.log("razorpay_signature " + razorpay_signature);
        if (isAuthentic) {
            // const payment = new Payment({
            //     razorpay_order_id,
            //     razorpay_payment_id,
            //     razorpay_signature
            // });

            // await payment.save();

            res.json({
                message: "Payment Successfull"
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }
})

export default router