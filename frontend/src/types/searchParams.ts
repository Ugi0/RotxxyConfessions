export type SearchParams = {
  id?: number;
  content?: string;
  category?: string;
  isNSFW?: boolean;
  orderBy?: "createdAt" | "title";
  orderDirection?: "asc" | "desc";
  reviewStatus?: "pending" | "approved" | "rejected";
};