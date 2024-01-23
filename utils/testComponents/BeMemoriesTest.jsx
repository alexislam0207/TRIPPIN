import { Button, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { addMemory, editMemory, memoriesByHoliday, memoryById, removeMemory } from "../backendView";
import { timestampToDate } from "../utils";

export default BeMemoriesTest = () => {
    const [memories, setMemories] = useState([]);
    const [change, setChange] = useState(false);

    const userId = 'RKeEweJmC96pOoZEmzQn'
    const holidayId = 'Jp3WIuvAXSp0SjwmSICp'

    useEffect(() => {
        memoriesByHoliday(userId, holidayId).then((res) => {
            setMemories(res);
        });
        // memoryById(userId, holidayId, 'd3N49z4oiKNskA93PE9Y').then((res) => {
        //     console.log(res)
        // })
        setChange(false)
      }, [change]);
    
      const dateChanger = (dateObj) => {
        const newDate = timestampToDate(dateObj)
        return newDate.date
      }

    const newMemory = () => {
        const title = 'Shibuya Crossing';
        const locationData = { latitude: 35.6614, longitude: 139.7041 };
        addMemory(userId, holidayId, title, locationData).then((res) => {
            console.log(res)
        })
        setChange(true)
    }

    const changeMem = async (memoryId) => {
        const field = 'date'
        const data = '2021-01-05T12:30:45.678Z'
        await editMemory(userId, holidayId, memoryId, field, data).then((res) => {
            console.log(res)
        })
        setChange(true)
    }

    const delMem = async (memoryId) => {
        await removeMemory(userId, holidayId, memoryId).then((res) => {
            console.log(res)
        })
        setChange(true)
    }

    return (
        <View>
            {memories.map((memory) => {
                return (
                <View>
                    <Text>{memory.title} - {dateChanger(memory.date)} - {memory.note ? memory.note : 'noinfo'}</Text>
                    <Text>{memory.locationData.latitude} - {memory.locationData.longitude}</Text>
                    <Button onPress={() => changeMem(memory.id)} title="change memory"></Button>
                    <Button onPress={() => delMem(memory.id)} title="delete memory"></Button>
                </View>
                );
            })}
            <Button onPress={newMemory} title="new memory"></Button>
        </View>
    )
}