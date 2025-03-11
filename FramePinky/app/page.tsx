'use client';

import dynamic from 'next/dynamic';

const Demo = dynamic(() => import('@/app/components/Demo'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col p-4">
      <Demo />
    </main>
  );
}