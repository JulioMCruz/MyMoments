'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import sdk from '@farcaster/frame-sdk';

// import Landing from '@/components/Landing';

const Landing = dynamic(() => import('@/components/Landing'), {
  ssr: false,
});

export default function Home() {

  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);  
  return (
    <main className="flex flex-col p-4">
      {/* <Demo /> */}
      <Landing />
    </main>
  );
}