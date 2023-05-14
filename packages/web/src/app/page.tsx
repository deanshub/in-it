'use client';

import { useRef, useState } from 'react';
import type { BlobResult } from '@vercel/blob';

export default function Home() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<BlobResult | null>(null);

  const submitStatsFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const blob = (await response.json()) as BlobResult;
    setBlob(blob);
  };

  const openDialog = () => {
    fileRef.current?.click();
  };

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <form
        action="/api/upload"
        method="POST"
        encType="multipart/form-data"
        onSubmit={submitStatsFile}
        onClick={openDialog}
        className="flex flex-col items-center justify-center w-96 h-96 border-2 border-dashed rounded-lg"
      >
        <p className="text-2xl font-bold text-center">Drag & Drop</p>
        <p className="text-xl text-center my-2">Or</p>
        <button className="px-4 py-2 text-lg font-bold text-white bg-blue-500 rounded-lg">
          Browse
        </button>
        <input ref={fileRef} type="file" name="file" id="file" className="hidden" />
        <p className="mt-4 text-xl text-center">in-it stats file</p>
        {blob ? (
          <div>
            Blob url: <a href={blob.url}>{blob.url}</a>
          </div>
        ) : null}
      </form>
    </main>
  );
}
