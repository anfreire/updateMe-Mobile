import * as React from 'react';
import {IconProps} from 'react-native-vector-icons/Icon';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';

/******************************************************************************
 *                                   TYPES                                    *
 ******************************************************************************/

const typeMapper: Record<string, React.ComponentType<IconProps>> = {
  'ant-design': AntDesign,
  entypo: Entypo,
  'evil-icons': EvilIcons,
  feather: Feather,
  'font-awesome': FontAwesome,
  'font-awesome-5': FontAwesome5,
  fontisto: Fontisto,
  foundation: Foundation,
  ionicons: Ionicons,
  'material-community': MaterialCommunityIcons,
  'material-icons': MaterialIcons,
  octicons: Octicons,
  'simple-line-icons': SimpleLineIcons,
  zocial: Zocial,
};

export type MultiIconType =
  | 'ant-design'
  | 'entypo'
  | 'evil-icons'
  | 'feather'
  | 'font-awesome'
  | 'font-awesome-5'
  | 'fontisto'
  | 'foundation'
  | 'ionicons'
  | 'material-community'
  | 'material-icons'
  | 'octicons'
  | 'simple-line-icons'
  | 'zocial';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

interface MultiIconProps extends IconProps {
  type?: MultiIconType;
}

const MultiIcon = (props: MultiIconProps) => {
  const {type, ...otherProps} = props;

  if (type && !typeMapper[type]) {
    throw new Error(`Invalid icon type: ${type}`);
  }

  return React.createElement(
    typeMapper[type ?? 'material-community'],
    otherProps,
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default React.memo(MultiIcon) as React.FC<MultiIconProps>;
