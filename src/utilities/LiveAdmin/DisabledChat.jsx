import { useState } from "react";
import { AlertCircle, MessageSquareOff } from "lucide-react";

export default function DisabledChat() {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b pb-3 mb-4">
        <h3 className="font-semibold flex items-center text-lg">
          <MessageSquareOff className="h-5 w-5 mr-2 text-gray-500" />
          Chat Disabled
        </h3>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-full p-6 mb-4">
          <AlertCircle className="h-10 w-10 text-amber-500" />
        </div>
        
        <h4 className="text-xl font-semibold mb-2">Chat is currently disabled</h4>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          The instructor has temporarily disabled the chat for this session.
        </p>
        
        {!expanded ? (
          <button 
            onClick={() => setExpanded(true)}
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
          >
            Learn more
          </button>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="mb-2">
              Chat may be disabled for several reasons:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>To minimize distractions during important content</li>
              <li>To improve focus during demonstrations</li>
              <li>When presenting sensitive material</li>
            </ul>
            <p>
              The instructor will re-enable chat when appropriate.
            </p>
            <button 
              onClick={() => setExpanded(false)}
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium mt-3 block"
            >
              Show less
            </button>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="border-t mt-4 pt-3 text-center text-sm text-gray-500">
        Chat will be available again when enabled by the instructor
      </div>
    </div>
  );
}