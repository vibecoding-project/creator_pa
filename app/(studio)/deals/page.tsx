import { getDeals } from "@/app/actions/deals";
import { DealsView } from "@/components/deals/deals-view";

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const { new: isNew } = await searchParams;
  const deals = await getDeals();
  return <DealsView autoOpenNew={isNew === "1"} initialDeals={deals} />;
}
