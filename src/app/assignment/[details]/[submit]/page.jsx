"use client";
import { use } from "react";
import SubmitAssignment from '@/utilities/Assignment/SubmitAssignment'
import useAuth from '../../../../../hooks/useAuth'
const page = props => {
  const params = use(props.params);
  const [data,loading] = useAuth();
  return (
    <div>
      <SubmitAssignment aid={params.submit} crid={params.details} id={data&&data._id}/>
    </div>
  )
}

export default page
