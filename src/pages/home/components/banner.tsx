import * as React from "react";
import { Banner } from "react-native-paper";
import { useSession } from "@/states/temporary/session";
import { useVersions } from "@/states/computed/versions";
import { useNavigate } from "@/hooks/useNavigate";

const makeUpdatesMessage = (updates: string[]) => {
	let updatesCopy = [...updates];
	if (updates.length === 1) {
		return `There is an update available for ${updates[0]}`;
	} else {
		const lastApp = updatesCopy.pop();
		return (
			`There are updates available for ${updatesCopy.join(", ")}` +
			` and ${lastApp}`
		);
	}
};

export default function HomeBanner() {
	const [bannerDismissed, activateFlag] = useSession((state) => [
		state.flags.homeBannerDismissed,
		state.activateFlag,
	]);
	const updates = useVersions((state) => state.updates);
	const navigate = useNavigate();

	const updatesMessage = React.useMemo(
		() => makeUpdatesMessage(updates),
		[updates],
	);

	return (
		<Banner
			visible={!bannerDismissed}
			actions={[
				{
					label: "Dismiss",
					onPress: () => activateFlag("homeBannerDismissed"),
				},
				{
					label: "View Updates",
					onPress: () => navigate("updates"),
				},
			]}
		>
			{updatesMessage}
		</Banner>
	);
}
