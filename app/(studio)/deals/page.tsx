import { DealsView } from "@/components/deals/deals-view";

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const { new: isNew } = await searchParams;
  return <DealsView autoOpenNew={isNew === "1"} />;
}
