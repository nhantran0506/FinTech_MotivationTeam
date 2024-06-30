import { ITransaction } from "./transaction";

export interface IUser {
    phoneNumber: string;
    social_id: string,
    name: string,
    balance: number;
}

export type GlobalContextType = {
    isLoggedIn: boolean;
    user: IUser;
    form: ITransaction;
    isLoading: boolean;
    setIsLoggedIn: (v: boolean) => void;
    setUser: (v: IUser) => void;
    setForm:(v: ITransaction) => void;
};