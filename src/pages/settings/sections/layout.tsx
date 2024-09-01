import * as React from "react";
import MultiIcon from "@/components/multiIcon";
import { useNavigate } from "@/hooks/useNavigate";
import { useDialogs } from "@/states/runtime/dialogs";
import { List } from "react-native-paper";

const SettingsLayout = () => {
  const navigate = useNavigate();
  const openDialog = useDialogs((state) => state.openDialog);
  return (
    <List.Section title="Layout">
      <List.Item
        title="Feels like home"
        description="Change the layout of the home screen"
        left={(props) => (
          <MultiIcon {...props} size={20} type="feather" name="layout" />
        )}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
        onPress={() => {
          navigate("Home", undefined, true);
          openDialog("homeLayoutPicker");
        }}
      />
    </List.Section>
  );
};

SettingsLayout.displayName = "SettingsLayout";

export default SettingsLayout;
