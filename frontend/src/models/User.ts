export enum UserType {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export interface User {
    id: number,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    email: string,
    dob: string,
    phone: string,
    balance: number,
    userType: UserType,
    isFrozen: boolean,
    token?: string,
}