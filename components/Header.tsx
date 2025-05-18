"use client"

import {
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";


import full from "@/Images/full.png";
import logo from "@/Images/logo.png";
import Image from "next/image";
import { ChevronLeftIcon, MenuIcon } from "lucide-react";
import { useSidebar } from "./ui/sidebar";
import { useUser } from '@clerk/nextjs';
import Link from "next/link";
export default function Header() {
  const { toggleSidebar, open, isMobile } = useSidebar();
  const { user, isLoaded } = useUser();
  //const { signOut } = useClerk(); 

  if (!isLoaded) return null;
  //const isLoggedIn = !!user?.id;
  
  const userName = user?.fullName || user?.firstName || user?.primaryEmailAddress?.emailAddress || 'Guest';

  console.log("user----->",userName);
   
  
  return (
 <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white ">
  {/* Left side */}
  <div className="h-10 flex items-center ">
    {open && !isMobile ? (
      <ChevronLeftIcon onClick={toggleSidebar} className="w-6 h-6" />
    ) : (
      <div className="flex items-center gap-2">
      <MenuIcon onClick={toggleSidebar} className="w-6 h-6 cursor-pointer" />
   

    {/* Logo */}
    <Image
      src={full}
      alt="logo"
      width={100}
      height={40}
      className="hidden md:block"
    />

    <Image
      src={logo}
      alt="logo"
      width={40}
      height={40}
      className="block md:hidden"
    />
  </div>
 )}
 </div>
  {/* Right side - Auth Buttons */}
  <div className="flex items-center gap-4">
  <SignedIn>
    <UserButton />
    <span className="text-white px-4">Welcome, {userName}!</span>
  </SignedIn>

   <SignedOut>
      <div className="flex gap-4">
      
          <Link href="/sign-in">
          <button className="border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-blue-600">
            Sign In
          </button>
          </Link>
        
      
        
           <Link href="/sign-up">
          <button className="border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-blue-600">
            Sign Up
          </button>
          </Link>
     
      </div>
    </SignedOut>
</div>

</header>
  );
}

