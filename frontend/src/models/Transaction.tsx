import { User } from "./User";

export interface Transaction {
    id:number
    type:string,
    transaction_amount:number,
    description:string,
    timeStamp:Date,
    current_balance:number,
    user:User
}