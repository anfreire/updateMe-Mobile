import FormScreen from "@/components/form";
import { useFeedback } from "@/states/persistent/feedback";
import { useToken } from "@/states/persistent/token";
import { useToast } from "@/states/temporary/toast";
import { useCallback, useMemo, useState } from "react";
import SuggestionsStats from "./stats";
import { useTranslations } from "@/states/persistent/translations";
import { Logger } from "@/states/persistent/logs";

export default function SuggestScreen() {
  const openToast = useToast().openToast;
  const [didSuggest, registerSuggestion] = useFeedback((state) => [
    state.didSuggest,
    state.registerSuggestion,
  ]);
  const [appsSuggestions, setAppsSuggestions] = useState<string[]>([]);
  const [suggested, setSuggested] = useState(false);
  const translations = useTranslations();
  const getToken = useToken((state) => state.getToken);

  const FieldsData: Record<string, { label: string; errorMessage: string }> =
    useMemo(
      () => ({
        name: {
          label: translations["What's your name?"],
          errorMessage: translations["Name is required"],
        },
        app: {
          label: translations["Which app do you want to suggest?"],
          errorMessage: translations["App name is required"],
        },
        description: {
          label: translations["Are you looking for a specific feature?"],
          errorMessage: "",
        },
      }),
      [translations]
    );

  const onMount = useCallback(
    (setDisabled: (value: boolean) => void) => {
      setAppsSuggestions([]);
      if (didSuggest()) {
        setSuggested(true);
        openToast(
          translations["You can only suggest one app per day"],
          "warning"
        );
      } else setDisabled(false);
    },
    [translations]
  );

  const onSubmit = useCallback(
    (data: Record<string, string>, setDisabled: (value: boolean) => void) => {
      setAppsSuggestions([]);
      setDisabled(true);
      fetch("https://updateme.fortunacasino.store/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          token: getToken(),
        }),
      })
        .then((response) => {
          if (response.status === 201) {
            registerSuggestion();
            setSuggested(true);
            openToast(
              translations["Suggestion submitted successfully"],
              "success"
            );
            return;
          }
          response.json().then((data) => {
            if (data.apps) {
              setAppsSuggestions(data.apps);
            }
            const message =
              data.message ?? translations["Failed to submit suggestion"];
            openToast(message, "error");
            setDisabled(false);
            Logger.error(message);
          });
        })
        .catch((e) => {
          openToast(translations["Failed to submit suggestion"], "error");
          setDisabled(false);
          Logger.error(`Failed to submit suggestion: ${e}`);
        });
    },
    [translations]
  );

  if (suggested) {
    return <SuggestionsStats />;
  }

  return (
    <FormScreen
      fieldsData={{
        ...FieldsData,
        app: { ...FieldsData.app, suggestions: appsSuggestions },
      }}
      init={onMount}
      submit={onSubmit}
    />
  );
}
