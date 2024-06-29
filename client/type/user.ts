export interface IUser {
    phoneNumber: string;
    social_id: string,
    name: string,
    balance: number;
}

export type GlobalContextType = {
    isLoggedIn: boolean;
    user: IUser;
    isLoading: boolean;
    setIsLoggedIn: (v: boolean) => void;
    setUser: (v: IUser) => void;
};