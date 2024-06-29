import React from 'react';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import EvilIconsIcon from 'react-native-vector-icons/EvilIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import {IconProps} from 'react-native-vector-icons/Icon';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIconsIcon from 'react-native-vector-icons/MaterialIcons';
import OcticonsIcon from 'react-native-vector-icons/Octicons';
import SimpleLineIconsIcon from 'react-native-vector-icons/SimpleLineIcons';
import ZocialIcon from 'react-native-vector-icons/Zocial';

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

const iconMapper: Record<MultiIconType, React.ComponentType<any>> = {
  'ant-design': AntDesignIcon,
  entypo: EntypoIcon,
  'evil-icons': EvilIconsIcon,
  feather: FeatherIcon,
  'font-awesome': FontAwesomeIcon,
  'font-awesome-5': FontAwesome5Icon,
  fontisto: FontistoIcon,
  foundation: FoundationIcon,
  ionicons: IoniconsIcon,
  'material-community': MaterialCommunityIcon,
  'material-icons': MaterialIconsIcon,
  octicons: OcticonsIcon,
  'simple-line-icons': SimpleLineIconsIcon,
  zocial: ZocialIcon,
};

interface MultiIconProps extends IconProps {
  type: MultiIconType;
}

const MultiIcon = React.forwardRef((props: MultiIconProps, ref: any) => {
  const {type, name, ...otherProps} = props;
  return React.createElement(iconMapper[type], {
    name,
    ...otherProps,
    ref,
  });
});

export default MultiIcon;
