import { useRef, useState } from "react";
import { useWindowDimensions, Image, View } from "react-native";
import { FAB, Portal, Text, ActivityIndicator, MD2Colors } from "react-native-paper";
import { addHoliday, addMemory } from "../../utils/backendView";
import AddHolidayForm from "./AddHolidayForm";
import AddMemoryForm from "./AddMemoryForm";

const NewPinAdder = ({ addPinMode, toggleAddPinMode, holidays, setHolidays, setMemories, mapViewRef, userId }) => {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const [menuOpen, setMenuOpen] = useState(false);
  const [addHolidayFormOpen, setAddHolidayFormOpen] = useState(false);
  const [addMemoryFormOpen, setAddMemoryFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // determines what is being edited - 'holiday', or 'memory'
  const [editMode, setEditMode] = useState(null);
  

  const newLocation = useRef(null);

  // calculate the left and top offsets of the new pin marker so that
  // its bottom-center (where the pin tip is) coincides with
  // the window center. The window center's y-position is offset by 50 to account for the nav bar.
  const windowCenter = { x: windowWidth / 2, y: windowHeight / 2 - 50 };
  const newPinSize = { width: 50, height: 50 };
  const newPinLocation = { left: windowCenter.x - newPinSize.width / 2, top: windowCenter.y - newPinSize.height };

  const selectEditMode = (mode) => {
    // this mode input should be either 'holiday' or 'memory'
    setEditMode(mode);
  };

  const onConfirmAddPin = async () => {
    const coordsToAdd = await mapViewRef.getCoordinateFromView([windowCenter.x, windowCenter.y]);
    newLocation.current = { longitude: coordsToAdd[0], latitude: coordsToAdd[1] };

    if (editMode === "holiday") {
      setAddHolidayFormOpen(true);
    } else if (editMode === "memory") {
      
      setAddMemoryFormOpen(true);
    }
    toggleAddPinMode();
    setEditMode(null);
  };

  const onAddHoliday = async (newTitle) => {
    const newHoliday = await addHoliday(userId, newTitle, newLocation.current);

    setHolidays((currHolidays) => [newHoliday, ...currHolidays]);
    setIsLoading(false);
  };

  const onAddMemory = async (newTitle, selectedHoliday) => {
    
    const newMemory = await addMemory(userId, selectedHoliday, newTitle, newLocation.current);

    setMemories((currMemories) => [newMemory, ...currMemories]);
    setIsLoading(false);
  };

  return (
    <>
      <FAB.Group
        open={menuOpen}
        visible
        icon={addPinMode ? "cancel" : "plus"}
        actions={[
          {
            icon: "plus",
            label: "Add Holiday",
            onPress: () => {
              toggleAddPinMode();
              selectEditMode("holiday");
              setMenuOpen(false);
            },
          },
          {
            icon: "plus",
            label: "Add Memory",
            onPress: () => {
              toggleAddPinMode();
              selectEditMode("memory");
              setMenuOpen(false);
            },
          },
        ]}
        onStateChange={({ open }) => {
          if (addPinMode) {
            // here, the button is in 'cancel' state.
            // toggle add pin mode and reset the chosen edit mode to null
            // on pressing cancel
            toggleAddPinMode();
            selectEditMode(null);
          } else {
            setMenuOpen(open);
          }
        }}
      />

      {/* a pin that appears in the center of the map on toggling 'Add Pin' mode ON */}
      {addPinMode && (
        <Image
          source={require("../../assets/marker-holiday.png")}
          height={newPinSize.height}
          width={newPinSize.width}
          style={{ position: "absolute", left: newPinLocation.left, top: newPinLocation.top }}
        />
      )}

      {addPinMode && (
        <FAB
          icon="check"
          style={customStyles.checkmarkButton}
          onPress={onConfirmAddPin}
          accessibilityLabel="Confirm add pin"
          variant="primary"
          color="#F9F9F9"
        />
      )}

      {isLoading && (
        <Portal>
          <View style={customStyles.loadingScreen}>
            <ActivityIndicator animating={true} color={MD2Colors.brown500} size={"large"} />
            <Text variant="bodyLarge" style={{ color: "#000000", opacity: 1 }}>
              Adding your new pin
            </Text>
          </View>
        </Portal>
      )}

      {addHolidayFormOpen && (
        <Portal>
          <AddHolidayForm
            newLocation={newLocation.current}
            exitEditMode={() => {
              selectEditMode(null);
              setAddHolidayFormOpen(false);
            }}
            handleAddHoliday={onAddHoliday}
            setAdding={setIsLoading}
          />
        </Portal>
      )}

      {addMemoryFormOpen && (
        <AddMemoryForm
          newLocation={newLocation.current}
          exitEditMode={() => {
            selectEditMode(null);
            setAddMemoryFormOpen(false);
          }}
          handleAddMemory={onAddMemory}
          setAdding={setIsLoading}
          holidays={holidays}
        />
      )}
    </>
  );
};

export default NewPinAdder;

const customStyles = {
  checkmarkButton: {
    position: "absolute",
    margin: 16,
    right: 70,
    bottom: 0,
    backgroundColor: "#41AB64",
  },
  floatingMenu: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 70,
    gap: 16,
  },
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#161C1B",
    opacity: 0.4,
  },
};
