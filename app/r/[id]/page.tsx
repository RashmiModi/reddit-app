// app/r/[id]/SubRedditContent.tsx

import CommunityInfo from "@/app/r/[id]/communityInfo";
import { getSubReddit } from "@/app/r/[id]/subredditService";

/*export async function getSubReddit(name: string) {
  const data = await prisma.subreddit.findFirst({
    where: {
      name: {
        equals: name,        
      },
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      description: true,
      userId: true,
    },
  });
console.log("Subreddit data in getSubReddit:", data);
  return data;
}

*/




export default async function SubRedditContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  console.log("Subreddit name from params:", params);
  console.log("Subreddit name:", id);
  const data = await getSubReddit(id);

  if (!data) return <div>Subreddit not found</div>;

  const safeData = {
    ...data,
    createdAt: data.createdAt.toISOString(),
  };

  return (
   <div className="max-w-[2500px] mx-auto flex flex-center gap-x-2 mt-4">
  <CommunityInfo data={safeData} />
</div>
  );
}