'use client';

import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import type { FormEvent, DragEvent } from 'react';
import type { BlobResult } from '@vercel/blob';

export default function Home() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<BlobResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const submitStatsFile = async (e: FormEvent<HTMLFormElement>) => {
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

  const handleDrag = (e: DragEvent | MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // at least one file has been dropped so do something
      // handleFiles(e.dataTransfer.files);
      submitStatsFile(e as any);
    }
  };

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <form
        action="/api/upload"
        method="POST"
        encType="multipart/form-data"
        onSubmit={submitStatsFile}
        onClick={openDialog}
        onDragEnter={handleDrag}
        onDrop={handleDrop}
        className={clsx(
          'flex flex-col items-center justify-center w-96 h-96 border-2 border-dashed rounded-lg',
          { 'bg-blue-300': dragActive },
        )}
      >
        <p className="text-2xl font-bold text-center">Drag & Drop</p>
        <p className="text-xl text-center my-2">Or</p>
        <button className="px-4 py-2 text-lg font-bold text-white bg-blue-700 rounded-lg">
          Browse
        </button>
        <input ref={fileRef} type="file" name="file" id="file" className="hidden" />
        <p className="mt-4 text-xl text-center">in-it stats file</p>
        {blob ? (
          <div>
            Blob url: <a href={blob.url}>{blob.url}</a>
          </div>
        ) : null}
        {dragActive && (
          <div
            className="fixed w-full h-full top-0 left-0 right-0 bottom-0"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          ></div>
        )}
      </form>
    </main>
  );
}
