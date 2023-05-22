'use client';

import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { FormEvent, DragEvent } from 'react';

// import type { BlobResult } from '@vercel/blob';

export default function Home() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  // const [blob, setBlob] = useState<BlobResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  const submitStatsFile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(formRef.current!);
      if (user?.email) {
        formData.append('userEmail', user.email);
      }
      if (user?.name) {
        formData.append('userName', user?.name);
      }
      // TODO: extend the type of user to include id
      // @ts-expect-error-next-line
      if (user?.id) {
        // @ts-expect-error-next-line
        formData.append('githubUsername', user?.id);
      }

      const response = await fetch('/api/stats', {
        method: 'POST',
        body: formData,
      });
      // const blob = (await response.json()) as BlobResult;
      // setBlob(blob);
      const result = await response.json();
      console.log(result);
      router.push(result.url);
    } catch (error) {
      console.error(error); // TODO: hanldle error in UI
    } finally {
      setLoading(false);
    }
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

  const fileChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // at least one file has been dropped so do something
      // handleFiles(e.target.files);
      submitStatsFile(e as any);
    }
  };

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <form
        action="/api/stats"
        ref={formRef}
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
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <label>loading...</label>
          </div>
        ) : (
          <>
            <p className="text-2xl font-bold text-center">Drag & Drop</p>
            <p className="text-xl text-center my-2">Or</p>
            <button className="px-4 py-2 text-lg font-bold text-white bg-blue-700 rounded-lg">
              Browse
            </button>
            <input
              ref={fileRef}
              type="file"
              name="file"
              id="file"
              className="hidden"
              onChange={fileChanged}
            />
            <p className="mt-4 text-xl text-center">in-it stats file</p>
            {/* {blob ? (
              <div>
                Blob url: <a href={blob.url}>{blob.url}</a>
              </div>
            ) : null} */}
            {dragActive && (
              <div
                className="fixed w-full h-full top-0 left-0 right-0 bottom-0"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              />
            )}
          </>
        )}
      </form>
    </main>
  );
}
