import { useRouter } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
// import auth from '@react-native-firebase/auth';

export default function adminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

    // const login = async () => {
    //     console.log("trying to login...")
    //     try {
    //     const user = await auth().signInWithEmailAndPassword(email, password);
    //     console.log(user);
    //     router.push("/tabs");
    //     } catch (error) {
    //     console.log(error);
    //     }
    // };

  function login() {
    console.log("trying to login...")
    if (email == "Admin@gmail.com" && password == "admin") {
        router.push("/adminDboard");
    } else {
        alert("Invalid email or password");
    }
  }
  
  function forgotId() {
    alert("Please contact the admin at +65 81234567 for help")
  }

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("@/assets/images/JudgeIconBG.png")} /> 
      <StatusBar style="auto" />
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={(email) => setEmail(email)}
        /> 
      </View> 
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        /> 
      </View> 
      <TouchableOpacity onPress={forgotId}>
        <Text style={styles.forgot_button}>Forgot Password?</Text> 
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
    backgroundColor: "#ffaf80",
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
    backgroundColor: "#ff7f50",
  },
});