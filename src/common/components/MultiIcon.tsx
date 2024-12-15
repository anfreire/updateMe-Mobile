import React, {memo, useCallback} from 'react';
import {IconProps} from 'react-native-vector-icons/Icon';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome6Pro from 'react-native-vector-icons/FontAwesome6Pro';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';
import {StyleSheet, View} from 'react-native';
import {Style} from 'react-native-paper/lib/typescript/components/List/utils';

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

export type MultiIconType =
  | 'ant-design'
  | 'entypo'
  | 'evil-icons'
  | 'feather'
  | 'font-awesome'
  | 'font-awesome-5'
  | 'font-awesome-5-pro'
  | 'font-awesome-6'
  | 'font-awesome-6-pro'
  | 'fontisto'
  | 'foundation'
  | 'ionicons'
  | 'material-community'
  | 'material-icons'
  | 'octicons'
  | 'simple-line-icons'
  | 'zocial';

interface NamesMapper extends Record<MultiIconType, string> {
  'ant-design': keyof typeof import('react-native-vector-icons/dist/glyphmaps/AntDesign.json');
  entypo: keyof typeof import('react-native-vector-icons/dist/glyphmaps/Entypo.json');
  'evil-icons': keyof typeof import('react-native-vector-icons/dist/glyphmaps/EvilIcons.json');
  feather: keyof typeof import('react-native-vector-icons/dist/glyphmaps/Feather.json');
  'font-awesome': keyof typeof import('react-native-vector-icons/dist/glyphmaps/FontAwesome.json');
  'font-awesome-5': keyof typeof import('react-native-vector-icons/dist/glyphmaps/FontAwesome5Free.json');
  'font-awesome-5-pro': keyof typeof import('react-native-vector-icons/dist/glyphmaps/FontAwesome5Pro.json');
  'font-awesome-6': keyof typeof import('react-native-vector-icons/dist/glyphmaps/FontAwesome6Free.json');
  'font-awesome-6-pro': keyof typeof import('react-native-vector-icons/dist/glyphmaps/FontAwesome6Pro.json');
  fontisto: keyof typeof import('react-native-vector-icons/dist/glyphmaps/Fontisto.json');
  foundation: keyof typeof import('react-native-vector-icons/dist/glyphmaps/Foundation.json');
  ionicons: keyof typeof import('react-native-vector-icons/dist/glyphmaps/Ionicons.json');
  'material-community': keyof typeof import('react-native-vector-icons/dist/glyphmaps/MaterialCommunityIcons.json');
  'material-icons': keyof typeof import('react-native-vector-icons/dist/glyphmaps/MaterialIcons.json');
  octicons: keyof typeof import('react-native-vector-icons/dist/glyphmaps/Octicons.json');
  'simple-line-icons': keyof typeof import('react-native-vector-icons/dist/glyphmaps/SimpleLineIcons.json');
  zocial: keyof typeof import('react-native-vector-icons/dist/glyphmaps/Zocial.json');
}

type IconName<T extends MultiIconType | undefined> =
  NamesMapper[T extends undefined ? 'material-community' : T];

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const ICON_TYPE_TO_COMPONENT: Record<
  MultiIconType,
  React.ComponentType<IconProps>
> = {
  'ant-design': AntDesign,
  entypo: Entypo,
  'evil-icons': EvilIcons,
  feather: Feather,
  'font-awesome': FontAwesome,
  'font-awesome-5': FontAwesome5,
  'font-awesome-5-pro': FontAwesome5Pro,
  'font-awesome-6': FontAwesome6,
  'font-awesome-6-pro': FontAwesome6Pro,
  fontisto: Fontisto,
  foundation: Foundation,
  ionicons: Ionicons,
  'material-community': MaterialCommunityIcons,
  'material-icons': MaterialIcons,
  octicons: Octicons,
  'simple-line-icons': SimpleLineIcons,
  zocial: Zocial,
};

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface MultiIconProps<T extends MultiIconType = MultiIconType>
  extends Omit<IconProps, 'name'> {
  name: IconName<T>;
  type?: T;
}

const MultiIcon = (props: MultiIconProps) => {
  const {type, ...otherProps} = props;

  if (type && !ICON_TYPE_TO_COMPONENT[type]) {
    throw new Error(`Invalid icon type: ${type}`);
  }

  return React.createElement(
    ICON_TYPE_TO_COMPONENT[type ?? 'material-community'],
    otherProps,
  );
};

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

export function buildMultiIcon<T extends MultiIconType | undefined = undefined>(
  name: IconName<T>,
  type?: T,
) {
  return (props: {color: string; style?: Style}) => (
    <View style={[styles.iconWrapper, props.style]}>
      <MultiIcon name={name} type={type} color={props.color} size={20} />
    </View>
  );
}

/******************************************************************************
 *                                    HOOK                                    *
 ******************************************************************************/

export interface useMultiIconProps<T extends MultiIconType = MultiIconType> {
  type?: T;
  name: IconName<T>;
}

export function useMultiIcon({name, type}: useMultiIconProps) {
  return useCallback(
    (props: {color: string; style?: Style}) => (
      <View style={[styles.iconWrapper, props.style]}>
        <MultiIcon name={name} type={type} color={props.color} size={20} />
      </View>
    ),
    [name, type],
  );
}

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  iconWrapper: {
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(MultiIcon) as React.FC<MultiIconProps>;
