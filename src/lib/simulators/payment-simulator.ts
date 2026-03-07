import { generateTransactionId } from "@/lib/utils";

export interface PaymentResult {
  success: boolean;
  transaction_id: string;
  message: string;
}

export interface IPaymentService {
  processPayment(amount: number, method: string): Promise<PaymentResult>;
}

export class PaymentSimulator implements IPaymentService {
  async processPayment(
    amount: number,
    method: string
  ): Promise<PaymentResult> {
    // Simulate processing delay (2-3s)
    const delay = 2000 + Math.random() * 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const transaction_id = generateTransactionId();

    return {
      success: true,
      transaction_id,
      message: `Pagamento de R$${amount.toFixed(2)} via ${method} processado com sucesso`,
    };
  }
}

export const paymentService: IPaymentService = new PaymentSimulator();
