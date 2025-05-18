import { Label } from '@radix-ui/react-label';
import { Separator } from '@radix-ui/react-separator';
import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { createCommunity } from '@/app/action';
export default function SubredditPage() {
  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="bg-white p-8 shadow-lg rounded-lg"> 
     <form action={createCommunity} className="space-y-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Create Community</h1>

          <Separator className="my-4" />

          <div>
            <Label htmlFor="community-name" className="text-lg font-semibold text-gray-700">
              Community Name
            </Label>
            <p className="text-sm text-gray-500 mt-2">
              Community names, including capitalization, cannot be changed!
            </p>
            
          </div>

          {/* Optional: Add description */}
          <div className='relative mt-3'>
           <p className='absolute left-0 w-8 flex items-center justify-center h-full text-muted-foreground'>  r/ </p>
         <input
              id="community_name"
              name="community_name"
              type="text"
             
              className="pl-6 mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
           />
          </div>



<div className='w-full flex mt-5 gap-x-5 justify-end'>  
      
         <Button type='submit'>Create</Button> 

         <Button asChild variant={'secondary'}>
          <Link href="/">Cancel</Link>
          </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
