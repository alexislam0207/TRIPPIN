import { StyleSheet, View } from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import markerHoliday from "../../assets/marker-holiday.png";
import markerMemory from "../../assets/marker-memory.png";
import markerPlaneRound from "../../assets/marker-airplane-round.png";
import Mapbox from "@rnmapbox/maps";
import HolidayPopup from "./HolidayPopup";
import MemoryPopup from "./MemoryPopup";
import { holidaysGeoJsonFromData, memoriesGeoJsonFromData } from "../../utils/maps/geojson";
import ActionSheet from "../BottomSheet";
import BottomModal from "../Bottom-Sheet/BottomModal";
import NewPinAdder from "./NewPinAdder";
import { DEV_MAPBOX_PUBLIC_API_KEY } from "@env";

Mapbox.setAccessToken(process.env.MAPBOX_PUBLIC_API_KEY || DEV_MAPBOX_PUBLIC_API_KEY);

const MapWithPopups = ({ mapHolidays, mapMemories, userId, isEditable, user }) => {
  const [holidays, setHolidays] = useState(mapHolidays);
  const [memories, setMemories] = useState(mapMemories);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [moreInfo, setMoreInfo] = useState(false);
  const [bottomSheet, setBottomSheet] = useState();
  const [sheetData, setSheetData] = useState();
  const [modalOpen, setModalOpen] = useState(null);

  // determines whether the new pin overlay is shown
  const [addPinMode, setAddPinMode] = useState(false);

  const mapView = useRef(null);
  const camera = useRef(null);

  const [coordinates, setCoordinates] = useState(
    holidays.length ? [holidays[0].locationData.longitude, holidays[0].locationData.latitude] : [13.4317618, 52.4827483]
  );

  const [zoom, setZoom] = useState(4);

  const holidayFeatureCollection = useMemo(() => holidaysGeoJsonFromData(holidays), [holidays]);

  const memoryFeatureCollection = useMemo(() => memoriesGeoJsonFromData(memories), [memories]);

  const onPinPress = async (e) => {
    // gets the geojson feature at the pin
    const feature = e.features[0];
    const { popupType, id } = feature.properties;
    setSheetData(feature);
    console.log(feature.properties, "here");

    // centers the selected pin on the screen
    setCoordinates(feature.geometry.coordinates);
    // camera.current.flyTo(feature.geometry.coordinates);

    // sets selected holiday/memory
    if (popupType === "holiday") {
      if (selectedHoliday === id) {
        setSelectedHoliday(null);
      } else {
        setSelectedHoliday(id);
      }
    } else if (popupType === "memory") {
      if (selectedMemory === id) {
        setSelectedMemory(null);
      } else {
        setSelectedMemory(id);
      }
    }
  };

  const toggleAddPinMode = () => {
    setAddPinMode((m) => !m);
  };

  const adjustCamera = async (newCoordinates, newZoom) => {
    camera.current.setCamera({
      centerCoordinate: newCoordinates,
      zoomLevel: newZoom,
    });
  };

  const renderMemoryPopups = () => {
    return memories.map((memory) => {
      return (
        <MemoryPopup
          key={`memoryPopup-${memory.id}`}
          memory={memory}
          isSelected={selectedMemory === memory.id ? true : false}
          setSelectedMemory={setSelectedMemory}
          setMoreInfo={setMoreInfo}
        />
      );
    });
  };

  const renderHolidayPopups = () => {
    return holidays.map((holiday) => {
      return (
        <HolidayPopup
          key={`holidayPopup-${holiday.id}`}
          holiday={holiday}
          isSelected={selectedHoliday === holiday.id ? true : false}
          setSelectedHoliday={setSelectedHoliday}
          setMoreInfo={setMoreInfo}
        />
      );
    });
  };

  useEffect(() => {
    setBottomSheet(
      <ActionSheet
        setModalOpen={setModalOpen}
        moreInfo={moreInfo}
        adjustCamera={adjustCamera}
        setCoordinates={setCoordinates}
        setZoom={setZoom}
        memories={memories}
        sheetData={sheetData}
        setMoreInfo={setMoreInfo}
        camera={camera.current}
      />
    );
  }, [moreInfo]);

  useEffect(() => {
    if (!holidays.length) {
      setCoordinates([13.4317618, 52.4827483]);
    }
  }, [holidays]);

  useEffect(() => {
    camera.current?.zoomTo(zoom);
  }, [zoom]);

  useEffect(() => {
    camera.current?.flyTo(coordinates);
  }, [coordinates]);

  // useEffect(() => {
  //   if ((selectedHoliday === null) | (selectedMemory === null)) {
  //     mapView.current.getCenter().then((center) => setCoordinates(center));
  //   }
  // }, [selectedHoliday, selectedMemory]);

  return (
    <>
      <View style={styles.container}>
        <Mapbox.MapView
          style={styles.map}
          styleURL={Mapbox.StyleURL.Street}
          ref={mapView}
          compassEnabled={true}
          scaleBarEnabled={false}
          onCameraChanged={(e) => {
            // if the user used a gesture to change the camera while a popup was open,
            // close it.
            if (e.gestures.isGestureActive) {
              setSelectedHoliday(null);
              setSelectedMemory(null);
            }
          }}
          projection="mercator"
          rotateEnabled={true}
        >
          <Mapbox.Camera centerCoordinate={coordinates} animationDuration={700} ref={camera} minZoomLevel={2} />

          <Mapbox.Images
            images={{
              markerHoliday,
              markerMemory,
              markerPlaneRound,
            }}
          />

          {/* an overlay that appears when 'Add Pin' mode is ON */}
          {addPinMode && (
            <Mapbox.BackgroundLayer
              id="editBackgroundLayer"
              style={{ backgroundColor: "#93B7B4", backgroundOpacity: 0.2 }}
            />
          )}

          {/* memories layer */}
          <Mapbox.ShapeSource id="memoryPinsSource" shape={memoryFeatureCollection} onPress={onPinPress}>
            <Mapbox.SymbolLayer id="memoryPinsLayer" style={customStyles.memoryPinsLayer} minZoomLevel={8} />
            {renderMemoryPopups()}
          </Mapbox.ShapeSource>

          {/* holidays layer: rendered above and after the memories layer */}
          <Mapbox.ShapeSource id="holidayPinsSource" shape={holidayFeatureCollection} onPress={onPinPress}>
            <Mapbox.SymbolLayer id="holidayPinsLayer" style={customStyles.holidayPinsLayer} maxZoomLevel={8} />
            {renderHolidayPopups()}
          </Mapbox.ShapeSource>
        </Mapbox.MapView>

        {userId && isEditable ? (
          <NewPinAdder
            addPinMode={addPinMode}
            toggleAddPinMode={toggleAddPinMode}
            holidays={holidays}
            setHolidays={setHolidays}
            setMemories={setMemories}
            mapViewRef={mapView.current}
            userId={userId}
          />
        ) : (
          ""
        )}

        {moreInfo && bottomSheet}
      </View>
      {modalOpen && <BottomModal sheetData={sheetData} user={user} setModalOpen={setModalOpen} modalOpen={modalOpen} />}
    </>
  );
};

export default MapWithPopups;

const customStyles = {
  holidayPinsLayer: {
    iconAllowOverlap: true,
    iconAnchor: "bottom",
    iconSize: ["interpolate", ["linear"], ["zoom"], 0, 0.4, 3, 0.5, 5, 0.6],
    iconImage: "markerPlaneRound",
  },
  memoryPinsLayer: {
    iconAllowOverlap: true,
    iconAnchor: "bottom",
    iconSize: 1.0,
    iconImage: "markerMemory",
  },
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    height: "100%",
    width: "100%",
  },
  map: {
    flex: 1,
  },
});
