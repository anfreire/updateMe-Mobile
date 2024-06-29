import FormScreen from "@/components/form";
import { FormSpree } from "@/lib/formspree";
import { useFeedback } from "@/states/persistent/feedback";
import { useToast } from "@/states/temporary/toast";

const FieldsData: Record<string, {label: string; errorMessage: string}> = {
  name: {
    label: "What's your name?",
    errorMessage: 'Name is required',
  },
  item: {
    label: 'Where is the problem?',
    errorMessage: 'Problem location is required',
  },
  description: {
    label: 'Describe the problem',
    errorMessage: 'Description is required',
  },
};

export default function ReportScreen() {
  const openToast = useToast().openToast;
  const {didReport, registerReport} = useFeedback();

  const init = (setDisabled: (value: boolean) => void) => {
    setDisabled(false);
    if (didReport()) {
      setDisabled(true);
      openToast('You have already submitted a report today', 'warning');
    }
  };

  const submit = (
    data: Record<string, string>,
    setDisabled: (value: boolean) => void,
  ) => {
    setDisabled(true);
    FormSpree.submitForm('reports', data).then(res => {
      if (res) {
        registerReport();
        openToast('Report submitted', 'success');
      } else {
        openToast('Failed to submit report', 'error');
        setDisabled(false);
      }
    });
  };

  return <FormScreen fieldsData={FieldsData} init={init} submit={submit} />;
}
