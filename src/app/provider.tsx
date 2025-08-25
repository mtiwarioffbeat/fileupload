'use client'
import React, { useEffect } from 'react'
import { Provider } from "react-redux";
import { store } from '@/redux/store'
import { redirect } from 'next/navigation';

export default function Providers({children}:{children:React.ReactNode})  {
    // useEffect(()=>{
    //    return  redirect('/auth/signup')
    // },[])
  return (
     <Provider store={store}>
        {children}
     </Provider>
  )
}

