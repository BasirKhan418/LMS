import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast, Toaster } from "sonner";
import VerifyRazorpaySign from "@/app/server/VerifyRazorpaySign";
import { 
  CheckCircle2, Calendar, Clock, Users, Tag, Play, 
  ChevronRight, ArrowRight, Lock, Monitor, FileText, 
  Award, PlayCircle, MessageCircle, ChevronDown,
  X
} from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function CourseEnrollmentDialog({ course, isOpen, onClose, onEnroll, batchdetails, onDirectEnroll, user }) {
  const [loading, setLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [showSidebarVideo, setShowSidebarVideo] = useState(false);
  
  // Calculate the discounted price if applicable
  const originalPrice = course?.price || 0;
  const discountPercent = course?.discount || 0;
  const discountedPrice = originalPrice - (originalPrice * (discountPercent / 100));
  
  // Extract YouTube video ID from URL
  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  const youtubeVideoId = getYoutubeVideoId(course?.ytvideo) || "dQw4w9WgXcQ"; // Default fallback
  
  // Load Razorpay script separately
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };
    
    // Only load if it doesn't exist
    if (!window.Razorpay) {
      loadRazorpayScript();
    }
  }, []);
  
  const handlePayment = async () => {
    // Close the dialog to avoid z-index conflicts
    onClose();
    
    // Set loading state
    setLoading(true);
    
    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": localStorage.getItem("dilmstoken")
        },
        body: JSON.stringify({
          price: discountedPrice,
          courseId: course._id
        })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        setLoading(false);
        toast.error(data.message || "Payment initialization failed");
        return;
      }
      
      // Create script if needed
      if (!window.Razorpay) {
        toast.error("Payment gateway failed to load. Please refresh the page and try again.");
        setLoading(false);
        return;
      }
      
      // Create options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "Infotact Learning",
        description: `Payment for ${course.title}`,
        image: "/9.png",
        order_id: data.order.id,
        handler: async function(response) {
         console.log("Payment response:", response);
        const data = await VerifyRazorpaySign(response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature);
        if (data.status) {
          toast.success("Payment successful!");
       onDirectEnroll();
         setLoading(false);
        }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || ""
        },
        notes: {
          address: "Razorpay Corporate Office",
          courseId: course._id
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
      
    } catch (error) {
      console.error("Error during payment:", error);
      setLoading(false);
      toast.error("Error processing payment. Please try again.");
    }
  };
  
  // Verification function
  const verifyPayment = async (payment, order) => {
    try {
      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": localStorage.getItem("dilmstoken")
        },
        body: JSON.stringify({
          paymentId: payment.razorpay_payment_id,
          orderId: payment.razorpay_order_id,
          signature: payment.razorpay_signature,
          courseId: course._id
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Payment successful!");
        if (onEnroll) {
          onEnroll(payment);
        }
      } else {
        toast.error(data.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error("Error verifying payment. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle section expansion
  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };
  
  // Toggle video preview
  const handlePreviewClick = () => {
    setShowVideo(!showVideo);
  };
  
  // Toggle sidebar video preview
  const handleSidebarPreviewClick = () => {
    setShowSidebarVideo(!showSidebarVideo);
  };
  
  // Function to get icon based on content type
  const getContentTypeIcon = (type) => {
    if (!type) return <FileText className="w-4 h-4 mr-3 text-slate-500 flex-shrink-0" />;
    
    const lowerType = type.toLowerCase();
    if (lowerType.includes('video') || lowerType.includes('recording')) {
      return <PlayCircle className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0" />;
    } else if (lowerType.includes('meet') || lowerType.includes('live')) {
      return <MessageCircle className="w-4 h-4 mr-3 text-purple-500 flex-shrink-0" />;
    } else {
      return <FileText className="w-4 h-4 mr-3 text-emerald-500 flex-shrink-0" />;
    }
  };
  
  // Calculate total weeks from content
  const totalWeeks = course?.content ? course.content.length : 0;
  
  // Calculate total content items
  const totalContentItems = course?.content ? 
    course.content.reduce((acc, week) => acc + (week.content?.length || 0), 0) : 0;

  // If course is not available, render a placeholder or return null
  if (!course) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose} className="overflow-hidden">
        <Toaster richColors position="top-center" closeButton={true} />
        <DialogContent className="sm:max-w-4xl max-h-[95vh] p-0 overflow-hidden flex flex-col">
          <DialogTitle className="sr-only">Course Details</DialogTitle>
          {/* Mobile-only header */}
          <div className="block md:hidden p-4 bg-slate-50 border-b">
            <h2 className="text-xl font-bold truncate">{course.title}</h2>
            <div className="flex items-center text-sm text-slate-600 mt-1">
              <Badge className="mr-2 bg-blue-500">{course.skills?.split(',')[0]}</Badge>
              <span>• {course.duration}</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Main content area - scrollable */}
            <ScrollArea className="flex-1 md:max-h-[80vh]">
              {/* Course header - desktop only */}
              <div className="hidden md:block relative h-56 w-full">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${course.img})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
                </div>
                
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className="bg-blue-500 hover:bg-blue-600">
                      {course.skills?.split(',')[0]}
                    </Badge>
                    {course.isopen && 
                      <Badge className="bg-emerald-500">Open for Enrollment</Badge>
                    }
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-2">{course.title}</h2>
                  
                  <p className="text-white/80 text-sm line-clamp-2 mb-3 max-w-2xl">{course.desc}</p>
                  
                  <div className="flex flex-wrap gap-4 text-white/90 text-sm">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{course.seats} seats</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Starts {new Date(course.startdate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main content */}
              <div className="p-4 md:p-6">
                <Tabs defaultValue="curriculum" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="curriculum" className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Course Content</h3>
                        <div className="text-sm text-slate-600">
                          {totalWeeks} weeks • {totalContentItems}+ lessons • {course.duration}
                        </div>
                      </div>
                      
                      {course.content && course.content.length > 0 ? (
                        <div className="space-y-3">
                          {course.content.map((week, index) => (
                            <div key={index} className="border rounded-lg overflow-hidden">
                              <button
                                onClick={() => toggleSection(index)}
                                className="w-full p-4 bg-slate-50 flex justify-between items-center hover:bg-slate-100 transition-colors text-left"
                              >
                                <div className="flex-1">
                                  <h4 className="font-medium flex items-center">
                                    <span>{week.name || `Week ${index + 1}`}</span>
                                  </h4>
                                  <div className="text-xs text-slate-500 mt-1">
                                    {week.type || "Lessons and Activities"}
                                  </div>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${expandedSection === index ? 'rotate-180' : ''}`} />
                              </button>
                              
                              {expandedSection === index && (
                                <>
                                  <Separator />
                                  {week.description && (
                                    <div className="p-3 bg-slate-50 text-sm text-slate-600 italic border-b">
                                      {week.description}
                                    </div>
                                  )}
                                  <div className="divide-y">
                                    {week.content && week.content.length > 0 ? (
                                      week.content.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-50">
                                          <div className="flex items-center">
                                            {getContentTypeIcon(item.type)}
                                            <span className="text-sm">{item.title || item.name || `Lesson ${idx + 1}`}</span>
                                          </div>
                                          <div className="flex items-center">
                                            {item.duration && (
                                              <span className="text-xs text-slate-500 mr-2">{item.duration}</span>
                                            )}
                                            <Lock className="w-4 h-4 text-slate-400" />
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="p-3 text-sm text-slate-500">
                                        Content details will be available after enrollment
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-slate-50 p-6 rounded-lg text-center">
                          <p className="text-slate-600 mb-1">Full curriculum will be available upon enrollment</p>
                          <p className="text-sm text-slate-500">{course.duration} of comprehensive learning material</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="overview" className="space-y-6">
                    {/* Course preview video */}
                    <div className="bg-slate-50 rounded-lg p-4 mb-6">
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <Play className="w-5 h-5 mr-2 text-blue-600" />
                        Course Preview
                      </h3>
                      
                      <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                        {showVideo ? (
                          <div className="w-full h-full relative">
                            <div className="absolute top-3 right-3 z-10">
                              <Button 
                                variant="secondary" 
                                size="icon" 
                                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full"
                                onClick={() => setShowVideo(false)}
                              >
                                <X className="w-4 h-4 text-white" />
                              </Button>
                            </div>
                            <iframe
                              className="w-full h-full"
                              src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`}
                              title="YouTube video player"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        ) : (
                          <>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Button 
                                variant="outline" 
                                size="lg" 
                                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                                onClick={handlePreviewClick}
                              >
                                <Play className="w-6 h-6 mr-2" />
                                Watch Preview
                              </Button>
                            </div>
                            <img 
                              src={course.img} 
                              alt="Video thumbnail" 
                              className="w-full h-full object-cover opacity-60"
                            />
                          </>
                        )}
                      </div>
                      
                      <div className="mt-2 text-sm text-center">
                        <a href={course.ytvideo} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center justify-center">
                          <Play className="w-4 h-4 mr-1" />
                          Watch more videos on our channel
                        </a>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">About This Course</h3>
                      <p className="text-slate-600 mb-4">{course.desc}</p>
                      <p className="text-slate-600">
                        Join our {course.duration} course to master {course.skills?.split(',').slice(0, 3).join(', ')} 
                        and more. This comprehensive program is designed for both beginners and advanced learners 
                        looking to enhance their skills in these high-demand areas.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Skills You'll Gain</h3>
                      <div className="flex flex-wrap gap-2">
                        {course.skills?.split(",").map((skill, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1">
                            {skill.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="features" className="space-y-5">
                    <h3 className="text-lg font-semibold mb-3">What's Included</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start bg-slate-50 p-4 rounded-lg">
                        <Monitor className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Full Course Access</h4>
                          <p className="text-sm text-slate-600 mt-1">
                            {totalWeeks} weeks of structured learning content
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start bg-slate-50 p-4 rounded-lg">
                        <MessageCircle className="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Community Access</h4>
                          <p className="text-sm text-slate-600 mt-1">
                            Join our exclusive group for support and networking
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start bg-slate-50 p-4 rounded-lg">
                        <FileText className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Course Materials</h4>
                          <p className="text-sm text-slate-600 mt-1">
                            Downloadable resources, code samples, and exercises
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start bg-slate-50 p-4 rounded-lg">
                        <Award className="w-5 h-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Certificate of Completion</h4>
                          <p className="text-sm text-slate-600 mt-1">
                            Earn a certificate after finishing the course
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-3">Course Features</h3>
                      <div className="grid md:grid-cols-2 gap-y-3">
                        {course.feature?.split(",").map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" />
                            <span className="text-slate-700">{feature.trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>

            {/* Sticky sidebar - desktop only */}
            <div className="hidden md:block w-80 border-l bg-white">
              <div className="p-6 sticky top-0">
                {/* Course card preview */}
                <div className="rounded-lg border overflow-hidden mb-6">
                  <div className="aspect-video relative">
                    {showSidebarVideo ? (
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <>
                        <img 
                          src={course.img} 
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                            onClick={handleSidebarPreviewClick}
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Preview
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Price section */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    {discountPercent > 0 ? (
                      <>
                        <span className="text-3xl font-bold">₹{discountedPrice}</span>
                        <span className="text-slate-500 line-through text-lg">₹{originalPrice}</span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold">₹{originalPrice}</span>
                    )}
                  </div>
                  
                  {discountPercent > 0 && (
                    <div className="flex items-center mb-2">
                      <Badge className="bg-red-500">{discountPercent}% OFF</Badge>
                      <span className="text-xs text-slate-500 ml-2">Limited time offer</span>
                    </div>
                  )}
                </div>
                
                {/* Enrollment buttons */}
                {course && batchdetails && course.batch !== batchdetails._id && (
                  <Button 
                    className="w-full mb-4"
                    size="lg"
                    onClick={handlePayment}
                    disabled={loading}
                  >
                    {loading ? (
                      <>Processing Payment...</>
                    ) : (
                      <div className="flex items-center">
                        Pay & Enroll Now
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </div>
                    )}
                  </Button>
                )}
                
                {course && batchdetails && course.batch === batchdetails._id && (
                  <Button 
                    className="w-full mb-4"
                    size="lg"
                    onClick={() => {
                      setLoading(true);
                      onDirectEnroll();
                      setTimeout(() => {
                        setLoading(false);
                        onClose();
                      }, 2000);
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>Enrolling...</>
                    ) : (
                      <div className="flex items-center">
                        Enroll For Free
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </div>
                    )}
                  </Button>
                )}
                
                {/* Course includes */}
                <div className="text-sm">
                  <p className="font-medium mb-2">This course includes:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Monitor className="w-4 h-4 mr-2 text-slate-500" />
                      <span>{totalWeeks} weeks of course material</span>
                    </li>
                    <li className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-slate-500" />
                      <span>Downloadable resources</span>
                    </li>
                    <li className="flex items-center">
                      <Award className="w-4 h-4 mr-2 text-slate-500" />
                      <span>Certificate of completion</span>
                    </li>
                    <li className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2 text-slate-500" />
                      <span>Community support</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-4 text-xs text-center text-slate-500">
                  30-day money-back guarantee
                </div>
              </div>
            </div>
          </div>
          
          {/* Sticky footer - mobile only */}
          <div className="block md:hidden p-4 border-t bg-white sticky bottom-0">
            <div className="flex items-center justify-between mb-3">
              {discountPercent > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">₹{discountedPrice}</span>
                  <span className="text-slate-500 line-through text-sm">₹{originalPrice}</span>
                  <Badge className="bg-red-500">{discountPercent}% OFF</Badge>
                </div>
              ) : (
                <span className="text-2xl font-bold">₹{originalPrice}</span>
              )}
            </div>
            
            {course && batchdetails && course.batch !== batchdetails._id && (
              <Button 
                className="w-full"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? (
                  <>Processing...</>
                ) : (
                  <div className="flex items-center justify-center">
                    Pay & Enroll Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                )}
              </Button>
            )}
            
            {course && batchdetails && course.batch === batchdetails._id && (
              <Button 
                className="w-full"
                onClick={() => {
                  setLoading(true);
                  onDirectEnroll();
                  setTimeout(() => {
                    setLoading(false);
                    onClose();
                  }, 2000);
                }}
                disabled={loading}
              >
                {loading ? (
                  <>Enrolling...</>
                ) : (
                  <div className="flex items-center justify-center">
                    Enroll For Free
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                )}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}