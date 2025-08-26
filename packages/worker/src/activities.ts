// import axios from "axios";

// export async function enrichLead({ leadId }: { leadId: string }) {
//   // stub enrichment
//   return { leadId, company: "ACME", scoreSignals: { size: 200 } };
// }

// export async function scoreLead(input: any) {
//   // call RAG service or LLM if needed
//   return { score: 0.72, risks: ["budget"] };
// }

// export async function priceQuote(_: any) {
//   return { base: 100000, requestedDiscountPercent: 4, final: 96000 };
// }

// export async function sendQuoteEmail({ email, final }: { email: string, final: number }) {
//   console.log(`Emailing ${email} with price ₹${final}`);
//   return true;
// }


import axios from "axios";

// Make sure all functions are exported
export async function enrichLead({ leadId }: { leadId: string }) {
  // stub enrichment
  console.log("🔍 Enriching lead:", leadId);
  return { leadId, company: "ACME", scoreSignals: { size: 200 } };
}

export async function scoreLead(input: any) {
  // call RAG service or LLM if needed
  console.log("📊 Scoring lead:", input);
  return { score: 0.72, risks: ["budget"] };
}

export async function priceQuote(input: any) {
  console.log("💰 Pricing quote for:", input);
  return { base: 100000, requestedDiscountPercent: 4, final: 96000 };
}

export async function sendQuoteEmail({ email, final }: { email: string, final: number }) {
  console.log(`📧 Emailing ${email} with price ₹${final}`);
  // Here you could integrate with actual email service
  return { success: true, emailSent: true };
}