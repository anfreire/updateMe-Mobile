import {Dimensions, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import React, {useReducer, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {ScrollView} from 'react-native';
import {useToast} from '@/states/temporary/toast';

type FieldsDataType = Record<string, {label: string; errorMessage: string}>;
//------------------------------------------------------
// TYPES
interface FieldState {
  value: string;
  error: boolean;
}
type FieldStates = Record<string, FieldState>;
type ValueType<T> = {field: string; value: T};
type FieldsAction =
  | {
      type: 'CHANGE';
      value: ValueType<string>;
    }
  | {type: 'ERROR'; value: ValueType<boolean>}
  | {type: 'RESET'};

//------------------------------------------------------
// REDUCER
const fieldsReducer = (
  state: FieldStates,
  action: FieldsAction,
): FieldStates => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        [action.value.field]: {value: action.value.value, error: false},
      };
    case 'ERROR':
      return {
        ...state,
        [action.value.field]: {
          value: state[action.value.field].value,
          error: action.value.value,
        },
      };
    case 'RESET':
      const resetedState = Object.fromEntries(
        Object.keys(state).map(key => [key, {value: '', error: false}]),
      );
      return resetedState;
    default:
      return state;
  }
};

function Field({
  label,
  fieldKey,
  state,
  dispatch,
  disabled,
  numberOfLines = 1,
  scrollTo,
  scrollViewRef,
}: {
  label: string;
  fieldKey: string;
  state: FieldState;
  dispatch: React.Dispatch<FieldsAction>;
  disabled: boolean;
  numberOfLines?: number;
  scrollTo?: (y: number) => void;
  scrollViewRef?: React.RefObject<ScrollView>;
}) {
  const [layoutReady, setLayoutReady] = useState(false);
  const viewRef = React.useRef<View>(null);

  const onFocused = () => {
    if (layoutReady) {
      viewRef.current?.measureLayout(
        scrollViewRef?.current?.getInnerViewNode(),
        (x, y) => {
          scrollTo?.(y - 150);
        },
      );
    }
  };

  return (
    <View
      onLayout={() => setLayoutReady(true)}
      style={{
        width: '100%',
      }}
      ref={viewRef}>
      <TextInput
        mode="outlined"
        onFocus={onFocused}
        label={label}
        editable={!disabled}
        multiline={numberOfLines > 1}
        numberOfLines={1}
        maxLength={numberOfLines > 1 ? 100 : 100}
        value={state.value}
        onChangeText={text =>
          dispatch({type: 'CHANGE', value: {field: fieldKey, value: text}})
        }
        style={{
          width: '100%',
          minHeight: numberOfLines > 1 ? 150 : undefined,
        }}
        error={state.error}
      />
    </View>
  );
}

export default function FormScreen({
  fieldsData,
  init,
  submit,
}: {
  fieldsData: FieldsDataType;
  init: (setDisabled: (value: boolean) => void) => void;
  submit: (
    data: Record<string, string>,
    setDisabled: (value: boolean) => void,
  ) => void;
}) {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [disabled, setDisabled] = useState(false);
  const [state, dispatch] = useReducer(
    fieldsReducer,
    Object.fromEntries(
      Object.keys(fieldsData).map(key => [key, {value: '', error: false}]),
    ),
  );
  const openToast = useToast().openToast;
  const screenHeight = Dimensions.get('screen').height;

  useFocusEffect(
    React.useCallback(() => {
      init(setDisabled);
    }, []),
  );

  const _submit = () => {
    for (const key in state) {
      const value = state[key];
      if (
        value.value.trim() === '' &&
        fieldsData[key].errorMessage.length > 0
      ) {
        dispatch({
          type: 'ERROR',
          value: {field: key, value: true},
        });
        openToast(fieldsData[key].errorMessage, 'error');
        return;
      }
    }
    submit(
      Object.fromEntries(
        Object.entries(state).map(([key, value]) => [key, value.value]),
      ),
      setDisabled,
    );
  };

  const scrollTo = (y: number) => {
    scrollViewRef.current?.scrollTo({y, animated: true});
  };

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
      }}>
      <ScrollView ref={scrollViewRef} style={{width: '100%'}}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            minHeight: screenHeight - 100,
            paddingBottom: 60,
            padding: 25,
            gap: 25,
            flex: 1,
          }}>
          {Object.entries(fieldsData).map(([key, value]) => (
            <Field
              key={key}
              label={value.label}
              fieldKey={key}
              state={state[key]}
              dispatch={dispatch}
              disabled={disabled}
              numberOfLines={key === 'description' ? 5 : 1}
              scrollTo={scrollTo}
              scrollViewRef={scrollViewRef}
            />
          ))}
        </View>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 15,
        }}>
        <Button mode="contained-tonal" disabled={disabled} onPress={_submit}>
          Submit
        </Button>
      </View>
    </View>
  );
}
