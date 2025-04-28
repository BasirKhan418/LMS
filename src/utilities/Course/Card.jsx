import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { LiaCertificateSolid } from "react-icons/lia";
export default function Component({
  title,
  description,
  progress,
  duration,
  validity,
  img,
  skills,
  isadmin,
  assignment,
  course = { coursetype: "recording" }, // Default to recording if not specified
  rating = 4.8,
  isBestseller = false,
  project
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl border border-gray-100 dark:border-gray-700 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Bestseller ribbon */}
      {isBestseller && (
        <div className="absolute -right-12 top-8 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-12 py-1 rotate-45 z-10 shadow-md">
          <span className="text-xs font-semibold">BESTSELLER</span>
        </div>
      )}
      
      {/* Image container */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
        <img
          src={img || "/api/placeholder/500/300"}
          alt={title}
          className={`w-full h-56 object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        
        {/* Overlay content */}
        <div className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between">
          <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-0">
            {duration}
          </Badge>
          <Badge className="bg-black/80 hover:bg-black text-white border-0 flex items-center gap-1">
            <CertificateIcon className="w-3 h-3" /> 
            Accredited
          </Badge>
        </div>
        
        {/* Course type indicator */}
        <div className="absolute bottom-4 left-4 z-20">
          <Badge 
            variant="outline" 
            className={`flex items-center gap-1 backdrop-blur-sm border-0 ${
              course.coursetype === "live" 
                ? "bg-red-600/80 text-white" 
                : "bg-green-600/80 text-white"
            }`}
          >
            {course.coursetype === "live" ? (
              <>
                <PulseIcon className="w-3 h-3" /> LIVE
              </>
            ) : (
              <>
                <VideoIcon className="w-3 h-3" /> RECORDED
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 bg-white dark:bg-gray-800">
        {/* Title and rating */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">{title}</h3>
          <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-md">
            <StarIcon className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{rating}</span>
          </div>
        </div>
        
        {/* Course summary/features */}
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
              <CalendarIcon className="w-4 h-4 text-blue-500" />
              Valid: {validity} {parseInt(validity) === 1 ? 'year' : 'years'}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
              <BookmarkIcon className="w-4 h-4 text-purple-500" />
              {skills.split(",").length} Skills
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
              <LiaCertificateSolid className="w-4 h-4 text-green-500" />
              Certificate
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
              <DeviceIcon className="w-4 h-4 text-orange-500" />
              Mobile Access
            </div>
          </div>
        </div>
        
        {/* Progress tracker (for students) */}
        {!isadmin && !assignment && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Course progress</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{progress}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2 bg-gray-200 dark:bg-gray-700"
            />
          </div>
        )}
        
        {/* Skills tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {skills.split(",").slice(0, 3).map((item, index) => (
            <Badge 
              key={index}
              variant="outline" 
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-0"
            >
              {item.trim()}
            </Badge>
          ))}
          {skills.split(",").length > 3 && (
            <Badge 
              variant="outline" 
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-0"
            >
              +{skills.split(",").length - 3} more
            </Badge>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center justify-between mt-4">
          {isadmin && (
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <PlusIcon className="w-4 h-4 mr-2" /> Manage Course
            </Button>
          )}
          {!isadmin && !assignment && (
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <PlayIcon className="w-4 h-4 mr-2" /> Continue Learning
            </Button>
          )}
          {assignment && (
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <ClipboardIcon className="w-4 h-4 mr-2" /> View {project?"Project":"Assignment"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Icons
function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function CertificateIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="14" x="3" y="5" rx="2" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <path d="M12 10v6" />
      <path d="M8 12h8" />
    </svg>
  );
}

function PlayIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  );
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function ClipboardIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="5" y="7" rx="2" />
      <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
    </svg>
  );
}

function CalendarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function BookmarkIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

function DeviceIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <line x1="12" x2="12.01" y1="18" y2="18" />
    </svg>
  );
}

function PulseIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function VideoIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
  );
}