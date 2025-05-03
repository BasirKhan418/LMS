"use client"
import React, { use } from 'react';
import UserAssignment from '@/utilities/Assignment/UserAssignment'
import useAuth from '../../../../hooks/useAuth';
const page = props => {
  const params = use(props.params);
  const [data,loading] = useAuth();
  return (
    <div>
      <UserAssignment id={params.details} userid={data&&data._id}/>
    </div>
  )
}

export default page
