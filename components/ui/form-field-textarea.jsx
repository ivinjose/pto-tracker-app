import { Controller } from "react-hook-form";
import { Text, TextInput, View } from "react-native";

const FormFieldTextarea = ({
    formControl,
    schemaProperty,
    placeholder,
    labelText,
    labelStyleClass,
    inputStyleClass,
}) => {
    return (
        <Controller
            control={formControl}
            name={schemaProperty}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <View className="mb-4">
                    {!!labelText && (
                        <Text className={labelStyleClass ?? "mb-1 text-base font-medium"}>
                            {labelText}
                        </Text>
                    )}

                    <TextInput
                        className={
                            inputStyleClass ??
                            "border border-gray-300 rounded-lg px-3 py-2 text-base min-h-[100px]"
                        }
                        placeholder={placeholder}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        multiline
                        textAlignVertical="top"
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

export default FormFieldTextarea;