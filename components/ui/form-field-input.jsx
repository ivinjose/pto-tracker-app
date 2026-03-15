import { Controller } from "react-hook-form";
import { Text, TextInput, View } from "react-native";

const FormFieldInput = ({
    formControl,
    schemaProperty,
    placeholder,
    labelText,
    labelStyleClass,
    inputType = "default",
}) => {
    return (
        <Controller
            control={formControl}
            name={schemaProperty}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <View className="mb-4">
                    {labelText && (
                        <Text className={labelStyleClass ?? "mb-1 text-base font-medium"}>
                            {labelText}
                        </Text>
                    )}

                    <TextInput
                        className="border border-gray-300 rounded-lg px-3 py-2 text-base"
                        placeholder={placeholder}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType={inputType === "number" ? "numeric" : "default"}
                    />

                    {error && (
                        <Text className="text-red-500 text-sm mt-1">
                            {error.message}
                        </Text>
                    )}
                </View>
            )}
        />
    );
};

export default FormFieldInput;