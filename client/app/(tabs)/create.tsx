import { useContext, useState } from "react";
import { router } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Alert, ScrollView } from "react-native";

import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { GlobalContext } from "../../context/GlobalProvider";
import { GlobalContextType } from "@/type/user";
import { createTransaction } from "@/api_lib/api_call";

const CreateTrans = () => {
  const { form, setForm } = useContext(GlobalContext) as GlobalContextType;
  const [uploading, setUploading] = useState(false);

  const submit = async () => {
    if (form.phonenumber_reciver === "" || form.amount === 0) {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);
    try {
      await createTransaction({
        ...form,
      });

      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("ERROR", error.message);
      }
    } finally {
      setForm({
        id: "",
        phonenumber_reciver: "",
        amount: 0,
      });

      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">
          Create a transaction
        </Text>

        <FormField
          title="Receive person"
          value={form.phonenumber_reciver}
          placeholder="912345678"
          handleChangeText={(e: any) =>
            setForm({ ...form, phonenumber_reciver: e })
          }
          otherStyles="mt-10"
        />

        <FormField
          title="Amount"
          value={form.amount}
          placeholder="$0"
          keyboardType={"numeric"}
          handleChangeText={(e: any) => setForm({ ...form, amount: e })}
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
};

export default CreateTrans;
