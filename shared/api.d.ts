export interface MessageResponse {
  message: string;
}

export interface CreateOrderResponse extends MessageResponse {
  id: number;
}
