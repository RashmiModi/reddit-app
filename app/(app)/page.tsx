// page.tsx
"use client";

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import Banner from "@/public/prod3.jpg";
import Banner2 from "@/public/prod2.jpg";
import Image from "next/image";

// Define the structure of a post
interface Post {
  id: string;
  title: string;
  imageString?: string; // Updated to match the Prisma model
  // Add other properties as needed
}

export default function Home() {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await fetch('/api/posts/recent');
        if (response.ok) {
          const posts = await response.json();
          console.log("posts-->", posts);
          setRecentPosts(posts);
        } else {
          console.error('Failed to fetch recent posts');
        }
      } catch (error) {
        console.error('Error fetching recent posts:', error);
      }
    };

    fetchRecentPosts();
  }, []);

  return (
    <div className="max-w-[2000px] mx-auto px-10 flex gap-x-8 mt-4">
      {/* Left Section */}
      <div className="w-[65%] flex flex-col gap-y-5">
        <h1 className="text-3xl font-bold">Popular Blog and Photo Post</h1>
        <p className="text-gray-600">
          “Smartphone city” will provide more active shots of people using their phones in urban settings. This indicates that your service connects to your users, no matter where they are.
          “Server room” is another shorthand for “data” images. This search gives you more realistic—but still high-tech—images, without relying too heavily on overlaid illustrations.
          With the focus on fashion, your models are not only perfectly dressed, but you’ll also see lots of images with large swaths of bold color. If you are looking for something gender-specific, you can always use Shutterstock’s People filter to narrow the results even more (though without refining, you may be able to cast a wider net for inclusivity for customers who want to see more non-binary models in marketing).
        </p>

        <h1 className="text-3xl font-bold">Recent Posts</h1>
        {recentPosts.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentPosts.map((post) => (
              <li key={post.id} className="border rounded-md overflow-hidden">
                <a href={`/posts/${post.id}`} className="block">
                  {post.imageString ? (
                    <Image
                      src={post.imageString}
                      alt={post.title}
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                  ) : (
                    <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Image not available</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-blue-600 hover:underline">
                      {post.title}
                    </h2>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent posts available.</p>
        )}
      </div>

      {/* Right Section */}
      <div className="w-[35%]">
        <Card>
          <Image src={Banner} alt="Banner" className="w-full h-50 object-cover rounded-t-md" />
        </Card>
        <Card>
          <Image src={Banner2} alt="Banner 2" className="w-full h-50 object-cover rounded-t-md" />
        </Card>
      </div>
    </div>
  );
}
