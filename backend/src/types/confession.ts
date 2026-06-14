export type Confession = {
  id: number;
  content: string;
  title: string;
  category: string;
  isNSFW: boolean;
  isReviewed: boolean;
  isApproved: boolean;
  isViewed: boolean;
  createdAt: Date;
};

export type SearchParams = {
  id?: number;
  content?: string;
  category?: string;
  isNSFW?: boolean;
  orderBy?: "createdAt" | "title";
  orderDirection?: "asc" | "desc";
  reviewStatus?: "pending" | "reviewed";
};