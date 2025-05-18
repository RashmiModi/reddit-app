// app/r/[id]/createpost/CreatePostLayout.tsx

'use client';

import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import prod3 from '@/public/prod3.jpg';
import { Separator } from '@radix-ui/react-separator';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { UploadDropzone } from '@uploadthing/react';
import { TipTabEditor } from '@/components/ui/TipTabEditor';
import type { OurFileRouter } from '@/app/api/uploadthing/core';
import { useState } from 'react';
import { createPost } from '@/app/action';
import { JSONContent } from '@tiptap/react';

interface FileData {
  ufsUrl: string;
  serverData: { uploadedBy: string } | null;
}

type UploadResponse = FileData[];

const rules = [
  { id: 1, text: 'Be respectful and civil' },
  { id: 2, text: 'Be mindful of the content you post' },
  { id: 3, text: 'Be aware of the community guidelines' },
  { id: 4, text: 'Be respectful of the moderators' },
  { id: 5, text: 'Be aware of the content you post' },
];

export default function CreatePostLayout({ id }: { id: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [json, setJson] = useState<JSONContent | null>(null);
  const [title, setTitle] = useState<string>('');

  const createPostReddit = createPost.bind(null, { jsonContent: json });

  return (
    <div className="max-w-[1400px] mx-auto px-10 flex gap-x-8 mt-4">
      {/* Left Section */}
      <div className="w-2/3 flex flex-col gap-y-10">
        <h1 className="font-semibold">
          Subreddit:{' '}
          <Link href={`/r/${id}`} className="text-primary text-sm font-medium">
            r/{id}
          </Link>
        </h1>

        <Tabs defaultValue="post" className="w-full">
          <TabsList className="w-full justify-start border-b bg-transparent p-0">
            <TabsTrigger
              value="post"
              className="px-4 py-2 font-semibold text-muted-foreground border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground"
            >
              Post
            </TabsTrigger>
            <TabsTrigger
              value="image"
              className="px-4 py-2 font-semibold text-muted-foreground border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground"
            >
              Image & Video
            </TabsTrigger>
          </TabsList>
          <TabsContent value="post" className="mt-4">
            <Card className="flex flex-col p-4">
              <form action={createPostReddit} className="flex flex-col gap-y-4">
                <input type="hidden" name="imageUrl" value={imageUrl ?? ''} />
                <input type="hidden" name="subName" value={id ?? ''} />
                <CardHeader>
                  <label>Title</label>
                  <input
                    required
                    name="title"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <TipTabEditor setJson={setJson} json={json} />
                </CardHeader>
                <CardFooter>
                  <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
                    Create Post
                  </button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="image" className="mt-4">
            <Card className="flex flex-col p-4">
              <CardHeader>
                {imageUrl === null ? (
                  <UploadDropzone<OurFileRouter, 'imageUploader'>
                    endpoint="imageUploader"
                    onClientUploadComplete={(res: UploadResponse) => {
                      if (res && res.length > 0) {
                        setImageUrl(res[0].ufsUrl);
                      }
                    }}
                    onUploadError={(error: Error) => {
                      console.error('Upload error', error);
                    }}
                    className="ut-button:bg-primary ut-button:ut-readying:bg-primary/50 ut-label:text-primary ut-button:ut-uploading:bg-primary/50 ut-button:ut-uploading:after:bg-primary"
                  />
                ) : (
                  <Image src={imageUrl} alt="uploaded" width={200} height={200} />
                )}
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Section */}
      <div className="w-1/3">
        <Card className="flex flex-col p-5">
          <div className="flex items-center gap-x-4">
            <Image className="h-10 w-10" src={prod3} alt="new" />
            <h1 className="font-medium">Posting to reddit....</h1>
          </div>
          <Separator className="mt-2" />
          <div className="flex flex-col gap-y-5 mt-5">
            {rules.map((rule) => (
              <div key={rule.id}>
                <p className="text-sm font-medium">
                  {rule.id}. {rule.text}
                </p>
                <Separator className="mt-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
