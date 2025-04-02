"use client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { toast } from "sonner"
import { Clock, Users, BookOpen, Check ,CheckCircle2,Loader2} from 'lucide-react'
import { useState,useEffect } from "react"
export function CourseCard({ course ,user,data}) {
    const [loading,setLoading] = useState(false);
    const [isenrolled,setIsenrolled] = useState(false);
    //handle click
    const handleClick = async() => {
     try{
      setLoading(true);
      let resdata = await fetch("/api/enrollcourse",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "token":localStorage.getItem("dilmstoken")
        },
        body:JSON.stringify({
          courseid:course._id,
          id:user._id,
          email:user.email,
          title:course.title
        })
      });
        let res = await resdata.json();
        setLoading(false);
        if(res.success){
          toast.success(res.message);
            setIsenrolled(true);
        }
        else{
          toast.error(res.message);
        }
     }
     catch(err){
        console.log(err);   
        setLoading(false);
       toast.error("Internal server error");
     }
    }
    useEffect(() => {
        if (data) {
          const enrolled = data.some((item) => item.courseid._id === course._id);
          setIsenrolled(enrolled);
        }
      }, [data, course._id]);
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative h-48">
          <Image
            src={course.img}
            alt={course.title}
            layout="fill"
            objectFit="cover"
          />
          <Badge
            className={`absolute top-2 right-2 ${
              course.isopen ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {course.isopen ? 'Open' : 'Closed'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{course.title}</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {course.skills.split(",").map((lang) => (
            <Badge key={lang} variant="secondary" className="px-2 py-1">
              {lang}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{course.desc}</p>
        <div className="flex justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{course.seats} seats</span>
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">What you'll get:</h4>
          <ul className="space-y-2">
            {course.feature.split(",").map((feature, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
        <CardFooter className="mt-auto flex justify-between items-center p-4 bg-gray-50">
            <div className="text-lg font-semibold flex items-center">
                <>
                    <Check className="w-5 h-5 mr-1 text-white bg-green-600 rounded-full" />
                    <span className="text-green-500 mx-1">Free</span>
                </>
            </div>
            <Button
                disabled={!course.isopen || isenrolled} // Disable if course is closed and not enrolled
                className="px-6"
                onClick={handleClick}
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enrolling...
                    </>
                ) : (
                    <>
                        <BookOpen className="w-4 h-4 mr-2" />
                        {course.price === 'Free' ? (
                            <>
                                <Check className="w-4 h-4 mr-2" /> Free
                            </>
                        ) : isenrolled ? 'Enrolled' : course.isopen ? 'Enroll Now' : 'Closed'}
                    </>
                )}
            </Button>
        </CardFooter>
    </Card>
  )
}

