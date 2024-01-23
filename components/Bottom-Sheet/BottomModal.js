import React, { useCallback, useMemo, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import CustomBackdrop from "./BackdropComp";
import AllHolidaysScreen from "../../navigation/screens/AllHolidaysScreen";
import EditHoliday from "./EditHoliday";

const BottomModal = ({ modalOpen, setModalOpen, user, sheetData }) => {
  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ["25%"], []);

  const handleClose = () => {
    setModalOpen(null);
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      bottomInset={100}
      topInset={-1200}
      detached={true}
      style={styles.sheetContainer}
      enablePanDownToClose
      onClose={() => {
        handleClose();
      }}
      handleHeight={100}
      containerStyle={{ height: 1700, paddingBottom: 100 }}
    >
      <EditHoliday sheetData={sheetData} user={user} />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  sheetContainer: {
    borderRadius: 20,
    marginHorizontal: 15,
    backgroundColor: "grey",
    shadowOffset: {
      width: 10,
      height: 20,
    },
    shadowOpacity: 5,
    shadowRadius: 30,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});

export default BottomModal;
