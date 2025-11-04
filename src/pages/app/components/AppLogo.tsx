import * as React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useTheme} from '@/theme';
import FastImage from 'react-native-fast-image';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const ICON_SIZE = 56;

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

const useAppLogo = (title: string, icon: string) => {
  const {schemedTheme} = useTheme();

  return {schemedTheme};
};

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface AppLogoProps {
  title: string;
  icon: string;
}

const AppLogo = ({title, icon}: AppLogoProps) => {
  const {schemedTheme} = useAppLogo(title, icon);

  return (
    <View style={styles.container}>
      {/* App Icon */}
      <View
        style={[
          styles.iconContainer,
          {backgroundColor: schemedTheme.surfaceContainerHigh},
        ]}>
        <FastImage
          resizeMode={FastImage.resizeMode.cover}
          style={styles.appIcon}
          source={{uri: icon}}
        />
      </View>

      {/* App Title */}
      <View style={styles.detailsContainer}>
        <Text
          style={[styles.appTitle, {color: schemedTheme.onSurface}]}
          variant="headlineSmall"
          numberOfLines={1}>
          {title}
        </Text>
      </View>
    </View>
  );
};

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: ICON_SIZE + 8,
    height: ICON_SIZE + 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  appIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: 12,
  },
  detailsContainer: {
    flex: 1,
  },
  appTitle: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(AppLogo);
