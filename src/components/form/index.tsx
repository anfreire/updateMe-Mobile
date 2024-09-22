import * as React from 'react';
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import {Button} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import {useToast} from '@/states/runtime/toast';
import {useTranslations} from '@/states/persistent/translations';
import FormField from './field';

interface FormFieldData {
  label: string;
  errorMessage: string;
  suggestions?: string[];
}

export interface FormFieldState {
  value: string;
  error: boolean;
}

export type FormFieldsState = Record<string, FormFieldState>;

const MIN_HEIGHT = Dimensions.get('screen').height - 100;

interface FormScreenProps {
  fieldsData: Record<string, FormFieldData>;
  init: (setDisabled: React.Dispatch<React.SetStateAction<boolean>>) => void;
  submit: (
    data: Record<string, string>,
    setDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  ) => void;
}

const FormScreen = ({fieldsData, init, submit}: FormScreenProps) => {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [disabled, setDisabled] = React.useState(false);
  const [fieldsState, setFieldsState] = React.useState<FormFieldsState>(() =>
    Object.fromEntries(
      Object.keys(fieldsData).map(key => [key, {value: '', error: false}]),
    ),
  );
  const openToast = useToast(state => state.openToast);
  const translations = useTranslations(state => state.translations);

  useFocusEffect(
    React.useCallback(() => {
      init(setDisabled);
    }, [init]),
  );

  const handleChange = React.useCallback((field: string, value: string) => {
    setFieldsState(prev => ({
      ...prev,
      [field]: {value, error: false},
    }));
  }, []);

  const handleSubmit = React.useCallback(() => {
    const errors = Object.entries(fieldsState).reduce(
      (acc, [key, value]) => {
        if (value.value.trim() === '' && fieldsData[key].errorMessage) {
          acc[key] = true;
          openToast(fieldsData[key].errorMessage, {
            type: 'error',
          });
        }
        return acc;
      },
      {} as Record<string, boolean>,
    );

    if (Object.keys(errors).length > 0) {
      setFieldsState(prev => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(errors).map(([key, error]) => [
            key,
            {...prev[key], error},
          ]),
        ),
      }));
      return;
    }

    submit(
      Object.fromEntries(
        Object.entries(fieldsState).map(([key, {value}]) => [key, value]),
      ),
      setDisabled,
    );
  }, [fieldsState, submit, fieldsData]);

  const scrollTo = React.useCallback((y: number) => {
    scrollViewRef.current?.scrollTo({y, animated: true});
  }, []);

  const numberOfLines = React.useMemo(
    () =>
      Object.fromEntries(
        Object.keys(fieldsData).map(key => [
          key,
          key === 'description' ? 5 : 1,
        ]),
      ),
    [fieldsData],
  );

  const renderField: ListRenderItem<[string, FormFieldData]> =
    React.useCallback(
      ({item: [key, field]}) => (
        <FormField
          suggestions={field.suggestions}
          label={field.label}
          fieldKey={key}
          value={fieldsState[key].value}
          error={fieldsState[key].error}
          onChange={handleChange}
          disabled={disabled}
          numberOfLines={numberOfLines[key]}
          scrollTo={scrollTo}
          scrollViewRef={scrollViewRef}
        />
      ),
      [fieldsState, disabled, handleChange, numberOfLines, scrollTo],
    );

  return (
    <View style={styles.wrapper}>
      <ScrollView ref={scrollViewRef} style={styles.scrollView}>
        <View style={[styles.body, {minHeight: MIN_HEIGHT}]}>
          <FlatList
            data={Object.entries(fieldsData)}
            renderItem={renderField}
            keyExtractor={([key]) => key}
          />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button
          mode="contained-tonal"
          disabled={disabled}
          onPress={handleSubmit}>
          {translations['Submit']}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingBottom: 60,
    padding: 25,
    gap: 25,
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 15,
  },
});

FormScreen.displayName = 'FormScreen';

export default React.memo(FormScreen);
