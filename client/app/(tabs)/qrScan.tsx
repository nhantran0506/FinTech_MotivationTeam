import QRScanner from "@/components/QRScanner";
import { Text } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function QrScan() {
  return (
    // <SafeAreaView>
    //   <Text>QrScan</Text>
    <QRScanner />
    // </SafeAreaView>
  );
}
