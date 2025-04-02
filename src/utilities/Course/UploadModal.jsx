
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { GrInProgress } from "react-icons/gr";
import { useEffect, useState } from "react";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import { set } from "mongoose";
export default function UploadModal({open,setOpen,progress}) {
    const [con,setcon] =useState(false)
useEffect(()=>{
    if(progress=="100"){
        setcon(true)
       let a =  setTimeout(()=>{
            setcon(false)
        },1000)
    }
},[progress])
  return (
    <>

    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
      {con&&<Fireworks autorun={{ speed: 3 }} />}
        <div className="flex flex-col items-center justify-center gap-6 py-8">
          <div className="grid w-full gap-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Uploading video...</p>
              <p className="text-sm font-medium">{progress}%</p>
            </div>
            <Progress value={progress} aria-label="Video upload progress" />
          </div>
         { progress=="100"&&<div>
          <CircleCheckIcon className="size-12 text-green-500" />
          <p className="text-lg font-medium py-2">Congratulations!</p>
          <p className="text-muted-foreground ">Your video has been uploaded.</p>
          </div>}
  
         { progress!="100"&&<div>
  <GrInProgress className="h-8 w-8 text-blue-500 my-2" />
  <p className="text-lg font-medium">Uploading...</p>
  <p className="text-muted-foreground">Your video is currently being uploaded. Please wait. This may take some time .</p>
</div>}
        </div>
        <DialogFooter>
          <div>
            <Button type="button" onClick={()=>{
                setOpen(false)
            }}>Close</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}

function CircleCheckIcon(props) {
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
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}