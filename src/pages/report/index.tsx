import * as React from "react";
import FormScreen from "@/components/form";
import { useFeedback } from "@/states/persistent/feedback";
import { Logger } from "@/states/persistent/logs";
import { useToken } from "@/states/persistent/token";
import { useTranslations } from "@/states/persistent/translations";
import { useToast } from "@/states/temporary/toast";
export default function ReportScreen() {
  const openToast = useToast((state) => state.openToast);
  const [didReport, registerReport] = useFeedback((state) => [
    state.didReport,
    state.registerReport,
  ]);
  const getToken = useToken((state) => state.getToken);
  const translations = useTranslations();

  const FieldsData: Record<string, { label: string; errorMessage: string }> =
    useMemo(
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

  const onMount = useCallback(
    (setDisabled: (value: boolean) => void) => {
      if (didReport()) {
        setDisabled(true);
        openToast(
          translations["You have already submitted a report today"],
          "warning"
        );
      } else setDisabled(false);
    },
    [translations]
  );

  const onSubmit = useCallback(
    (data: Record<string, string>, setDisabled: (value: boolean) => void) => {
      setDisabled(true);
      fetch("https://updateme.fortunacasino.store/reports", {
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
            registerReport();
            openToast(translations["Report submitted successfully"], "success");
            return;
          }

          response.json().then((data) => {
            const message =
              data.message ?? translations["Failed to submit report"];
            openToast(message, "error");
            setDisabled(false);
            Logger.error(message);
          });
        })
        .catch((e) => {
          openToast(translations["Failed to submit report"], "error");
          setDisabled(false);
          Logger.error(`Failed to submit report: ${e}`);
        });
    },
    [translations]
  );

  return (
    <FormScreen fieldsData={FieldsData} init={onMount} submit={onSubmit} />
  );
}
