export const PRICE_TIERS: Record<number, number> = {
  1: 50,
  2: 75,
  3: 100,
  4: 150,
  5: 200,
};

export const getPriceForTier = (tier: number): number => {
  return PRICE_TIERS[tier] || 0;
};

