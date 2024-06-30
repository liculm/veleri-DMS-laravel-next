'use client'

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/hooks/auth";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

export default function Home() {
  const {isLoggedIn} = useAuth({middleware: 'guest'})
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn())
      router.push('/procedure')
    else
      router.push('/login')
  }, [])
}
