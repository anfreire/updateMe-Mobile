import * as React from 'react';
import isEqual from 'react-fast-compare';
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

export type MultiIconType = keyof typeof typeMapper;

interface MultiIconProps extends IconProps {
  type: MultiIconType;
}

const MultiIcon = (props: MultiIconProps) => {
  const {type, ...otherProps} = props;
  const IconComponent = React.useMemo(() => typeMapper[type], [type]);

  return (
    <React.Suspense fallback={null}>
      <IconComponent {...otherProps} />
    </React.Suspense>
  );
};

MultiIcon.displayName = 'MultiIcon';

export default React.memo(MultiIcon, isEqual);
