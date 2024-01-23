import { StyleSheet, View } from "react-native";
import MapWithPopups from "../../components/maps/MapWithPopups";
import { useLinkToHoliday } from "../../utils/backendView";
import { useState } from "react";
import dummyData from "../../components/maps/dummyData";
import {
  ActivityIndicator,
  MD2Colors,
  Searchbar,
  Button,
  Dialog,
  Portal,
  PaperProvider,
  Text,
} from "react-native-paper";

export default function MyFriendsHolidayScreen() {
  const [holidays, setHolidays] = useState(dummyData.holidays);
  const [memories, setMemories] = useState(dummyData.memories);
  const [isLoading, setIsLoading] = useState(false);
  const [holidayLink, setHolidayLink] = useState("");
  const [err, setErr] = useState(false);

  return (
    <PaperProvider>
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator animating={true} color={MD2Colors.blueGrey100} size={"large"} />
        ) : (
          <MapWithPopups mapHolidays={holidays} mapMemories={memories} isEditable={false} />
        )}
        <Searchbar
          onIconPress={() => {
            setIsLoading(true);
            useLinkToHoliday(holidayLink).then((res) => {
              if (res.msg) {
                setErr(true);
                setIsLoading(false);
              } else {
                const justHolidayData = { ...res };
                delete justHolidayData.memories;
                setHolidays([justHolidayData]);
                setMemories(res.memories);
                setIsLoading(false);
              }
            });
          }}
          style={styles.search}
          autoCapitalize="none"
          placeholder="Enter holiday link here"
          onChangeText={setHolidayLink}
          value={holidayLink}
        />
        <Portal>
          <Dialog
            visible={err}
            onDismiss={() => {
              setErr(false);
            }}
          >
            <Dialog.Content>
              <Text variant="bodyLarge">The link is invalid.</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  setErr(false);
                }}
              >
                Ok
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
  },
  IconButton: {
    alignSelf: "flex-end",
    position: "absolute",
    bottom: "5%",
    right: "10%",
    zIndex: 1,
  },
  search: {
    position: "absolute",
    bottom: 0,
    zIndex: 1,
    width: "100%",
    borderRadius: 0,
  },
});
