import { NextResponse } from "next/server";
import { headers } from "next/headers";
import AuthorizeMd from "../../../../../middleware/AuthorizeMd";
import Razorpay from "razorpay";

export const POST = async(req, request) => {
    try {
        const headerlist = await headers();
        const data = await req.json();
        console.log("data in payment route", data);
        let rand = Math.floor(Math.random() * 10000000);
        
        const auth = AuthorizeMd(headerlist.get("token"));
        if (!auth.status) {
            return NextResponse.json({
                message: "Unauthorized request does not allow to the system",
                status: 401,
                success: false
            });
        }
        
        const instance = new Razorpay({ 
            key_id: `${process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}`, 
            key_secret: `${process.env.RAZORPAY_KEY_SECRET}` 
        });
        
        const options = {
            amount: (Math.floor(data.price)) * 100,  // amount in the smallest currency unit
            currency: "INR",
            receipt: `${rand}`
        };
        
        // Convert the callback-based function to a Promise
        const order = await new Promise((resolve, reject) => {
            instance.orders.create(options, (err, order) => {
                if (err) {
                    console.log("Razorpay error:", err);
                    reject(err);
                } else {
                    console.log("order is", order);
                    resolve(order);
                }
            });
        });
        
        return NextResponse.json({
            message: "Order Created Successfully",
            status: 200,
            success: true,
            order: order
        });
    } catch (e) {
        console.log("error in payment route", e);
        return NextResponse.json({
            message: "Internal Server Error",
            status: 500,
            success: false
        });
    }
}