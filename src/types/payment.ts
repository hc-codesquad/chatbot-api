import { float } from "aws-sdk/clients/lightsail";

export interface Payment {
  id?: number;
  reference: string;
  transactionId: string;
  orderId: string;
  paymentId: string;
  paymentMethod: string;
  paymentMethodCustomCode: string;
  merchantName: string;
  value: string;
  currency: string;
  installments: string;
  deviceFingerprint: string;
  card: Card;
  miniCart: MiniCart;
  url:string;
  callbackUrl:string;
  returnUrl:string;
}

export interface Card {
  holder: string;
  number: string;
  csc: string;
  expiration: Expiration;
}

export interface Expiration {
  month: string;
  year: string;
}

export interface MiniCart {
  shippingValue: float;
  taxValue: float;
  buyer: Buyer;
  shippingAddress: Shippingaddress;
  billingAddress: BillingAddress;
  items: Item[];
}

export interface Buyer {
  id: string;
  firstName: string;
  lastName: string;
  document: string;
  documentType: string;
  email: string;
  phone: string;
}

export interface Shippingaddress {
  country: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  postalCode: string;
  city: string;
  state: string;
}

export interface BillingAddress {
  country: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  postalCode: string;
  city: string;
  state: string;
}

export interface Item {
  id: string;
  name: string;
  price: string;
  quantity: string;
  discount: string;
}