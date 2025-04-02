
"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import MuxPlayer from '@mux/mux-player-react';
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CourseData } from "../../../../functions/Coursedata"
import { Toaster,toast } from "sonner"
import UploadModal from "@/utilities/Course/UploadModal"
import ProfielSpinner from "@/utilities/Spinner/ProfielSpinner"
import MuxGetUrlFunc from "@/app/server/Mux";
import { FetchAsset,FetchAssetDetails } from "@/app/server/FetchMux";
import axios from "axios"
export default function Component() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [courseDatas, setCourseDatas] = useState([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadModal, setUploadModal] = useState(false)
  const [videodata,setVideoData] = useState([])
  const [loading,setLoading] = useState(false)
  const [previewModal, setPreviewModal] = useState(false)
  const [previewVideo, setPreviewVideo] = useState(null)
  //fetch all course data
  const fethcourseData = async()=>{
    let res = await CourseData();
    fetchVideoData(res.data[0]._id)
    setCourseDatas(res.data)
  }
  //fetch all video data
    const fetchVideoData = async(id)=>{
        setLoading(true)
        const res = await fetch(`/api/addvideos?id=${id}`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "token":localStorage.getItem("dilmsadmintoken")
            },
        })
        const result = await res.json();
        setLoading(false)
        if(result.success){
            if(result.data.length==0){
                setVideoData([])
                toast.error("No video found in this category")
            }
            else{
                setVideoData(result.data[0].content)
            console.log(result.data[0].content)
            toast.success(result.message)
            }
        }
        else{
            toast.error(result.message)
        }
    }
  //useEffect

  useEffect(()=>{
 fethcourseData()
  },[])
  const [videocontent, setVideoContent] = useState(
    {
        title:"",
        description:"",
        folderid:""
    })
    const [video,setVideo] = useState("")
  //handle chneger
  const handleChanges = (e)=>{
    setVideoContent({
        ...videocontent,
        [e.target.name]:e.target.value
    })
  }
  //video onchnage
    const handleVideoChange = (e)=>{
        setVideo(e.target.files[0])
    }
    //update on database
    const updateondatabase = async(videoid,playbackid)=>{
        const name = courseDatas.find((item)=>item._id==videocontent.folderid)
       let data = {name:name.title,folderid:name._id,content:{...videocontent,videoid,playbackid}}
       console.log(data)
    const res = await fetch("/api/addvideos",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "token":localStorage.getItem("dilmsadmintoken")
        },
        body:JSON.stringify(data)
    })
    const result = await res.json();
    console.log(result)
    if(result.success){
        toast.success(result.message)
            setUploadModal(false)
            handleCloseModal()
            setVideoContent({
                title:"",
                description:"",
                folderid:""
            })
            setVideo("")
            setUploadProgress(0)
    }
    else{
        toast.error(result.message)
        setUploadModal(false)
        handleCloseModal()
        setVideoContent({
            title:"",
            description:"",
            folderid:""
        })
        setVideo("")
        setUploadProgress(0)
    }
    }
    //upload on mux
    const uploadvideo = async()=>{
        if(video==""){
          toast.error("Please select a video to upload")
          return
        }
        else{
        try {
          const [uploadUrl,upload] = await MuxGetUrlFunc();
    setUploadModal(true)
    // console.log('upload data:',upload)
    // setUploadModal(true)
    // let UploadUrl = upload.data.data.url
    const uploadVideo = await axios.put(uploadUrl, video, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentCompleted = Math.floor((loaded * 100) / total);
        setUploadProgress(percentCompleted);
        console.log('Upload progress:', percentCompleted);
      },
      
    });
   
    console.log('upload data asset:',upload)
     console.log('Video uploaded asset:', uploadVideo);

    const assetId = upload;
    console.log('Asset ID:', assetId);
    const [asset,assetid] = await FetchAsset(upload);

    console.log("assest is upload  asset",asset)
    //asset.data.data.asset_id
  const [dataid,playbackid] =await FetchAssetDetails(assetid);
      updateondatabase(dataid,playbackid);
        } catch (error) {
         toast.error("Something went wrong! try again later"+error)
        }
    }
      };
    //submit form

    const handleUpload = async(e)=>{
        e.preventDefault();
        if(videocontent.title==""||videocontent.description==""||videocontent.folderid==""){
            toast.error("Please fill all the fields")
            return;
        }
         uploadvideo()
    }
 
  const [showModal, setShowModal] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const handleVideoClick = (video) => {
    setSelectedVideo(video)
    setShowModal(true)
  }
  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedVideo(null)
  }
  return (
    <>
    {loading?<div className="flex justify-center items-center"><ProfielSpinner/></div>:<>
    <UploadModal open={uploadModal} setOpen={setUploadModal} progress={uploadProgress}/>
    <Toaster position='top-center' expand={false} />
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Video Gallery</h1>
        <Button size="sm" onClick={() => setShowModal(true)}>
          Upload Video
        </Button>
      </div>
      <Collapsible className="border rounded-lg overflow-hidden">
        <CollapsibleTrigger className="flex items-center justify-between bg-muted px-4 py-3 cursor-pointer">
          <div className="flex items-center gap-2">
            <FolderIcon className="w-5 h-5" />
            <span>Video Categories</span>
          </div>
          <ChevronDownIcon className="w-5 h-5 transition-transform [&[data-state=open]]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courseDatas.map((item)=>(<Button
                key={item._id}
                onClick={() =>{
                     setSelectedCategory(item._id)
                    fetchVideoData(item._id)
                    }}
                variant={selectedCategory == item._id ? "" : "outline"}
                className="justify-start gap-2"
              >
                <FolderIcon className="w-5 h-5" />
                <span>{item.title}</span>
              </Button>))}
            
          </div>
        </CollapsibleContent>
      </Collapsible>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
   
            {videodata&&videodata.map((item)=>(<div
             
              className="relative group overflow-hidden rounded-lg cursor-pointer"
              onClick={()=>{
                setPreviewModal(true)
                setPreviewVideo(item)
              }}
            >
              <img
                src={`https://image.mux.com/${item.playbackid}/thumbnail.png?width=214&height=121&time=2&fit_mode=preserve`}
                alt={video.title}
                width={400}
                height={225}
                className="w-full h-48 object-cover group-hover:opacity-50 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayIcon className="w-10 h-10 text-white" />
              </div>
              <div className="p-2">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              </div>
            </div>))}
            
          
      </div>
      {videodata.length==0&&<div className="flex justify-center items-center w-full h-full bg-muted/20 rounded-lg">
            
            <p>No video found in this category</p>
        </div>
            }
      <Dialog open={showModal} >
  <DialogContent className={"  "}>
      
      
        <div className="flex justify-center items-center ">
          <div className="bg-background p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Upload a Video</h2>
            <form onSubmit={handleUpload}>
              <div className="mb-4">
                <Label htmlFor="title">Title</Label>
                <Input id="title" type="text" name="title" onChange={handleChanges} placeholder="Enter video title" />
              </div>
              <div className="mb-4">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" onChange={handleChanges} placeholder="Enter video description" rows={3} />
              </div>
              <div className="mb-4">
                <Label htmlFor="category">Select Folder</Label>
                <select id="category" name="folderid" onChange={handleChanges} className="w-full p-2 border rounded-lg">
                <option value="">Select Folder</option>
                {courseDatas.map((item)=>(
                  <option value={item._id} key={item._id}>{item.title}</option>
                ))}
                </select>
              </div>
              <div className="mb-4">
                <Label htmlFor="file">Video File</Label>
                <Input id="file" type="file" onChange={handleVideoChange}/>
              </div>
              <div className="mb-4">
               
              </div>
              <div className="flex justify-end">
                <Button type="submit">Upload</Button>
                <Button variant="outline" onClick={handleCloseModal} className="ml-2" type="button">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      
  </DialogContent>
</Dialog>

      
    </div>
    </>}
    {/* preview video */}
    <Dialog open={previewModal}>
      <DialogContent className="sm:max-w-[700px] p-0">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-hidden rounded-t-xl">
          <MuxPlayer
  streamType="on-demand"
  playbackId={previewModal&&previewVideo.playbackid}
  metadataVideoTitle={previewModal&&previewVideo.title}
  metadataViewerUserId={previewModal&&previewVideo.description}
  poster={`https://image.mux.com/${previewModal&&previewVideo.playbackid}/thumbnail.png?width=214&height=121&time=2&fit_mode=preserve`}
  primaryColor="#FFFFFF"
  secondaryColor="#000000"
/>
          </div>
          <div className="bg-background px-6 py-8 rounded-b-xl">
            <div className="grid gap-4">
              <div>
                <h1 className="text-2xl font-bold">{previewModal&&previewVideo.title}</h1>
                <p className="text-muted-foreground">
                 {previewModal&&previewVideo.description}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Video ID</div>
                  <div>{previewModal&&previewVideo.videoid}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Playback ID</div>
                  <div>{previewModal&&previewVideo.playbackid}</div>
                </div>
              </div>
            </div>
            
          </div>
       
          <Button variant="" onClick={()=>{
            setPreviewModal(false)
            setPreviewVideo(null)
          }} className="" type="button">
                  Cancel
                </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
    
  )
}

function ChevronDownIcon(props) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}


function FolderIcon(props) {
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
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  )
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
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  )
}