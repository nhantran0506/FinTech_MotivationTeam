import React, { useContext, useEffect } from "react";
import { Text, View, Image, TouchableOpacity, FlatList } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import Carousel from "react-native-reanimated-carousel";
import { icons, images } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlobalContext } from "@/context/GlobalProvider";
import { GlobalContextType } from "@/type/user";
import useRefresh from "@/hooks/useRefresh";
import {
  getFamilierUser,
  getHistoryTransaction,
  signOut,
} from "@/api_lib/api_call";
import { router } from "expo-router";
import HistoryTransaction from "@/components/HistoryTransaction";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function HomeScreen() {
  const { user, setUser, setIsLoggedIn } = useContext(
    GlobalContext
  ) as GlobalContextType;
  const { data: transactions, refetch: refetchTrans } = useRefresh(
    getHistoryTransaction
  );
  const { data: users, refetch: refetchUsers } = useRefresh(getFamilierUser);

  useEffect(() => {
    refetchTrans();
    refetchUsers();
  }, []);

  const logout = async () => {
    await signOut();
    setUser({
      phoneNumber: "",
      social_id: "",
      name: "",
      balance: 0,
    });
    setIsLoggedIn(false);

    router.replace("/sign-in");
  };

  const handleAddFamilier = async () => {
    // await addFamilier();
  };

  const handleNavigateQr = async () => {
    router.push("/qrShare");
  };

  // Carousel data
  const imagesList = [
    { id: 1, image: images.card1 },
    { id: 2, image: images.card2 },
    { id: 3, image: images.card3 },
    { id: 4, image: images.card4 },
  ];

  return (
    <SafeAreaView className="flex-1 bg-black px-1">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="font-bold text-white text-2xl">Welcome Back,</Text>
          <Text className="font-semibold text-white opacity-60 text-xl">
            {user.name}
          </Text>
        </View>

        <TouchableOpacity onPress={logout} className="p-2">
          <Image
            source={icons.logout}
            resizeMode="contain"
            className="w-6 h-6"
          />
        </TouchableOpacity>
      </View>
      <View>
        <View className="flex flex-row"></View>

        {/* Saved person */}
        <View className="pt-2">
          <View className="flex flex-row">
            <TouchableOpacity
              className="h-24 w-25 justify-center rounded-lg px-1"
              onPress={() => handleNavigateQr()}
            >
              <View className="w-16 h-16 bg-gray-600 rounded-md  justify-center items-center">
                <Ionicons name="qr-code-outline" size={32} color="white" />
              </View>
              <Text className="text-white">Share QR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="h-24 w-25 justify-center items-center  rounded-lg px-1"
              onPress={() => handleAddFamilier()}
            >
              <View className="w-16 h-16 bg-gray-600 rounded-md  justify-center">
                <MaterialIcons
                  name="add"
                  color="white"
                  size={28}
                  style={{ alignSelf: "center" }}
                />
              </View>
              <Text className="text-white">Add Users</Text>
            </TouchableOpacity>
            <FlatList
              inverted
              horizontal
              showsHorizontalScrollIndicator={false}
              data={users}
              renderItem={({ item }) => {
                return (
                  <View className="h-24 w-25 justify-center items-center  rounded-lg mx-1">
                    <Image
                      className="w-16 h-16 bg-black rounded-md  justify-center"
                      // source={}
                    />
                    <Text className="text-white">{item.userName}</Text>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </View>

      <HistoryTransaction {...transactions} />
    </SafeAreaView>
  );
}
