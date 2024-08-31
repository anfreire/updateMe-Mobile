import * as React from "react";
import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";
import { Chip } from "react-native-paper";

interface FormSuggestionsProps {
  fieldKey: string;
  onChange: (field: string, value: string) => void;
  suggestions?: string[];
}

const FormSuggestions = ({
  fieldKey,
  onChange,
  suggestions,
}: FormSuggestionsProps) => {
  const renderSuggestions: ListRenderItem<string> = React.useCallback(
    ({ item }) => (
      <Chip compact onPress={() => onChange(fieldKey, item)}>
        {item}
      </Chip>
    ),
    [fieldKey, onChange]
  );

  const keyExtractor = React.useCallback(
    (item: string) => `${fieldKey}-${item}`,
    [fieldKey]
  );

  if (!suggestions) return null;

  return (
    <View style={syles.suggestions}>
      <FlatList
        data={suggestions}
        renderItem={renderSuggestions}
        keyExtractor={keyExtractor}
        horizontal
      />
    </View>
  );
};

const syles = StyleSheet.create({
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

FormSuggestions.displayName = "FormSuggestions";

export default React.memo(FormSuggestions);
