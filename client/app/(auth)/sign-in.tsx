import { useContext, useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";

import { images } from "../../constants";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { getCurrentUser, signIn } from "@/api_lib/api_call";
import { GlobalContext } from "@/context/GlobalProvider";
import { GlobalContextType } from "@/type/user";

const SignInPage = () => {
  const {setUser, setIsLoggedIn} = useContext(GlobalContext) as GlobalContextType;

  const [form, setForm] = useState({
    phonenumber: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!form.phonenumber || !form.password) {
      Alert.alert("ERROR", "Please fill all field");
    }

    setIsSubmitting(true);

    try {
      await signIn(form.phonenumber, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLoggedIn(true);
      
      router.replace("/home");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("ERROR", error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center min-h-[85vh] px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[34px]"
          />

          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Log in to your wallet
          </Text>

          <FormField
            title="Phone number"
            value={form.phonenumber}
            handleChangeText={(e: string) => setForm({ ...form, phonenumber: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e: string) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-secondary"
            >
              Signup
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignInPage;
