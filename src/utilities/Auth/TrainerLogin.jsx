"use client"
import Image from "next/image"
import Link from "next/link"
import { Toaster, toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import ProfileSpinner from "../Spinner/ProfielSpinner"
import { useState } from "react"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import axios from "axios"
  
export function TrainerLogin() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        if(e.target.name === "email"){
            setEmail(e.target.value);
        }
        else if(e.target.name === "otp"){
            setOtp(e.target.value); 
        }
    }

    const handleOtpSend = async(e) => {
        e.preventDefault();
        if(email === ""){
            toast.error("Please enter your email");
            return;
        }
        try {
            setLoading(true);
            let data = await axios.post("/api/trainerauth", {
                email: email.toLowerCase(),
                type: "send"
            });
            setLoading(false);
            if(data.data.success){
                setIsOtpSent(true);
                toast.success(data.data.message);
            } else {
                toast.error(data.data.message);
            }
        } catch(err) {
            toast.error("Something went wrong try again after some time!" + err);
            setLoading(false);
        }
    }

    const handleVerifyOtp = async() => { 
        if(otp === ""){
            toast.error("Please enter otp");
            return;
        }
        try {
            setLoading(true);
            let data = await axios.post("/api/trainerauth", {
                email: email.toLowerCase(),
                type: "verify",
                otp: otp
            });
            setLoading(false);
            if(data.data.success){
                toast.success(data.data.message);
                localStorage.setItem("dilmsadmintoken", data.data.token);
                router.push("/trainer");
            } else {
                toast.error(data.data.message);
            }
        } catch(err) {
            toast.error("Something went wrong try again after some time!" + err);
            setLoading(false);
        }
    }

    return (
        <div className="">
            <Toaster position="top-center" expand={false}/>
            {loading ? <div className="absolute flex justify-center items-center h-full w-full"><ProfileSpinner/></div> : ""}
            <div className={`w-full lg:grid lg:grid-cols-2 ${loading ? "opacity-30" : ""}`}>
                <div className="flex items-center justify-center py-12">
                    <div className="mx-auto grid w-[350px] gap-6">
                        <div className="grid gap-2 text-center">
                            <div className="flex justify-center items-center my-4">
                                <img
                                    src="/9.png" 
                                    alt="My Image"
                                    className="lg:h-48 lg:w-48 lg:absolute w-48 h-16"
                                />
                            </div>
                            <h1 className="text-3xl font-bold mt-16">Trainer Login to Infotact-Learning</h1>
                            <p className="text-balance text-muted-foreground">
                                Enter your email to login to your admin account.
                            </p>
                        </div>
                        <div className="grid gap-4">
                            {!isOtpSent && <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="m@example.com"
                                    onChange={handleChange}
                                    value={email}
                                    required
                                />
                            </div>}
                            {isOtpSent && <div className="grid gap-2 flex justify-center">
                                <Label htmlFor="email">Otp (One Time Password)</Label>
                                <InputOTP maxLength={6} onChange={(value) => {setOtp(value)}}>
                                    <InputOTPGroup className="text-4xl">
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator/>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>}
                            
                            {!isOtpSent && <Button type="submit" className="w-full" variant="" onClick={handleOtpSend}>
                                {loading ? "Sending..." : "Send OTP"}
                            </Button>}
                            {isOtpSent && <Button type="submit" className="w-full" variant="" onClick={handleVerifyOtp}>
                                {loading ? "Verifying..." : "Login"}
                            </Button>}
                        </div>
                    </div>
                </div>
                <div className="hidden bg-muted lg:block">
                    <Image
                        src="/lms.png"
                        alt="Image"
                        width="1920"
                        height="1080"
                        className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                    />
                </div>
            </div>
        </div>
    )
}