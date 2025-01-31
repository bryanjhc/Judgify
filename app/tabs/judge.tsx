// import { Item } from 'firebase/analytics';
import React, { useState, useEffect } from 'react';
import { Rating } from 'react-native-ratings';
import { StyleSheet, View, Text, TextInput, FlatList, Image, TouchableOpacity, Linking, Modal, Button, Pressable, Alert } from 'react-native';
import { notificationAsync } from 'expo-haptics';
import { useGlobalState } from '@/GlobalState';
import { collection, addDoc, doc, setDoc, getDoc, getDocs, query, where, updateDoc, deleteDoc, writeBatch, orderBy } from "firebase/firestore"; // Firestore functions
import { db } from '../../db/firebaseConfig';
import { ImageSourcePropType } from 'react-native';

// const propertyData = [
//   {
//     id: '1',
//     image: 'https://source.unsplash.com/900x900/?house',
//     projectName: '$250,000',
//     indivNames: '123 Main St',
//     description: '150',
//     beds: '3',
//     baths: '2',
//     parking: '1'
//   },
//   {
//     id: '2',
//     image: 'https://source.unsplash.com/900x900/?apartment',
//     projectName: '$400,000',
//     indivNames: '456 Oak Ave',
//     description: '200',
//     beds: '4',
//     baths: '3',
//     parking: '2'
//   },
//   {
//     id: '3',
//     image: 'https://source.unsplash.com/900x900/?house+front',
//     projectName: '$150,000',
//     indivNames: '789 Maple Rd',
//     description: '100',
//     beds: '2',
//     baths: '1',
//     parking: '0'
//   },
//   {
//     id: '4',
//     image: 'https://source.unsplash.com/900x900/?small+house',
//     projectName: '$150,000',
//     indivNames: '789 Maple Rd',
//     description: '100',
//     beds: '2',
//     baths: '1',
//     parking: '0'
//   }
// ];

// const groupData = [
//     {
//         id: '1',
//         "picture": require("@/assets/images/chewtok.jpg"),
//         "projectName": "Judgify",
//         "members": ["Nicholas Tok", "Bryan Chew"],
//         "linkedinLinks": [
//             "https://www.linkedin.com/in/nictok",
//             "https://www.linkedin.com/in/bryanjhc",
//         ],
//         "projectDescription": "Judgify is an app that heavily improves convenience in the judging progress for judges and event organisers.",
//         "projectPrizeCategory": "Most Socially Useful Hack",
//         "devpostLink": "https://devpost.com/judgify",
//         "repoLink": "https://github.com/bryanjhc/Judgify"
//     },
//     {
//         id: '2',
//       "picture": require("@/assets/images/EcoTrack.webp"),
//       "projectName": "EcoTrack",
//       "members": ["Alice Tan", "Bob Lim", "Cindy Ong", "David Ng"],
//       "linkedinLinks": [
//         "https://www.linkedin.com/in/alicetan",
//         "https://www.linkedin.com/in/boblim",
//         "https://www.linkedin.com/in/cindyong",
//         "https://www.linkedin.com/in/davidng"
//       ],
//       "projectDescription": "EcoTrack is an innovative app that empowers individuals to track their carbon footprint, receive personalized tips to reduce it, and connect with green initiatives in their community.",
//       "projectPrizeCategory": "Most Socially Useful Hack",
//       "devpostLink": "https://devpost.com/ecotrack",
//       "repoLink": "https://github.com/team-ecotrack"
//     },
//     {
//       id: '3',
//       "picture": require("@/assets/images/HealthhubAI.webp"),
//       "projectName": "HealthHub AI",
//       "members": ["Ethan Lee", "Fiona Chen", "Grace Tan"],
//       "linkedinLinks": [
//         "https://www.linkedin.com/in/ethanlee",
//         "https://www.linkedin.com/in/fionachen",
//         "https://www.linkedin.com/in/gracetan"
//       ],
//       "projectDescription": "HealthHub AI is a chatbot that provides reliable health advice, symptom analysis, and connects users with medical professionals instantly.",
//       "projectPrizeCategory": "Most Overengineered Hack",
//       "devpostLink": "https://devpost.com/healthhubai",
//       "repoLink": "https://github.com/team-healthhubai"
//     },
//     {
//         id: '4',
//       "picture": require("@/assets/images/EduSphere.webp"),
//       "projectName": "EduSphere",
//       "members": ["Irene Tan", "Jacky Chua", "Kim Ng", "Leonard Wong"],
//       "linkedinLinks": [
//         "https://www.linkedin.com/in/irenetan",
//         "https://www.linkedin.com/in/jackychua",
//         "https://www.linkedin.com/in/kimng",
//         "https://www.linkedin.com/in/leonardwong"
//       ],
//       "projectDescription": "EduSphere is a gamified e-learning platform designed to make studying fun and collaborative for students of all ages.",
//       "projectPrizeCategory": "Most Beautiful Hack",
//       "devpostLink": "https://devpost.com/edusphere",
//       "repoLink": "https://github.com/team-edusphere"
//     },
//     {
//         id: '5',
//       "picture": require("@/assets/images/SafeWay.webp"),
//       "projectName": "SafeWay",
//       "members": ["Maria Chong", "Noah Lim", "Oliver Tan"],
//       "linkedinLinks": [
//         "https://www.linkedin.com/in/mariachong",
//         "https://www.linkedin.com/in/noahlim",
//         "https://www.linkedin.com/in/olivertan"
//       ],
//       "projectDescription": "SafeWay is an AI-powered navigation tool for pedestrians, prioritizing safe and accessible routes in urban environments.",
//       "projectPrizeCategory": "Most Awesomely Useless Hack",
//       "devpostLink": "https://devpost.com/safeway",
//       "repoLink": "https://github.com/team-safeway"
//     },
//     {
//         id: '6',
//       "picture": require("@/assets/images/FinGrow.webp"),
//       "projectName": "FinGrow",
//       "members": ["Pauline Koh", "Quincy Lim", "Rita Tan", "Samuel Ng"],
//       "linkedinLinks": [
//         "https://www.linkedin.com/in/paulinekoh",
//         "https://www.linkedin.com/in/quincylim",
//         "https://www.linkedin.com/in/ritatan",
//         "https://www.linkedin.com/in/samuelng"
//       ],
//       "projectDescription": "FinGrow is a personal finance app that helps users manage budgets, track spending, and achieve financial goals with ease.",
//       "projectPrizeCategory": "Most Annoying Hack",
//       "devpostLink": "https://devpost.com/fingrow",
//       "repoLink": "https://github.com/team-fingrow"
//     }
//   ]

const PropertyList = () => {
  const [searchText, setSearchText] = useState('');

  const [isModalVisible, setModalVisible] = useState(false);

  const [selectedItem, setSelectedItem] = useState<typeof groupData[0] | null>(null);
  const [selectedPicture, setSelectedPicture] = useState<any>(require("@/assets/images/EcoTrack.webp"));

  const [funRating, setFunRating] = useState(2.5);
  const [impactRating, setImpactRating] = useState(2.5);
  const [techRating, setTechRating] = useState(2.5);
  const [groupData, setGroupData] = useState<any>([]);

  // Pull the info
  const { globalId } = useGlobalState();
  console.log(globalId); // successful pull
  async function pullAssignedTeams(globalId: string) {
    try {
        // Reference the specific document in Firestore
        const docRef = doc(db, 'judgeHack&Roll25', globalId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // Extract the `teams` property
            const data = docSnap.data();
            const assignedTeams = (data.teams as (string | number)[] || []).map((teamId: string | number) => String(teamId));
            console.log("Assigned Teams:", assignedTeams);
            return assignedTeams;
        } else {
            console.warn("No document found for the given ID:", globalId);
            return null;
        }
    } catch (error) {
        console.error("Error fetching assigned teams:", error);
        return null;
      }
};

  async function pullPropertyData(teamList: string[]) {
    const propertyData: any[] = []; // Initialize array to store property data

    try {
        for (const teamId of teamList) {
            const docRef = doc(db, 'HacknRoll25', teamId); // Reference each document
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                propertyData.push(data); // Append fetched data
            } else {
                console.warn(`Document with ID ${teamId} does not exist.`);
            }
        }

        console.log("Fetched Property Data:", propertyData);
        return propertyData;
    } catch (error) {
        console.error("Error fetching property data:", error);
        return [];
    }
  }

  async function updateAllPictures() {
    try {
      // Reference the HacknRoll25 collection
      const collectionRef = collection(db, "HacknRoll25");
      // Fetch all documents in the collection
      const querySnapshot = await getDocs(collectionRef);

      // Define the new picture value
      const newPicture = "@/assets/images/HealthhubAI.webp";
      // Loop through each document and update the picture field
      const updatePromises = querySnapshot.docs.map(async (docSnap) => {
        const docRef = doc(db, "HacknRoll25", docSnap.id); // Get a reference to the document
        await updateDoc(docRef, { picture: newPicture }); // Update the picture field
      });
      // Wait for all updates to complete
      await Promise.all(updatePromises);
      console.log("All pictures updated successfully!");
    } catch (error) {
      console.error("Error updating pictures:", error);
    }
  }

  useEffect(() => {
    // Call the function
    // updateAllPictures();
    if (globalId) {
        const fetchData = async () => {
            const assignedGroups = await pullAssignedTeams(globalId);
            if (assignedGroups.length > 0) {
                const info = await pullPropertyData(assignedGroups); // Await the property data
                setGroupData(info); // Set the fetched data in state
            }
        };
        fetchData();
    }
  }, [globalId]);


  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleSearch = (text: string) => {
      setSearchText(text);
  }

  const imageMap: Record<string, ImageSourcePropType> = {
    "@/assets/images/HealthhubAI.webp": require("@/assets/images/HealthhubAI.webp"),
    "@/assets/images/chewtok.jpg": require("@/assets/images/chewtok.jpg"),
    "@/assets/images/EcoTrack.webp": require("@/assets/images/EcoTrack.webp"),
    "@/assets/images/EduSphere.webp": require("@/assets/images/EduSphere.webp"),
    "@/assets/images/SafeWay.webp": require("@/assets/images/SafeWay.webp"),
    "@/assets/images/FinGrow.webp": require("@/assets/images/FinGrow.webp"),
    // Add other mappings as necessary
  };

  const renderItem = ({ item }: { item: typeof groupData[0] }) => (
    <TouchableOpacity style={styles.card} onPress={() => {
      console.log("Selected Picture:", item.picture);
      setSelectedPicture(item.picture);
      setSelectedItem(item);
      toggleModal();
    }}>
      <Image source={imageMap[item.picture] || imageMap["@/assets/images/HealthhubAI.webp"]} style={styles.image} />
      <View style={styles.cardBody}>
        <Text style={styles.projectName}>{item.teamName}</Text>
        {item.members.map((member, index) => (
            <Text key={index} style={styles.indivNames} onPress={() => Linking.openURL(item.linkedinLinks[index])}>
                {member}
            </Text>
        ))}
        <Text style={styles.description}>{item.projectDescription}</Text>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.beds}>{item.projectPrizeCategory}</Text>
        <Text style={styles.baths} onPress={() => Linking.openURL(item.repoLink)}>{item.repoLink}</Text>
        <Text style={styles.parking} onPress={() => Linking.openURL(item.devpostLink)}>{item.devpostLink}</Text>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.notesHeader}>Take Notes:</Text>
        <TextInput style={styles.notes} multiline/>
      </View>
    </TouchableOpacity>
  );

  async function updateRatings(selectedItemID: string, funRating: number, impactRating: number, techRating: number) {
    try {
      // Reference the specific document in the "HacknRoll25" collection
      const docRef = doc(db, "HacknRoll25", selectedItemID);
      // Update the document with the new ratings
      await updateDoc(docRef, {
        funVotes: funRating,
        innoVotes: impactRating,
        techVotes: techRating,
      });
      console.log("Ratings updated successfully!");
    } catch (error) {
      console.error("Error updating ratings:", error);
    }
  }

  const filteredData = groupData.filter((item) => {
    return item.teamName.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchInputContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Assigned Teams..."
          onChangeText={handleSearch}
          value={searchText}
        />
      </View>
      <FlatList
        contentContainerStyle={styles.propertyListContainer}
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.ID}
      />

      <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            toggleModal();
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {selectedItem && 
              (<View style={{alignContent : "center"}}>
                <Text style={styles.projectName}>{selectedItem.teamName}</Text>
                <Image source={imageMap[selectedPicture] || imageMap["@/assets/images/HealthhubAI.webp"]} style={{width : 280 , height : "25%"}}/>
              <Text style={styles.description}>{selectedItem.projectDescription}</Text>
              <Text style={styles.ratingHeader}>Ratings</Text>
              <Text style={styles.indivNames}>Fun</Text>
              <Rating
                type='star'
                ratingCount={5}
                imageSize={30}
                style={{ paddingVertical: 10 }}
                onFinishRating={setFunRating}
                startingValue={funRating}
                fractions={1}
                jumpValue={0.5}
              />
              <Text style={styles.indivNames}>Impactful and Innovative</Text>
              <Rating
                type='heart'              
                ratingCount={5}
                imageSize={30}
                style={{ paddingVertical: 10 }}
                onFinishRating={setImpactRating}
                startingValue={impactRating}
                fractions={1}
                jumpValue={0.5}
              />
              <Text style={styles.indivNames}>Technologically Impressive</Text>
              <Rating
                type='rocket'
                ratingCount={5}
                imageSize={30}
                style={{ paddingVertical: 10 }}
                onFinishRating={setTechRating}
                startingValue={techRating}
                fractions={1}
                jumpValue={0.5}
              />
              </View>
              )}
              <View style = {{flexDirection : "row"}}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={toggleModal}>
                  <Text style={styles.textStyle}>Close</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    // console.log("Selected Item ID Type:", typeof selectedItem.ID);
                    console.log('Fun Rating: ', funRating);
                    console.log('Impact Rating: ', impactRating);
                    console.log('Tech Rating: ', techRating);
                    updateRatings(String(selectedItem.ID), funRating, impactRating, techRating);
                    toggleModal();
                    Alert.alert('Ratings Submitted', 'Your ratings have been submitted successfully!', [
                      { text: 'OK' }
                    ]);
                  }}>
                  <Text style={styles.textStyle}>Submit</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginHorizontal: 10,
    width: 100,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    paddingTop:60,
  },
  searchInputContainer:{
    paddingHorizontal:20,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor:'#dcdcdc',
    backgroundColor:'#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  },
  propertyListContainer:{
    paddingHorizontal:20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginTop:10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  image: {
    height: 150,
    width: '100%',
    marginBottom: 10,
    borderTopLeftRadius:5,
    borderTopRightRadius:5,
  },
  cardBody: {
    marginBottom: 10,
    padding: 10,
  },
  projectName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5
  },
  ratingHeader: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5
  },
  indivNames: {
    fontSize: 16,
    marginBottom: 5
  },
  description: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666'
  },
  cardFooter: {
    padding: 10,
    borderTopWidth:1,
    borderTopColor:'#dcdcdc',
    justifyContent: 'space-between',
  },
  beds: {
    fontSize: 14,
    color:'#ffa500',
    fontWeight: 'bold'
  },
  baths: {
    fontSize: 14,
    color:'#ffa500',
    fontWeight: 'bold'
  },
  parking: {
    fontSize: 14,
    color:'#ffa500',
    fontWeight: 'bold'
  },
  notesHeader: {
    fontSize: 20,
    marginBottom: 5
  },
  notes: {
    height: 100,
    borderWidth: 1,
    borderColor:'#dcdcdc',
    backgroundColor:'#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }
});

export default PropertyList