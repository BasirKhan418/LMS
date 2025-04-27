'use client'

import { useEffect } from 'react'

export default function RazorpayIntegration({ children }) {
  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    
    return () => {
      // Clean up
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  return <>{children}</>
}