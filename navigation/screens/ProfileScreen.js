import { Text, View, StyleSheet } from "react-native";
import Header from "../../components/Header";
import { TextInput, Button } from "react-native-paper";
import { useEffect, useState } from "react";
import Login from "../../components/Login";
import { userLogOut } from "../../utils/backendView";
import Profile from "../../components/Profile";

export default function ProfileScreen({ user, setUser, setUserLoggedIn }) {
  return (
    <>
      <Header />
      {user ? (
        <View style={styles.container}>
          <Text>Hello {user.displayName}</Text>
          <Profile user={user} />
          <Button
            onPress={() => {
              userLogOut();
              setUser(null);
            }}
          >
            Log Out
          </Button>
        </View>
      ) : (
        <Login setUserLoggedIn={setUserLoggedIn} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
