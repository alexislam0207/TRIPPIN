import { useState } from "react";
import { View, Text } from "react-native";
import { Button, Dialog, TextInput } from "react-native-paper";

const AddHolidayForm = ({ newLocation, exitEditMode, handleAddHoliday, setAdding }) => {
  const [titleInput, setTitleInput] = useState("");
  const [visible, setVisible] = useState(true);

  const hideDialog = () => setVisible(false);

  const handleDismiss = () => {
    hideDialog();
    exitEditMode();
  };

  return (
    <Dialog visible={visible} onDismiss={handleDismiss}>
      <Dialog.Title>New Holiday</Dialog.Title>
      <Dialog.Content style={styles.form}>
        <TextInput
          label="Title"
          value={titleInput}
          onChangeText={(text) => setTitleInput(text)}
          mode="outlined"
          placeholder="A new trip title"
        />
        <TextInput
          label="Location"
          disabled
          value={newLocation.longitude + ", " + newLocation.latitude}
          onChangeText={(text) => setTitleInput(text)}
          mode="outlined"
          placeholder="A new trip title"
        />
      </Dialog.Content>
      <Dialog.Actions>
        <Button
          onPress={() => {
            handleDismiss();
          }}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={() => {
            setAdding(true);
            handleAddHoliday(titleInput);
            handleDismiss();
          }}
        >
          Add Holiday
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default AddHolidayForm;

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    gap: 10,
  },
};
