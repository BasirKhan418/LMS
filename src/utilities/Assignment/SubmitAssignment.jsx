"use client"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState,useEffect } from "react"
import { Toaster,toast } from "sonner"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/navigation"
export default function SubmitAssignment({aid,crid,id}) {
    const [data,setData] = useState(null);
    const [loading,setLoading] = useState(false);
    const [response,setResponse] = useState("")
    const [submitted,setSubmitted] = useState(false);
    const router = useRouter();
    //handle change in response
    const handleChange = (e)=>{
        setResponse(e.target.value)
        localStorage.setItem(`${aid}Response`,e.target.value);
    }
    const fetchAssignment = async()=>{
        try{
            setLoading(true);
            const response = await fetch(`/api/getassignment?id=${aid}`,{
                method:"GET",
                headers:{
                    "content-type":"application/json",
                    "token":localStorage.getItem("dilmstoken")
                }
            })
            const res = await response.json();
            console.log(res)
            setLoading(false);
            if(res.success){
                setData(res.data);
               
            }
            else{
                setData(null)
                toast.error(res.message)
            }
        }
        catch(err){
            setLoading(false);
            setData(null)
        }
    }

    const handleContextMenu = (event) => {
      event.preventDefault(); // Prevent the default right-click context menu
    };

    useEffect(()=>{
        fetchAssignment();
       if(localStorage.getItem(`${aid}Response`)){
        setResponse(localStorage.getItem(`${aid}Response`));
       }
        window.addEventListener('contextmenu', handleContextMenu);
      
        return () => {
       
          window.removeEventListener('contextmenu', handleContextMenu);
        };
        
    },[])
  //handleSubmit Assignment
  const handleSubmit = async()=>{
    if(response.length<10){
        return toast.error("Assignment content too short or empty to submit")
    }
    console.log(data[0].duedate);
    if(Date.now() > new Date(data[0].duedate)){
        return toast.error("Assignment deadline has passed. You can't submit this assignment anymore! Please contact your instructor for more information.")
    }
    setLoading(true);
    const res = await fetch("/api/submitassignment",{
        method:"POST",
        headers:{
            "content-type":"application/json",
            "token":localStorage.getItem("dilmstoken"),
        },
        body:JSON.stringify({
            asid:aid,
            crid:crid,
            userid:id,
            response:response
        })
    })
    let result = await res.json();
    setLoading(false);
    if(result.success){
        toast.success(result.message)
        localStorage.removeItem(`${aid}Response`);
        setSubmitted(true);
    }
    else{
        toast.error(result.message)
        localStorage.removeItem(`${aid}Response`);
    }
  }
  const handleShare = () => {
    const url = encodeURIComponent('https://devsomeware.com'); // Replace with your URL

    const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}`;

    window.open(linkedInUrl, '_blank');
  };
  console.log(id);
  return (
    <>
    <Head>

  <title>Assignment Page For : {data&&data[0].title}</title>
      </Head>
    <Toaster position="top-center" expand={"false"}/>
   {!submitted&& <>
    
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen w-full">
      <div className="bg-background rounded-lg border p-6 flex flex-col gap-4 dry">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">Assignment: {data&&data[0].title}</h2>
            <p className="text-sm text-muted-foreground">Assignment ID: {aid}</p>
          </div>
          <div className="bg-muted rounded-full w-8 h-8 flex items-center justify-center">
            <ClockIcon className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
        <div className="prose text-muted-foreground flex-1">
          <p>{data&&data[0].desc}</p>
         
        </div>
        <div className="bg-muted rounded-md p-4">
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
      <iframe 
        src={data&&data[0].link} 
        width="100%" 
        height="500px" 
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: '0' }}
        onError={(e) => {
          e.target.style.display = 'none';
          // Optionally display an error message or a fallback
          console.error('Error loading iframe');
        }}
      ></iframe>
    </div>
            <h3 className="text-lg font-semibold">Instructions</h3>
            <ul className="list-disc list-inside">
                <li>Do not copy from the internet</li>
                <li>Do not share your solution with others</li>
                <li>Submit your solution before the deadline</li>
                <li>Do not submit multiple times</li>   
                <li>Do not submit incomplete solution</li>
            
            </ul>
        </div>
      </div>
      <div className="bg-background rounded-lg border p-6 flex flex-col gap-4">
        <Textarea
          className="flex-1 resize-none p-4 rounded-md border border-input shadow-sm"
          placeholder="Write your solution here..."
          onChange={handleChange}
          value={response}
          onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
        />
        <div className="flex justify-start gap-2">
          <Button variant="ghost" onClick={()=>{
            router.back();
          }}>Cancel</Button>
          <Button onClick={handleSubmit}>{loading?"Analyzing.....":"Submit"}</Button>
        </div>
      </div>
    </div>
    </>}
    {
      submitted&&<div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <CalendarIcon className="mx-auto h-16 w-16 text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Congratulations!</h1>
        <p className="mt-4 text-muted-foreground">You've successfully submitted your assignment. Great work!</p>
        <div className="mt-6 flex justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            prefetch={false}
          >
            Go to Dashboard
          </Link>
          <Button onClick={handleShare} className="mx-4">
            Share on LinkedIn
          </Button>
        </div>
      </div>
    </div>
    }
    </>
  )
}

function ClockIcon(props) {
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
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
function CalendarIcon(props) {
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
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
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