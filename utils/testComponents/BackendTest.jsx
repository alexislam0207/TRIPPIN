import { Button, Text, View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { auth } from "../../firebaseconfig";
import BeHolidaysTest from "./BeHolidaysTest";
import BeUsersTest from "./BeUsersTest";
import BeMemoriesTest from "./BeMemoriesTest";
import UtilTests from "./UtilTests";

export default BackendTest = () => {
    return (
        
        <View style={styles.page}>
            {/* <BeUsersTest /> */}
            <BeHolidaysTest />
            {/* <BeMemoriesTest /> */}
            {/* <UtilTests /> */}
        </View>
      );
}

const styles = StyleSheet.create({
    page: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
});