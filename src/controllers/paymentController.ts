import { Request, Response, NextFunction } from "express";
import Razorpay from "razorpay";
import crypto from "crypto"


export const payment: any = async (req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        const instant = new Razorpay({
            key_id: "rzp_test_bQ0uziKKUphI6R",
            key_secret: "MWSRrp0RPg7dtfuha1RsbXKS",
        })
        const option = {
            amount: req.body.price * 100,
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        }
        instant.orders.create(option, (error, order) => {
            if (error) {
                return res.json({ message: "something wrong" })
            }
            res.json({ data: order });
        })

    } catch (error) {
        console.log('error', error)
    }
}

export const verify: any = async (req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", "MWSRrp0RPg7dtfuha1RsbXKS")
            .update(sign.toString())
            .digest("hex"); 
        if (razorpay_signature === expectedSign) {
            return res.json({ message: "payment verify successfully", paymentid: razorpay_payment_id })
        } else {
            return res.json({ message: "Invelid payment" })
        }

    } catch (err) {
        next(err)
    }
}