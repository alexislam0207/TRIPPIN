import Mapbox from "@rnmapbox/maps";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Button, Card, IconButton, Text } from "react-native-paper";
import { DEV_MAPBOX_PUBLIC_API_KEY } from "@env";

Mapbox.setAccessToken(process.env.MAPBOX_PUBLIC_API_KEY || DEV_MAPBOX_PUBLIC_API_KEY);

const HolidayPopup = ({ holiday, isSelected, setSelectedHoliday, setMoreInfo }) => {
  const handleSeeMore = () => {
    setMoreInfo(true);
  };

  const hidePopup = () => {
    setSelectedHoliday(null);
  };

  const renderDescription = () => {
    if (holiday.info) {
      const excerpt = holiday.info.split(" ").slice(0, 20);
      return excerpt.join(" ") + (excerpt.length < 20 ? "" : "...");
    }

    return "no description 🏜️";
  };

  return (
    <Mapbox.MarkerView // popup
      key={`MarkerView-Popup-${holiday.locationData.longitude}-${holiday.locationData.latitude}`}
      coordinate={[holiday.locationData.longitude, holiday.locationData.latitude]}
      anchor={{ x: 0.5, y: 0 }}
      allowOverlap={true}
      style={{ maxWidth: "60%" }}
    >
      <Card style={{ display: isSelected ? "" : "none", margin: 0 }}>
        <Card.Content>
          <Text variant="titleLarge">{holiday.title}</Text>
          <Text variant="bodyMedium">{renderDescription()}</Text>
        </Card.Content>
        <Card.Actions>
          <Button
            onPressIn={() => {
              handleSeeMore();
            }}
            mode="text"
          >
            See more
          </Button>
          <IconButton icon="close-circle-outline" size={20} onPressIn={hidePopup} style={{ margin: 0 }} />
        </Card.Actions>
      </Card>
    </Mapbox.MarkerView>
  );
};

export default HolidayPopup;
