export interface ClientI {
  name: string;
  codeID: string;
  tributeID: string;
  currency: string;
  monthlyCall: number;
  bank: number[];
  id: any;
}

export interface ClientIStatus {
  message: string;
  client?: ClientI;
}
