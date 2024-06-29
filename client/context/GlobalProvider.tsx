import { getCurrentUser } from "@/api_lib/api_call";
import { ITransaction } from "@/type/transaction";
import { GlobalContextType, IUser } from "@/type/user";
import { useContext, createContext, useEffect, useState, FC } from "react";

export const GlobalContext = createContext<GlobalContextType | null>(null);

const GlobalProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<IUser>({
    phoneNumber: "",
    social_id: "",
    name: "",
    balance: 0,
  });
  const [form, setForm] = useState<ITransaction>({
    phonenumber_reciver: "",
    amount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser({
            phoneNumber: "",
            social_id: "",
            name: "",
            balance: 0,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
        form,
        setForm,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
