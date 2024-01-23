import Mapbox from "@rnmapbox/maps";
import { Button, Card, IconButton, Text } from "react-native-paper";
import { DEV_MAPBOX_PUBLIC_API_KEY } from "@env";

Mapbox.setAccessToken(process.env.MAPBOX_PUBLIC_API_KEY || DEV_MAPBOX_PUBLIC_API_KEY);

const MemoryPopup = ({ memory, isSelected, setSelectedMemory, setMoreInfo }) => {
  const hidePopup = () => {
    setSelectedMemory(null);
  };

  const handleSeeMore = () => {
    setMoreInfo(true);
  };

  const renderDescription = () => {
    if (memory.note) {
      const excerpt = memory.note.split(" ").slice(0, 20);
      return excerpt.join(" ") + (excerpt.length < 20 ? "" : "...");
    }

    return "no description 🏜️";
  };

  return (
    <Mapbox.MarkerView // popup
      key={`MarkerView-Popup-${memory.locationData.longitude}-${memory.locationData.latitude}`}
      coordinate={[memory.locationData.longitude, memory.locationData.latitude]}
      anchor={{ x: 0.5, y: 0 }}
      allowOverlap={true}
      style={{ maxWidth: "60%" }}
    >
      <Card style={{ display: isSelected ? "" : "none", margin: 0 }}>
        <Card.Content>
          <Text variant="titleLarge">{memory.title}</Text>
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

export default MemoryPopup;
