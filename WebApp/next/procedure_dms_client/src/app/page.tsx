'use client'

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/hooks/auth";

export default function Home() {
  const {isLoggedIn} = useAuth({middleware: 'guest'})
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn())
      router.push('/dashboard')
    else
      router.push('/login')
  }, [])
}
