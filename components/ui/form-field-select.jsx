import { Picker } from "@react-native-picker/picker";
import { Controller } from "react-hook-form";
import { Text, View } from "react-native";

const FormFieldSelect = ({
    formControl,
    schemaProperty,
    placeholder,
    labelText,
    labelStyleClass,
    dropdownOptions,
}) => {
    return (
        <Controller
            control={formControl}
            name={schemaProperty}
            render={({ field: { onChange, value } }) => (
                <View className="w-full">
                    {labelText && (
                        <Text className={labelStyleClass}>
                            {labelText}
                        </Text>
                    )}

                    <View className="border border-gray-300 rounded-md mt-1">
                        <Picker
                            selectedValue={value}
                            onValueChange={(itemValue) => onChange(itemValue)}
                        >
                            <Picker.Item label={placeholder} value={null} />

                            {dropdownOptions.map(({ value, label }) => (
                                <Picker.Item key={value} label={label} value={value} />
                            ))}
                        </Picker>
                    </View>
                </View>
            )}
        />
    );
};

export default FormFieldSelect;