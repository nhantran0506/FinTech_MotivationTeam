import React, { useState, useRef } from "react";
import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
  FlatList,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import SlidingUpPanel from "rn-sliding-up-panel";
import Carousel from "react-native-reanimated-carousel";
import { images } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  // Users Data
  const Users = [
    {
      key: "1",
      userImage:
        "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      userName: "Jessica",
      transactionDate: "25 April 20",
      amount: "$350",
      credit: true,
    },
    {
      key: "2",
      userImage:
        "https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      userName: "Micela",
      transactionDate: "16 April 20",
      amount: "$150",
      credit: false,
    },
    {
      key: "3",
      userImage:
        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      userName: "Gabriel",
      transactionDate: "05 April 20",
      amount: "$364",
      credit: false,
    },
    {
      key: "4",
      userImage:
        "https://images.pexels.com/photos/1082962/pexels-photo-1082962.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      userName: "Jasmine",
      transactionDate: "28 March 20",
      amount: "$100",
      credit: true,
    },
    {
      key: "5",
      userImage:
        "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      userName: "Alex",
      transactionDate: "14 March 20",
      amount: "$450",
      credit: true,
    },
    {
      key: "6",
      userImage:
        "https://images.pexels.com/photos/1548164/pexels-photo-1548164.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      userName: "Mark",
      transactionDate: "05 March 20",
      amount: "$288",
      credit: true,
    },
    {
      key: "7",
      userImage:
        "https://images.pexels.com/photos/1090387/pexels-photo-1090387.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      userName: "Daria",
      transactionDate: "03 March 20",
      amount: "$350",
      credit: false,
    },
    {
      key: "8",
      userImage:
        "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      userName: "George",
      transactionDate: "01 March 20",
      amount: "$350",
      credit: true,
    },
  ];

  // Carousel data
  const imagesList = [
    { id: 1, image: images.card1 },
    { id: 2, image: images.card2 },
    { id: 3, image: images.card3 },
    { id: 4, image: images.card4 },
  ];

  const { width, height } = Dimensions.get("window");

  // SLIDING PANEL

  const [dragRange, setDragRange] = useState({
    top: height - 80,
    bottom: 160,
  });

  const _draggedValue = new Animated.Value(180);

  const ModalRef = useRef(null);

  return (
    <SafeAreaView className="flex-1 bg-black px-1">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="font-bold text-white text-2xl">Welcome Back,</Text>
          <Text className="font-semibold text-white opacity-60 text-xl">
            Truong Nguyen
          </Text>
        </View>
        <View>
          <Image
            source={{
              uri: "https://images.pexels.com/photos/936229/pexels-photo-936229.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
            }}
            className="w-14 h-14 rounded-full"
          />

          {/* Unread notification */}
          <View className="h-3 w-3 bg-purple-500 rounded-full absolute right-1.5 border-2 border-black"></View>
        </View>
      </View>
      <View>
        {/* Card images */}
        <View className="flex-row justify-between items-center p-1">
          <Carousel
            loop
            width={width}
            height={240}
            data={imagesList}
            renderItem={({ item }) => (
              <View>
                <Image source={item.image} />
              </View>
            )}
          />
        </View>

        {/* Saved person */}
        <View className="pt-4">
          <Text className="text-white opacity-60 ">Send Money</Text>
          <View className="flex flex-row">
            <TouchableOpacity className="h-24 w-25 justify-center items-center  rounded-lg px-1">
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
              data={Users}
              renderItem={({ item }) => {
                return (
                  <View className="h-24 w-25 justify-center items-center  rounded-lg mx-1">
                    <Image
                      className="w-16 h-16 bg-black rounded-md  justify-center"
                      source={{ uri: item.userImage }}
                    />
                    <Text className="text-white">{item.userName}</Text>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </View>

      <View className="flex-1">
        <SlidingUpPanel
          ref={ModalRef}
          draggableRange={dragRange}
          animatedValue={_draggedValue}
          backdropOpacity={0}
          snappingPoints={[360]}
          height={height + 20}
          friction={0.9}
        >
          <View className="flex-1 bg-gray-900 rounded-t-3xl p-3.5">
            <View className="h-1.5 w-12 bg-gray-800 rounded-full self-center mt-1.5"></View>
            <View>
              <Text className="text-white my-3">Recent Transactions</Text>
            </View>

            <View className="h-[400px] pb-5">
              <FlatList
                data={Users}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => {
                  return (
                    <View className="border p-4 flex-row justify-between items-center mb-20">
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <View style={{ marginRight: 10 }}>
                          <Image
                            source={{ uri: item.userImage }}
                            className="w-30 h-30 bg-black rounded-full"
                          />
                        </View>
                        <View>
                          <Text style={{ fontSize: 14, color: "#fff" }}>
                            {item.userName}
                          </Text>
                          <Text
                            style={{
                              fontSize: 10,
                              color: "#fff",
                              opacity: 0.6,
                            }}
                          >
                            {item.transactionDate}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            color: "#fff",
                            marginHorizontal: 2,
                          }}
                        >
                          {item.amount}
                        </Text>

                        {item.credit ? (
                          <MaterialIcons
                            name="arrow-drop-up"
                            size={22}
                            color="green"
                          />
                        ) : (
                          <MaterialIcons
                            name="arrow-drop-down"
                            size={22}
                            color="#ff3838"
                          />
                        )}
                      </View>
                    </View>
                  );
                }}
              />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity className="p-4 w-200 justify-center bg-gray-900 rounded-lg">
                <Text className="text-white text-center text-16">
                  View Full History
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SlidingUpPanel>
      </View>
    </SafeAreaView>
  );
}
