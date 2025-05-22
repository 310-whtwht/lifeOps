import { JournalForm } from "@/components/journal/JournalForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata = {
  title: "ジャーナル編集 | LifeOps",
  description: "ジャーナルの詳細を編集します",
};

export default async function EditJournalPage({ params }: Props) {
  const resolvedParams = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900">日誌編集</h1>
        <div className="mt-8 max-w-3xl">
          <JournalForm entryId={resolvedParams.id} />
        </div>
      </div>
    </div>
  );
}
