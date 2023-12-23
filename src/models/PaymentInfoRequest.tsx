class PaymentInfoRequest {
  amout: number;
  currency: string;
  receiptEmail?: string | undefined;

  constructor(
    amout: number,
    currency: string,
    receiptEmail: string | undefined
  ) {
    this.amout = amout;
    this.currency = currency;
    this.receiptEmail = receiptEmail;
  }
}

export default PaymentInfoRequest;
