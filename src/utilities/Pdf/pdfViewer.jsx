
import { Button } from "@/components/ui/button"
import Link from "next/link"
export default function pdfViewer({content}) {
  return (
    <div className="flex flex-col items-center justify-center bg-background">
      <div className="w-full  rounded-lg overflow-hidden shadow-lg lg:w-[78vw] h-full">
        <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Notes For - {content.name}</h2>
          <div className="flex items-center gap-4">
           <Link href={`${content.link}`} target="_blank"> <Button variant="ghost" size="icon">
              <MaximizeIcon className="w-5 h-5" />
              <span className="sr-only">Fullscreen</span>
            </Button></Link>
          </div>
        </div>
        <div className="h-[80vh] w-full overflow-auto">
          <iframe src={content.link} className="w-full h-full" frameBorder="0" />
        </div>
      </div>
    </div>
  )
}

function MaximizeIcon(props) {
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
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  )
}


function XIcon(props) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}