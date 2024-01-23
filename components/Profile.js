import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Avatar,
  Card,
  Text,
  IconButton,
  TextInput,
  Button,
} from "react-native-paper";
import { editUserInfo, getUserInfo } from "../utils/backendView";

export default function Profile({ user }) {
  const [userInfo, setUserInfo] = useState({});
  const [bioValue, setBioValue] = useState("");
  const [inputBoxOpen, setInputBoxOpen] = useState(false);

  useEffect(() => {
    getUserInfo(user.displayName).then((res) => {
      setUserInfo(res);
    });
  }, []);

  useEffect(() => {
    setBioValue(userInfo.bio);
  }, [inputBoxOpen]);

  function handleBioSubmit() {
    editUserInfo(userInfo.id, "bio", bioValue).then(() => {
      setInputBoxOpen(false);
      getUserInfo(user.displayName).then((res) => {
        setUserInfo(res);
      });
    });
  }

  return (
    <View style={styles.container}>
      <Avatar.Text style={styles.avatar} size={150} label={user.displayName.slice(0,1).toUpperCase()} />

      <Card style={styles.bio}>
        <Card.Title
          title="Bio"
          titleVariant="titleLarge"
          right={(props) => (
            <IconButton
              {...props}
              icon={inputBoxOpen ? "close" : "lead-pencil"}
              onPress={() => {
                !inputBoxOpen ? setInputBoxOpen(true) : setInputBoxOpen(false);
              }}
            />
          )}
        />
        <Card.Content>
          {inputBoxOpen ? (
            <View>
              <TextInput
                value={bioValue}
                onChangeText={(text) => setBioValue(text)}
              />
              <Button icon="check" mode="contained" onPress={handleBioSubmit}>
                submit
              </Button>
            </View>
          ) : (
            <Text variant="bodyMedium">
              {userInfo.bio ? userInfo.bio : null}
            </Text>
          )}
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    margin: 20,
  },
  bio: {
    maxWidth: 300,
    minWidth: 300,
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
});
