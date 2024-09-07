import * as React from "react";
import { useTranslations } from "@/states/persistent/translations";
import { useDialogs } from "@/states/runtime/dialogs";
import { useToast } from "@/states/runtime/toast";
import { FlatList, StyleSheet, View } from "react-native";
import { Card, IconButton, ProgressBar, Text } from "react-native-paper";

const SuggestionStat = ({
  value,
}: {
  value: { app: string; count: number; percentage: number };
}) => (
  <View key={value.app} style={styles.suggestionStatContainer}>
    <View style={styles.suggestionStatWrapper}>
      <Text variant="titleSmall" style={styles.suggestionStatTitle}>
        {value.app}
      </Text>
      <View style={styles.suggestionStatTextWrapper}>
        <Text style={styles.suggestionStatText}>{value.count}</Text>
      </View>
    </View>
    <View style={styles.suggestionStatProgressBarWrapper}>
      <ProgressBar
        style={styles.suggestionStatProgressBar}
        animatedValue={value.percentage}
      />
    </View>
  </View>
);

export default function SuggestionsStats() {
  const [stats, setStats] = React.useState<
    { app: string; count: number; percentage: number }[]
  >([]);
  const openToast = useToast((state) => state.openToast);
  const openDialog = useDialogs((state) => state.openDialog);
  const translations = useTranslations((state) => state.translations);

  React.useEffect(() => {
    fetch("https://updateme.fortunacasino.store/suggestions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) =>
        response.json().then((data) => {
          setStats(data);
        })
      )
      .catch(() =>
        openToast(translations["Failed to fetch suggestions list"], {
          type: "error",
        })
      );

    return () => {
      setStats([]);
    };
  }, [translations]);

  const handleInfo = React.useCallback(() => {
    openDialog({
      title: translations["App Suggestions"],
      content:
        translations[
          "This list shows the suggested apps by users. Apps with the highest number of suggestions will be prioritized for addition to the app list."
        ],
      actions: [
        {
          title: translations["Ok"],
          action: () => {},
        },
      ],
    });
  }, [translations]);

  return (
    <View style={styles.rootView}>
      <View style={styles.cardView}>
        <Card mode="elevated" contentStyle={styles.card} elevation={2}>
          <Text variant="titleLarge">{translations["App Suggestions"]}</Text>
        </Card>

        <Card mode="elevated" style={styles.cardContent} elevation={2}>
          <View style={styles.suggestionView}>
            <IconButton
              icon="information"
              style={styles.infoButton}
              onPress={handleInfo}
            />
            <FlatList
              data={stats}
              keyExtractor={(item) => item.app}
              renderItem={({ item }) => <SuggestionStat value={item} />}
              contentContainerStyle={styles.flatListContainer}
            />
            {stats.map((value) => (
              <SuggestionStat value={value} />
            ))}
          </View>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootView: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    backgroundColor: "transparent",
  },
  cardView: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    marginBottom: 50,
    marginTop: 10,
    gap: 30,
    backgroundColor: "transparent",
  },
  card: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    padding: 30,
    marginTop: -10,
    paddingBottom: 20,
  },
  cardContent: {
    width: "80%",
  },
  suggestionView: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 10,
    paddingTop: 30,
    position: "relative",
  },
  infoButton: {
    position: "absolute",
    top: -5,
    right: -5,
  },
  suggestionStatContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 10,
    margin: 10,
  },
  suggestionStatWrapper: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    paddingRight: 20,
  },
  suggestionStatTitle: {
    width: "100%",
    textAlign: "center",
  },
  suggestionStatTextWrapper: {
    display: "flex",
    justifyContent: "center",
  },
  suggestionStatText: {
    color: "grey",
  },
  suggestionStatProgressBarWrapper: {
    flex: 2,
    width: "100%",
  },
  suggestionStatProgressBar: {
    height: 6,
  },
  flatListContainer: {
    width: "100%",
  },
});
