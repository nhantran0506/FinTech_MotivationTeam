import { ITransaction } from "@/type/transaction";
import AsyncStorage from "@react-native-async-storage/async-storage";

const backEndUrl = "http://10.10.0.245:5000";

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token !== null) {
      return token;
    }
    throw new Error("Token not found");
  } catch (error) {
    console.error("Error retrieving token:", error);
    throw error;
  }
};

export const createUser = async (username: string, password: string) => {
  const url = backEndUrl + "/user/register";

  const requestBody = {
    username: username,
    password: password,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const signIn = async (phonenumber: string, password: string) => {
  const url = backEndUrl + "/login";

  const requestBody = {
    phonenumber: phonenumber,
    password: password,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    // Save the token to AsyncStorage
    await AsyncStorage.setItem("token", data.access_token);

    return data;
  } catch (error) {
    console.error("Error sign in:", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    // delete the token from AsyncStorage
    await AsyncStorage.setItem("token", "");
  } catch (error) {
    console.error("Error sign out:", error);
    throw error;
  }
};

// get current login user
export const getCurrentUser = async () => {
  const url = backEndUrl + "/get_user";
  const token = await getToken();

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

export const createTransaction = async (transaction: ITransaction) => {
  const url = backEndUrl + "/transfer";
  const token = await getToken();

  const requestBody = {
    phonenumber_reciver: transaction.phonenumber_reciver,
    amount: transaction.amount,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getHistoryTransaction = async () => {
  const url = backEndUrl + "/get_transactions";
  const token = await getToken();

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error getting history transactions:", error);
    throw error;
  }
};

export const getQrShare = async (qr_text: string) => {
  const url = backEndUrl + "/qr";

  const requestBody = {
    qr_text: qr_text,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    return data.qr_image_base64;
  } catch (error) {
    console.error("Error getting history transactions:", error);
    throw error;
  }
};