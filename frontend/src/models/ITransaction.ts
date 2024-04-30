import { User } from "./User";

export interface ITransaction {
    id: number
    transactionType: string,
    amount: number,
    description: string,
    timeStamp: Date,
    curentBalance: number;
    user: User
}