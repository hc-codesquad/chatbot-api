import { stringType } from 'aws-sdk/clients/iam';
import { Payment, Card, MiniCart, Expiration, Buyer, Shippingaddress, BillingAddress, Item } from './types/payment';
import { float } from "aws-sdk/clients/lightsail";


export function parsePaymentRequest(body: {
  reference: string, orderId: string, transactionId: string, paymentId: string,
  paymentMethod: string, paymentMethodCustomCode: string, merchantName: string, value: string,
  currency: string, installments: string, deviceFingerprint: string, url: string, callbackUrl: string,
  returnUrl: string
}, card: Card, miniCart: MiniCart,): Payment {
  return {
    reference: body.reference,
    orderId: body.orderId,
    transactionId: body.transactionId,
    paymentId: body.paymentId,
    paymentMethod: body.paymentMethod,
    paymentMethodCustomCode: body.paymentMethodCustomCode,
    merchantName: body.merchantName,
    value: body.value,
    currency: body.currency,
    installments: body.installments,
    deviceFingerprint: body.deviceFingerprint,
    card: card,
    miniCart: miniCart,
    callbackUrl: body.callbackUrl,
    returnUrl: body.returnUrl,
    url: body.url
  };
}

export function parseCardRequest(body: {
  number: string,
  csc: string,
  holder: stringType
}, expiration: Expiration): Card {
  return {
    number: body.number,
    csc: body.csc,
    expiration: expiration,
    holder: body.holder
  };
}

export function parseExpirationRequest(body: {
  month: string,
  year: string,
}): Expiration {
  return {
    month: body.month,
    year: body.year
  };
}

export function parseMiniCartRequest(body: { shippingValue: float, taxValue: float },
  buyer: Buyer, shippingAddress: Shippingaddress, billingAddress: BillingAddress, items: Item[]): MiniCart {
  return {
    shippingValue: body.shippingValue,
    taxValue: body.taxValue,
    buyer: buyer,
    shippingAddress: shippingAddress,
    billingAddress: billingAddress,
    items: items
  }
}

export function parseBuyerRequest(body: {
  id: string,
  firstName: string,
  lastName: string,
  document: string,
  documentType: string,
  email: string,
  phone: string,
}): Buyer {
  return {
    id: body.id,
    firstName: body.firstName,
    lastName: body.lastName,
    document: body.document,
    documentType: body.documentType,
    email: body.email,
    phone: body.phone
  }
}

export function parseShippingaddressRequest(body: {
  country: string,
  street: string,
  number: string,
  complement: string,
  neighborhood: string,
  postalCode: string,
  city: string,
  state: string,
}): Shippingaddress {
  return {
    country: body.country,
    street: body.street,
    number: body.number,
    complement: body.complement,
    neighborhood: body.neighborhood,
    postalCode: body.postalCode,
    city: body.city,
    state: body.state
  }
}

export function parseBillingAddress(body: {
  country: string,
  street: string,
  number: string,
  complement: string,
  neighborhood: string,
  postalCode: string,
  city: string,
  state: string
}): BillingAddress {
  return {
    country: body.country,
    street: body.street,
    number: body.number,
    complement: body.complement,
    neighborhood: body.neighborhood,
    postalCode: body.postalCode,
    city: body.city,
    state: body.state
  }
}

export function parseItemsRequest(items: Item[]): Item[] {
  let lista: Item[] = []
  items.forEach(element => {
    lista.push(element)
  });
  return lista
}
