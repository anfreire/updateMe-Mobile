import {useNavigation} from '@react-navigation/native';
import {
  MainStackNavigation,
  MainStackPage,
  MainStackParams,
  Stack,
} from '@/navigation/types';
import {useCallback} from 'react';

type MainStackScreen = Exclude<MainStackPage, `${string}-stack`>;

type NavigateScreenProps = {
  [K in MainStackScreen]: {
    screen: K;
    params: MainStackParams[K];
    stack?: never;
  };
}[MainStackScreen];

type NavigateStackProps = {
  [K in Stack]: {
    [P in keyof MainStackParams[K]]: {
      stack: K;
    } & (MainStackParams[K] extends {params: undefined}
      ? {screen: MainStackParams[K]['screen']}
      : MainStackParams[K]);
  }[keyof MainStackParams[K]];
}[Stack];

export type useNavigateProps = NavigateScreenProps | NavigateStackProps;

export function useNavigate() {
  const navigation = useNavigation<MainStackNavigation>();

  const navigate = useCallback(
    ({stack, screen, params}: NavigateScreenProps | NavigateStackProps) => {
      if (!stack) {
        navigation.navigate(screen, params);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        navigation.navigate(stack as any, {
          screen,
          params,
        });
      }
    },
    [navigation],
  );

  return navigate;
}
