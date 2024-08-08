import React, { useMemo } from "react";
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

const iconMapper: Record<IconType, React.ComponentType<any>> = iconTypes.reduce(
	(acc, type) => ({
		...acc,
		[type]: React.lazy(() => import(`react-native-vector-icons/${type}`)),
	}),
	{} as Record<IconType, React.ComponentType<any>>,
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

interface MultiIconProps extends IconProps {
	type: MultiIconType;
}

const MultiIcon = React.forwardRef<any, MultiIconProps>((props, ref) => {
	const { type, ...otherProps } = props;

	const IconComponent = useMemo(() => iconMapper[typeMapper[type]], [type]);

	return (
		<React.Suspense fallback={null}>
			<IconComponent {...otherProps} ref={ref} />
		</React.Suspense>
	);
});

export default MultiIcon;
