/*

  This component is not being used anymore, but serves as an example
  of how to write a PointAnnotation as it is difficult to find 
  examples online for the syntax. 
  
  Can be deleted if needed. 
  
*/

import { StyleSheet, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import Mapbox from "@rnmapbox/maps";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { DEV_MAPBOX_PUBLIC_API_KEY } from "@env";

Mapbox.setAccessToken(process.env.MAPBOX_PUBLIC_API_KEY || DEV_MAPBOX_PUBLIC_API_KEY);

const CustomMapView = ({ holidays }) => {
  const [calloutVisible, setCalloutVisible] = useState(false);
  const [location, setLocation] = useState({ longitude: -5, latitude: 55 });
  const [selectedHoliday, setSelectedHoliday] = useState();
  const camera = useRef(null);
  const mapView = useRef(null);

  const [coordinates] = useState([-2.983333, 53.400002]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.error("Permission to access location was denied");

        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();
  }, []);

  const onMarkerPress = () => {
    setCalloutVisible(true);
  };

  const loadAnnotation = (holiday) => {
    return (
      <Mapbox.PointAnnotation
        key={holiday.id}
        id={holiday.id}
        coordinate={holiday.locationData}
        onSelected={onMarkerPress}
      >
        <View
          style={{
            height: 20,
            width: 20,
            backgroundColor: "green",
            borderColor: "black",
            borderWidth: 2,
            borderRadius: 50,
          }}
        ></View>

        <Mapbox.Callout title={holiday.title + " " + holiday.info} contentStyle={{}}>
          <View style={{ width: 150, marginBottom: 150 }}>
            <Card>
              <Card.Title title="Card Title" subtitle="Card Subtitle" />
              <Card.Content>
                <Text variant="titleLarge">Card title</Text>
                <Text variant="bodySmall">Card content</Text>
              </Card.Content>
              <Card.Actions>
                <Button style={{ marginRight: 35 }}>Ok</Button>
              </Card.Actions>
            </Card>
          </View>
        </Mapbox.Callout>
      </Mapbox.PointAnnotation>
    );
  };

  return (
    <View style={styles.container}>
      <Mapbox.MapView style={styles.map} deselectAnnotationOnTap ref={mapView}>
        <Mapbox.Camera zoomLevel={4} centerCoordinate={coordinates} />

        <Mapbox.PointAnnotation title="scotland" id="uk" coordinate={coordinates} />

        <Mapbox.PointAnnotation
          id="userLocation"
          coordinate={[location.longitude, location.latitude]}
          title="Your location"
        />

        <View>
          {holidays.map((holiday) => {
            return loadAnnotation(holiday);
          })}
        </View>
        <View>
          {holidays[0].memories.map((memory) => {
            return loadAnnotation(memory);
          })}
        </View>
        <View>
          {holidays[1].memories.map((memory) => {
            return loadAnnotation(memory);
          })}
        </View>
      </Mapbox.MapView>
    </View>
  );
};

export default CustomMapView;

const customStyles = {
  callout: {
    borderRadius: 5,
    padding: 10,
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
