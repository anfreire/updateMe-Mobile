import React, { useCallback, useMemo, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { useToast } from "@/states/temporary/toast";
import Field, { FieldsDataType, FieldStates } from "./field";
import { useTranslations } from "@/states/persistent/translations";

const minHeight = Dimensions.get("screen").height - 100;

export default function FormScreen({
  fieldsData,
  init,
  submit,
}: {
  fieldsData: FieldsDataType;
  init: (setDisabled: (value: boolean) => void) => void;
  submit: (
    data: Record<string, string>,
    setDisabled: (value: boolean) => void
  ) => void;
}) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [disabled, setDisabled] = useState(false);
  const [state, setState] = useState<FieldStates>(() =>
    Object.fromEntries(
      Object.keys(fieldsData).map((key) => [key, { value: "", error: false }])
    )
  );
  const openToast = useToast((state) => state.openToast);
  const translations = useTranslations();

  useFocusEffect(
    useCallback(() => {
      init(setDisabled);
    }, [init])
  );

  const handleChange = useCallback((field: string, value: string) => {
    setState((prev) => ({
      ...prev,
      [field]: { value, error: false },
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    for (const key in state) {
      if (
        state[key].value.trim() === "" &&
        fieldsData[key].errorMessage.length > 0
      ) {
        setState({
          ...state,
          [key]: { value: state[key].value, error: true },
        });
        openToast(fieldsData[key].errorMessage, "error");
        return;
      }
    }

    submit(
      Object.fromEntries(
        Object.entries(state).map(([key, value]) => [key, value.value])
      ),
      setDisabled
    );
  }, [state, fieldsData, submit]);

  const scrollTo = useCallback(
    (y: number) => {
      scrollViewRef.current?.scrollTo({ y, animated: true });
    },
    [scrollViewRef]
  );

  const numberOfLines = useMemo(() => {
    return Object.fromEntries(
      Object.keys(fieldsData).map((key) => [key, key === "description" ? 5 : 1])
    );
  }, [fieldsData]);

  return (
    <View style={styles.wrapper}>
      <ScrollView ref={scrollViewRef} style={styles.scrollView}>
        <View style={[styles.body, { minHeight: minHeight }]}>
          {Object.entries(fieldsData).map(([key, value]) => (
            <Field
              key={key}
              suggestions={value.suggestions}
              label={value.label}
              fieldKey={key}
              value={state[key].value}
              error={state[key].error}
              onChange={handleChange}
              disabled={disabled}
              numberOfLines={numberOfLines[key]}
              scrollTo={scrollTo}
              scrollViewRef={scrollViewRef}
            />
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button
          mode="contained-tonal"
          disabled={disabled}
          onPress={handleSubmit}
        >
          {translations["Submit"]}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingBottom: 60,
    padding: 25,
    gap: 25,
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 15,
  },
});
