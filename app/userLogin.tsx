import { useRouter } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { db } from '../db/firebaseConfig';
import { collection, addDoc, doc, setDoc, getDoc, getDocs, query, where, updateDoc, deleteDoc, writeBatch, orderBy } from "firebase/firestore"; // Firestore functions
import React, { useEffect, useState, useMemo } from 'react';


export default function userLogin() {
  const router = useRouter();
  const [id , setId] = useState("");
  const [availableIds, setAvailableIds] = useState<string[]>([]);

  async function fetchAllDocumentIds(collectionName: string, setAvailableIds: (ids: string[]) => void) {
    try {
      const collectionRef = collection(db, collectionName);
      const querySnapshot = await getDocs(collectionRef);

      // Map over all documents to extract their IDs
      const documentIds = querySnapshot.docs.map((doc) => doc.id);
      console.log("Fetched document IDs:", documentIds);
      setAvailableIds(documentIds);
    } catch (error) {
      console.error("Error fetching document IDs:", error);
    }
  }

  useEffect(() => {
    fetchAllDocumentIds("judgeHack&Roll25", setAvailableIds);
  }, []);

  function login() {
      console.log("trying to login...")
      if (availableIds.includes(id)) {
        console.log('Navigating with ID:', id);
        router.push({
          pathname: '/tabs/map',
          params: { id },
        });
      }
      else {
        alert("Invalid ID");
      }
  }

  function forgotId() {
    alert("Please contact the admin at +65 81234567 for your ID")
  }


  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("@/assets/images/JudgeIconBG.png")} /> 
      <StatusBar style="auto" />
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Unique ID (6 digits)"
          placeholderTextColor="#003f5c"
          onChangeText={(id) => setId(id)}
        /> 
      </View>
      <TouchableOpacity onPress={forgotId}>
        <Text style={styles.forgot_button}>Forgot ID?</Text> 
      </TouchableOpacity> 
      <TouchableOpacity style={styles.loginBtn} onPress={login}>
        <Text style={styles.loginText}>LOGIN</Text> 
      </TouchableOpacity> 
    </View> 
  );
}
const styles = StyleSheet.create({
  loginText: {
    color: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginBottom: 40,
    height : '25%',
    width : '100%',
  },
  inputView: {
    backgroundColor: "#FFC0CB",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#FF1493",
  },
});