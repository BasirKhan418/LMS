"use client";
import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, BarChart3, Clock, User, BookOpen, AlertTriangle, Loader2 } from 'lucide-react';

const AttendanceView = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('All');
   //fetch user first
   const validatefun = async()=>{
    try{
        setIsLoading(true);
        const response = await fetch("/api/homeauth",{
         method:"POST",
         headers:{
           "content-type":"application/json",
           "token":localStorage.getItem("dilmstoken")
         }
        })
       const res = await response.json();
       console.log(res)
        setIsLoading(false);
       if(res.success){

       fetchAttendanceData(res.batch._id,res.user._id,res.user.month)
      
       }
       else{
         console.log(res.message)
       }
    }
    catch(err){
     setIsLoading(false);
      
    }
  
 }
  //getch attandance data from API
  const fetchAttendanceData = async (batchid,userid,duration) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/attendance',{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
              "Authorization": localStorage.getItem("dilmstoken")
          },
            body: JSON.stringify({ batchid, userid, duration })
        });
      const mockResponse = await res.json(); // Simulate API response
      console.log("mockResponse",mockResponse)
      if(mockResponse.success) {
        setAttendanceData(mockResponse);
      }
      else{
        setAttendanceData({});
      }
      
      setIsLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch attendance data");
      setIsLoading(false);
    }
  };
  useEffect(() => {
    // Simulating API fetch - in real implementation, replace with actual API call
    

    validatefun();
  }, []);

  // Function to determine if a user was present in a class
  const isUserPresent = (classData) => {
    if (!attendanceData || !attendanceData.userAttendance) return false;
    return classData.users.includes(attendanceData.userAttendance.userId);
  };
  
  // Get classes for the selected duration
  const getFilteredClasses = () => {
    if (!attendanceData || !attendanceData.data) return [];
    if (selectedDuration === 'All') {
      return attendanceData.data;
    }
    return attendanceData.data.filter(item => item.duration === selectedDuration);
  };
  
  // Group classes by weekname
  const groupByWeek = () => {
    const filtered = getFilteredClasses();
    const grouped = {};
    
    filtered.forEach(classItem => {
      if (!grouped[classItem.weekname]) {
        grouped[classItem.weekname] = [];
      }
      grouped[classItem.weekname].push(classItem);
    });
    
    return grouped;
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex justify-center items-center p-4">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 text-blue-600 animate-spin" />
          <h2 className="mt-4 text-xl font-semibold text-gray-700">Loading your attendance data...</h2>
          <p className="mt-2 text-gray-500">This will just take a moment</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex justify-center items-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-800">Oops! Something went wrong</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  // No data state
  if (!attendanceData || !attendanceData.userAttendance) {
    return (
      <div className="bg-gray-50 min-h-screen flex justify-center items-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
            <Calendar className="h-8 w-8 text-yellow-600" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-800">No Attendance Data</h2>
          <p className="mt-2 text-gray-600">We couldn't find any attendance records for you.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }
  
  const { userAttendance } = attendanceData;
  const { totalClasses, attendedClasses, attendancePercentage } = userAttendance;
  const weeklyClasses = groupByWeek();
  
  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with stats */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6 mb-6 overflow-hidden">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
              <User className="mr-2" size={24} />
              Attendance Dashboard
            </h1>
            <p className="text-blue-100 mb-6">Track your class attendance and performance</p>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Overall Attendance Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-white">
                    <BarChart3 size={20} className="mr-2" />
                    <span className="font-medium">Overall</span>
                  </div>
                  <span className="text-sm text-blue-100">{attendedClasses}/{totalClasses}</span>
                </div>
                <div className="mt-3 text-3xl font-bold text-white">{attendancePercentage}%</div>
                <div className="mt-3 w-full bg-black/20 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      attendancePercentage >= 75 ? 'bg-green-400' : 
                      attendancePercentage >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${attendancePercentage}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Classes Delivered Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="flex items-center text-white mb-2">
                  <BookOpen size={20} className="mr-2" />
                  <span className="font-medium">Total Classes</span>
                </div>
                <div className="text-3xl font-bold text-white">{totalClasses}</div>
              </div>
              
              {/* Classes Attended Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="flex items-center text-white mb-2">
                  <CheckCircle size={20} className="mr-2" />
                  <span className="font-medium">Attended</span>
                </div>
                <div className="text-3xl font-bold text-white">{attendedClasses}</div>
              </div>
              
              {/* Absence Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="flex items-center text-white mb-2">
                  <XCircle size={20} className="mr-2" />
                  <span className="font-medium">Missed</span>
                </div>
                <div className="text-3xl font-bold text-white">{totalClasses - attendedClasses}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Duration Filter */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-6">
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div className="flex items-center mb-2 md:mb-0">
              <Clock size={20} className="mr-2 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">Duration Filter</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDuration('All')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedDuration === 'All' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {attendanceData.fetchedDurations.map(duration => (
                <button
                  key={duration}
                  onClick={() => setSelectedDuration(duration)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedDuration === duration 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {duration}
                </button>
              ))}
            </div>
          </div>
          
          {selectedDuration !== 'All' && userAttendance.attendanceByMonth[selectedDuration] && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <span className="text-sm font-medium text-gray-700 mb-2 sm:mb-0">
                  {selectedDuration} Attendance: 
                </span>
                <div className="flex items-center">
                  <div className="bg-blue-600 text-white text-lg font-bold px-3 py-1 rounded-lg mr-3">
                    {userAttendance.attendanceByMonth[selectedDuration].attendancePercentage}%
                  </div>
                  <span className="text-sm text-gray-600">
                    ({userAttendance.attendanceByMonth[selectedDuration].attendedClasses}/
                    {userAttendance.attendanceByMonth[selectedDuration].totalClasses} classes)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Week-wise Attendance */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-6">
          <div className="flex items-center mb-6">
            <Calendar size={20} className="mr-2 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Week-wise Attendance</h2>
          </div>
          
          {Object.keys(weeklyClasses).length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
                <Calendar className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-700">No attendance data available</h3>
              <p className="mt-2 text-gray-500">There's no data available for the selected duration.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(weeklyClasses).map(([weekName, classes]) => (
                <div key={weekName} className="border border-gray-100 rounded-xl p-4 hover:border-blue-200 transition-colors">
                  <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                    <Calendar size={16} className="mr-2 text-blue-600" />
                    {weekName}
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gray-50 rounded-lg">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-l-lg">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Duration
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-r-lg">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {classes.map((classItem) => {
                          const present = isUserPresent(classItem);
                          const date = new Date(classItem.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          });
                          
                          return (
                            <tr key={classItem._id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                {date}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                {classItem.duration}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                {present ? (
                                  <span className="px-3 py-1 inline-flex items-center text-xs font-medium rounded-full bg-green-100 text-green-800">
                                    <CheckCircle size={14} className="mr-1" />
                                    Present
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 inline-flex items-center text-xs font-medium rounded-full bg-red-100 text-red-800">
                                    <XCircle size={14} className="mr-1" />
                                    Absent
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceView;