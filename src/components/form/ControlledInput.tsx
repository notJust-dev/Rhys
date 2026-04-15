import { Text, TextInput, View, type ViewProps } from "@/tw";
import { type ComponentProps } from "react";
import {
  type FieldValues,
  type Path,
  type RegisterOptions,
  useController,
} from "react-hook-form";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  containerClassName?: string;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
} & Omit<ComponentProps<typeof TextInput>, "value" | "onChangeText" | "onBlur"> &
  Pick<ViewProps, "className">;

export function ControlledInput<T extends FieldValues>({
  name,
  label,
  containerClassName,
  className,
  rules,
  ...textInputProps
}: Props<T>) {
  const {
    field: { value, onBlur, onChange },
    fieldState: { error },
  } = useController<T>({ name, rules });

  return (
    <View className={containerClassName}>
      {label ? (
        <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      ) : null}
      <TextInput
        {...textInputProps}
        value={value ?? ""}
        onChangeText={onChange}
        onBlur={onBlur}
        placeholderTextColor="#9ca3af"
        className={`border rounded-xl px-4 py-3 text-base bg-gray-50 ${error ? "border-red-500" : "border-gray-200"
          } ${className ?? ""}`}
      />
      <Text className="text-xs text-red-600 h-4 mt-1" numberOfLines={1}>
        {error?.message ?? ""}
      </Text>
    </View>
  );
}
