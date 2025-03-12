"use client"

// import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

import { useEffect, useCallback, useState } from 'react';
import sdk, { type FrameContext } from '@farcaster/frame-sdk';

export default function Header() {

  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();

  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <header className="w-full py-4 px-4 sm:px-6 header-footer-gradient text-white shadow-md bg-[#6d63fe]">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <Link href="/" className="flex items-center text-2xl font-bold sm:mb-0">
          <Image src="/assets/momentsLogo.png" alt="Moments Logo" width={64} height={64} className="mr-2" />
          <span className="text-white">Moments</span>
        </Link>
        {/* <div>
            <span className="text-sm text-white bg-opacity-20 px-3 rounded-full">{`Welcome ${context?.user.displayName}`}</span>
        </div> */}
      </div>
    </header>
  )
}

