import * as React from "react";
import FormScreen from "@/components/form";
import { useFeedback } from "@/states/persistent/feedback";
import { Logger } from "@/states/persistent/logs";
import { useTranslations } from "@/states/persistent/translations";
import { useToast } from "@/states/runtime/toast";
import { useSession } from "@/states/runtime/session";
import { useCurrPageEffect } from "@/hooks/useCurrPageEffect";
import { Page } from "@/types/navigation";

const CURR_PAGE: Page = "report";

export default function ReportScreen() {
  const openToast = useToast((state) => state.openToast);
  const [didReport, registerReport] = useFeedback((state) => [
    state.didReport,
    state.registerReport,
  ]);
  const token = useSession((state) => state.token);
  const translations = useTranslations((state) => state.translations);

  const FieldsData: Record<string, { label: string; errorMessage: string }> =
    React.useMemo(
      () => ({
        name: {
          label: translations["What's your name?"],
          errorMessage: translations["Name is required"],
        },
        item: {
          label: translations["Where is the problem?"],
          errorMessage: translations["Problem location is required"],
        },
        description: {
          label: translations["Describe the problem"],
          errorMessage: translations["Description is required"],
        },
      }),
      [translations]
    );

  const onMount = React.useCallback(
    (setDisabled: (value: boolean) => void) => {
      if (didReport()) {
        setDisabled(true);
        openToast(translations["You have already submitted a report today"], {
          type: "warning",
        });
      } else setDisabled(false);
    },
    [translations]
  );

  const onSubmit = React.useCallback(
    (data: Record<string, string>, setDisabled: (value: boolean) => void) => {
      setDisabled(true);
      fetch("https://updateme.fortunacasino.store/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          token: token,
        }),
      })
        .then((response) => {
          if (response.status === 201) {
            registerReport();
            openToast(translations["Report submitted successfully"], {
              type: "success",
            });
            return;
          }

          response.json().then((res) => {
            const message =
              res.message ?? translations["Failed to submit report"];
            openToast(message, { type: "error" });
            setDisabled(false);
            Logger.error(message);
          });
        })
        .catch((e) => {
          openToast(translations["Failed to submit report"], { type: "error" });
          setDisabled(false);
          Logger.error(`Failed to submit report: ${e}`);
        });
    },
    [translations, token]
  );

  useCurrPageEffect(CURR_PAGE);

  return (
    <FormScreen fieldsData={FieldsData} init={onMount} submit={onSubmit} />
  );
}
