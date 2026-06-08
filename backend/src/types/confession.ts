export type Confession = {
  id: number;
  text: string;
  title: string;
  category: string;
  isNSFW: boolean;
};

export type SearchParams = {
  id?: number;
  text?: string;
  category?: string;
  isNSFW?: boolean;
  orderBy?: "createdAt" | "title";
  orderDirection?: "asc" | "desc";
};