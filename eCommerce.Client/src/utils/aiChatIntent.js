const personalDetails = /\b(?:my|mine|our)\s+(?:(?:latest|last|recent|current|previous|past)\s+)?(?:orders?|purchases?|payments?|refunds?|deliver(?:y|ies)|shipments?|packages?|parcels?|tracking|account|profile|addresses?|invoices?)\b/i;
const accountAction = /\b(?:show|list|check|view|find|track)\s+(?:me\s+)?(?:(?:the|my)\s+)?(?:(?:latest|last|recent|current)\s+)?(?:orders?|payments|deliveries|shipments)\b/i;
const recentOrder = /\b(?:latest|last|recent|current)\s+orders?\b/i;
const orderReference = /\b(?:order|payment|shipment|tracking)\s+(?:status|details|history|number|id)\b/i;
const shoppingQuestion = /\b(?:products?|catalog|stock|in stock|prices?|laptops?|phones?|recommendations?|reviews?|compare|available|polic(?:y|ies))\b/i;
const accountFollowUp = /^(?:and\b|what about\b|how about\b|where\b|when\b|is it\b|has it\b|can you\b|tell me more\b|more details\b|status\b|payment\b|delivery\b|tracking\b|shipment\b)/i;

export function isPersonalAccountRequest(message) {
  return personalDetails.test(message) || accountAction.test(message)
    || recentOrder.test(message) || orderReference.test(message);
}

export function isShoppingRequest(message) {
  return shoppingQuestion.test(message) && !isPersonalAccountRequest(message);
}

export function isAccountFollowUp(message) {
  return accountFollowUp.test(message) && !isShoppingRequest(message);
}
