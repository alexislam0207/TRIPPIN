import { Button, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { removeLinkFromHoliday, addHoliday, useLinkToHoliday, addLinkToHoliday, addMemory, editHoliday, holidayById, holidaysByUser, removeHoliday } from "../backendView";
import { timestampToDate } from "../utils";

export default BeHolidaysTest = () => {
  const [hols, setHols] = useState([]);
  const [holAdded, setHolAdded] = useState(false);

  const testUser = "hrcH4eGxSwHRjlRPbZ1x"

  useEffect(() => {
    holidaysByUser(testUser).then((res) => {
      setHols(res);
    });
    // holidayById(testUser, 'uNFhKPtp3HT3taCJJZRg').then((res) => {
    //     console.log(res)
    // })
    useLinkToHoliday('NZs9I9wlXl8T').then((res) => {
      console.log(res, res.memories.length)
    })
    setHolAdded(false)
  }, [holAdded]);

  const createHol = () => {
    const title = 'Paris';
    const location = { latitude: 48.8566, longitude: 2.3522 };
    addHoliday(testUser, title, location).then((res) => {
      console.log(res)
    });
    setHolAdded(true)
  };

  const dateChanger = (dateObj) => {
    const newDate = timestampToDate(dateObj)
    return newDate.date
  }

  const changeHol = async (holId) => {
    const testInput = "2021-01-05T12:30:45.678Z"
    await editHoliday(testUser, holId, 'info', 'date works2').then((res) => {
      console.log(res)
    })
    setHolAdded(true)
  }

  const delHol = async (holId) => {
    await removeHoliday(testUser, holId).then((res) => {
      console.log(res)
    })
    setHolAdded(true)
  }

  const shareHol = async (holId) => {
    await addLinkToHoliday(testUser, holId).then((res) => {
      console.log(res)
    })
    setHolAdded(true)
  }

  const delShareLink = async (holId) => {
    await removeLinkFromHoliday(testUser, holId).then((res) => {
      console.log(res)
    })
  }

  return (
    <View>
      <Text>User: </Text>
      {hols.map((hol) => {
        return (
          <View>
            <Text>{hol.title} - {dateChanger(hol.startDate)}</Text>
            {/* <Text>{dateChanger(hol.startDate)}</Text> */}
            <Text>{hol.info ? hol.info : 'noinfo'}</Text>
            <Text>{hol.shareLink ? hol.shareLink : 'noShareLink'}</Text>
            {/* <Text>{hol.locationData.latitude}-{hol.locationData.longitude}</Text> */}
            {/* <Button onPress={() => changeHol(hol.id)} title="change holiday"></Button>
            <Button onPress={() => delHol(hol.id)} title="delete holiday"></Button> */}
            <Button onPress={() => shareHol(hol.id)} title="share holiday"></Button>
            <Button onPress={() => delShareLink(hol.id)} title="delete share link"></Button>
          </View>
        );
      })}
      <Button onPress={createHol} title="new holiday"></Button>
    </View>
  );
};
