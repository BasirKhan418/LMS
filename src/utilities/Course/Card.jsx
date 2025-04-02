
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export default function Component({title,description,progress,duration,validity,img,skills,isadmin,assignment}) {
 
  return (
    <Card className="w-full max-w-sm rounded-lg overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl p-2 my-2 md:mx-2 xl:mx-2 mx-0 lg:mx-2">
      <div className="relative">
        <img
          src={img}
          alt="Course Thumbnail"
          width={500}
          height={300}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4 space-x-2">
          <Badge variant="outline" className="bg-primary text-primary-foreground">
            {duration}
          </Badge>
          
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant="outline" className="bg-black text-primary-foreground">
            Accredited
          </Badge>
        </div>
      </div>
      <div className="p-6 bg-background">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
         <div className="mb-4">
         { !isadmin&&!assignment&&<><Progress value={progress} aria-label="75% complete" />
          <div className="flex items-center justify-between mt-2 ">
      { !assignment&&<span className="text-muted-foreground text-sm">{progress}% complete</span>}
            <span className="text-muted-foreground text-sm">Valid for {validity} year</span>
          </div></>}
          <div className="flex items-center justify-between mt-2 flex-wrap">
          {skills.split(",").map((item,index)=>(<Badge variant="outline" className="bg-secondary text-secondary-foreground my-1" key={index}>
            {item}
          </Badge>))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          {isadmin&&<Button>Add Now</Button>}
          {!isadmin&&!assignment&&<Button>View Now</Button>}
          {assignment&&<Button>View Assignment</Button>}
          <div className="flex items-center gap-2">
            <StarIcon className="w-5 h-5 text-yellow-500" />
            <span className="text-muted-foreground text-sm">4.8</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

function StarIcon(props) {
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}