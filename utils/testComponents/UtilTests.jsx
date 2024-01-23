import { Button, Text, View } from "react-native";
import { locationChecker } from "../controllers/controllerUtils";

export default UtilTests = () => {
    const location = { latitude: -22.9068, longitude: -43.1729 }
    
    const showMe = async () => {
        console.log(await locationChecker(location))
    }

    return (
        <View>
            <Text>User: </Text>
            <Button onPress={showMe} title="test"></Button>
        </View>
    )
}