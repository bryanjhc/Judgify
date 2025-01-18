import React, { useEffect, useState, useMemo } from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity, Linking, TextInput } from 'react-native';
import { collection, addDoc, doc, setDoc, getDoc, getDocs, query, where, updateDoc, deleteDoc, orderBy, writeBatch } from "firebase/firestore"; // Firestore functions
import { db } from'../db/firebaseConfig';
import { Card } from '@rneui/themed';
import { EventData } from '../constants/interfaces';
import { Button, useTheme, Modal, VStack, HStack } from 'native-base';
import { Icon } from 'react-native-elements';
import InputScrollView from 'react-native-input-scroll-view';
import { useRouter } from 'expo-router';

export default function SubmitNewEvent() {

    const router = useRouter();
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [organizer, setOrganizer] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [participants, setParticipants] = useState('');
    const [numTeams, setNumTeams] = useState('');

    const handleSubmit = async () => {
        if (!eventName || !eventDate || !organizer || !eventLocation || !participants|| !numTeams || !eventDescription) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }

        // Push data to firestore
        try {
            const docRef = doc(db, 'events', eventName);
            await setDoc(docRef, {
                name: eventName,
                dateOfEvent: eventDate,
                numOfParticipants: participants,
                numOfTeams: numTeams,
                location: eventLocation,
                description: eventDescription,
                createdAt: new Date().toISOString(),
                eventStatus: 'Upcoming',
                eventURL: '',
                organizer: organizer,
            });
            Alert.alert('Success', 'Event submitted successfully!');
            setEventName('');
            setEventDate('');
            setOrganizer('');
            setEventLocation('');
            setParticipants('');
            setNumTeams('');
            setEventDescription('');
        } catch (error) {
            Alert.alert('Error', 'Failed to submit the event. Please try again.');
            console.error('Error submitting event:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Card containerStyle={styles.card}>
                <Card.Title style={styles.title}>New Event</Card.Title>
                <Card.Divider />
                <InputScrollView>
                    <VStack space={4}>
                        <TextInput
                            style={styles.input}
                            placeholder="Event Name"
                            value={eventName}
                            onChangeText={setEventName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Event Date (YYYY-MM-DD)"
                            value={eventDate}
                            onChangeText={setEventDate}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Event Organizer"
                            value={organizer}
                            onChangeText={setOrganizer}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Event Location"
                            value={eventLocation}
                            onChangeText={setEventLocation}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Number of participants"
                            value={participants}
                            onChangeText={setParticipants}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Number of teams"
                            value={numTeams}
                            onChangeText={setNumTeams}
                        />
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Event Description"
                            value={eventDescription}
                            onChangeText={setEventDescription}
                            multiline
                        />
                        <Button onPress={handleSubmit} style={styles.button}>
                            Submit
                        </Button>
                        <Button onPress={() => router.push('/adminDboard')} style={styles.backButton}>
                            Back
                        </Button>
                    </VStack>
                </InputScrollView>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    card: {
        width: '100%',
        borderRadius: 8,
        padding: 16,
        height: '75%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
        // marginBottom: 15
    },
    button: {
        backgroundColor: '#4caf50',
    },
    backButton: {
        backgroundColor: '#DC143C',
    },
});