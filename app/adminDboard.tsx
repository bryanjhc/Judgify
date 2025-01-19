import React, { useEffect, useState, useMemo } from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity, Linking, TextInput } from 'react-native';
import { collection, addDoc, doc, setDoc, getDoc, getDocs, query, where, updateDoc, deleteDoc, orderBy, writeBatch } from "firebase/firestore"; // Firestore functions
import { db } from'../db/firebaseConfig';
import { Card } from '@rneui/themed';
import { EventData } from '../constants/interfaces';
import { Button, useTheme, Modal, VStack, HStack, Input } from 'native-base';
import { Icon } from 'react-native-elements';
import InputScrollView from 'react-native-input-scroll-view';
import { useRouter } from 'expo-router';

export default function AdminDashboard() {

  // Constants
  const theme = useTheme();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [newEvent, setNewEvent] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [numberOfJudges, setNumberOfJudges] = useState("");
  const [startEvent, setStartEvent] = useState<any>(null);
  const [buttonFlag, setbuttonFlag] = useState(false);

  // Create a pull function for events
  async function fetchEvents(): Promise<any> {
    try {
      const eventsRef = collection(db, "events");
      const eventsQuery = query(eventsRef, orderBy("dateOfEvent", "desc"));
      const eventsSnapshot = await getDocs(eventsQuery);
      const eventsList: any[] = [];
      eventsSnapshot.forEach((doc) => {
        eventsList.push({ id: doc.id, ...doc.data() });
      });
      console.log("Events fetched successfully:", eventsList);
      return eventsList;
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  };

  async function pushJudgeInfo(teamAllocations: Record<string, number[]>): Promise<any> {
    const batch = writeBatch(db);
    const collectionPath = "judge" + startEvent.name;

    for (const judge in teamAllocations) {
      const judgeData = {
        uuid: judge,
        teams: teamAllocations[judge],
        event: startEvent.name,
        eventId: startEvent.id,
        company: "Grab",
        role: "Senior Software Engineer",
        email: "hihi@gmail.com"
      };
      const docRef = doc(db, collectionPath, judge);
      batch.set(docRef, judgeData);
    }
    await batch.commit();
    console.log("Batch write completed successfully.");
  };

  useEffect(() => {
    const loadEvent = async () => {
      const fetchedEvents = await fetchEvents();
      setEvents(fetchedEvents);
    };
    loadEvent();
    console.log("StartEvent", startEvent);
    console.log("Number of Judges", numberOfJudges);
  }, [newEvent]);

  // const eventData = {
  //   name: "Hack&Roll 2025",
  //   description: "Annual hackathon event for 2025.",
  //   numOfParticipants: 120,
  //   numOfTeams: 45,
  //   dateOfEvent: "2025-03-15",
  //   createdAt: new Date().toISOString(),
  //   location: "School of Computing, NUS",
  //   eventStatus: "upcoming",
  //   eventType: "Hackathon",
  //   eventURL: "https://hacknroll2025.example.com",
  //   organizer: "NUS Hackers",
  //   tags: ["tech", "coding", "competition"],
  // };

  // interface EventData {
  //   name: string;
  //   description: string;
  //   numOfParticipants: number;
  //   numOfTeams: number;
  //   dateOfEvent: string;
  //   createdAt: string;
  //   location: string;
  //   eventStatus: string;
  //   eventType: string;
  //   eventURL: string;
  //   organizer: string;
  //   tags: string[];
  // }

  async function createEventWithNameAsID(eventName: string, eventData: EventData): Promise<void> {
    try {
      const eventRef = doc(db, "events", eventName);
      await setDoc(eventRef, eventData);
      console.log("Document written with ID:", eventName);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  }

  // UUID generator
  const generateJudgeUUIDs = (count: number): string[] => {
    const uuids = [];
    for (let i = 0; i < count; i++) {
      const uuid = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit number
      uuids.push(uuid);
    }
    return uuids;
  };

  // Shuffle array function
  const shuffleArray = (array: number[]): number[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const allocateTeams = (judges: string[], teams: number[], teamsPerJudge: number) => {
    const allocations: Record<string, number[]> = {};
    let teamIndex = 0;

    judges.forEach((judge) => {
      allocations[judge] = teams.slice(teamIndex, teamIndex + teamsPerJudge);
      teamIndex += teamsPerJudge;
    });
    console.log("Team allocations:", allocations);
    return allocations;
  };

  async function updateEventStatus(status: string) {
    try {
      const eventRef = doc(db, "events", "HacknRoll25");
      await updateDoc(eventRef, {
        eventStatus: status,
      });
      console.log(`Event status updated to "${status}"`);
    } catch (error) {
      console.error("Error updating event status:", error);
      // Alert.alert("Error", "Failed to update event status.");
    }
  }

  // Once I press start -> prompt for user to enter number of judges.
  const handleStartEvent = () => {
    if (isNaN(Number(numberOfJudges)) || Number(numberOfJudges) <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid number greater than 0.");
    } else {
      setModalVisible(false);
      console.log(`Event started with ${numberOfJudges} judges.`);
      // Start the database push here
      console.log("Start event", startEvent);
      // take the number of teams from startEvent, and divide it by the number of judges
      // Randomly assign judges to teams
      // Push these results to the database
      const judgeUUIDs = generateJudgeUUIDs(Number(numberOfJudges));
      const teamsPerJudge = Math.ceil(startEvent.numOfTeams / judgeUUIDs.length);
      const shuffledTeams = shuffleArray([...Array(startEvent.numOfTeams).keys()]);
      const teamAllocations = allocateTeams(judgeUUIDs, shuffledTeams, teamsPerJudge);
      console.log(teamAllocations);
      pushJudgeInfo(teamAllocations)
        .then(() => console.log("Pushed to firestore"))
        .catch((error) => {
          console.error("Error pushing to Firestore:", error);
          Alert.alert("Error", "An error occurred while pushing data.");
        }
      );

      setbuttonFlag(true);
      updateEventStatus("started");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.title}>Welcome to Admin Dashboard</Text>
      </View>
      <Card>
        <Card.Title>Schedule</Card.Title>
        <Card.Divider />
          <View style={styles.scrollContainer}>
            <InputScrollView>
            {/* Map here */}
            {events.map((oneEvent) => (
              <Card containerStyle={styles.cardContainer} key={oneEvent.id}>
                <Text style={styles.eventTitle}>{oneEvent.name}</Text>
                <Text style={styles.eventDetails}>
                  <Text style={styles.boldText}>Date:</Text> {oneEvent.dateOfEvent}
                </Text>
                <Text style={styles.eventDetails}>
                  <Text style={styles.boldText}>Location:</Text> {oneEvent.location}
                </Text>
                <Text style={styles.eventDetails}>
                  <Text style={styles.boldText}>Organizer:</Text> {oneEvent.organizer}
                </Text>
                <Text style={styles.eventDetails}>
                  <Text style={styles.boldText}>Participants:</Text> {oneEvent.numOfParticipants}
                </Text>
                <Text style={styles.eventDetails}>
                  <Text style={styles.boldText}>Teams:</Text> {oneEvent.numOfTeams}
                </Text>
                <Text style={styles.eventDetails}>
                  <Text style={styles.boldText}>Description:</Text> {oneEvent.description}
                </Text>
                <Text
                  style={styles.eventLink}
                  onPress={() => Linking.openURL(oneEvent.eventURL)}
                >
                  Visit Event Page
                </Text>
                <Button
                  bg= "emerald.400"
                  _pressed= {{ bg: "emerald.300" }}
                  width= "100%"
                  _text={{
                    fontWeight: "bold",
                  }}
                  onPress= {() => {
                    console.log("Start event");
                    setStartEvent(oneEvent);
                    setModalVisible(true);
                  }}
                  isDisabled={buttonFlag}
                >
                  Start
                </Button>
              </Card>
            ))}
          </InputScrollView>
        </View>
      </Card>
      <View style={styles.addContainer}>
        <TouchableOpacity
            style={styles.circularButton}
            onPress={() => {
              console.log("Admin wants to add a new event");
              router.push('/submitNewEvent');
            }}
          >
            <Icon
              name="add"
            />
          </TouchableOpacity>
      </View>
      <View style={styles.backContainer}>
        <Button
          onPress={() => {
            console.log("Admin wants to go back to the main page");
            router.push('/');
          }}
        >
          Home
        </Button>
      </View>
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Enter Number of Judges</Modal.Header>
          <Modal.Body>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter a number"
              value={numberOfJudges}
              onChangeText={setNumberOfJudges}
            />
          </Modal.Body>
          <Modal.Footer>
            <HStack space={3}>
              <Button colorScheme="green" onPress={handleStartEvent}>
                OK
              </Button>
              <Button colorScheme="red" onPress={() => setModalVisible(false)}>
                Back
              </Button>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeContainer: {
    marginTop: 40
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardContainer: {
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  eventDetails: {
    marginVertical: 4,
    fontSize: 14,
  },
  eventLink: {
    color: "blue",
    marginTop: 8,
    marginBottom: 4
  },
  boldText: {
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    width: "100%",
  },
  circularButton: {
    // position: 'absolute',
    // right: 5,
    width: 50,
    height: 50,
    borderRadius: 25, // Half of the width/height for a perfect circle
    backgroundColor: 'orange', // Background color
    // alignItems: 'center', // Center icon horizontally
    justifyContent: 'center', // Center icon vertically
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.3, // Shadow opacity for iOS
    shadowRadius: 3, // Shadow radius for iOS
  },
  addContainer: {
    justifyContent:'center',
    marginTop: 15
  },
  scrollContainer: {
    flex: 1,
    maxHeight: 500, // Constrain scrollable area
  },
  backContainer: {
    justifyContent:'center',
    marginTop: 15
  },
});









// E.g. for CRUD Functionalities to follow
async function getEventByID(eventName: string): Promise<void> {
  try {
    const eventRef = doc(db, "events", eventName);
    const docSnap = await getDoc(eventRef);

    if (docSnap.exists()) {
      console.log("Event data:", docSnap.data());
    } else {
      console.log("No such event!");
    }
  } catch (error) {
    console.error("Error getting event:", error);
  }
}


// Query based on conditions
async function queryEvents(): Promise<void> {
  try {
    const eventsRef = collection(db, "events");
    const q = query(eventsRef, where("numOfParticipants", ">", 100));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} =>`, doc.data());
    });
  } catch (error) {
    console.error("Error querying events:", error);
  }
}

//updating a document
async function updateEvent(eventName: string): Promise<void> {
  try {
    const eventRef = doc(db, "events", eventName);
    await updateDoc(eventRef, {
      numOfParticipants: 150, // Update this field
    });
    console.log("Event updated successfully!");
  } catch (error) {
    console.error("Error updating event:", error);
  }
}

//Delete Doc
async function deleteEvent(eventName: string): Promise<void> {
  try {
    const eventRef = doc(db, "events", eventName);
    await deleteDoc(eventRef);
    console.log("Event deleted successfully!");
  } catch (error) {
    console.error("Error deleting event:", error);
  }
}