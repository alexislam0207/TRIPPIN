import { useEffect, useState } from "react";
import { StyleSheet, ScrollView, Pressable } from "react-native";
import { Button, Card, Text, Dialog, Portal, PaperProvider, TextInput, Modal } from "react-native-paper";

import {
  addLinkToHoliday,
  editHoliday,
  editMemory,
  getUserInfo,
  holidayById,
  memoriesByHoliday,
  removeHoliday,
  removeLinkFromHoliday,
  removeMemory,
} from "../../utils/backendView";

export default function HolidayCard({ user, sheetData }) {
  const [userId, setUserId] = useState("");
  const [holiday, setHoliday] = useState({ id: sheetData.id.split("-")[1] });
  const [shareBoxVisible, setShareBoxVisible] = useState(false);
  const [editBoxVisible, setEditBoxVisible] = useState(false);
  const [newHolidayTitle, setNewHolidayTitle] = useState("");
  const [newHolidayInfo, setNewHolidayInfo] = useState("");
  const [deleteBoxVisible, setDeleteBoxVisible] = useState(false);
  const [allMemories, setAllMemories] = useState([]);
  const [allMemoriesVisible, setAllMemoriesVisible] = useState(false);
  const [memoryEditBoxVisible, setMemoryEditBoxVisible] = useState(false);
  const [memoryToBeEdit, setMemoryToBeEdit] = useState("");
  const [newMemoryTitle, setNewMemoryTitle] = useState("");
  const [newMemoryNote, setNewMemoryNote] = useState("");
  const [memoryDeleteBoxVisible, setMemoryDeleteBoxVisible] = useState(false);
  const [memoryToBeDelete, setMemoryToBeDelete] = useState("");

  useEffect(() => {
    if (!user) {
      return undefined;
    }
    getUserInfo(user.displayName).then((res) => {
      setUserId(res.id);
      holidayById(res.id, holiday.id)
        .then((res) => {
          setHoliday({ ...res, id: holiday.id });
          setNewHolidayTitle(res.title);
          setNewHolidayInfo(res.info);
        })
        .catch((res) => {});
      memoriesByHoliday(res.id, holiday.id)
        .then((res) => {
          setAllMemories(res);
        })
        .catch(() => {});
    });
  }, []);

  useEffect(() => {
    setNewMemoryTitle(memoryToBeEdit.title);
    setNewMemoryNote(memoryToBeEdit.note);
  }, [memoryToBeEdit]);

  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        {/********************** holiday card **********************/}
        {holiday?.title ? (
          <Card>
            <Card.Content style={styles.holiday_card}>
              <Text variant="titleLarge">{holiday.title}</Text>
              <Text variant="bodyMedium">{holiday.startDate.toDate().toLocaleDateString()}</Text>
              {holiday.info ? <Text variant="bodyMedium">{holiday.info}</Text> : null}
              <Pressable
                style={styles.see_memories}
                onPress={() => {
                  setAllMemoriesVisible(true);
                }}
              >
                <Text style={{ color: "darkslateblue", fontWeight: "bold" }}>See memories...</Text>
              </Pressable>
            </Card.Content>
            <Card.Actions>
              <Button
                icon="share"
                mode="outlined"
                onPress={() => {
                  setShareBoxVisible(true);
                }}
              >
                Share
              </Button>
              <Button
                icon="pencil"
                mode="contained-tonal"
                onPress={() => {
                  setEditBoxVisible(true);
                }}
              >
                Edit
              </Button>
              <Button
                icon="delete"
                onPress={() => {
                  setDeleteBoxVisible(true);
                }}
              >
                Delete
              </Button>
            </Card.Actions>
          </Card>
        ) : (
          <>
            {user ? (
              <Text variant="displayMedium" style={{ alignSelf: "center", textAlign: "center" }}>
                Holiday has been deleted!
              </Text>
            ) : (
              <Text variant="displayMedium" style={{ alignSelf: "center", textAlign: "center" }}>
                Log-in to see options
              </Text>
            )}
          </>
        )}

        {holiday ? (
          <Portal>
            {/********************** share holiday box **********************/}
            <Dialog
              visible={shareBoxVisible}
              onDismiss={() => {
                setShareBoxVisible(false);
              }}
            >
              <Dialog.Title>Share it to your friends!</Dialog.Title>
              <Dialog.Content>
                {holiday?.shareLink ? (
                  <Text variant="bodyLarge">
                    Link:{"\n"}
                    {holiday.shareLink}
                  </Text>
                ) : (
                  <Pressable
                    onPress={() => {
                      addLinkToHoliday(userId, holiday.id).then((res) => {
                        setHoliday({
                          ...res,
                          id: holiday.id,
                        });
                      });
                    }}
                  >
                    <Text style={{ color: "darkslateblue" }} variant="bodyLarge">
                      Create a link
                    </Text>
                  </Pressable>
                )}
              </Dialog.Content>
              {holiday.shareLink ? (
                <Dialog.Actions>
                  <Button
                    onPress={() => {
                      removeLinkFromHoliday(userId, holiday.id).then(() => {
                        holidayById(userId, holiday.id).then((res) => {
                          setHoliday({
                            ...res,
                            id: holiday.id,
                          });
                        });
                      });
                    }}
                  >
                    Deactivate link
                  </Button>
                </Dialog.Actions>
              ) : null}
            </Dialog>
            {/********************** edit holiday box **********************/}
            <Dialog
              visible={editBoxVisible}
              onDismiss={() => {
                setEditBoxVisible(false);
              }}
            >
              <Dialog.Title>Edit</Dialog.Title>
              <Dialog.Content>
                <TextInput label="Title" value={newHolidayTitle} onChangeText={(text) => setNewHolidayTitle(text)} />
                <TextInput label="Info" value={newHolidayInfo} onChangeText={(text) => setNewHolidayInfo(text)} />
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={() => {
                    const promise1 = editHoliday(userId, holiday.id, "title", newHolidayTitle);
                    const promise2 = editHoliday(userId, holiday.id, "info", newHolidayInfo);
                    Promise.all([promise1, promise2])
                      .then(() => {
                        holidayById(userId, holiday.id).then((res) => {
                          setHoliday({
                            ...res,
                            id: holiday.id,
                          });
                        });
                      })
                      .catch((res) => {
                        console.log(res);
                      });
                    setEditBoxVisible(false);
                  }}
                >
                  Submit
                </Button>
                <Button
                  onPress={() => {
                    setEditBoxVisible(false);
                  }}
                >
                  Cancel
                </Button>
              </Dialog.Actions>
            </Dialog>
            {/********************** delete holiday box **********************/}
            <Dialog
              visible={deleteBoxVisible}
              onDismiss={() => {
                setDeleteBoxVisible(false);
              }}
            >
              <Dialog.Title>Alert</Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium">
                  By deleting this holiday, you will delete all the associated memories as well.
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={() => {
                    removeHoliday(userId, holiday.id).then(() => {
                      setHoliday(null);
                    });
                    setDeleteBoxVisible(false);
                  }}
                >
                  Delete
                </Button>
                <Button
                  onPress={() => {
                    setDeleteBoxVisible(false);
                  }}
                >
                  Cancel
                </Button>
              </Dialog.Actions>
            </Dialog>
            {/********************** all memories card **********************/}
            <Modal
              visible={allMemoriesVisible}
              onDismiss={() => {
                setAllMemoriesVisible(false);
              }}
              contentContainerStyle={{
                backgroundColor: "white",
                padding: 10,
                marginTop: 30,
                marginBottom: 50,
              }}
            >
              <ScrollView>
                <Card.Title title={holiday.title} titleVariant="titleLarge" />
                {allMemories.length === 0 ? (
                  <Card>
                    <Card.Content>
                      <Text variant="bodyMedium">no memory yet...</Text>
                    </Card.Content>
                  </Card>
                ) : (
                  allMemories.map((memory) => {
                    return (
                      <Card key={memory.id}>
                        <Card.Content>
                          <Text variant="titleMedium">{memory.title}</Text>
                          <Text variant="bodyMedium">{memory.date.toDate().toLocaleDateString()}</Text>
                          <Text variant="bodyMedium">{memory.note}</Text>
                        </Card.Content>
                        <Card.Actions>
                          <Button
                            onPress={() => {
                              setMemoryToBeEdit(memory);
                              setAllMemoriesVisible(false);
                              setMemoryEditBoxVisible(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            onPress={() => {
                              setMemoryToBeDelete(memory.id);
                              setAllMemoriesVisible(false);
                              setMemoryDeleteBoxVisible(true);
                            }}
                          >
                            Delete
                          </Button>
                        </Card.Actions>
                      </Card>
                    );
                  })
                )}
              </ScrollView>
            </Modal>
            {/********************** edit memory box **********************/}
            <Dialog
              visible={memoryEditBoxVisible}
              onDismiss={() => {
                setMemoryEditBoxVisible(false);
              }}
            >
              <Dialog.Title>Edit</Dialog.Title>
              <Dialog.Content>
                <TextInput label="Title" value={newMemoryTitle} onChangeText={(text) => setNewMemoryTitle(text)} />
                <TextInput label="Info" value={newMemoryNote} onChangeText={(text) => setNewMemoryNote(text)} />
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={() => {
                    const promise1 = editMemory(userId, holiday.id, memoryToBeEdit.id, "title", newMemoryTitle);
                    const promise2 = editMemory(userId, holiday.id, memoryToBeEdit.id, "note", newMemoryNote);
                    Promise.all([promise1, promise2]).then(() => {
                      memoriesByHoliday(userId, holiday.id)
                        .then((res) => {
                          setAllMemories(res);
                        })
                        .catch(() => {});
                    });
                    setMemoryEditBoxVisible(false);
                    setAllMemoriesVisible(true);
                    setMemoryToBeEdit("");
                  }}
                >
                  Submit
                </Button>
                <Button
                  onPress={() => {
                    setMemoryEditBoxVisible(false);
                    setAllMemoriesVisible(true);
                    setMemoryToBeEdit("");
                  }}
                >
                  Cancel
                </Button>
              </Dialog.Actions>
            </Dialog>
            {/********************** delete memory box **********************/}
            <Dialog
              visible={memoryDeleteBoxVisible}
              onDismiss={() => {
                setMemoryDeleteBoxVisible(false);
              }}
            >
              <Dialog.Title>Alert</Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium">Are you sure you want to delete this memory?</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={() => {
                    removeMemory(userId, holiday.id, memoryToBeDelete).then(() => {
                      memoriesByHoliday(userId, holiday.id)
                        .then((res) => {
                          setAllMemories(res);
                        })
                        .catch(() => {});
                    });
                    setMemoryDeleteBoxVisible(false);
                    setAllMemoriesVisible(true);
                    setMemoryToBeDelete("");
                  }}
                >
                  Delete
                </Button>
                <Button
                  onPress={() => {
                    setMemoryDeleteBoxVisible(false);
                    setAllMemoriesVisible(true);
                  }}
                >
                  Cancel
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        ) : null}
      </ScrollView>
    </PaperProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  holiday_card: {
    gap: 5,
    paddingBottom: 5,
  },
  see_memories: {
    paddingTop: 10,
    paddingBottom: 10,
  },
});
