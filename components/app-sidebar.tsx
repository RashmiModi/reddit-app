"use client"
import * as React from "react"
import {  HomeIcon, Minus, Plus, TrendingUpIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import Image from "next/image"
import Link from "next/link"
import logo from "@/Images/logo.png"
import { useUser } from '@clerk/nextjs';

type SidebarData = {
  navMain: {
    title: string;
    url: string;
    items: {
      title: string;
      url: string;
      isActive: boolean;
    }[];
  }[];
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const userName = user?.firstName  || 'Guest';
   const encodedUserName = encodeURIComponent(userName);
   console.log("user-----> side bar",encodedUserName);

 

  const sidebarData: SidebarData = {
    navMain: [
      {
        title: "Communities",
        url: "",
        items: [
          {
            title: "Community",
            url: "/r/list",
            isActive: false,
          },
          {
            title: "My post",
            url: `/r/profile-page/${encodedUserName}`,
            isActive: false,
          },
        ],
      },
    ],
  };

  return (
    <Sidebar {...props} className="bg-red-200 w-2000 min-h-screen">
      <SidebarHeader className="sidebar-header">
        <SidebarMenu className="sidebar-header">
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="sidebar-item">
              <Link href="/">
                <Image src={logo} alt="logo" width={50} height={50} className="object-contain" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="p-5">
                {/*<create community button */}
              </SidebarMenuButton>

              <SidebarMenuButton asChild className="p-5 bg-red-500 text-white">
                <Link href="/">
                  <HomeIcon className="w-4 h-4 mr-2" /> Home
                </Link>
              </SidebarMenuButton>

              <SidebarMenuButton asChild className="p-5 bg-red-500 text-white">
                <Link href="/aboutus">
                  <TrendingUpIcon className="w-4 h-4 mr-2" /> About Us
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarMenu>
            {sidebarData.navMain.map((item, index) => (
              <Collapsible
                key={item.title}
                defaultOpen={index === 1}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      {item.title}{" "}
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={subItem.isActive}
                            >
                              <a href={subItem.url}>{subItem.title}</a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
