import { User } from "./User";

export enum TransactionType {
    WITHDRAWAL = 'WITHDRAWAL',
    DEPOSIT = 'DEPOSIT',
    TRANSFER = 'TRANSFER'
}

export interface Transaction {
    id: number,
    transactionType: TransactionType,
    amount: number,
    description: string,
    timeStamp: string,
    targetAccount: number,
    user: User,
    resultBalance: number
}