import * as React from "react";
import FormScreen from "@/components/form";
import { useFeedback } from "@/states/persistent/feedback";
import { useToken } from "@/states/persistent/session";
import { useToast } from "@/states/runtime/toast";
import SuggestionsStats from "./stats";
import { useTranslations } from "@/states/persistent/translations";
import { Logger } from "@/states/persistent/logs";

export default function SuggestScreen() {
  const openToast = useToast().openToast;
  const [didSuggest, registerSuggestion] = useFeedback((state) => [
    state.didSuggest,
    state.registerSuggestion,
  ]);
  const [appsSuggestions, setAppsSuggestions] = React.useState<string[]>([]);
  const [suggested, setSuggested] = React.useState(false);
  const translations = useTranslations((state) => state.translations);
  const getToken = useToken((state) => state.getToken);

  const FieldsData: Record<string, { label: string; errorMessage: string }> =
    React.useMemo(
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

  const onMount = React.useCallback(
    (setDisabled: (value: boolean) => void) => {
      setAppsSuggestions([]);
      if (didSuggest()) {
        setSuggested(true);
        openToast(translations["You can only suggest one app per day"], {
          type: "warning",
        });
      } else setDisabled(false);
    },
    [translations]
  );

  const onSubmit = React.useCallback(
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
            openToast(translations["Suggestion submitted successfully"], {
              type: "success",
            });
            return;
          }
          response.json().then((data) => {
            if (data.apps) {
              setAppsSuggestions(data.apps);
            }
            const message =
              data.message ?? translations["Failed to submit suggestion"];
            openToast(message, { type: "error" });
            setDisabled(false);
            Logger.error(message);
          });
        })
        .catch((e) => {
          openToast(translations["Failed to submit suggestion"], {
            type: "error",
          });
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
