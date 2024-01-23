import { View, StyleSheet } from "react-native";
import { TextInput, Button, SegmentedButtons } from "react-native-paper";
import { useState } from "react";
import {
  createUser,
  userCheck,
  userLogIn,
  userLogOut,
} from "../utils/backendView";

export default function Login({ setUserLoggedIn }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInSignUp, setSignInSignUp] = useState("log in");

  return (
    <View style={styles.container}>
      <SegmentedButtons
        style={styles.toggle}
        value={signInSignUp}
        onValueChange={setSignInSignUp}
        buttons={[
          {
            value: "log in",
            label: "log in",
          },
          {
            value: "create account",
            label: "create account",
          },
        ]}
      />
      {signInSignUp === "create account" ? (
        <TextInput
          style={styles.input}
          value={username}
          placeholder="Username"
          autoCapitalize="none"
          onChangeText={(text) => setUsername(text)}
        ></TextInput>
      ) : null}
      <TextInput
        style={styles.input}
        value={email}
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
      ></TextInput>
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        value={password}
        placeholder="Password"
        autoCapitalize="none"
        onChangeText={(text) => setPassword(text)}
      ></TextInput>
      {signInSignUp === "create account" ? (
        <Button
          onPress={() => {
            createUser(email, password, username).then(() => {
              setUserLoggedIn(true);
            });
          }}
        >
          Create Account
        </Button>
      ) : (
        <Button
          onPress={() => {
            userLogIn(email, password).then(() => {
              setUserLoggedIn(true);
            });
          }}
        >
          Log In
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    marginVertical: 4,
    height: 30,
    padding: 10,
    minWidth: 300,
  },
  toggle: {
    maxWidth: 300,
    paddingBottom: 20,
  },
});
