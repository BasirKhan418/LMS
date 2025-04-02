
import { BookX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from "next/link"
export function NotEnrolled() {
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
      <BookX className="w-16 h-16 text-gray-400 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        You Are Not Enrolled in Any Course
      </h2>
      <p className="text-gray-600 text-center">
        Enroll in a course now to continue your learning journey and explore new opportunities!
      </p>
      <Link href="/allcourses"><Button className="mt-4">Explore Courses</Button></Link>
    </div>
  );
}
