import { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/providers/authProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heading1, Body, Caption } from "@/components/ui/typography";
import { SafeArea } from "@/components/ui/safe-area";

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    const success = await login(email.trim(), password);
    if (!success) {
      Alert.alert(
        "Đăng nhập thất bại",
        "Email hoặc mật khẩu không chính xác. Vui lòng thử lại.",
      );
    }
  };

  return (
    <SafeArea>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled">
          <View className="flex-1 justify-center px-6 py-8">
            {/* Logo / Brand */}
            <View className="items-center mb-10">
              <View className="w-20 h-20 rounded-full bg-primary-500 items-center justify-center mb-4">
                <Ionicons name="storefront" size={40} color="white" />
              </View>
              <Heading1 className="text-center">Store Order</Heading1>
              <Body className="text-center text-gray-500 mt-1">
                Đăng nhập để bắt đầu
              </Body>
            </View>

            {/* Form */}
            <View className="gap-4">
              {/* Email */}
              <View>
                <Input
                  placeholder="Email"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email)
                      setErrors((e) => ({ ...e, email: undefined }));
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  leftIcon={
                    <Ionicons name="mail-outline" size={20} color="#9ca3af" />
                  }
                />
                {errors.email && (
                  <Caption className="text-red-500 mt-1 ml-1">
                    {errors.email}
                  </Caption>
                )}
              </View>

              {/* Password */}
              <View>
                <Input
                  placeholder="Mật khẩu"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password)
                      setErrors((e) => ({ ...e, password: undefined }));
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!isLoading}
                  leftIcon={
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#9ca3af"
                    />
                  }
                  rightIcon={
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#9ca3af"
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />
                {errors.password && (
                  <Caption className="text-red-500 mt-1 ml-1">
                    {errors.password}
                  </Caption>
                )}
              </View>

              {/* Login Button */}
              <Button
                variant="secondary"
                onPress={handleLogin}
                disabled={isLoading}
                className="mt-2">
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeArea>
  );
}
