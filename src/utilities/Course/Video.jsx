import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {FileText} from "lucide-react"
import { AiTwotoneLike,AiTwotoneDislike ,AiFillLike,AiFillDislike } from "react-icons/ai";
import MuxPlayer from '@mux/mux-player-react';
import { useEffect, useState } from "react"
import useAuth from "../../../hooks/useAuth"
import { Toaster,toast } from "sonner"
export default function VideoContent({content,allcoursedata,allComment,setAllComment, isAdminView}) {
  const [like,setLike] = useState(false)
  const [dislike,setDislike] = useState(false)
  const [data] = useAuth();
  const [description,setDescription] = useState("")
  const handleChange = (e)=>{
    setDescription(e.target.value)
  }
//handle submit
const handleCommentSubmit = async()=>{
  let commentdata = {name:content.name,comment:{name:data.name,comment:description,date:new Date(),img:data.img}}
  const res = await fetch("/api/comment",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "token":localStorage.getItem("dilmstoken")
    },
    body:JSON.stringify(commentdata)
  })
  const result = await res.json();
  if(result.success){
    setDescription("")
    toast.success(result.message)
    if(result.data&&result.data.comment!=null){
    setAllComment(result.data.comment)
    }
  }
  else{
    toast.error(result.message)
  }
}

  const handleLikeClick = () => {
    if (like) {
      setLike(false);
    } else {
      setLike(true);
      setDislike(false);
    }
  };

  const handleDislikeClick = () => {
    if (dislike) {
      setDislike(false);
    } else {
      setDislike(true);
      setLike(false);
    }
  };
  //calculate difference
  const getTimeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days >= 1 ? `${days} days ago` : 'less than 24 hours ago';
};

  return (
    <>
    <Toaster position='top-center' expand={false} />
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
      
    <div className="flex flex-col gap-6">
      <div className="rounded-lg overflow-hidden aspect-video w-full">
      <MuxPlayer
  streamType="on-demand"
  playbackId={content&&content.playbackid}
  metadataVideoTitle={content&&content.name}
  metadataViewerUserId={content&&content.description}
  primaryColor="#FFFFFF"
  poster={content&&content.poster}
  secondaryColor="#000000"
/>
      </div>
      <div className="bg-background rounded-lg p-6 shadow">
        <div className="flex items-start justify-between lg:flex-nowrap md:flex-nowrap flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">{content.name}</h1>
            <p className="text-muted-foreground mt-2">
              {content.description}
            </p>
          </div>
          <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleLikeClick}>
        {like ? <AiFillLike className="w-6 h-6" /> : <AiTwotoneLike className="w-6 h-6" />}
      </Button>
      <Button variant="ghost" size="icon" onClick={handleDislikeClick}>
        {dislike ? <AiFillDislike className="w-6 h-6" /> : <AiTwotoneDislike className="w-6 h-6" />}
      </Button>
            <Link href={`${content.videonotes&&content.videonotes}`} target="_blank">
            <Button variant="ghost" size="icon">
              <FileText className="w-5 h-5" />
            </Button>
            </Link> 
            
           <Link href={`${content.slide&&content.slide}`} target="_blank"><Button>Slides</Button></Link> 
          </div>
        </div>
      </div>
      <div className="bg-background rounded-lg p-6 shadow">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Comments</h2>
          <div className="flex gap-4">
            <Avatar className="w-10 h-10 border">
              <AvatarImage src={data&&data.img} />
              <AvatarFallback>{data&&data.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
  <Textarea 
    placeholder="Write your comment..." 
    className="resize-none h-32 w-full" // Increase height and set width to full
    onChange={handleChange} 
    value={description}
  />
  <div className="flex justify-end mt-2">
    <Button size="" onClick={handleCommentSubmit}  >Post</Button>
  </div>
</div>

          </div>
          <div className="flex flex-col gap-4">
          
          {allComment&&allComment.slice(0).reverse().map((item,index)=>(<div className="flex items-start gap-4 py-4 shadow px-4 rounded" key={index}>
              <Avatar className="w-10 h-10 border">
                <AvatarImage src={item.img} />
                <AvatarFallback>{item.name[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{getTimeAgo(item.date)}</div>
                </div>
                <p className="text-muted-foreground">
                  {item.comment}
                </p>
              </div>
            </div>))}
          </div>
        </div>
      </div>
    </div>
    <div className="bg-background rounded-lg p-6 shadow ">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Related Courses</h2>
        <div className="flex flex-col justify-center items-center flex-wrap">
          {allcoursedata && allcoursedata.map((item) => (
            <div className="bg-muted/20 rounded-lg p-4" key={item._id}>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-shrink-0 rounded-lg overflow-hidden w-[100px] h-[100px] mx-auto sm:mx-0">
                  <img src={item.img} alt="Course Thumbnail" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="text-muted-foreground">
                    {item.desc.length > 100 ? `${item.desc.slice(0, 100)}...` : item.desc}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="ghost" size="icon">
                      <AiTwotoneLike className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <AiTwotoneDislike className="w-5 h-5" />
                    </Button>
                    <Link href="/allcourses" target="_blank">
                      <Button variant="ghost" size="icon">
                        <ShareIcon className="w-5 h-5" />
                      </Button>
                    </Link>
                    <Link href="/allcourses" target="_blank">
                      <Button>View Now</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  </>
  )
}

function ShareIcon(props) {
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
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  )
}


function ThumbsDownIcon(props) {
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
      <path d="M17 14V2" />
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
    </svg>
  )
}


function ThumbsUpIcon(props) {
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
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  )
}