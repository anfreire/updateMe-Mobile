import FormScreen from "@/components/form";
import { FormSpree } from "@/lib/formspree";
import { useFeedback } from "@/states/persistent/feedback";
import { useToast } from "@/states/temporary/toast";

const FieldsData: Record<string, {label: string; errorMessage: string}> = {
  name: {
    label: "What's your name?",
    errorMessage: 'Name is required',
  },
  app: {
    label: 'Which app do you want to suggest?',
    errorMessage: 'App name is required',
  },
  description: {
    label: 'Are you looking for a specific feature?',
    errorMessage: '',
  },
};

export default function SuggestScreen() {
  const openToast = useToast().openToast;
  const {didSuggest, registerSuggestion} = useFeedback();

  const init = (setDisabled: (value: boolean) => void) => {
    setDisabled(false);
    if (didSuggest()) {
      setDisabled(true);
      openToast('You have already submitted a suggestion today', 'warning');
    }
  };

  const submit = (
    data: Record<string, string>,
    setDisabled: (value: boolean) => void,
  ) => {
    setDisabled(true);
    FormSpree.submitForm('suggestions', data).then(res => {
      if (res) {
        registerSuggestion();
        openToast('Suggestion submitted', 'success');
      } else {
        openToast('Failed to submit suggestion', 'error');
        setDisabled(false);
      }
    });
  };

  return <FormScreen fieldsData={FieldsData} init={init} submit={submit} />;
}
