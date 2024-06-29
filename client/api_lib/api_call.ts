import AsyncStorage from "@react-native-async-storage/async-storage";

const backEndUrl = "http://192.168.1.2:5000";

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

export const signIn = async (username: string, password: string) => {
  const url = backEndUrl + "/user/login";

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

    // Save the token to AsyncStorage
    await AsyncStorage.setItem("token", data.token);

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

// get user from current login user
export const getCurrentUser = async (username: string) => {
  const url = backEndUrl + "/user/view/" + username;

  const requestBody = {
    username: username,
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
    console.error("Error getting user:", error);
    throw error;
  }
};

export const getAllPosts = async () => {
  const url = backEndUrl + "/products/view-all";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error getting products:", error);
    throw error;
  }
};

export const getLastestPost = async () => {
  const url = backEndUrl + "/products/view-all";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    const latestPosts = data.slice(0, 5);

    return latestPosts;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

// search by title
export const searchPosts = async (keyword: string | string[] | undefined) => {};

// get posts that are written by current login user
export const getUserPosts = async (username: string) => {
  const url = backEndUrl + "/products/viewByUser/" + username;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error getting products:", error);
    throw error;
  }
};


