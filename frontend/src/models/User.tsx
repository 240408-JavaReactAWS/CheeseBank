export interface User {
    id:number,
    first_name:string,
    last_name:string,
    user_name:string,
    password:string,
    email:string,
    dob:Date,
    phone_number:number,
    token:string,
    isFrozen:boolean,
    balance:number
}