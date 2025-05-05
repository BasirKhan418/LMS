"use client"
import Image from "next/image"
import Link from "next/link"
import { Toaster, toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import ProfielSpinner from "../Spinner/ProfielSpinner"
import { useState } from "react"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import axios from "axios"
  
export function AdminLogin() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpsent, setIsOtpsent] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        if(e.target.name === "email") {
            setEmail(e.target.value);
        }
        else if(e.target.name === "otp") {
            setOtp(e.target.value); 
        }
    }

    const handleOtpSend = async(e) => {
        e.preventDefault();
        if(email === "") {
            toast.error("Please enter your email");
            return;
        }
        try {
            setLoading(true);
            let data = await axios.post("/api/adminauth", {email: email.toLowerCase(), type: "send"})
            setLoading(false);
            if(data.data.success) {
                setIsOtpsent(true);
                toast.success(data.data.message);
            } else {
                toast.error(data.data.message);
            }
        } catch(err) {
            toast.error("Something went wrong try again after some time!" + err);
            setLoading(false);
        }
    }

    const hanldeVerifyOtp = async() => { 
        if(otp === "") {
            toast.error("Please enter otp");
            return;
        }
        setLoading(true);
        try {
            let data = await axios.post("/api/adminauth", {email: email.toLowerCase(), type: "verify", otp: otp});
            setLoading(false);
            if(data.data.success) {
                setIsOtpsent(true);
                toast.success(data.data.message);
                localStorage.setItem("dilmsadmintoken", data.data.token);
                router.push("/admin");
            } else {
                toast.error(data.data.message);
            }
        } catch(err) {
            setLoading(false);
            toast.error("Something went wrong. Please try again.");
        }
    }

    return (
        <div className="min-h-screen">
            <Toaster position="top-center" expand={false}/>
            
            {loading && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-white/70 dark:bg-black/70">
                    <ProfielSpinner/>
                </div>
            )}
            
            <div className={`w-full min-h-screen lg:grid lg:grid-cols-2 ${loading ? "opacity-30" : ""}`}>
                <div className="flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
                    <div className="w-full max-w-md mx-auto grid gap-4 sm:gap-6">
                        <div className="grid gap-2 text-center">
                            {/* Logo Container - Improved responsiveness */}
                            <div className="flex justify-center my-2 sm:my-4">
                                <div className="relative w-40 h-14 xs:w-44 xs:h-16 sm:w-48 sm:h-20">
                                    <Image
                                        src="/9.png"
                                        alt="Logo"
                                        layout="fill"
                                        objectFit="contain"
                                        priority
                                    />
                                </div>
                            </div>
                            
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mt-4 sm:mt-6 md:mt-8">
                                Admin Login to Infotact-Learning
                            </h1>
                            <p className="text-xs sm:text-sm text-balance text-muted-foreground">
                                Enter your email to login to your admin account.
                            </p>
                        </div>
                        
                        <div className="grid gap-4">
                            {!isOtpsent && (
                                <div className="grid gap-2">
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
                                </div>
                            )}
                            
                            {isOtpsent && (
                                <div className="grid gap-3">
                                    <Label htmlFor="otp" className="text-center">
                                        OTP (One Time Password)
                                    </Label>
                                    <div className="flex justify-center">
                                        <InputOTP maxLength={6} onChange={(value) => {setOtp(value)}}>
                                            <InputOTPGroup className="text-2xl sm:text-3xl md:text-4xl">
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator/>
                                            <InputOTPGroup className="text-2xl sm:text-3xl md:text-4xl">
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                </div>
                            )}
                            
                            <div className="pt-2">
                                {!isOtpsent && (
                                    <Button 
                                        type="submit" 
                                        className="w-full" 
                                        onClick={handleOtpSend}
                                    >
                                        {loading ? "Sending..." : "Send OTP"}
                                    </Button>
                                )}
                                
                                {isOtpsent && (
                                    <Button 
                                        type="submit" 
                                        className="w-full" 
                                        onClick={hanldeVerifyOtp}
                                    >
                                        {loading ? "Verifying..." : "Login"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="hidden bg-muted lg:block">
                    <div className="relative h-full w-full">
                        <Image
                            src="/infotactlearning.gif"
                            alt="Image"
                            fill
                            className="object-cover dark:brightness-[0.2] dark:grayscale"
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}