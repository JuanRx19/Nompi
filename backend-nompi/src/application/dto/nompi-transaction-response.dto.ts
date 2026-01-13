export class NompiTransactionResponseDto {
  data: {
    id: string;
    amount_in_cents: number;
    status: string;
    merchant: {
      name: string;
      email: string;
      legal_id: string;
    };
    payment_link_id: string;
  };
}
