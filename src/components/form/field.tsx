import * as React from "react";
import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";
import { ScrollView } from "react-native";
import FormSuggestions from "./suggestions";

interface FormFieldsProps {
  label: string;
  suggestions?: string[];
  fieldKey: string;
  value: string;
  error: boolean;
  onChange: (field: string, value: string) => void;
  disabled: boolean;
  numberOfLines?: number;
  scrollTo?: (y: number) => void;
  scrollViewRef?: React.RefObject<ScrollView>;
}

const FormField = ({
  label,
  suggestions,
  fieldKey,
  value,
  error,
  onChange,
  disabled,
  numberOfLines = 1,
  scrollTo,
  scrollViewRef,
}: FormFieldsProps) => {
  const viewRef = React.useRef<View>(null);

  const onFocused = React.useCallback(() => {
    viewRef.current?.measureLayout(
      scrollViewRef?.current?.getInnerViewNode(),
      (_, y) => {
        scrollTo?.(y - 150);
      }
    );
  }, [scrollTo]);

  const multilineProps = React.useMemo(
    () => ({
      multiline: numberOfLines > 1,
      maxLength: numberOfLines > 1 ? 100 : 100,
      minHeight: numberOfLines > 1 ? 150 : undefined,
    }),
    [numberOfLines]
  );

  return (
    <View style={syles.wrapper} ref={viewRef}>
      <TextInput
        mode="outlined"
        onFocus={onFocused}
        label={label}
        disabled={disabled}
        editable={!disabled}
        multiline={multilineProps.multiline}
        numberOfLines={1}
        maxLength={multilineProps.maxLength}
        value={value}
        onChangeText={(text) => onChange(fieldKey, text)}
        style={[syles.input, { minHeight: multilineProps.minHeight }]}
        error={error}
      />
      <FormSuggestions
        fieldKey={fieldKey}
        onChange={onChange}
        suggestions={suggestions}
      />
    </View>
  );
};

const syles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  input: {
    width: "100%",
  },
  suggestions: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 10,
    marginTop: 5,
    gap: 5,
  },
});

FormField.displayName = "FormField";

export default React.memo(FormField);
