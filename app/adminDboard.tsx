import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { collection, addDoc, doc, setDoc, getDoc, getDocs, query, where, updateDoc, deleteDoc, orderBy } from "firebase/firestore"; // Firestore functions
import { db } from'../db/firebaseConfig';
import { Card } from '@rneui/themed';
import { EventData } from '../constants/interfaces';
import { Button, useTheme } from 'native-base';

export default function AdminDashboard() {

  // Constants
  const theme = useTheme();
  const [events, setEvents] = useState<any[]>([]);
  const [newEvent, setNewEvent] = useState<boolean>(false);

  // Create a pull function for events
  async function fetchEvents(): Promise<any> {
    try {
      const eventsRef = collection(db, "events");
      const eventsQuery = query(eventsRef, orderBy("dateOfEvent"));
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

  useEffect(() => {
    const loadEvent = async () => {
      const fetchedEvents = await fetchEvents();
      setEvents(fetchedEvents);
    };
    loadEvent();
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

  // onPress={() => createEventWithNameAsID("HacknRoll25", eventData)}

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Admin Dashboard</Text>
      <Card>
        <Card.Title>Schedule</Card.Title>
        <Card.Divider />
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
              onPress= {() => console.log("Start event")}
            >
              Start
            </Button>
          </Card>
        ))}
      </Card>
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