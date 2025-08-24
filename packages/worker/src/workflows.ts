import { proxyActivities, defineSignal, defineQuery, setHandler, sleep } from "@temporalio/workflow";
import type * as activities from "./activities";

const a = proxyActivities<typeof activities>({ startToCloseTimeout: "1 minute" });

export const approvalSignal = defineSignal<[approved: boolean]>("approval");
export const managerSummaryQuery = defineQuery<string>("managerSummary");

export async function leadToQuote({ leadId, email }: { leadId: string; email: string; }) {
  let approved: boolean | null = null;
  setHandler(approvalSignal, (ok) => { approved = ok; });
  let summary = "Not ready";
  setHandler(managerSummaryQuery, () => summary);

  const enr = await a.enrichLead({ leadId });
  const sc = await a.scoreLead(enr);
  const price = await a.priceQuote({ enr, sc });

  // Simple policy gate (demo): if discount > 5, require approval
  if (price.requestedDiscountPercent > 5) {
    summary = `Awaiting approval for discount ${price.requestedDiscountPercent}%`;
    // Wait up to 14 days for approval
    const deadline = Date.now() + 14 * 24 * 3600 * 1000;
    while (approved === null && Date.now() < deadline) {
      await sleep(1000 * 60 * 5);
    }
    if (!approved) throw new Error("Discount not approved");
  }

  await a.sendQuoteEmail({ email, final: price.final });
  summary = `Quote sent to ${email} with ₹${price.final}`;
  return { ok: true };
}
