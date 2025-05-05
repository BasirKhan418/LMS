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
  
export function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleChange = (e) => {
    if(e.target.name === "email") {
      setEmail(e.target.value);
    }
  }
  
  const handleOtpSend = async(e) => {
    e.preventDefault();
    if(email === "") {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      let data = await axios.post("/api/auth", {email: email.toLowerCase(), type: "send"});
      setLoading(false);
      if(data.data.success) {
        setIsOtpSent(true);
        toast.success(data.data.message);
      } else {
        toast.error(data.data.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error("An error occurred. Please try again.");
      
    }
  }
  
  const handleVerifyOtp = async() => { 
    if(otp === "") {
      toast.error("Please enter OTP");
      return;
    }
    setLoading(true);
    try {
      let data = await axios.post("/api/auth", {email: email.toLowerCase(), type: "verify", otp: otp})
      setLoading(false);
      if(data.data.success) {
        toast.success(data.data.message);
        localStorage.setItem("dilmstoken", data.data.token);
        router.push("/");
      } else {
        toast.error(data.data.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error("An error occurred. Please try again.");
      
    }
  }

  return (
    <>
      <Toaster position="top-center" expand={false} />
      
      <div className="min-h-screen relative flex flex-col lg:flex-row w-full">
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white/70 dark:bg-black/70 z-50">
            <ProfielSpinner />
          </div>
        )}
        
        {/* Login Form Section */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="w-full max-w-md mx-auto">
            {/* Logo Container - Improved responsiveness */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="relative w-48 h-16 xs:w-56 xs:h-20 sm:w-64 sm:h-24">
                <Image
                  src="/9.png" 
                  alt="Logo"
                  layout="fill"
                  objectFit="contain"
                  priority
                />
              </div>
            </div>
            
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Login to Infotact Learning</h1>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-2">
                Enter your email to login to your account
              </p>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              {!isOtpSent ? (
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    onChange={handleChange}
                    value={email}
                    className="w-full"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <Label htmlFor="otp" className="text-sm font-medium block text-center">
                    Enter OTP (One Time Password)
                  </Label>
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} onChange={(value) => setOtp(value)}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
              )}
              
              <div className="pt-2">
                {!isOtpSent ? (
                  <Button 
                    type="submit" 
                    className="w-full h-10 text-white bg-green-600 hover:bg-green-700" 
                    onClick={handleOtpSend}
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    className="w-full h-10 text-white bg-green-600 hover:bg-green-700" 
                    onClick={handleVerifyOtp}
                  >
                    {loading ? "Verifying..." : "Login"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Image Section */}
        <div className="hidden lg:block lg:flex-1">
          <div className="h-full w-full relative">
            <Image
              src="/infotactlearning.gif"
              alt="Login Image"
              fill
              className="object-cover dark:brightness-75"
              priority
            />
          </div>
        </div>
      </div>
    </>
  )
}