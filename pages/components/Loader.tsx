"use client";

import { useEffect } from 'react'

export default function Loader({color,size}:any) {
    useEffect(() => {
        async function getLoader() {
            const { quantum } = await import('ldrs')
            quantum.register()
        }
        getLoader()
    }, [])
    return <l-quantum
      size={size}
      speed="1.10"
      color={color}
    ></l-quantum>
}

