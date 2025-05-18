// app/r/[id]/createpost/page.tsx

import CreatePostLayout from './CreatePostLayout';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <CreatePostLayout id={id} />;
}


