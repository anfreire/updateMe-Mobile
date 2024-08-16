import React, { useCallback, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Chip, TextInput } from "react-native-paper";
import { ScrollView } from "react-native";

export type FieldsDataType = Record<
	string,
	{ label: string; errorMessage: string; suggestions?: string[] }
>;

export interface FieldState {
	value: string;
	error: boolean;
}

export type FieldStates = Record<string, FieldState>;

export default function Field({
	label,
	suggestions,
	fieldKey,
	value,
	error,
	onChange,
	disabled,
	numberOfLines = 1,
	scrollTo,
	scrollViewRef,
}: {
	label: string;
	suggestions?: string[];
	fieldKey: string;
	value: string;
	error: boolean;
	onChange: (field: string, value: string) => void;
	disabled: boolean;
	numberOfLines?: number;
	scrollTo?: (y: number) => void;
	scrollViewRef?: React.RefObject<ScrollView>;
}) {
	const viewRef = useRef<View>(null);

	const onFocused = useCallback(() => {
		viewRef.current?.measureLayout(
			scrollViewRef?.current?.getInnerViewNode(),
			(_, y) => {
				scrollTo?.(y - 150);
			},
		);
	}, [scrollTo, scrollViewRef]);

	const multilineProps = useMemo(
		() => ({
			multiline: numberOfLines > 1,
			maxLength: numberOfLines > 1 ? 100 : 100,
			minHeight: numberOfLines > 1 ? 150 : undefined,
		}),
		[numberOfLines],
	);

	return (
		<View style={syles.wrapper} ref={viewRef}>
			<TextInput
				mode="outlined"
				onFocus={onFocused}
				label={label}
				disabled={disabled}
				editable={!disabled}
				multiline={multilineProps.multiline}
				numberOfLines={1}
				maxLength={multilineProps.maxLength}
				value={value}
				onChangeText={(text) => onChange(fieldKey, text)}
				style={[syles.input, { minHeight: multilineProps.minHeight }]}
				error={error}
			/>
			{suggestions?.length ? (
				<View style={syles.suggestions}>
					{suggestions.map((suggestion, index) => (
						<Chip
							compact
							onPress={() => onChange(fieldKey, suggestion)}
							key={index}
						>
							{suggestion}
						</Chip>
					))}
				</View>
			) : null}
		</View>
	);
}

const syles = StyleSheet.create({
	wrapper: {
		width: "100%",
	},
	input: {
		width: "100%",
	},
	suggestions: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		flexWrap: "wrap",
		marginBottom: 10,
		marginTop: 5,
		gap: 5,
	},
});
