export type Confession = {
  id?: string;
  content: string;
  title: string;
  category: Category;
  isNSFW: boolean;
};

export type ConfessionStatus = "pending" | "approved" | "rejected";
export type Category = typeof categories[number];

export const categories = [
    "school",
    "work",
    "family",
    "relationships",
    "fantasy",
    "guilt",
    "other"
];