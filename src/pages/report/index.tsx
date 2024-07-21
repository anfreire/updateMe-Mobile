import FormScreen from '@/components/form';
import {useFeedback} from '@/states/persistent/feedback';
import {useToken} from '@/states/persistent/token';
import {useToast} from '@/states/temporary/toast';

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
    fetch('http://updateme.fortunacasino.store/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        token: useToken.getState().token,
      }),
    })
      .then(response => {
        if (response.status === 201) {
          registerReport();
          openToast('Report submitted successfully', 'success');
          return;
        }
        response.json().then(data => {
            openToast(data.message ?? 'Failed to submit report', 'error');
            setDisabled(false);
        });
      })
      .catch(() => {
        openToast('Failed to submit report', 'error');
        setDisabled(false);
      });
  };

  return <FormScreen fieldsData={FieldsData} init={init} submit={submit} />;
}
