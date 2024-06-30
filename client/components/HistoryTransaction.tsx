import { ITransaction } from "@/type/transaction";
import { MaterialIcons } from "@expo/vector-icons";
import { useRef } from "react";
import { View, Dimensions, Animated, FlatList, Text } from "react-native";
import SlidingUpPanel from "rn-sliding-up-panel";

const HistoryTransaction = (transactions: ITransaction[]) => {
  return (
    <View className="flex-1 bg-gray-900 rounded-t-3xl p-3.5 w-full">
      <View>
        <Text className="text-white m-2">Recent Transactions</Text>
      </View>

      <View className="h-[400px] pb-5">
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <View className="border p-4 flex-row justify-between items-center">
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View>
                    <Text style={{ fontSize: 14, color: "#fff" }}>
                      {item.phonenumber_reciver}
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        color: "#fff",
                        opacity: 0.6,
                      }}
                    >
                      {"10.10.2020"}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#fff",
                      marginHorizontal: 2,
                    }}
                  >
                    {item.amount}
                  </Text>

                  {item.amount ? (
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
    </View>
  );
};
export default HistoryTransaction;
