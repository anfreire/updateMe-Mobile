import FormScreen from "@/components/form";
import { useFeedback } from "@/states/persistent/feedback";
import { useToken } from "@/states/persistent/token";
import { useToast } from "@/states/temporary/toast";
import { useEffect, useState } from "react";
import SuggestionsStats from "./stats";
import { useFocusEffect } from "@react-navigation/native";

const FieldsData: Record<string, { label: string; errorMessage: string }> = {
  name: {
    label: "What's your name?",
    errorMessage: "Name is required",
  },
  app: {
    label: "Which app do you want to suggest?",
    errorMessage: "App name is required",
  },
  description: {
    label: "Are you looking for a specific feature?",
    errorMessage: "",
  },
};

export default function SuggestScreen() {
  const openToast = useToast().openToast;
  const { didSuggest, registerSuggestion } = useFeedback();
  const [appsSuggestions, setAppsSuggestions] = useState<string[]>([]);
  const [suggested, setSuggested] = useState(false);

  const init = (setDisabled: (value: boolean) => void) => {
    setDisabled(false);
    setAppsSuggestions([]);
    if (didSuggest()) {
      setSuggested(true);
      openToast("You can only suggest one app per day");
    }
  };

  const submit = (
    data: Record<string, string>,
    setDisabled: (value: boolean) => void
  ) => {
    setAppsSuggestions([]);
    setDisabled(true);
    fetch("https://updateme.fortunacasino.store/suggestions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        token: useToken.getState().token,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          registerSuggestion();
          setSuggested(true);
          openToast("Report submitted successfully", "success");
          return;
        }
        response.json().then((data) => {
          if (data.apps) {
            setAppsSuggestions(data.apps);
          }
          openToast(data.message ?? "Failed to submit report", "error");
          setDisabled(false);
        });
      })
      .catch(() => {
        openToast("Failed to submit suggestion", "error");
        setDisabled(false);
      });
  };

  return suggested ? (
    <SuggestionsStats />
  ) : (
    <FormScreen
      fieldsData={{
        ...FieldsData,
        app: { ...FieldsData.app, suggestions: appsSuggestions },
      }}
      init={init}
      submit={submit}
    />
  );
}
