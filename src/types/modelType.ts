export interface UserType extends Document {
  readonly _id: string;
  name: string;
  email: string;
  photo: string;
  gender: "male" | "female";
  role: "user" | "admin";
  DOB: Date;
  createdAt: Date;
  updatedAt: Date;

  // this is virtual attribute
  age: number;
}
// Product model type
export interface ProductType extends Document {
  readonly id: number;
  name: string;
  photo: string;
  price: number;
  stock: number;
  category: string;
}
export type OrderedItemsType = {
  name: string;
  photo: string;
  quantity: number;
  price: number;
  productId: number;
};
export type ShippingInfoType = {
  state: string;
  city: string;
  pinCode: number;
  country: string;
};
export interface OrderType  {
  shippingInfo:ShippingInfoType;
  status?: "pending payment" | "processing" | "shipped" | "delivered";
  orderedBy: string;
  deliveryCharge: number;
  discount?: number|null;
  total: number;
  orderedItems: OrderedItemsType[];
  createdAt:Date;
}

export type CombinedCachedDataType = {
  productOn_a_Page: ProductType[];
  totalProductsBasedOnFilter: ProductType[];
  totalPage: number;
};
