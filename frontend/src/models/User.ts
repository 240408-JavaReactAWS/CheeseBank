export interface User {
    id: number,
    first_name: string,
    last_name: string,
    username: string,
    password: string,
    email: string,
    dob: Date,
    phone: number,
    is_frozen: boolean,
    balance: number,
    user_type: string
}