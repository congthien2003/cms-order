import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Heading2, Caption } from "./typography";

type Props = {
  title: string;
  helloName?: string;
  onLogout?: () => void;
};

const HeaderScreen = (props: Props) => {
  return (
    <View className="bg-white px-4 pt-2 pb-3 border-b border-gray-100">
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Heading2>{props.title}</Heading2>
          {props.helloName && (
            <Caption className="text-gray-500">
              Xin chào, {props.helloName}
            </Caption>
          )}
        </View>
        {props.onLogout && (
          <TouchableOpacity
            onPress={props.onLogout}
            className="p-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="log-out-outline" size={24} color="#64748b" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default HeaderScreen;
