import { BookX } from 'lucide-react'

export function NoCoursesBanner() {
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
      <BookX className="w-16 h-16 text-gray-400 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Courses Found</h2>
      <p className="text-gray-600">Check back later for new course offerings.</p>
    </div>
  )
}
