import { Item } from "@/types";

// Simple keyword matching algorithm
export const checkMatch = (lostItem: Partial<Item>, foundItems: Item[]): Item[] => {
  if (!lostItem.title || !lostItem.category) return [];

  const lostKeywords = lostItem.title.toLowerCase().split(' ');

  return foundItems.filter(found => {
    if (found.category !== lostItem.category) return false;
    
    // Check keyword overlap
    const foundTitle = found.title.toLowerCase();
    const matchCount = lostKeywords.reduce((acc, word) => {
      return foundTitle.includes(word) ? acc + 1 : acc;
    }, 0);

    // If 50% of keywords match or location matches
    const isLocationMatch = lostItem.location === found.location;
    return (matchCount / lostKeywords.length > 0.4) || (matchCount > 0 && isLocationMatch);
  });
};