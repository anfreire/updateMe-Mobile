import { useTranslations } from "@/states/persistent/translations";
import { useDialogs } from "@/states/temporary/dialogs";
import { useToast } from "@/states/temporary/toast";
import { useCallback, useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import { Card, IconButton, ProgressBar, Text } from "react-native-paper";

const SuggestionStat = ({
  value,
}: {
  value: { app: string; count: number; percentage: number };
}) => (
  <View
    key={value.app}
    style={{
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      padding: 10,
      margin: 10,
    }}
  >
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        gap: 10,
        paddingRight: 20,
      }}
    >
      <Text variant="titleSmall" style={{ width: "100%", textAlign: "center" }}>
        {value.app}
      </Text>
      <View style={{ display: "flex", justifyContent: "center" }}>
        <Text
          style={{
            color: "grey",
          }}
        >
          {value.count}
        </Text>
      </View>
    </View>
    <View style={{ flex: 2, width: "100%" }}>
      <ProgressBar style={{ height: 6 }} animatedValue={value.percentage} />
    </View>
  </View>
);

export default function SuggestionsStats() {
  const [stats, setStats] = useState<
    { app: string; count: number; percentage: number }[]
  >([]);
  const openToast = useToast((state) => state.openToast);
  const showDialog = useDialogs((state) => state.openDialog);
  const translations = useTranslations();

  useEffect(() => {
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
        openToast(translations["Failed to fetch suggestions list"], "error")
      );

    return () => {
      setStats([]);
    };
  }, []);

  const handleInfo = useCallback(() => {
    showDialog({
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

          <Card mode="elevated" style={{ width: "80%" }} elevation={2}>
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
                contentContainerStyle={{ width: "100%" }}
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
});
