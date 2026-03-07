import { Format, Tone, ProductDomain } from './types';

export const INTERNAL_FORMAT_IDS = ['CL', 'INV', 'QS', 'CF'];

export const MODEL_COSTS = {
  lite: 0.0004,
  standard: 0.0031,
  pro: 0.0420
};

export const USD_TO_MYR_RATE = 4.45;

/**
 * Learned from Stripe Documentation Index (llms.txt)
 */
export const VERIFIED_DOC_ROOTS: Record<string, string[]> = {
  PAYMENTS: [
    'https://docs.stripe.com/payments',
    'https://docs.stripe.com/checkout',
    'https://docs.stripe.com/elements',
    'https://docs.stripe.com/link',
    'https://docs.stripe.com/terminal',
    'https://docs.stripe.com/radar'
  ],
  BILLING: [
    'https://docs.stripe.com/billing',
    'https://docs.stripe.com/invoicing',
    'https://docs.stripe.com/tax',
    'https://docs.stripe.com/revenue-recognition'
  ],
  CONNECT: [
    'https://docs.stripe.com/connect',
    'https://docs.stripe.com/payouts'
  ],
  FINANCIAL_SERVICES: [
    'https://docs.stripe.com/issuing',
    'https://docs.stripe.com/treasury',
    'https://docs.stripe.com/capital',
    'https://docs.stripe.com/financial-connections'
  ],
  BUSINESS_OPERATIONS: [
    'https://docs.stripe.com/identity',
    'https://docs.stripe.com/atlas',
    'https://docs.stripe.com/climate',
    'https://docs.stripe.com/sigma'
  ]
};

export const FORMATS: Format[] = [
  { 
    id: 'EO', 
    name: 'Email + PWR', 
    description: 'Full customer reply paired with a detailed internal investigation record.', 
    icon: '✉️',
    category: 'draft',
    modelTier: 'standard',
    instruction: `**TEMPLATE: EMAIL+PWR validation**\nGenerates the customer email draft PLUS the full internal investigation record.\n\n... (standard headers) ...\n\n**Email body:**\nHi there,\n\n[ASA Protocol Response]\n\n[Standard Signature Block]`
  },
  { 
    id: 'FU', 
    name: 'Follow-up email', 
    description: 'Professional follow-up for non-responsive users.', 
    icon: '⏳',
    category: 'draft',
    modelTier: 'lite'
  },
  { 
    id: 'BND', 
    name: 'Bad News Delivery', 
    description: 'Structured SPIKES protocol delivery for policy-related or negative updates.', 
    icon: '🚫',
    category: 'draft',
    modelTier: 'standard'
  },
  { 
    id: 'EM', 
    name: 'Empathy Statements', 
    description: 'Context-specific empathy snippets to de-escalate high-stress situations.', 
    icon: '💙',
    category: 'snippet',
    modelTier: 'lite'
  },
  { 
    id: 'ACK', 
    name: 'Acknowledgement', 
    description: 'Short, professional acknowledgement of receiving information or requests.', 
    icon: '✅',
    category: 'snippet',
    modelTier: 'lite'
  },
  { 
    id: 'CL', 
    name: 'Chat / RAC Notes', 
    description: 'Internal analysis and plan for approval based on chat transcripts.', 
    icon: '📄',
    category: 'internal',
    modelTier: 'standard'
  },
  { 
    id: 'INV', 
    name: 'Investigation Notes', 
    description: 'Deep internal record capturing technical steps and account state.', 
    icon: '🔍',
    category: 'internal',
    modelTier: 'standard'
  },
  { 
    id: 'QS', 
    name: 'Short Summary', 
    description: 'High-speed summary of account IDs and key issue status.', 
    icon: '⚡',
    category: 'internal',
    modelTier: 'lite'
  },
  { 
    id: 'CF', 
    name: 'Consult', 
    description: 'Structured request for internal departmental consultation.', 
    icon: '🤝',
    category: 'internal',
    modelTier: 'standard'
  }
];

export const TONES: Tone[] = [
  { id: 'DRIVER', name: 'Driver', description: 'Results-first. Concise.', promptInstruction: 'Be extremely concise. Use bullet points.' },
  { id: 'ANALYTICAL', name: 'Analytical', description: 'Technical context. Logic-based.', promptInstruction: 'Focus on API parameters and object structures.' },
  { id: 'AMIABLE', name: 'Amiable', description: 'Empathetic. Reassuring.', promptInstruction: 'Use warm, patient language. Focus on guidance.' },
  { id: 'EXPRESSIVE', name: 'Expressive', description: 'Energetic. Growth-focused.', promptInstruction: 'Energetic and positive language.' }
];

export const PRODUCT_DOMAINS: ProductDomain[] = [
  {
    id: 'CORE_PAYMENTS',
    name: 'Payments & Checkout',
    description: 'Online/In-person payments, Checkout, Elements, Link, and Radar.',
    contextInstruction: 'Focus on card payments, APMs, Checkout Sessions, Payment Elements, Stripe Confirmation Tokens, and Radar fraud prevention. Prioritize Payment Intents over Charges.',
    keywords: ['Payments', 'Checkout', 'Link', 'Elements', 'Radar', 'Terminal', 'Confirmation Tokens'],
    category: ['direct']
  },
  {
    id: 'SAAS_BILLING',
    name: 'Billing & Tax',
    description: 'Subscriptions, Invoicing, Tax automation, and Revenue Recognition.',
    contextInstruction: 'Focus on Subscription lifecycles, Metered billing, Sales tax/VAT (Stripe Tax), and accrual accounting (Revenue Recognition). Follow ASC 606/GAAP compliance.',
    keywords: ['Billing', 'Subscriptions', 'Tax', 'Invoicing', 'Revenue Recognition', 'ASC 606'],
    category: ['saas']
  },
  {
    id: 'CONNECT_PLATFORMS',
    name: 'Connect Platforms',
    description: 'Multiparty payments, Payouts, and Onboarding.',
    contextInstruction: 'Focus on Connect (Standard/Express/Custom), Fund Flows (Direct/Destination/SCT), Platform Reserves, and Onboarding configurations.',
    keywords: ['Connect', 'Payouts', 'Onboarding', 'Fund Flows', 'Multiparty'],
    category: ['connect']
  },
  {
    id: 'FINANCIAL_PRODUCTS',
    name: 'Banking & Issuing',
    description: 'Issuing cards, Treasury BaaS, Capital financing, and Financial Connections.',
    contextInstruction: 'Focus on Stripe Issuing (Card programs), Treasury (Financial Accounts), Capital (Financing), and Financial Connections (Bank data/Verification).',
    keywords: ['Issuing', 'Treasury', 'Capital', 'Financial Connections', 'BaaS'],
    category: ['direct', 'connect']
  },
  {
    id: 'BUSINESS_IDENTITY',
    name: 'Identity & Business',
    description: 'Identity verification, Atlas incorporation, Sigma reporting, and Climate.',
    contextInstruction: 'Focus on Identity (KYC/ID documents), Atlas (Delaware incorporation), Sigma (SQL reporting), and Stripe Climate (Carbon removal).',
    keywords: ['Identity', 'Atlas', 'Sigma', 'Climate', 'KYC'],
    category: ['direct', 'connect', 'saas']
  }
];

export const SYSTEM_PROMPT = `
**PERSPECTIVE: First-Person ("I").**
ROLE: Agent drafting support responses.

**INTEGRATED KNOWLEDGE (Learned):**
- **Payments:** Prefer Payment Element/Checkout. Use Confirmation Tokens for pre-intent inspection.
- **Connect:** Prefer controller properties over legacy Standard/Express labels where applicable. 
- **Billing:** Recommend Billing APIs for SaaS models instead of raw PaymentIntents.
- **Verification:** Follow document requirements by country for Connect and Identity.

**LINK INTEGRITY:**
1. Use googleSearch to verify links against the "https://docs.stripe.com/" root.
2. If specific deep-links are unavailable via search, use the category roots from constants.ts.

**PII & REDACTION:**
- Replace names with "[Name]" or "[Business Name]".
- Redact Bank Names as "[Bank Name]".
`;

export const DEFAULT_STATION = {
  name: "Lofi Beats",
  url: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1"
};