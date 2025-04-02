"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import ProfilePageSkeleton from "@/utilities/skeleton/ProfilePageSkeleton";
import { Toaster,toast } from "sonner";
import ProfielSpinner from "@/utilities/Spinner/ProfielSpinner";
export default function Component() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [av, setAv] = useState("DI");
  const [score, setScore] = useState(0);
  const [amount,setamount] = useState(0)
  const [form, setForm] = useState({
    name: "",
    email: "",
    github: "",
    bio: "",
    linkedin: "",    
  }
  )
const handleChange = (e)=>{
setForm({...form,[e.target.name]:e.target.value})
}
  const router = useRouter();
  const validatesFunc = async (token) => {
    console.log(token);
    setLoading(true);
    const response = await fetch("/api/homeauth", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        token: token,
      },
    });
    const res = await response.json();
    setLoading(false);
    console.log(res);
    if (res.success) {
      setData(res.data);
    //avtar name
      let avname = res.user.name.split(" ");
      avname = avname[0][0].toUpperCase() + avname[1][0].toUpperCase();
      setAv(avname);
      console.log(avname);
      //score
      let tempscr= 0;
      res.data.map((item)=>{
        tempscr = tempscr+item.score;
      })
      //deriving amount
      
    
      setScore(tempscr/res.data.length);
      //end
      //amount
      res.data.map((item)=>{
        setamount(amount+item.amount);
      })
      //end
      //setting your name
        setForm({
          name: res.user.name,
          email: res.user.email,
          github: res.user.github,
          bio: res.user.bio,
          linkedin: res.user.linkedin,
          img:res.user.img
        })
        //end
    } else {
      toast.error(res.message);
      if (res.ansession) {
        setisansession(true);
        setTimeout(() => {
          router.push("/login");
        }, 4000);
      }
      router.push("/login");
    }
  };
  useEffect(() => {
    validatesFunc(localStorage.getItem("dilmstoken"));
  }, [])
  //onsubmit;
  const onSubmitdata = async(e)=>{
    e.preventDefault();
  if(form.name==""||form.email==""||form.phone==""||form.desc==""||form.profile==""){
    toast.error("All fields are required!");
    return;
  }
  setPostLoading(true);
 const response = await fetch("/api/profile",{
    method:"POST",
    headers:{
      "content-type":"application/json",
      token:localStorage.getItem("dilmstoken")
    },
    body:JSON.stringify(form)
 })
setPostLoading(false);
 const res = await response.json();
 if(res.success){
   toast.success(res.message);
 }
    else{
    toast.error(res.message);
    }
  }
  
  return (
    <>
    <Toaster position="top-center" expand={false}/>
    {loading && <ProfilePageSkeleton/>}
    {postLoading && <div className="flex justify-center items-center h-full"><ProfielSpinner/></div>}

    {!loading && !postLoading &&<div className="w-full max-w-5xl mx-auto py-12 px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
        <div className="bg-background rounded-lg p-6 shadow-sm">
          <div className="flex flex-col items-center gap-4">
          <Avatar className="w-24 h-24">
                <AvatarImage src={form&&form.img&&form.img} />
                <AvatarFallback>{av}</AvatarFallback>
              </Avatar>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold">{form && form.name}</div>
              <div className="text-muted-foreground">Student</div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-muted rounded-lg p-4 flex flex-col items-center">
                <div className="text-4xl font-bold">{data && data.length}</div>
                <div className="text-muted-foreground">Courses</div>
              </div>
              <div className="bg-muted rounded-lg p-4 flex flex-col items-center">
                <div className="text-4xl font-bold">{Math.floor(score)}%</div>
                <div className="text-muted-foreground">Total Score</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-muted rounded-lg p-4 flex flex-col items-center">
                <div className="text-4xl font-bold">99+</div>
                <div className="text-muted-foreground">Your Rank</div>
              </div>
              <div className="bg-muted rounded-lg p-4 flex flex-col items-center">
                <div className="text-4xl font-bold"> Free</div>
                <div className="text-muted-foreground">Tuition</div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Courses</h2>
              <Link
                href="/course"
                className="text-primary hover:underline"
                prefetch={false}
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data&&data.map((item,index)=>(<Card className="p-4" key={index}>

                <div className="flex items-center justify-between relative">
               
        <div className="absolute top-4 right-4">
          <Badge variant="outline" className="bg-primary text-primary-foreground">
            {item.courseid.duration} Months
          </Badge>
        </div>
                    <div className="flex justify-center items-center flex-col ">
                
                    <img src={item.courseid.img} alt="image" className="h-44 w-full object-cover"/>
                    <div className="text-lg font-bold">
                    {item.courseid.title}
                  </div>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-2 flex-wrap">
          {item.courseid.skills.split(",").map((item,index)=>(<Badge variant="outline" className="bg-secondary text-secondary-foreground my-1" key={index}>
            {item}
          </Badge>))}
          </div>
                <Link href={`/course/detail/${item.courseid._id}`}><Button variant="" className="my-2 w-full">
                    View Now
                </Button></Link>
              </Card>))}
           
             
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Settings</h2>
            </div>
            <Card className="p-4">
            <form onSubmit={onSubmitdata} className="space-y-4">
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    <div className="space-y-2">
      <Label htmlFor="name">Name</Label>
      <Input id="name" type="text" name="name" value={form.name} onChange={handleChange} />
    </div>
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        readOnly
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="profile">Profile</Label>
      <Input id="linkedin" type="url" name="linkedin" value={form.linkedin} onChange={handleChange} />
    </div>
    <div className="space-y-2">
      <Label htmlFor="phone">Phone</Label>
      <Input id="github" type="url" name="github" value={form.github} onChange={handleChange} />
    </div>
    <div className="space-y-2 md:col-span-2">
      <Label htmlFor="desc">Bio</Label>
      <textarea 
        name="bio" 
        id="bio" 
        rows={8} 
        value={form.bio} 
        onChange={handleChange} 
        className="w-full border-2 border-green-200 rounded-lg p-2 resize-none"  
      ></textarea>
    </div>
  </div>
  <div className="mt-4 flex justify-end">
    <Button type="submit">Save Changes</Button>
  </div>
</form>

            </Card>
          </div>
        </div>
      </div>
    </div>}
    </>
  );
}
