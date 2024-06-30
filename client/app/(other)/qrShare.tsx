import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import { useContext, useEffect, useState } from "react";
import { backEndUrl } from "@/api_lib/api_call";
import { useLocalSearchParams } from "expo-router";
import { GlobalContext } from "@/context/GlobalProvider";
import { GlobalContextType } from "@/type/user";

const QrSharePage = () => {
  const { user } = useContext(GlobalContext) as GlobalContextType;
  const [qr, setQr] = useState();

  useEffect(() => {
    fetch(backEndUrl + "/qr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ qr_text: user.phoneNumber }),
    })
      .then((response) => response.json())
      .then((res) => {
        setQr(res.qr_image_base64);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <SafeAreaView className=" h-full">
      <Image
        style={{
          width: 300,
          height: 300,
          borderWidth: 1,
          borderColor: "black",
        }}
        className="mx-auto "
        source={{ uri: "data:image/png;base64," + qr }}
      />
    </SafeAreaView>
  );
};

export default QrSharePage;
