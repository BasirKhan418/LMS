"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import ProfilePageSkeleton from "@/utilities/skeleton/ProfilePageSkeleton";
import { Toaster, toast } from "sonner";
import ProfileSpinner from "@/utilities/Spinner/ProfielSpinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, Pencil, Save } from "lucide-react";
import RazorpayIntegration from "../../../hooks/razorpayint";
import VerifyRazorpaySign from "../server/VerifyRazorpaySign";
export default function Component() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [av, setAv] = useState("DI");
  const [selectedTab, setSelectedTab] = useState("courses");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [additionalMonths, setAdditionalMonths] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [maxAdditionalMonths, setMaxAdditionalMonths] = useState(5);

  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    github: "",
    bio: "",
    linkedin: "",
    img: "",
    number: "",
    clg: "",
    gender: "",
    projects: "",
    qualification: "",
    ayear: "",
    country: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSelectChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const validatesFunc = async (token) => {
    setLoading(true);
    try {
      const response = await fetch("/api/homeauth", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          token: token,
        },
      });
      const res = await response.json();
      
      if (res.success) {
        setData(res.data);
        // Avatar name
        const nameParts = res.user.name.split(" ");
        const avName = nameParts.length > 1 
          ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
          : nameParts[0].substring(0, 2).toUpperCase();
        setAv(avName);
        
        // Set current month and calculate max additional months
        const userMonth = parseInt(res.user.month) || 1;
        setCurrentMonth(userMonth);
        setMaxAdditionalMonths(6 - userMonth);
        
        // Initialize additional months to 1 or max available if less than 1
        setAdditionalMonths(Math.min(1, 6 - userMonth));
        
        // Setting user data
        setForm({
          name: res.user.name || "",
          email: res.user.email || "",
          github: res.user.github || "",
          bio: res.user.bio || "",
          linkedin: res.user.linkedin || "",
          img: res.user.img || "",
          number: res.user.number || "",
          clg: res.user.clg || "",
          gender: res.user.gender || "",
          projects: res.user.projects || "",
          qualification: res.user.qualification || "",
          ayear: res.user.ayear || "",
          country: res.user.country || "",
          domain: res.user.domain || "",
        });
      } else {
        toast.error(res.message);
        if (res.ansession) {
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else {
          router.push("/login");
        }
      }
    } catch (error) {
      toast.error("Failed to fetch profile data");
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("dilmstoken");
    if (token) {
      validatesFunc(token);
    } else {
      router.push("/login");
    }
  }, []);

  const onSubmitData = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!form.name || !form.email) {
      toast.error("Name and email are required!");
      return;
    }

    setPostLoading(true);
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          token: localStorage.getItem("dilmstoken"),
        },
        body: JSON.stringify(form),
      });
      
      const res = await response.json();
      if (res.success) {
        toast.success(res.message || "Profile updated successfully");
      } else {
        toast.error(res.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while updating profile");
      
    } finally {
      setPostLoading(false);
    }
  };
  //update duration code

  const updateDuration = async () => {
    try{
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          token: localStorage.getItem("dilmstoken"),
        },
        body: JSON.stringify({ email:form.email,month: additionalMonths }),
      });
      const res = await response.json();
      if (res.success) {
        validatesFunc(localStorage.getItem("dilmstoken"));
        toast.success(res.message || "Duration updated successfully");
      } else {
        toast.error(res.message || "Failed to update duration");
      }
    }
    catch(err){
      
      toast.error("Failed to update duration. Please try again.");
    }
  }
//handle payement route
  const handlePayment = async () => {
    try{
  const response = await fetch("/api/payment", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      token: localStorage.getItem("dilmstoken"),
    },
    body: JSON.stringify({ price: additionalMonths * 150 }),
  });
  const res = await response.json();
  if (res.success) {
// Create script if needed
if (!window.Razorpay) {
  toast.error("Payment gateway failed to load. Please refresh the page and try again.");
  setLoading(false);
  return;
}

// Create options
const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: res.order.amount,
  currency: "INR",
  name: "Infotact Learning",
  description: `Payment for internship extension additional ${additionalMonths} month(s)`,
  image: "/9.png",
  order_id: res.order.id,
  handler: async function(response) {
  const data = await VerifyRazorpaySign(response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature);
  if (data.status) {
    toast.success("Payment successful!");
    await updateDuration();
   setLoading(false);
  }
  },
  prefill: {
    name: form?.name || "",
    email: form?.email || "",
    contact: form?.phone || ""
  },
  notes: {
    address: "Razorpay Corporate Office",
    additional_months: additionalMonths,
    user_id: data[0]._id,
  },
  theme: {
    color: "#3399cc"
  },
  modal: {
    escape: false,
    ondismiss: function() {
      setLoading(false);
      toast.info("Payment canceled");
    }
  }
};

// Create a detached payment instance
const paymentObject = new Razorpay(options);

// Add event handlers
paymentObject.on('payment.failed', function(response) {
  toast.error(`Payment failed: ${response.error.description}`);
  setLoading(false);
});

// Open in next tick to ensure DOM is ready
setTimeout(() => {
  paymentObject.open();
}, 100);
  
  }
  else{
    toast.error(res.message || "Failed to create order");
    return;
  }
    }
    catch(err){
  
      toast.error("Payment failed. Please try again.");

    }
  };

  if (loading) {
    return <ProfilePageSkeleton />;
  }

  if (postLoading || paymentLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ProfileSpinner />
      </div>
    );
  }

  return (
    <>
    <RazorpayIntegration >
      <Toaster position="top-center" richColors />
      <div className="w-full max-w-7xl mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col gap-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarImage src={form.img} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {av}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 text-center md:text-left">
                <h1 className="text-3xl font-bold">{form.name}</h1>
                <div className="text-muted-foreground flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                    {form.domain || "Student"}
                  </Badge>
                  {form.month && (
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                      Month {form.month}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="ml-auto flex  md:flex-row gap-4 items-center mt-4 md:mt-0 justify-center ">
              <div className="bg-white rounded-lg p-4 flex flex-col items-center shadow-sm">
                <div className="text-3xl font-bold">{data.length || 0}</div>
                <div className="text-muted-foreground text-sm">Enrolled Courses</div>
              </div>
              <div className="bg-white rounded-lg p-4 flex flex-col items-center shadow-sm">
                <div className="text-3xl font-bold">{currentMonth || 0}/{6}</div>
                <div className="text-muted-foreground text-sm">Internship Progress</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Tabs 
            defaultValue="courses" 
            className="w-full" 
            value={selectedTab} 
            onValueChange={setSelectedTab}
          >
            <TabsList className="grid grid-cols-3 md:w-[400px] mb-4">
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="upgrade">Upgrade</TabsTrigger>
            </TabsList>
            
            {/* Courses Tab */}
            <TabsContent value="courses" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data && data.length > 0 ? (
                  data.map((item, index) => (
                    <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative">
                        <img 
                          src={item.courseid.img} 
                          alt={item.courseid.title} 
                          className="h-48 w-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-primary text-primary-foreground">
                            {item.courseid.duration} Months
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-bold mb-2">{item.courseid.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.courseid.skills.split(",").slice(0, 3).map((skill, idx) => (
                            <Badge variant="outline" className="bg-secondary/20 text-secondary-foreground" key={idx}>
                              {skill.trim()}
                            </Badge>
                          ))}
                          {item.courseid.skills.split(",").length > 3 && (
                            <Badge variant="outline" className="bg-secondary/10">
                              +{item.courseid.skills.split(",").length - 3} more
                            </Badge>
                          )}
                        </div>
                        <Link href={`/course/detail/${item.courseid._id}`}>
                          <Button className="w-full">
                            View Course
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full flex justify-center items-center py-12 text-center">
                    <div className="space-y-4">
                      <div className="text-xl font-medium text-muted-foreground">
                        You haven't enrolled in any courses yet
                      </div>
                      <Link href="/course">
                        <Button>Browse Courses</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-0">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Personal Information</h3>
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={onSubmitData} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={form.name} 
                          onChange={handleChange} 
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          readOnly
                          className="bg-muted/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn Profile</Label>
                        <Input 
                          id="linkedin" 
                          name="linkedin" 
                          value={form.linkedin} 
                          onChange={handleChange}
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="github">GitHub Profile</Label>
                        <Input 
                          id="github" 
                          name="github" 
                          value={form.github} 
                          onChange={handleChange}
                          placeholder="https://github.com/username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="number">Phone Number</Label>
                        <Input 
                          id="number" 
                          name="number" 
                          value={form.number} 
                          onChange={handleChange}
                          placeholder="9876543210"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select 
                          value={form.gender || ""} 
                          onValueChange={(value) => handleSelectChange("gender", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input 
                          id="country" 
                          name="country" 
                          value={form.country} 
                          onChange={handleChange}
                          placeholder="India"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clg">College/University</Label>
                        <Input 
                          id="clg" 
                          name="clg" 
                          value={form.clg} 
                          onChange={handleChange}
                          placeholder="Your institution"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="qualification">Qualification</Label>
                        <Input 
                          id="qualification" 
                          name="qualification" 
                          value={form.qualification} 
                          onChange={handleChange}
                          placeholder="B.Tech, MCA, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ayear">Academic Year</Label>
                        <Input 
                          id="ayear" 
                          name="ayear" 
                          type="number"
                          value={form.ayear} 
                          onChange={handleChange}
                          placeholder="2023"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projects">Projects</Label>
                      <textarea
                        id="projects"
                        name="projects"
                        value={form.projects}
                        onChange={handleChange}
                        placeholder="List your projects with brief descriptions"
                        className="w-full min-h-24 border rounded-md p-2 resize-y"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={form.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself"
                        className="w-full min-h-32 border rounded-md p-2 resize-y"
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Upgrade Tab */}
            <TabsContent value="upgrade" className="mt-0">
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Extend Your Internship</h3>
                  <p className="text-blue-100">
                    Upgrade your internship duration to get more time to complete your courses and gain valuable experience.
                  </p>
                </div>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="current-month">Current Month</Label>
                        <Input 
                          id="current-month" 
                          value={currentMonth || "1"} 
                          readOnly 
                          className="bg-muted/50"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="additional-months">Additional Months</Label>
                        <Select 
                          value={additionalMonths.toString()} 
                          onValueChange={(value) => setAdditionalMonths(parseInt(value))}
                          disabled={maxAdditionalMonths <= 0}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select months" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: maxAdditionalMonths }, (_, i) => i + 1).map((month) => (
                              <SelectItem key={month} value={month.toString()}>
                                {month} {month === 1 ? "Month" : "Months"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {maxAdditionalMonths <= 0 && (
                          <p className="text-sm text-amber-600 mt-1">
                            You've reached the maximum internship duration of 6 months.
                          </p>
                        )}
                      </div>
                      
                      <div className="border rounded-lg p-4 bg-blue-50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Base price per month</span>
                          <span>₹150</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Number of months</span>
                          <span>× {additionalMonths}</span>
                        </div>
                        <div className="border-t pt-2 mt-2 flex justify-between items-center">
                          <span className="font-medium">Total amount</span>
                          <span className="text-xl font-bold">₹{additionalMonths * 150}</span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full flex items-center justify-center gap-2" 
                        size="lg"
                        onClick={handlePayment}
                        disabled={maxAdditionalMonths <= 0}
                      >
                        <CreditCard className="h-4 w-4" />
                        Pay ₹{additionalMonths * 150} and Upgrade
                      </Button>
                      
                      <div className="text-center text-sm text-muted-foreground">
                        <p>Total duration after upgrade: <span className="font-medium">{currentMonth + additionalMonths} / 6 months</span></p>
                      </div>
                    </div>
                    
                    <div className="bg-muted rounded-lg p-6">
                      <h4 className="text-lg font-medium mb-4">Benefits of Extending</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <div className="mt-1 bg-green-500 text-white p-1 rounded-full h-5 w-5 flex items-center justify-center text-xs">✓</div>
                          <span>More time to complete your assignments and projects</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 bg-green-500 text-white p-1 rounded-full h-5 w-5 flex items-center justify-center text-xs">✓</div>
                          <span>Additional mentorship sessions with industry experts</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 bg-green-500 text-white p-1 rounded-full h-5 w-5 flex items-center justify-center text-xs">✓</div>
                          <span>Extended access to course materials and resources</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 bg-green-500 text-white p-1 rounded-full h-5 w-5 flex items-center justify-center text-xs">✓</div>
                          <span>Enhanced certificate with longer internship duration</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 bg-green-500 text-white p-1 rounded-full h-5 w-5 flex items-center justify-center text-xs">✓</div>
                          <span>Better portfolio development opportunities</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RazorpayIntegration>
    </>
  );
}