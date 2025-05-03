"use client"
import { Award, AlertCircle, BookOpen, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function CourseCompletionAlert({progress,title}) {
  const [isHovering, setIsHovering] = useState(false);
  
  // Mock course data
  const courseData = {
    completionRate: progress,
    coursesCompleted: 3,
    totalCourses: 5,
    platformName: "Infotact Learning",
    courseName: title,
    certificateType: "Professional Certificate"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full -mr-20 -mt-20 z-0"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-50 rounded-full -ml-12 -mb-12 z-0"></div>
        
        {/* Content Container with higher z-index */}
        <div className="relative z-10">
          {/* Platform Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-md">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-white rounded-md flex items-center justify-center">
                  <BookOpen className="text-blue-600" size={18} />
                </div>
                <span className="text-white font-bold ml-2">{courseData.platformName}</span>
              </div>
            </div>
          </div>
          
          {/* Title with certificate icon */}
          <div className="flex items-center justify-center mb-4">
            <Award className="text-yellow-500 mr-2" size={24} />
            <h1 className="text-xl font-bold text-gray-900">
              Certificate Pending
            </h1>
          </div>
          
          {/* Course name */}
          <h2 className="text-center text-gray-800 font-medium mb-1">{courseData.courseName}</h2>
          <p className="text-gray-500 text-sm text-center mb-6">{courseData.certificateType}</p>
          
          {/* Course progress visualization */}
          <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100">
            {/* Progress circle */}
            <div className="flex justify-center mb-4">
              <div className="relative w-28 h-28">
                {/* Background circle */}
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#e5e7eb" 
                    strokeWidth="8"
                  />
                  {/* Progress arc - circumference is 2πr = 2π*45 ≈ 282.74, then take percentage */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="8"
                    strokeDasharray="282.74"
                    strokeDashoffset={282.74 * (1 - courseData.completionRate/100)}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                {/* Percentage text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-xl font-bold text-gray-800">{courseData.completionRate}%</span>
                    <span className="block text-xs text-gray-500">Completed</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Status message */}
            <div className="flex items-center bg-amber-50 rounded-lg p-3 border border-amber-100">
              <AlertCircle className="text-amber-500 mr-2 flex-shrink-0" size={16} />
              <p className="text-sm text-amber-700">
                <span className="font-medium">Complete all courses to earn your certificate</span>
              </p>
            </div>
          </div>
          
          {/* Course progress details */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Courses Progress</span>
              <span className="text-sm text-blue-600 font-medium">{courseData.coursesCompleted}/{courseData.totalCourses}</span>
            </div>
            
            {/* Progress bar with course markers */}
            <div className="h-3 bg-gray-200 rounded-full mb-1 relative">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" 
                style={{ width: `${(courseData.coursesCompleted / courseData.totalCourses) * 100}%` }}
              ></div>
              
              {/* Course milestone markers */}
              {[...Array(courseData.totalCourses)].map((_, i) => (
                <div 
                  key={i}
                  className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full border-2 border-white 
                             ${i < courseData.coursesCompleted ? 'bg-blue-500' : 'bg-gray-300'}`}
                  style={{ left: `${(i / (courseData.totalCourses - 1)) * 100}%`,
                          transform: 'translate(-50%, -50%)' }}
                >
                  {i < courseData.coursesCompleted && (
                    <span className="flex h-full w-full items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Certificate mockup */}
          <div className="relative mb-6 bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="bg-white rounded border border-gray-200 p-4 shadow-sm opacity-70">
              <div className="flex justify-between items-center mb-3">
                <div className="h-6 w-24 bg-gray-200 rounded"></div>
                <div className="h-6 w-6 bg-blue-200 rounded-full"></div>
              </div>
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 bg-yellow-200 rounded-full"></div>
              </div>
              <div className="h-3 w-full bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-full bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-2/3 mx-auto bg-gray-200 rounded"></div>
            </div>
            
            {/* Certificate locked overlay */}
            <div className="absolute inset-0 bg-white bg-opacity-60 rounded-lg flex flex-col items-center justify-center">
              <div className="bg-white rounded-full p-2 shadow-md mb-2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-xs text-gray-500">Unlocks at 100% completion</span>
            </div>
          </div>
          
          {/* Action button */}
          <button 
            className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                      text-white py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg
                      flex items-center justify-center ${isHovering ? 'translate-y-0' : 'translate-y-0'}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            Continue Learning
            <ChevronRight className={`ml-1 transition-transform ${isHovering ? 'translate-x-1' : 'translate-x-0'}`} size={18} />
          </button>
          
          {/* Bottom note */}
          <div className="mt-5 flex justify-center items-center">
            <div className="flex items-center text-xs text-gray-500">
              <div className="flex h-4 items-center mr-1">
                <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22a10 10 0 100-20 10 10 0 000 20zm0-18a8 8 0 110 16 8 8 0 010-16zm-1 5a1 1 0 112 0v5a1 1 0 01-2 0V9zm1-3a1 1 0 100 2 1 1 0 000-2z"/>
                </svg>
              </div>
              Your progress is automatically saved
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
