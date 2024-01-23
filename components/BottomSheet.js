import React, { useCallback, useState, useMemo, useRef, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Animated, { useAnimatedStyle, interpolateColor, interpolate } from "react-native-reanimated";

import { Button, Card, IconButton, Text } from "react-native-paper";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import "../assets/airplane-icon-png-2506.png";

import SheetMemory from "./SheetMemory";
import BottomModal from "./Bottom-Sheet/BottomModal";

const ActionSheet = ({
  camera,
  setModalOpen,
  setMoreInfo,
  sheetData,
  memories,
  setCoordinates,
  setZoom,
  adjustCamera,
}) => {
  const bottomSheetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadData, setLoadData] = useState();

  const snapPoints = useMemo(() => ["10%", "30%", "50%", "75%", "100%"], []);

  const handleZoom = () => {
    camera.zoomTo(7);
  };

  const handleGoTo = () => {
    adjustCamera(sheetData.geometry.coordinates, 7);

    setIsOpen(false);
    setMoreInfo(false);
  };

  handleEditButton = () => {
    setModalOpen("edit");
  };

  const handleCloseSheet = () => {
    setIsOpen(false);
    setMoreInfo(false);
  };

  useEffect(() => {
    if (!sheetData) {
      setIsLoading(true);
    } else {
      setLoadData(sheetData.properties);
      setIsLoading(false);
    }
  }, [sheetData]);

  const CustomBackground = ({ style, animatedIndex }) => {
    //#region styles
    const containerAnimatedStyle = useAnimatedStyle(() => ({
      backgroundColor: interpolateColor(animatedIndex.value, [0, 3], ["#FFFFFF", "#a8b5eb"]),
      borderRadius: interpolate(animatedIndex.value, [0, 0.9], [0, 80]),
    }));

    const containerStyle = useMemo(() => [style, containerAnimatedStyle], [style, containerAnimatedStyle]);
    //#endregion
    // render
    return <Animated.View pointerEvents="none" style={containerStyle} />;
  };

  console.log(sheetData, "load")

  return (
    <>
      <BottomSheet
        backgroundComponent={CustomBackground}
        enablePanDownToClose
        ref={bottomSheetRef}
        index={isOpen ? 1 : -1}
        snapPoints={snapPoints}
        onClose={handleCloseSheet}
      >
        <BottomSheetView style={styles.contentContainer}>
          {isLoading ? (
            <ActivityIndicator animating={true} color={MD2Colors.blueGrey100} size={"large"} />
          ) : (
            <>
              <Card style={{ width: "70%", height: "35%", alignItems: "center" }}>
                <Card.Content>
                  <Text style={{ alignSelf: "center" }} variant="labelLarge">
                    {loadData.title}
                  </Text>
                </Card.Content>
                <Card.Cover
                  style={{ backgroundColor: "clear", maxHeight: "50%", overflow: "hidden" }}
                  resizeMode="contain"
                  source={{ uri: "https://cdn-icons-png.flaticon.com/512/562/562740.png" }}
                />
                <Card.Actions style={{ margin: 0, borderWidth: 0, padding: 0 }}>
                  <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", overflow: "visible" }}>
                    {loadData.popupType === "holiday" ? (
                      <Button mode="text" onPressIn={() => handleEditButton()}>
                        Options
                      </Button>
                    ) : null}
                    <Button mode="text" onPressIn={() => handleGoTo("holiday")}>
                      Go to
                    </Button>
                  </View>
                </Card.Actions>
              </Card>
              <Text style={{ alignSelf: "center", textAlign: "center", color: "white", padding: 5 }}>
                {loadData.popupType === "holiday" ? loadData.description : null}
              </Text>
              {loadData.popupType === "holiday" ? (
                <Text style={{ alignSelf: "center" }} variant="headlineSmall">
                  Memories
                </Text>
              ) : (
                <Text style={{ alignSelf: "center", textAlign: "center" }} variant="headlineSmall">
                  {loadData.description ? loadData.description : "Add a description!"}
                </Text>
              )}
              <ScrollView nestedScrollEnabled={true} scrollEnabled={true} style={{ height: "100%", flex: 1 }}>
                <View style={{ marginBottom: "10%" }}>
                  {memories.map((memory, index) => {
                    if (memory.holidayReference === loadData.id) {
                      return (
                        <SheetMemory
                          key={index}
                          handleCloseSheet={handleCloseSheet}
                          camera={camera}
                          setCoordinates={setCoordinates}
                          memory={memory}
                          adjustCamera={adjustCamera}
                        />
                      );
                    }
                  })}
                </View>
              </ScrollView>
            </>
          )}
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
});

export default ActionSheet;
