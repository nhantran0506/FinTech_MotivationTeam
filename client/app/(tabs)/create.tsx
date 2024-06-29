import { useState } from "react";
import { router } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Alert, ScrollView } from "react-native";

import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { useGlobalContext } from "../../context/GlobalProvider";
// import { createTransaction } from "@/lib/apiCall";

type FormState = {
  sender: string;
  reveicer: string;
  amount: number;
};

const CreateTrans = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<FormState>({
    sender: "",
    reveicer: "",
    amount: 0,
  });

  const submit = async () => {
    if (form.reveicer === "" || form.amount === 0) {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);
    try {
      // await createTransaction({
      //   ...form,
      //   sender: user.username,
      // });

      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("ERROR", error.message);
      }
    } finally {
      setForm({
        reveicer: "",
        amount: 0,
        // sender: user.username,
        sender: "",
      });

      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>

        <FormField
          title="Receive person"
          value={form.reveicer}
          placeholder="Give your video a catchy title..."
          handleChangeText={(e: any) => setForm({ ...form, reveicer: e })}
          otherStyles="mt-10"
        />

        <FormField
          title="Amount"
          value={form.amount}
          placeholder="How many..."
          handleChangeText={(e: any) => setForm({ ...form, reveicer: e })}
          otherStyles="mt-7"
        />

        <CustomButton
          title="Submit"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}


export default CreateTrans;