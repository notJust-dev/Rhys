import { Pressable } from "@/tw";
import { Animated } from "@/tw/animated";
import type { LegendListRef } from "@legendapp/list/react-native";
import { SymbolView } from "expo-symbols";
import { type RefObject, useCallback } from "react";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import {
  type SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const THRESHOLD = 200;

type Props = {
  listRef: RefObject<LegendListRef | null>;
  distanceFromBottom: SharedValue<number>;
};

export function ScrollToBottomButton({ listRef, distanceFromBottom }: Props) {
  const { height: keyboardHeight } = useReanimatedKeyboardAnimation();
  const insets = useSafeAreaInsets();

  const style = useAnimatedStyle(() => ({
    opacity: withTiming(distanceFromBottom.value > THRESHOLD ? 1 : 0, {
      duration: 150,
    }),
    transform: [
      { translateY: Math.min(keyboardHeight.value + insets.bottom, 0) },
    ],
  }));

  const scrollToBottom = useCallback(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [listRef]);

  return (
    <Animated.View
      style={style}
      className="absolute self-center bottom-4"
    >
      <Pressable
        onPress={scrollToBottom}
        className="w-10 h-10 rounded-full bg-white border border-gray-200 items-center justify-center shadow"
      >
        <SymbolView
          name={{
            ios: "arrow.down",
            android: "arrow_downward",
            web: "arrow_downward",
          }}
          size={18}
          tintColor="gray"
        />
      </Pressable>
    </Animated.View>
  );
}
