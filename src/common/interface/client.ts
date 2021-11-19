export interface ClientI {
  name: string;
  codeId: string;
  tributeID: number;
  currency: string;
  monthlyCall: number;
  bank: number[];
  id: any;
}

export interface ClientIStatus {
  message: string;
}
