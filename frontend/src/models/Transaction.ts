import { User } from "./User";

export interface Transaction {
    id: number
    amount: number,
    description: string,
    target_account: number
    time_stamp: Date,
    transaction_type: string,
    user: User,
}