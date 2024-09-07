import * as React from "react";
import isEqual from "react-fast-compare";
import { IconProps } from "react-native-vector-icons/Icon";

const iconTypes = [
  "AntDesign",
  "Entypo",
  "EvilIcons",
  "Feather",
  "FontAwesome",
  "FontAwesome5",
  "Fontisto",
  "Foundation",
  "Ionicons",
  "MaterialCommunityIcons",
  "MaterialIcons",
  "Octicons",
  "SimpleLineIcons",
  "Zocial",
] as const;

type IconType = (typeof iconTypes)[number];
type IconComponent = React.ComponentType<IconProps>;

const iconMapper: Record<
  IconType,
  React.LazyExoticComponent<IconComponent>
> = iconTypes.reduce(
  (acc, type) => ({
    ...acc,
    [type]: React.lazy(() => import(`react-native-vector-icons/${type}`)),
  }),
  {} as Record<IconType, React.LazyExoticComponent<IconComponent>>
);

export type MultiIconType =
  | "ant-design"
  | "entypo"
  | "evil-icons"
  | "feather"
  | "font-awesome"
  | "font-awesome-5"
  | "fontisto"
  | "foundation"
  | "ionicons"
  | "material-community"
  | "material-icons"
  | "octicons"
  | "simple-line-icons"
  | "zocial";

const typeMapper: Record<MultiIconType, IconType> = {
  "ant-design": "AntDesign",
  entypo: "Entypo",
  "evil-icons": "EvilIcons",
  feather: "Feather",
  "font-awesome": "FontAwesome",
  "font-awesome-5": "FontAwesome5",
  fontisto: "Fontisto",
  foundation: "Foundation",
  ionicons: "Ionicons",
  "material-community": "MaterialCommunityIcons",
  "material-icons": "MaterialIcons",
  octicons: "Octicons",
  "simple-line-icons": "SimpleLineIcons",
  zocial: "Zocial",
};

interface MultiIconProps extends Omit<IconProps, "ref"> {
  type: MultiIconType;
}

const MultiIcon = React.forwardRef<React.Component<IconProps>, MultiIconProps>(
  (props, ref) => {
    const { type, ...otherProps } = props;
    const IconComponent = React.useMemo(
      () => iconMapper[typeMapper[type]],
      [type]
    );

    return (
      <React.Suspense fallback={null}>
        <IconComponent {...otherProps} ref={ref} />
      </React.Suspense>
    );
  }
);

MultiIcon.displayName = "MultiIcon";

export default React.memo(MultiIcon, isEqual);
