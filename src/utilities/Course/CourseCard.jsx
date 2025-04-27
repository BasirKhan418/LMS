"use client"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { toast } from "sonner"
import { Clock, Users, BookOpen, Check, CheckCircle2, Loader2, Tag } from 'lucide-react'
import { useState, useEffect } from "react"
import CourseEnrollmentDialog from "../dialog/course-dialog"
export function CourseCard({ course, user, data,batchdetails }) {
  const [loading, setLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showDialog, setShowDialog] = useState(false); // State to control dialog visibility

  const handleEnrollment = async() => {
    
      setShowDialog(true);
  }

  const handleDirectEnroll = async() => {
    try {
      setLoading(true);
      let resdata = await fetch("/api/enrollcourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": localStorage.getItem("dilmstoken")
        },
        body: JSON.stringify({
          courseid: course._id,
          id: user._id,
          email: user.email,
          title: course.title
        })
      });
      let res = await resdata.json();
      setLoading(false);
      if(res.success) {
        toast.success(res.message);
        setIsEnrolled(true);
      } else {
        toast.error(res.message);
      }
    } catch(err) {
      console.log(err);   
      setLoading(false);
      toast.error("Internal server error");
    }
  }

  // Handle successful payment and enrollment from dialog
  const handlePaymentSuccess = async () => {
    // Here you would implement the actual payment processing
    // Then call the enrollment API
    // handleDirectEnroll();
  }

  useEffect(() => {
    if (data) {
      const enrolled = data.some((item) => item.courseid._id === course._id);
      setIsEnrolled(enrolled);
    }
  }, [data, course._id]);

  // Determine if course is free or paid
  const isFree = course.price === 'Free';
  // Get price value if not free
  const priceValue = !isFree ? `₹${course.price}` : "Free";

  return (
    <>
      <Card className="group flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl border-0 shadow-md relative">
        {/* Image container with overlay on hover */}
        <div className="relative h-52 sm:h-48 md:h-56 lg:h-60 overflow-hidden">
          <Image
            src={course.img}
            alt={course.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-50"></div>
          
          {/* Status badge */}
          <Badge
            className={`absolute top-3 left-3 text-xs font-medium py-1 px-3 ${
              course.isopen ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'
            }`}
          >
            {course.isopen ? 'Open for Enrollment' : 'Enrollment Closed'}
          </Badge>

          {/* Price tag */}
          <div className="absolute bottom-0 right-0 bg-slate-900/85 text-white px-4 py-2 rounded-tl-lg flex items-center">
            <Tag className="w-4 h-4 mr-2" />
            <span className={`font-bold ${isFree ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isFree ? 'Free' : priceValue}
            </span>
          </div>
        </div>

        <CardContent className="flex-grow p-5">
          {/* Title */}
          <h3 className="text-xl font-bold mb-3 line-clamp-2 text-slate-800">{course.title}</h3>
          
          {/* Skills badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {course.skills.split(",").slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="px-2 py-0.5 text-xs">
                {skill.trim()}
              </Badge>
            ))}
            {course.skills.split(",").length > 4 && (
              <Badge variant="outline" className="px-2 py-0.5 text-xs">
                +{course.skills.split(",").length - 4} more
              </Badge>
            )}
          </div>
          
          {/* Description */}
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">{course.desc}</p>
          
          {/* Course stats */}
          <div className="flex justify-between text-sm text-slate-500 mb-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1.5 text-slate-400" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1.5 text-slate-400" />
              <span>{course.seats} seats</span>
            </div>
          </div>
          
          {/* Features section */}
          <div className="bg-slate-50 p-3 rounded-lg">
            <h4 className="font-semibold text-sm mb-2 text-slate-700">What you'll get:</h4>
            <ul className="space-y-2">
              {course.feature.split(",").slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-600">{feature.trim()}</span>
                </li>
              ))}
              {course.feature.split(",").length > 3 && (
                <li className="text-sm text-slate-500 italic pl-6">
                  +{course.feature.split(",").length - 3} more features
                </li>
              )}
            </ul>
          </div>
        </CardContent>

        <CardFooter className="px-5 py-4 bg-slate-50 border-t border-slate-100">
          <Button
            disabled={!course.isopen || isEnrolled || loading}
            className={`w-full py-2 transition-all ${
              isEnrolled 
                ? 'bg-emerald-500 hover:bg-emerald-600' 
                : course.isopen 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-slate-400'
            }`}
            onClick={handleEnrollment}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                {isEnrolled ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    <span>Enrolled</span>
                  </>
                ) : course.isopen ? (
                  <>
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span>Enroll Now</span>
                  </>
                ) : (
                  <span>Not Available</span>
                )}
              </div>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Enrollment Dialog for paid courses */}
      <CourseEnrollmentDialog 
        course={course}
        isOpen={showDialog}
        batchdetails={batchdetails}
        onClose={() => setShowDialog(false)}
        onEnroll={handlePaymentSuccess}
        onDirectEnroll={handleDirectEnroll} // Pass the direct enroll function to the dialog
        user={user}
      />
    </>
  )
}