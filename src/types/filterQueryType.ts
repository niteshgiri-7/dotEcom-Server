export type SearchRequestQuery = {
  sort?: string;
  page?: string;
  price?: string;
  search?: string;
  category?:string;
};

export interface BaseQueryType {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: { $lte: number };
  category?: string;
}