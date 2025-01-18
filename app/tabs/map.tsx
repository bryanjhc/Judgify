import { View, Image, StyleSheet, Platform, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { Button, Container } from 'native-base';
import { db } from '../../db/firebaseConfig';
import { collection, addDoc, doc, setDoc, getDoc, getDocs, query, where, updateDoc, deleteDoc, writeBatch, orderBy } from "firebase/firestore"; // Firestore functions
import React, { useEffect, useState, useMemo } from 'react';
import { Cell } from '@/constants/interfaces';
import { Icon } from 'react-native-elements';
import Svg, { Path } from 'react-native-svg';

export default function HomeScreen() {

  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id;

  const [teams, setTeams] = useState<any[]>([]);
  const [assignedTableIds, setAssignedTableIds] = useState<string[]>([]);
  const [gridOutline, setGrid] = useState<Cell[][]>([]);

  //Measuring layout
  const [layoutWidth, setLayoutWidth] = useState(0);
  const [layoutHeight, setLayoutHeight] = useState(0);

  const [startCell, setStartCell] = useState<Cell | null>(null);
  const [overlayEnabled, setOverlayEnabled] = useState(false);


  useEffect(() => {
      const fetchAllTeams = async () => {
          const fetchedTeams = await fetchTeamsFromHacknRoll();
          setTeams(fetchedTeams);
          fetchTables();
          // For example, we can assign some tables to teams
          // setAssignedTableIds([]); // Gotta change this to pulling from backend
      };
      const fetchTables = async () => {
        if (id) {
          console.log("Passed ID from userLogin.tsx: ",id);
          const fetchedTables = await fetchAssignedTables(id);
          if (fetchedTables) {
            console.log(fetchedTables.teams);
            setAssignedTableIds(fetchedTables.teams);
          }
        } else {
          console.warn("ID is null, cannot fetch assigned tables.");
        }
      };
      fetchAllTeams();
  }, []);

  async function fetchTeamsFromHacknRoll() {
      try {
          const q = query(
              collection(db, "HacknRoll25"),
              orderBy("ID", "asc")
          );
        const querySnapshot = await getDocs(q);
        const teams: any[] = [];
        querySnapshot.forEach((docSnap) => {
          // docSnap.id is the document ID (string)
          // docSnap.data() is the actual data
          teams.push({
            docId: docSnap.id,       // could store doc ID (string), or use the "ID" field
            ...docSnap.data(),
          });
        });
        console.log("Fetched teams:", teams);
        return teams;
      } catch (error) {
        console.error("Error fetching teams:", error);
        return [];
      }
  }


  async function fetchAssignedTables(id: string) {
    try {
      const docRef = doc(db, "judgeHack&Roll25", id); // Reference the specific document
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data?.teams && Array.isArray(data.teams)) {
          data.teams = data.teams.map((num) => String(num));
        }
        console.log("Fetched assigned tables:", data);
        return data; // Return the entire document data
      } else {
        console.warn("No document found for the given ID.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching assigned tables:", error);
      return null;
    }
  }

  //Insert fake info
  // const entries = [
  //     { ID: 1, focus: "most innovative hack", teamName: "InnovateSquad", votes: 6119 },
  //     { ID: 2, focus: "most practical solution", teamName: "NUSmartDevelopers", votes: 1062 },
  //     { ID: 3, focus: "best user experience", teamName: "TechNerds", votes: 6577 },
  //     { ID: 4, focus: "most innovative hack", teamName: "HackathonCreators", votes: 9297 },
  //     { ID: 5, focus: "most practical solution", teamName: "TechCreators", votes: 6227 },
  //     { ID: 6, focus: "best design", teamName: "PioneersNerds", votes: 4078 },
  //     { ID: 7, focus: "best design", teamName: "InnovateMasters", votes: 4217 },
  //     { ID: 8, focus: "most practical solution", teamName: "CodeNerds", votes: 2859 },
  //     { ID: 9, focus: "best design", teamName: "BuildersNerds", votes: 3666 },
  //     { ID: 10, focus: "best design", teamName: "NUSmartMasters", votes: 1365 },
  //     { ID: 11, focus: "most practical solution", teamName: "PioneersGurus", votes: 1911 },
  //     { ID: 12, focus: "most practical solution", teamName: "BuildersChamp", votes: 2550 },
  //     { ID: 13, focus: "best user experience", teamName: "TechChamp", votes: 1273 },
  //     { ID: 14, focus: "most useless hack", teamName: "HackathonGurus", votes: 5331 },
  //     { ID: 15, focus: "most practical solution", teamName: "InnovateChamp", votes: 9724 },
  //     { ID: 16, focus: "most practical solution", teamName: "BuildersNerds", votes: 4498 },
  //     { ID: 17, focus: "most useless hack", teamName: "HackathonCreators", votes: 6771 },
  //     { ID: 18, focus: "best user experience", teamName: "PioneersHackers", votes: 9122 },
  //     { ID: 19, focus: "most practical solution", teamName: "CodeChamp", votes: 494 },
  //     { ID: 20, focus: "best user experience", teamName: "PioneersSquad", votes: 3928 },
  //     { ID: 21, focus: "most practical solution", teamName: "TeamGurus", votes: 3284 },
  //     { ID: 22, focus: "best design", teamName: "TeamHackers", votes: 4732 },
  //     { ID: 23, focus: "most innovative hack", teamName: "InnovateMasters", votes: 417 },
  //     { ID: 24, focus: "best design", teamName: "CodeSquad", votes: 3206 },
  //     { ID: 25, focus: "most practical solution", teamName: "DreamersDevelopers", votes: 6491 },
  //     { ID: 26, focus: "best design", teamName: "CodeCreators", votes: 459 },
  //     { ID: 27, focus: "most innovative hack", teamName: "NUSmartHackers", votes: 53 },
  //     { ID: 28, focus: "most practical solution", teamName: "HackathonDevelopers", votes: 7516 },
  //     { ID: 29, focus: "best user experience", teamName: "CodeHackers", votes: 5042 },
  //     { ID: 30, focus: "best user experience", teamName: "NUSmartGurus", votes: 3289 },
  //     { ID: 31, focus: "most practical solution", teamName: "InnovateDevelopers", votes: 5404 },
  //     { ID: 32, focus: "best user experience", teamName: "NUSmartSquad", votes: 8646 },
  //     { ID: 33, focus: "best user experience", teamName: "CodeMasters", votes: 2054 },
  //     { ID: 34, focus: "best design", teamName: "NUSmartJudge", votes: 9165 },
  //     { ID: 35, focus: "best user experience", teamName: "InnovateJudge", votes: 601 },
  //     { ID: 36, focus: "most practical solution", teamName: "InnovateHackers", votes: 3130 },
  //     { ID: 37, focus: "best design", teamName: "DreamersHackers", votes: 5694 },
  //     { ID: 38, focus: "best user experience", teamName: "InnovateCreators", votes: 4288 },
  //     { ID: 39, focus: "best design", teamName: "NUSmartNerds", votes: 4415 },
  //     { ID: 40, focus: "most useless hack", teamName: "HackathonGurus", votes: 2497 },
  //     { ID: 41, focus: "most useless hack", teamName: "TeamNerds", votes: 6252 },
  //     { ID: 42, focus: "best user experience", teamName: "TechNerds", votes: 633 },
  //     { ID: 43, focus: "best user experience", teamName: "PioneersHackers", votes: 9229 },
  //     { ID: 44, focus: "most practical solution", teamName: "InnovateGurus", votes: 3704 },
  //     { ID: 45, focus: "most useless hack", teamName: "BuildersMasters", votes: 3996 },
  //     { ID: 46, focus: "most practical solution", teamName: "CodeMasters", votes: 3617 },
  //     { ID: 47, focus: "best design", teamName: "TeamGurus", votes: 3886 },
  //     { ID: 48, focus: "best user experience", teamName: "CodeMasters", votes: 3663 },
  //     { ID: 49, focus: "most practical solution", teamName: "TeamMasters", votes: 402 },
  //     { ID: 50, focus: "best user experience", teamName: "PioneersDevelopers", votes: 7309 },
  //     { ID: 51, focus: "most innovative hack", teamName: "NUSmartMasters", votes: 3275 },
  //     { ID: 52, focus: "most useless hack", teamName: "DreamersGurus", votes: 6420 },
  //     { ID: 53, focus: "most innovative hack", teamName: "TeamDevelopers", votes: 674 },
  //     { ID: 54, focus: "most innovative hack", teamName: "DreamersSquad", votes: 7930 },
  //     { ID: 55, focus: "best design", teamName: "NUSmartMasters", votes: 4711 },
  //     { ID: 56, focus: "most useless hack", teamName: "DreamersMasters", votes: 9188 },
  //     { ID: 57, focus: "best user experience", teamName: "DreamersChamp", votes: 1530 },
  //     { ID: 58, focus: "best user experience", teamName: "PioneersHackers", votes: 721 },
  //     { ID: 59, focus: "most practical solution", teamName: "CodeNerds", votes: 4691 },
  //     { ID: 60, focus: "best user experience", teamName: "PioneersChamp", votes: 6557 }
  // ];

  const entries = [
    {
      ID: 1,
      focus: "most socially useful hack",
      teamName: "Judgify",
      innoVotes: 10,
      techVotes: 5,
      funVotes: 10,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Nicholas Tok", "Bryan Chew"],
      linkedinLinks: [
        "www.linkedin.com/in/tok-jun-hui-nicholas-217268249",
        "https://www.linkedin.com/in/bryanjhc",
      ],
      projectDescription:
        "Judgify is an app that heavily improves convenience in the judging progress for judges and event organisers.",
      projectPrizeCategory: "Most Socially Useful Hack",
      devpostLink: "https://devpost.com/judgify",
      repoLink: "https://github.com/bryanjhc/Judgify",
    },
    {
      ID: 2,
      focus: "most practical solution",
      teamName: "NUSmartDevelopers",
      innoVotes: 1,
      techVotes: 5,
      funVotes: 7,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Nicholas Tok", "Bryan Chew"],
      linkedinLinks: [
        "www.linkedin.com/in/tok-jun-hui-nicholas-217268249",
        "https://www.linkedin.com/in/bryanjhc",
      ],
      projectDescription:
        "A smart city platform that connects local businesses with consumers through AI-driven recommendations.",
      projectPrizeCategory: "Most Practical Solution",
      devpostLink: "https://devpost.com/nusmartdevelopers",
      repoLink: "https://github.com/nusmartdevelopers/platform",
    },
    {
      ID: 3,
      focus: "best user experience",
      teamName: "TechNerds",
      innoVotes: 12,
      techVotes: 2,
      funVotes: 5,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Nicholas Tok", "Bryan Chew"],
      linkedinLinks: [
        "www.linkedin.com/in/tok-jun-hui-nicholas-217268249",
        "https://www.linkedin.com/in/bryanjhc",
      ],
      projectDescription:
        "An intuitive app for managing personal finances with real-time insights and budget recommendations.",
      projectPrizeCategory: "Best User Experience",
      devpostLink: "https://devpost.com/technerds",
      repoLink: "https://github.com/technerds/finance-manager",
    },
    {
      ID: 4,
      focus: "most innovative hack",
      teamName: "HackathonCreators",
      innoVotes: 7,
      techVotes: 8,
      funVotes: 5,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Nicholas Tok", "Bryan Chew"],
      linkedinLinks: [
        "www.linkedin.com/in/tok-jun-hui-nicholas-217268249",
        "https://www.linkedin.com/in/bryanjhc",
      ],
      projectDescription:
        "A blockchain-based solution to ensure transparency in charitable donations and fund allocation.",
      projectPrizeCategory: "Most Innovative Hack",
      devpostLink: "https://devpost.com/hackathoncreators",
      repoLink: "https://github.com/hackathoncreators/blockchain-charity",
    },
    {
      ID: 5,
      focus: "most practical solution",
      teamName: "TechCreators",
      innoVotes: 5,
      techVotes: 5,
      funVotes: 5,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Nicholas Tok", "Bryan Chew"],
      linkedinLinks: [
        "www.linkedin.com/in/tok-jun-hui-nicholas-217268249",
        "https://www.linkedin.com/in/bryanjhc",
      ],
      projectDescription:
        "An e-learning platform designed to help students and professionals upskill efficiently.",
      projectPrizeCategory: "Most Practical Solution",
      devpostLink: "https://devpost.com/techcreators",
      repoLink: "https://github.com/techcreators/e-learning",
    },
    {
      ID: 6,
      focus: "best design",
      teamName: "PioneersNerds",
      innoVotes: 2,
      techVotes: 8,
      funVotes: 7,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Nicholas Tok", "Bryan Chew"],
      linkedinLinks: [
        "www.linkedin.com/in/tok-jun-hui-nicholas-217268249",
        "https://www.linkedin.com/in/bryanjhc",
      ],
      projectDescription:
        "A beautifully designed habit tracker that integrates seamlessly with users' daily routines.",
      projectPrizeCategory: "Best Design",
      devpostLink: "https://devpost.com/pioneersnerds",
      repoLink: "https://github.com/pioneersnerds/habit-tracker",
    },
    {
      ID: 7,
      focus: "best design",
      teamName: "InnovateMasters",
      innoVotes: 7,
      techVotes: 3,
      funVotes: 4,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Nicholas Tok", "Bryan Chew"],
      linkedinLinks: [
        "www.linkedin.com/in/tok-jun-hui-nicholas-217268249",
        "https://www.linkedin.com/in/bryanjhc",
      ],
      projectDescription:
        "A next-generation design tool powered by AI to assist designers in creating stunning visuals.",
      projectPrizeCategory: "Best Design",
      devpostLink: "https://devpost.com/innovatemasters",
      repoLink: "https://github.com/innovatemasters/design-tool",
    },
    {
      ID: 8,
      focus: "most practical solution",
      teamName: "CodeNerds",
      innoVotes: 6,
      techVotes: 6,
      funVotes: 5,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Nicholas Tok", "Bryan Chew"],
      linkedinLinks: [
        "www.linkedin.com/in/tok-jun-hui-nicholas-217268249",
        "https://www.linkedin.com/in/bryanjhc",
      ],
      projectDescription:
        "A coding platform that provides real-time collaborative features for developers worldwide.",
      projectPrizeCategory: "Most Practical Solution",
      devpostLink: "https://devpost.com/codenerds",
      repoLink: "https://github.com/codenerds/coding-platform",
    },
    {
      ID: 9,
      focus: "best design",
      teamName: "BuildersNerds",
      innoVotes: 4,
      techVotes: 2,
      funVotes: 3,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Nicholas Tok", "Bryan Chew"],
      linkedinLinks: [
        "www.linkedin.com/in/tok-jun-hui-nicholas-217268249",
        "https://www.linkedin.com/in/bryanjhc",
      ],
      projectDescription:
        "An innovative architectural visualization tool for construction projects.",
      projectPrizeCategory: "Best Design",
      devpostLink: "https://devpost.com/buildersnerds",
      repoLink: "https://github.com/buildersnerds/visualization-tool",
    },
    {
      ID: 10,
      focus: "best design",
      teamName: "NUSmartMasters",
      innoVotes: 5,
      techVotes: 2,
      funVotes: 1,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Nicholas Tok", "Bryan Chew"],
      linkedinLinks: [
        "www.linkedin.com/in/tok-jun-hui-nicholas-217268249",
        "https://www.linkedin.com/in/bryanjhc",
      ],
      projectDescription:
        "A mobile-first social media app focusing on visual storytelling.",
      projectPrizeCategory: "Best Design",
      devpostLink: "https://devpost.com/nusmartmasters",
      repoLink: "https://github.com/nusmartmasters/social-storytelling",
    },
    {
      ID: 11,
      focus: "best AI hack",
      teamName: "TeamAlpha",
      innoVotes: 12,
      techVotes: 15,
      funVotes: 5,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Alice Johnson", "Bob Smith"],
      linkedinLinks: [
        "https://www.linkedin.com/in/alice-johnson-12345",
        "https://www.linkedin.com/in/bob-smith-67890",
      ],
      projectDescription:
        "TeamAlpha built an AI-driven chatbot that provides mental health support in real-time.",
      projectPrizeCategory: "Best AI Hack",
      devpostLink: "https://devpost.com/teamalpha11",
      repoLink: "https://github.com/teamalpha/mental-health-bot",
    },
    {
      ID: 12,
      focus: "best community solution",
      teamName: "GammaSolutions",
      innoVotes: 8,
      techVotes: 9,
      funVotes: 7,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Charlie Green", "Diana White"],
      linkedinLinks: [
        "https://www.linkedin.com/in/charlie-green-112233",
        "https://www.linkedin.com/in/diana-white-445566",
      ],
      projectDescription:
        "A crowdsourcing platform for matching local volunteers with community needs.",
      projectPrizeCategory: "Best Community Solution",
      devpostLink: "https://devpost.com/gammasolutions12",
      repoLink: "https://github.com/gammasolutions/community-matcher",
    },
    {
      ID: 13,
      focus: "most socially useful hack",
      teamName: "HelpHub",
      innoVotes: 10,
      techVotes: 11,
      funVotes: 8,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Ethan Brown", "Fiona Davis"],
      linkedinLinks: [
        "https://www.linkedin.com/in/ethan-brown-998877",
        "https://www.linkedin.com/in/fiona-davis-776655",
      ],
      projectDescription:
        "HelpHub connects people in need of non-emergency medical consultation with volunteer professionals.",
      projectPrizeCategory: "Most Socially Useful Hack",
      devpostLink: "https://devpost.com/helphub13",
      repoLink: "https://github.com/helphub/consultation-app",
    },
    {
      ID: 14,
      focus: "best game hack",
      teamName: "PixelPioneers",
      innoVotes: 15,
      techVotes: 7,
      funVotes: 14,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["George Mills", "Hannah Lee"],
      linkedinLinks: [
        "https://www.linkedin.com/in/george-mills-123454321",
        "https://www.linkedin.com/in/hannah-lee-987659876",
      ],
      projectDescription:
        "A retro-style platformer that teaches basic programming concepts in a fun environment.",
      projectPrizeCategory: "Best Game Hack",
      devpostLink: "https://devpost.com/pixelpioneers14",
      repoLink: "https://github.com/pixelpioneers/retro-coding-game",
    },
    {
      ID: 15,
      focus: "best AR/VR solution",
      teamName: "VirtualVision",
      innoVotes: 9,
      techVotes: 16,
      funVotes: 6,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Ian Martin", "Jenny Kim"],
      linkedinLinks: [
        "https://www.linkedin.com/in/ian-martin-555111",
        "https://www.linkedin.com/in/jenny-kim-333111",
      ],
      projectDescription:
        "An AR application that visualizes architectural designs in real-world settings.",
      projectPrizeCategory: "Best AR/VR Solution",
      devpostLink: "https://devpost.com/virtualvision15",
      repoLink: "https://github.com/virtualvision/architecture-ar",
    },
    {
      ID: 16,
      focus: "most innovative hack",
      teamName: "QuantumLeap",
      innoVotes: 17,
      techVotes: 13,
      funVotes: 9,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Kevin Lee", "Laura Chen"],
      linkedinLinks: [
        "https://www.linkedin.com/in/kevin-lee-444555",
        "https://www.linkedin.com/in/laura-chen-222111",
      ],
      projectDescription:
        "QuantumLeap leverages quantum computing for optimizing logistics routes in real-time.",
      projectPrizeCategory: "Most Innovative Hack",
      devpostLink: "https://devpost.com/quantumleap16",
      repoLink: "https://github.com/quantumleap/logistics-optimizer",
    },
    {
      ID: 17,
      focus: "best environmental hack",
      teamName: "EcoTrack",
      innoVotes: 13,
      techVotes: 10,
      funVotes: 7,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Mark Thomas", "Nina Park"],
      linkedinLinks: [
        "https://www.linkedin.com/in/mark-thomas-111222",
        "https://www.linkedin.com/in/nina-park-333444",
      ],
      projectDescription:
        "EcoTrack uses satellite data to monitor deforestation and alerts NGOs for immediate action.",
      projectPrizeCategory: "Best Environmental Hack",
      devpostLink: "https://devpost.com/ecotrack17",
      repoLink: "https://github.com/ecotrack/deforestation-monitor",
    },
    {
      ID: 18,
      focus: "best hardware hack",
      teamName: "CircuitWizards",
      innoVotes: 14,
      techVotes: 12,
      funVotes: 10,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Oliver Stone", "Paula Lin"],
      linkedinLinks: [
        "https://www.linkedin.com/in/oliver-stone-987654",
        "https://www.linkedin.com/in/paula-lin-123123",
      ],
      projectDescription:
        "A smart irrigation system that senses soil moisture and automatically waters plants.",
      projectPrizeCategory: "Best Hardware Hack",
      devpostLink: "https://devpost.com/circuitwizards18",
      repoLink: "https://github.com/circuitwizards/auto-irrigation",
    },
    {
      ID: 19,
      focus: "most fun hack",
      teamName: "LaughterLab",
      innoVotes: 7,
      techVotes: 8,
      funVotes: 18,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Quentin Blake", "Rachel Adams"],
      linkedinLinks: [
        "https://www.linkedin.com/in/quentin-blake-876543",
        "https://www.linkedin.com/in/rachel-adams-456789",
      ],
      projectDescription:
        "A meme generator that uses AI to create personalized humor based on user-submitted text.",
      projectPrizeCategory: "Most Fun Hack",
      devpostLink: "https://devpost.com/laughterlab19",
      repoLink: "https://github.com/laughterlab/ai-meme-generator",
    },
    {
      ID: 20,
      focus: "best financial hack",
      teamName: "LedgerLion",
      innoVotes: 11,
      techVotes: 12,
      funVotes: 5,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Steven Hall", "Tina West"],
      linkedinLinks: [
        "https://www.linkedin.com/in/steven-hall-987654321",
        "https://www.linkedin.com/in/tina-west-123456789",
      ],
      projectDescription:
        "A blockchain-based platform to simplify international remittances with low fees.",
      projectPrizeCategory: "Best Financial Hack",
      devpostLink: "https://devpost.com/ledgerlion20",
      repoLink: "https://github.com/ledgerlion/remittance-platform",
    },
    {
      ID: 21,
      focus: "best machine learning hack",
      teamName: "DataDroids",
      innoVotes: 16,
      techVotes: 17,
      funVotes: 9,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Uma Patel", "Victor Lin"],
      linkedinLinks: [
        "https://www.linkedin.com/in/uma-patel-991100",
        "https://www.linkedin.com/in/victor-lin-220033",
      ],
      projectDescription:
        "A machine learning model predicting crop yield based on weather and soil data.",
      projectPrizeCategory: "Best Machine Learning Hack",
      devpostLink: "https://devpost.com/datadroids21",
      repoLink: "https://github.com/datadroids/crop-yield-prediction",
    },
    {
      ID: 22,
      focus: "best educational hack",
      teamName: "LearnX",
      innoVotes: 10,
      techVotes: 9,
      funVotes: 12,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Wendy Zhang", "Xavier King"],
      linkedinLinks: [
        "https://www.linkedin.com/in/wendy-zhang-445566",
        "https://www.linkedin.com/in/xavier-king-889900",
      ],
      projectDescription:
        "LearnX gamifies online learning with interactive quizzes and leveling systems for students.",
      projectPrizeCategory: "Best Educational Hack",
      devpostLink: "https://devpost.com/learnx22",
      repoLink: "https://github.com/learnx/edu-gamification",
    },
    {
      ID: 23,
      focus: "most impactful hack",
      teamName: "ChangeMakers",
      innoVotes: 18,
      techVotes: 8,
      funVotes: 10,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Yara Mahmoud", "Zack Brown"],
      linkedinLinks: [
        "https://www.linkedin.com/in/yara-mahmoud-111999",
        "https://www.linkedin.com/in/zack-brown-222888",
      ],
      projectDescription:
        "ChangeMakers helps connect social enterprises with potential investors through a shared platform.",
      projectPrizeCategory: "Most Impactful Hack",
      devpostLink: "https://devpost.com/changemakers23",
      repoLink: "https://github.com/changemakers/investment-platform",
    },
    {
      ID: 24,
      focus: "best UI/UX hack",
      teamName: "SleekDesign",
      innoVotes: 9,
      techVotes: 8,
      funVotes: 11,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Aaron Thomas", "Bella Reyes"],
      linkedinLinks: [
        "https://www.linkedin.com/in/aaron-thomas-548721",
        "https://www.linkedin.com/in/bella-reyes-877654",
      ],
      projectDescription:
        "An intuitive travel planning app with minimalistic design and easy itinerary sharing.",
      projectPrizeCategory: "Best UI/UX Hack",
      devpostLink: "https://devpost.com/sleekdesign24",
      repoLink: "https://github.com/sleekdesign/travel-planner",
    },
    {
      ID: 25,
      focus: "best open source contribution",
      teamName: "OpenSourcery",
      innoVotes: 13,
      techVotes: 14,
      funVotes: 6,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Caleb Moore", "Danielle Wu"],
      linkedinLinks: [
        "https://www.linkedin.com/in/caleb-moore-123321",
        "https://www.linkedin.com/in/danielle-wu-456654",
      ],
      projectDescription:
        "A collection of open source libraries to simplify real-time data visualization in React.",
      projectPrizeCategory: "Best Open Source Contribution",
      devpostLink: "https://devpost.com/opensourcery25",
      repoLink: "https://github.com/opensourcery/react-visual-libs",
    },
    {
      ID: 26,
      focus: "best blockchain hack",
      teamName: "BlockBreakers",
      innoVotes: 14,
      techVotes: 16,
      funVotes: 5,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Erin Foley", "Frank Diaz"],
      linkedinLinks: [
        "https://www.linkedin.com/in/erin-foley-778899",
        "https://www.linkedin.com/in/frank-diaz-556677",
      ],
      projectDescription:
        "A decentralized identity management system to streamline secure user authentication.",
      projectPrizeCategory: "Best Blockchain Hack",
      devpostLink: "https://devpost.com/blockbreakers26",
      repoLink: "https://github.com/blockbreakers/did-management",
    },
    {
      ID: 27,
      focus: "best IoT solution",
      teamName: "SenseIT",
      innoVotes: 12,
      techVotes: 14,
      funVotes: 10,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Gina Hall", "Harry Kim"],
      linkedinLinks: [
        "https://www.linkedin.com/in/gina-hall-009988",
        "https://www.linkedin.com/in/harry-kim-112233",
      ],
      projectDescription:
        "SenseIT uses distributed IoT sensors to monitor city traffic and reduce congestion via real-time signals.",
      projectPrizeCategory: "Best IoT Solution",
      devpostLink: "https://devpost.com/senseit27",
      repoLink: "https://github.com/senseit/city-traffic-iot",
    },
    {
      ID: 28,
      focus: "best mobile app",
      teamName: "MobiMasters",
      innoVotes: 8,
      techVotes: 9,
      funVotes: 14,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Iris Taylor", "Jason Wang"],
      linkedinLinks: [
        "https://www.linkedin.com/in/iris-taylor-776655",
        "https://www.linkedin.com/in/jason-wang-123123",
      ],
      projectDescription:
        "A mobile marketplace for swapping secondhand goods within local communities.",
      projectPrizeCategory: "Best Mobile App",
      devpostLink: "https://devpost.com/mobimasters28",
      repoLink: "https://github.com/mobimasters/local-swap",
    },
    {
      ID: 29,
      focus: "most socially useful hack",
      teamName: "HealthHive",
      innoVotes: 15,
      techVotes: 11,
      funVotes: 7,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Karen Young", "Leo Sun"],
      linkedinLinks: [
        "https://www.linkedin.com/in/karen-young-334455",
        "https://www.linkedin.com/in/leo-sun-667788",
      ],
      projectDescription:
        "A telehealth platform that connects rural communities with urban medical specialists.",
      projectPrizeCategory: "Most Socially Useful Hack",
      devpostLink: "https://devpost.com/healthhive29",
      repoLink: "https://github.com/healthhive/telehealth-platform",
    },
    {
      ID: 30,
      focus: "best big data hack",
      teamName: "DataCrushers",
      innoVotes: 13,
      techVotes: 17,
      funVotes: 6,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Molly Bates", "Nathan Long"],
      linkedinLinks: [
        "https://www.linkedin.com/in/molly-bates-001122",
        "https://www.linkedin.com/in/nathan-long-774411",
      ],
      projectDescription:
        "A scalable data pipeline for analyzing climate change patterns across decades of records.",
      projectPrizeCategory: "Best Big Data Hack",
      devpostLink: "https://devpost.com/datacrushers30",
      repoLink: "https://github.com/datacrushers/climate-data-pipeline",
    },
    {
      ID: 31,
      focus: "best DevOps solution",
      teamName: "OpsExperts",
      innoVotes: 10,
      techVotes: 16,
      funVotes: 6,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Olivia Pierce", "Paul Gordon"],
      linkedinLinks: [
        "https://www.linkedin.com/in/olivia-pierce-101112",
        "https://www.linkedin.com/in/paul-gordon-131415",
      ],
      projectDescription:
        "A container orchestration tool that simplifies CI/CD for microservices-based applications.",
      projectPrizeCategory: "Best DevOps Solution",
      devpostLink: "https://devpost.com/opsexperts31",
      repoLink: "https://github.com/opsexperts/microservice-orchestration",
    },
    {
      ID: 32,
      focus: "most creative hack",
      teamName: "IdeaMakers",
      innoVotes: 18,
      techVotes: 7,
      funVotes: 13,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Rachel Kim", "Sam Parker"],
      linkedinLinks: [
        "https://www.linkedin.com/in/rachel-kim-556677",
        "https://www.linkedin.com/in/sam-parker-889900",
      ],
      projectDescription:
        "IdeaMakers developed an interactive AI design tool for generating custom clothing patterns.",
      projectPrizeCategory: "Most Creative Hack",
      devpostLink: "https://devpost.com/ideamakers32",
      repoLink: "https://github.com/ideamakers/ai-clothing-design",
    },
    {
      ID: 33,
      focus: "best social media hack",
      teamName: "TrendTide",
      innoVotes: 9,
      techVotes: 8,
      funVotes: 16,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Tom Hansen", "Uma Nolan"],
      linkedinLinks: [
        "https://www.linkedin.com/in/tom-hansen-556677",
        "https://www.linkedin.com/in/uma-nolan-778899",
      ],
      projectDescription:
        "TrendTide aggregates trending topics across platforms to help influencers plan content strategies.",
      projectPrizeCategory: "Best Social Media Hack",
      devpostLink: "https://devpost.com/trendtide33",
      repoLink: "https://github.com/trendtide/content-trend-aggregator",
    },
    {
      ID: 34,
      focus: "best healthcare hack",
      teamName: "MediManage",
      innoVotes: 14,
      techVotes: 15,
      funVotes: 5,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Victor Hugo", "Wendy Li"],
      linkedinLinks: [
        "https://www.linkedin.com/in/victor-hugo-242526",
        "https://www.linkedin.com/in/wendy-li-353637",
      ],
      projectDescription:
        "A prescription management tool that uses AI to track and alert patients about medication schedules.",
      projectPrizeCategory: "Best Healthcare Hack",
      devpostLink: "https://devpost.com/medimanage34",
      repoLink: "https://github.com/medimanage/med-tracker",
    },
    {
      ID: 35,
      focus: "best use of APIs",
      teamName: "APIGurus",
      innoVotes: 13,
      techVotes: 11,
      funVotes: 9,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Xenia Drake", "Yvonne Smith"],
      linkedinLinks: [
        "https://www.linkedin.com/in/xenia-drake-242424",
        "https://www.linkedin.com/in/yvonne-smith-353535",
      ],
      projectDescription:
        "APIGurus integrated multiple public APIs to create a seamless city exploration experience.",
      projectPrizeCategory: "Best Use of APIs",
      devpostLink: "https://devpost.com/apigurus35",
      repoLink: "https://github.com/apigurus/city-explorer",
    },
    {
      ID: 36,
      focus: "most philanthropic hack",
      teamName: "CharityChain",
      innoVotes: 17,
      techVotes: 10,
      funVotes: 6,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Zane Grey", "Amanda Clark"],
      linkedinLinks: [
        "https://www.linkedin.com/in/zane-grey-575757",
        "https://www.linkedin.com/in/amanda-clark-989898",
      ],
      projectDescription:
        "A transparent donation platform to ensure contributions reach intended beneficiaries via smart contracts.",
      projectPrizeCategory: "Most Philanthropic Hack",
      devpostLink: "https://devpost.com/charitychain36",
      repoLink: "https://github.com/charitychain/donation-platform",
    },
    {
      ID: 37,
      focus: "best cybersecurity hack",
      teamName: "SecuriTeam",
      innoVotes: 15,
      techVotes: 16,
      funVotes: 8,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Bill Cross", "Carla Knight"],
      linkedinLinks: [
        "https://www.linkedin.com/in/bill-cross-202020",
        "https://www.linkedin.com/in/carla-knight-303030",
      ],
      projectDescription:
        "SecuriTeam built a threat detection system that uses ML to identify phishing attempts in real-time.",
      projectPrizeCategory: "Best Cybersecurity Hack",
      devpostLink: "https://devpost.com/securiteam37",
      repoLink: "https://github.com/securiteam/phishing-detector",
    },
    {
      ID: 38,
      focus: "best cloud solution",
      teamName: "CloudCrew",
      innoVotes: 9,
      techVotes: 13,
      funVotes: 11,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Derek Hale", "Elena Miles"],
      linkedinLinks: [
        "https://www.linkedin.com/in/derek-hale-404040",
        "https://www.linkedin.com/in/elena-miles-505050",
      ],
      projectDescription:
        "A cloud-based data warehouse solution optimizing cost and performance for medium-sized businesses.",
      projectPrizeCategory: "Best Cloud Solution",
      devpostLink: "https://devpost.com/cloudcrew38",
      repoLink: "https://github.com/cloudcrew/data-warehouse",
    },
    {
      ID: 39,
      focus: "best data visualization hack",
      teamName: "VizMasters",
      innoVotes: 14,
      techVotes: 9,
      funVotes: 12,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Fred Mason", "Gloria Fox"],
      linkedinLinks: [
        "https://www.linkedin.com/in/fred-mason-606060",
        "https://www.linkedin.com/in/gloria-fox-707070",
      ],
      projectDescription:
        "Interactive dashboards for visualizing city crime data and trends using D3.js.",
      projectPrizeCategory: "Best Data Visualization Hack",
      devpostLink: "https://devpost.com/vizmasters39",
      repoLink: "https://github.com/vizmasters/crime-viz",
    },
    {
      ID: 40,
      focus: "best accessibility hack",
      teamName: "AccessAll",
      innoVotes: 11,
      techVotes: 10,
      funVotes: 13,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Henry Woo", "Irene Novak"],
      linkedinLinks: [
        "https://www.linkedin.com/in/henry-woo-808080",
        "https://www.linkedin.com/in/irene-novak-909090",
      ],
      projectDescription:
        "A screen-reading browser extension with enhanced voice control for the visually impaired.",
      projectPrizeCategory: "Best Accessibility Hack",
      devpostLink: "https://devpost.com/accessall40",
      repoLink: "https://github.com/accessall/screen-reader",
    },
    {
      ID: 41,
      focus: "best robotics hack",
      teamName: "RoboGenesis",
      innoVotes: 16,
      techVotes: 14,
      funVotes: 8,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Jack Berry", "Kyla Morris"],
      linkedinLinks: [
        "https://www.linkedin.com/in/jack-berry-111222333",
        "https://www.linkedin.com/in/kyla-morris-444555666",
      ],
      projectDescription:
        "A swarm robotics system for autonomous warehouse inventory management.",
      projectPrizeCategory: "Best Robotics Hack",
      devpostLink: "https://devpost.com/robogenesis41",
      repoLink: "https://github.com/robogenesis/swarm-robots",
    },
    {
      ID: 42,
      focus: "best music-related hack",
      teamName: "TuneUp",
      innoVotes: 9,
      techVotes: 8,
      funVotes: 15,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Linda Ray", "Martin Cook"],
      linkedinLinks: [
        "https://www.linkedin.com/in/linda-ray-202229",
        "https://www.linkedin.com/in/martin-cook-445566",
      ],
      projectDescription:
        "TuneUp personalizes playlists using sentiment analysis on your music library and streaming history.",
      projectPrizeCategory: "Best Music-Related Hack",
      devpostLink: "https://devpost.com/tuneup42",
      repoLink: "https://github.com/tuneup/music-sentiment-playlists",
    },
    {
      ID: 43,
      focus: "best gaming accessory hack",
      teamName: "GameGears",
      innoVotes: 13,
      techVotes: 15,
      funVotes: 12,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Nicole Boyd", "Oscar James"],
      linkedinLinks: [
        "https://www.linkedin.com/in/nicole-boyd-313131",
        "https://www.linkedin.com/in/oscar-james-515151",
      ],
      projectDescription:
        "A custom game controller that adapts to different genres for optimal play experiences.",
      projectPrizeCategory: "Best Gaming Accessory Hack",
      devpostLink: "https://devpost.com/gamegears43",
      repoLink: "https://github.com/gamegears/adaptive-controller",
    },
    {
      ID: 44,
      focus: "most user-friendly hack",
      teamName: "EasyUX",
      innoVotes: 14,
      techVotes: 9,
      funVotes: 8,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Paula Rivers", "Quincy Stone"],
      linkedinLinks: [
        "https://www.linkedin.com/in/paula-rivers-626262",
        "https://www.linkedin.com/in/quincy-stone-727272",
      ],
      projectDescription:
        "A drag-and-drop website builder with built-in accessibility checks and style suggestions.",
      projectPrizeCategory: "Most User-Friendly Hack",
      devpostLink: "https://devpost.com/easyux44",
      repoLink: "https://github.com/easyux/site-builder",
    },
    {
      ID: 45,
      focus: "best collaboration hack",
      teamName: "CollabCraft",
      innoVotes: 10,
      techVotes: 12,
      funVotes: 13,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Ryan Parker", "Sara King"],
      linkedinLinks: [
        "https://www.linkedin.com/in/ryan-parker-383838",
        "https://www.linkedin.com/in/sara-king-484848",
      ],
      projectDescription:
        "CollabCraft is a real-time creative collaboration platform featuring shared drawing boards and group chat.",
      projectPrizeCategory: "Best Collaboration Hack",
      devpostLink: "https://devpost.com/collabcraft45",
      repoLink: "https://github.com/collabcraft/creative-whiteboard",
    },
    {
      ID: 46,
      focus: "most inclusive hack",
      teamName: "BridgeBuilders",
      innoVotes: 18,
      techVotes: 9,
      funVotes: 10,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Terry Howe", "Uma East"],
      linkedinLinks: [
        "https://www.linkedin.com/in/terry-howe-949494",
        "https://www.linkedin.com/in/uma-east-050505",
      ],
      projectDescription:
        "A platform connecting diverse freelancers with equitable project opportunities.",
      projectPrizeCategory: "Most Inclusive Hack",
      devpostLink: "https://devpost.com/bridgebuilders46",
      repoLink: "https://github.com/bridgebuilders/equitable-jobs",
    },
    {
      ID: 47,
      focus: "best containerization hack",
      teamName: "DockerDocs",
      innoVotes: 12,
      techVotes: 16,
      funVotes: 5,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Vera Yates", "Will Adams"],
      linkedinLinks: [
        "https://www.linkedin.com/in/vera-yates-505152",
        "https://www.linkedin.com/in/will-adams-515253",
      ],
      projectDescription:
        "DockerDocs automates container build documentation, generating usage tips and config details on the fly.",
      projectPrizeCategory: "Best Containerization Hack",
      devpostLink: "https://devpost.com/dockerdocs47",
      repoLink: "https://github.com/dockerdocs/container-auto-docs",
    },
    {
      ID: 48,
      focus: "best use of AI in finance",
      teamName: "FinAI",
      innoVotes: 15,
      techVotes: 14,
      funVotes: 9,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Xavier Boone", "Yara Feld"],
      linkedinLinks: [
        "https://www.linkedin.com/in/xavier-boone-000111",
        "https://www.linkedin.com/in/yara-feld-111222",
      ],
      projectDescription:
        "An AI-powered tool for predicting stock market trends and alerting users to high-volatility changes.",
      projectPrizeCategory: "Best Use of AI in Finance",
      devpostLink: "https://devpost.com/finai48",
      repoLink: "https://github.com/finai/stock-trend-predictor",
    },
    {
      ID: 49,
      focus: "most sustainable hack",
      teamName: "GreenFuture",
      innoVotes: 17,
      techVotes: 12,
      funVotes: 7,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Zara Khan", "Adam Kelly"],
      linkedinLinks: [
        "https://www.linkedin.com/in/zara-khan-505060",
        "https://www.linkedin.com/in/adam-kelly-606070",
      ],
      projectDescription:
        "GreenFuture calculates personalized carbon footprints and suggests actionable steps to reduce emissions.",
      projectPrizeCategory: "Most Sustainable Hack",
      devpostLink: "https://devpost.com/greenfuture49",
      repoLink: "https://github.com/greenfuture/carbon-calculator",
    },
    {
      ID: 50,
      focus: "best hack for remote work",
      teamName: "RemoteBoost",
      innoVotes: 8,
      techVotes: 13,
      funVotes: 10,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Brian Olson", "Cindy Evans"],
      linkedinLinks: [
        "https://www.linkedin.com/in/brian-olson-111111",
        "https://www.linkedin.com/in/cindy-evans-222222",
      ],
      projectDescription:
        "A remote collaboration tool that integrates seamlessly with project management software.",
      projectPrizeCategory: "Best Hack for Remote Work",
      devpostLink: "https://devpost.com/remoteboost50",
      repoLink: "https://github.com/remoteboost/collab-tool",
    },
    {
      ID: 51,
      focus: "best smart home hack",
      teamName: "HomeGenie",
      innoVotes: 12,
      techVotes: 11,
      funVotes: 8,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Darren Young", "Ella Vanderbilt"],
      linkedinLinks: [
        "https://www.linkedin.com/in/darren-young-121314",
        "https://www.linkedin.com/in/ella-vanderbilt-151617",
      ],
      projectDescription:
        "A central control system that learns user patterns to automate lights and temperature.",
      projectPrizeCategory: "Best Smart Home Hack",
      devpostLink: "https://devpost.com/homegenie51",
      repoLink: "https://github.com/homegenie/smart-automation",
    },
    {
      ID: 52,
      focus: "best hack for mental wellness",
      teamName: "MindfulTech",
      innoVotes: 18,
      techVotes: 9,
      funVotes: 11,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Felix Grant", "Gina Martin"],
      linkedinLinks: [
        "https://www.linkedin.com/in/felix-grant-181920",
        "https://www.linkedin.com/in/gina-martin-212223",
      ],
      projectDescription:
        "A mindfulness app with guided meditations and real-time stress monitoring through wearables.",
      projectPrizeCategory: "Best Hack for Mental Wellness",
      devpostLink: "https://devpost.com/mindfultech52",
      repoLink: "https://github.com/mindfultech/meditation-app",
    },
    {
      ID: 53,
      focus: "best hack for personal productivity",
      teamName: "ProdBoost",
      innoVotes: 14,
      techVotes: 10,
      funVotes: 8,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Harry Moore", "Iris O'Connor"],
      linkedinLinks: [
        "https://www.linkedin.com/in/harry-moore-242526",
        "https://www.linkedin.com/in/iris-oconnor-272829",
      ],
      projectDescription:
        "ProdBoost uses AI to optimize daily to-do lists based on priority and deadline predictions.",
      projectPrizeCategory: "Best Hack for Personal Productivity",
      devpostLink: "https://devpost.com/prodboost53",
      repoLink: "https://github.com/prodboost/ai-todo",
    },
    {
      ID: 54,
      focus: "best hack for social justice",
      teamName: "JusticeApp",
      innoVotes: 15,
      techVotes: 11,
      funVotes: 6,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Jon Lee", "Kate Watson"],
      linkedinLinks: [
        "https://www.linkedin.com/in/jon-lee-131415",
        "https://www.linkedin.com/in/kate-watson-161718",
      ],
      projectDescription:
        "A legal resource hub that helps underrepresented communities find free or low-cost legal aid.",
      projectPrizeCategory: "Best Hack for Social Justice",
      devpostLink: "https://devpost.com/justiceapp54",
      repoLink: "https://github.com/justiceapp/legal-aid-platform",
    },
    {
      ID: 55,
      focus: "best VR collaboration hack",
      teamName: "HoloConnect",
      innoVotes: 9,
      techVotes: 14,
      funVotes: 10,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Leo Jordan", "Mia Fitzgerald"],
      linkedinLinks: [
        "https://www.linkedin.com/in/leo-jordan-343536",
        "https://www.linkedin.com/in/mia-fitzgerald-373839",
      ],
      projectDescription:
        "A virtual reality workspace allowing teams to brainstorm and prototype in 3D environments.",
      projectPrizeCategory: "Best VR Collaboration Hack",
      devpostLink: "https://devpost.com/holoconnect55",
      repoLink: "https://github.com/holoconnect/vr-workspace",
    },
    {
      ID: 56,
      focus: "best hack for media & journalism",
      teamName: "TruthTrack",
      innoVotes: 13,
      techVotes: 12,
      funVotes: 7,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Nora Beck", "Omar Diaz"],
      linkedinLinks: [
        "https://www.linkedin.com/in/nora-beck-646566",
        "https://www.linkedin.com/in/omar-diaz-676869",
      ],
      projectDescription:
        "TruthTrack verifies news articles in real-time using NLP and cross-referencing multiple credible sources.",
      projectPrizeCategory: "Best Hack for Media & Journalism",
      devpostLink: "https://devpost.com/truthtrack56",
      repoLink: "https://github.com/truthtrack/news-verifier",
    },
    {
      ID: 57,
      focus: "best hack for language learning",
      teamName: "LinguaLink",
      innoVotes: 11,
      techVotes: 9,
      funVotes: 14,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Peter Fisher", "Queenie Tong"],
      linkedinLinks: [
        "https://www.linkedin.com/in/peter-fisher-484950",
        "https://www.linkedin.com/in/queenie-tong-515253",
      ],
      projectDescription:
        "An AI-driven language learning buddy that chats with users and corrects grammar in real-time.",
      projectPrizeCategory: "Best Hack for Language Learning",
      devpostLink: "https://devpost.com/lingualink57",
      repoLink: "https://github.com/lingualink/ai-language-buddy",
    },
    {
      ID: 58,
      focus: "best space tech hack",
      teamName: "OrbitOps",
      innoVotes: 16,
      techVotes: 15,
      funVotes: 9,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Ron Silva", "Susan Park"],
      linkedinLinks: [
        "https://www.linkedin.com/in/ron-silva-545556",
        "https://www.linkedin.com/in/susan-park-575859",
      ],
      projectDescription:
        "OrbitOps simulates satellite orbits for debris collision prevention using real-time tracking data.",
      projectPrizeCategory: "Best Space Tech Hack",
      devpostLink: "https://devpost.com/orbitops58",
      repoLink: "https://github.com/orbitops/debris-avoidance",
    },
    {
      ID: 59,
      focus: "best GIS hack",
      teamName: "MapMasters",
      innoVotes: 12,
      techVotes: 14,
      funVotes: 7,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Tim Rogers", "Ursula Monroe"],
      linkedinLinks: [
        "https://www.linkedin.com/in/tim-rogers-606162",
        "https://www.linkedin.com/in/ursula-monroe-636465",
      ],
      projectDescription:
        "MapMasters integrates GIS data to provide real-time evacuation routes during natural disasters.",
      projectPrizeCategory: "Best GIS Hack",
      devpostLink: "https://devpost.com/mapmasters59",
      repoLink: "https://github.com/mapmasters/evacuation-routes",
    },
    {
      ID: 60,
      focus: "most socially useful hack",
      teamName: "Sunshine",
      innoVotes: 17,
      techVotes: 10,
      funVotes: 8,
      picture: require("@/assets/images/chewtok.jpg"),
      members: ["Vince Brooks", "Wendy Zhang"],
      linkedinLinks: [
        "https://www.linkedin.com/in/vince-brooks-666777",
        "https://www.linkedin.com/in/wendy-zhang-888999",
      ],
      projectDescription:
        "Sunshine connects local farmers with food banks to reduce food wastage and feed those in need.",
      projectPrizeCategory: "Most Socially Useful Hack",
      devpostLink: "https://devpost.com/sunshine60",
      repoLink: "https://github.com/sunshine/food-bank-connector",
    }
  ];

  async function batchInsertEntries() {
      const batch = writeBatch(db);
      const collectionPath = "HacknRoll25";

      entries.forEach((entry) => {
      //   const docRef = doc(db, collectionPath, entry.ID.toString());
      const docRef = doc(db, collectionPath, entry.ID.toString());
        batch.set(docRef, entry);
      });

      try {
        console.log("running the push");
        await batch.commit();
        console.log("Batch insert successful!");
      } catch (error) {
        console.error("Error inserting batch: ", error);
      }
  }


  //Sample layout of event space:
  const rowLayout = ['table', 'table', 'table', 'aisle', 'table', 'table', 'table'];

  //Gonna represent it in a grid format so easier to draw lines
  function buildGrid(teamsArray: any[]) {
      const tablesPerRow = 6;
      const totalTableRows = Math.ceil(teamsArray.length / tablesPerRow);
      const displayRows = 2 * totalTableRows - 1; // includes the inbetween aisles
      const columns = rowLayout.length;

      let tableIndex = 0;
      let grid: Array<Array<any>> = [];

      for (let r = 0; r < displayRows; r++) {
          const isTableRow = (r % 2 === 0); // even row => table row; odd => aisle row
          let rowCells: Array<any> = [];

          for (let c = 0; c < columns; c++) {
              let cellType = 'aisle';
              let team = null;
              if (isTableRow) {
                  cellType = rowLayout[c]; // 'table' or 'aisle'

                  if (cellType === 'table' && tableIndex < teamsArray.length) { // if table assign the team to it too
                  team = teamsArray[tableIndex];
                  tableIndex++;
                  }
              }

              // figure out if walkable (usually only aisle is walkable)
              const walkable = (cellType === 'aisle');

              rowCells.push({
                  row: r,
                  col: c,
                  type: cellType,
                  walkable: walkable,
                  team: team,
              });
          }
        grid.push(rowCells);
      }
      return grid;
  };

  // Build the grid using the teams
  const grid = useMemo(() => {
      return buildGrid(teams);
  }, [teams]);

  const assignedCells = useMemo(() => {
      const result: Cell[] = [];
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
          if (grid[r][c].team && assignedTableIds.includes(grid[r][c].team.docId)) {
            result.push(grid[r][c]);
          }
        }
      }
      return result;
  }, [grid, assignedTableIds]);

  const displayRows = grid.length;
  const columns = displayRows > 0 ? grid[0].length : 0;

  // Handler for overlay taps
  function handleOverlayTap(x: number, y: number) {
      console.log("Overlay tap at:", x, y);
      if (!layoutWidth || !layoutHeight) return; // not measured yet
      if (displayRows === 0 || columns === 0) return;

      const cellWidth = layoutWidth / columns;
      const cellHeight = layoutHeight / displayRows;

      const col = Math.floor(x / cellWidth);
      const row = Math.floor(y / cellHeight);

      if (
          row >= 0 && row < displayRows &&
          col >= 0 && col < columns
      ) {
          const tappedCell = grid[row][col];
          console.log("Tapped cell =>", tappedCell);
          setStartCell(tappedCell);
      } else {
          console.log("Tapped outside the grid boundary.");
      }
  }

  // Calling BFS when startCell changes
  const [pathCells, setPathCells] = useState<Cell[]>([]); // The final BFS path

  useEffect(() => {
      if (!startCell) return;
      if (assignedCells.length === 0) {
        setPathCells([]);
        return;
      }

      // 1) Find closest assigned table
      let closestTableCell: Cell | null = null;
      let closestDist = Infinity;
      for (const assignCell of assignedCells) {
        const dist =
          Math.abs(assignCell.row - startCell.row) +
          Math.abs(assignCell.col - startCell.col);
        if (dist < closestDist) {
          closestDist = dist;
          closestTableCell = assignCell;
        }
      }
      if (!closestTableCell) {
        setPathCells([]);
        return;
      }

      // 2) Aisle neighbors of that table
      const neighbors = getNeighbors(closestTableCell, grid).filter(n => n.walkable);
      if (neighbors.length === 0) {
        setPathCells([]);
        return;
      }

      // 3) BFS => pick shortest path
      let bestPath: Cell[] = [];
      let bestLen = Infinity;
      for (const neighbor of neighbors) {
        const p = bfs(startCell, neighbor, grid);
        if (p.length > 0 && p.length < bestLen) {
          bestLen = p.length;
          bestPath = p;
        }
      }
      setPathCells(bestPath);

  }, [startCell, assignedCells]);

  function bfs(start: Cell, target: Cell, grid: Cell[][]): Cell[] {
      const visited = new Set<string>();
      const queue: Cell[] = [];
      const parentMap = new Map<Cell, Cell | null>();

      queue.push(start);
      visited.add(`${start.row},${start.col}`);
      parentMap.set(start, null);

      while (queue.length > 0) {
        const current = queue.shift()!;
        if (current.row === target.row && current.col === target.col) {
          return buildPath(parentMap, current);
        }
        for (const neighbor of getNeighbors(current, grid)) {
          const key = `${neighbor.row},${neighbor.col}`;
          if (!visited.has(key)) {
            visited.add(key);
            parentMap.set(neighbor, current);
            queue.push(neighbor);
          }
        }
      }
      return [];
  }

  function getNeighbors(cell: Cell, grid: Cell[][]): Cell[] {
      const directions = [
          { dr: -1, dc: 0 }, // up
          { dr: 1, dc: 0 },  // down
          { dr: 0, dc: -1 }, // left
          { dr: 0, dc: 1 },  // right
      ];
      const neighbors: Cell[] = [];
      for (const { dr, dc } of directions) {
          const nr = cell.row + dr;
          const nc = cell.col + dc;
          if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[nr].length) {
          const nCell = grid[nr][nc];
          // only walkable cells (aisle)
          if (nCell.walkable) {
              neighbors.push(nCell);
          }
          }
      }
      return neighbors;
  }

  function buildPath(parentMap: Map<Cell, Cell | null>, end: Cell) {
      const path: Cell[] = [];
      let current: Cell | null = end;
      while (current) {
          path.push(current);
          current = parentMap.get(current) || null;
      }
      return path.reverse();
  }


  function PathOverlay(props: {
      pathCells: Cell[];
      layoutWidth: number;
      layoutHeight: number;
      rows: number;
      cols: number;
      }) {
      const { pathCells, layoutWidth, layoutHeight, rows, cols } = props;
      if (pathCells.length === 0) return null;

      const cellWidth = layoutWidth / cols;
      const cellHeight = layoutHeight / rows;

      let d = '';
      pathCells.forEach((cell, i) => {
          const cx = (cell.col + 0.5) * cellWidth;
          const cy = (cell.row + 0.5) * cellHeight;
          if (i === 0) {
          d = `M${cx},${cy}`;
          } else {
          d += ` L${cx},${cy}`;
          }
      });

      return (
          <Svg
          pointerEvents="none" // so it doesn't block touches
          style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: layoutWidth,
              height: layoutHeight,
          }}
          >
              <Path d={d} stroke="blue" strokeWidth={3} fill="none" />
          </Svg>
      );
  }


  return (
      <ImageBackground
      source={require('@/assets/images/wooden floor.png')}
      style={styles.backgroundImage}
      >
          <Container style={styles.diningHallContainer}>

              {/* Stage */}
              <Container style={styles.stageContainer}>
              <TouchableOpacity
                  style={styles.stage}
                    onPress={() => router.push('/tabs')}
              >
                  <ThemedText type="defaultSemiBold">Stage</ThemedText>
              </TouchableOpacity>
              </Container>

              {/* RENDER THE GRID */}
              <Container
              style={styles.allTablesContainer}
              onLayout={(event) => {
              const { width, height } = event.nativeEvent.layout;
              setLayoutWidth(width);
              setLayoutHeight(height);
              }}>
                  <View style={{ flex: 1, flexDirection: 'column' }}>
                      {grid.map((rowCells, r) => (
                      <View
                          key={`row-${r}`}
                          style={styles.tableRowContainer}
                      >
                          {rowCells.map((cell, c) => {
                          let cellStyle = styles.aisle; // default aisle style
                          if (cell.type === 'table') {
                              const isAssigned = cell.team ? assignedTableIds.includes(cell.team.docId) : false;

                              if (cell.team) {
                                  cellStyle = isAssigned ? styles.assignedTable : styles.table;
                              } else {
                                  // table cell with no team
                                  cellStyle = styles.table;
                              }
                          }
                          // check if it's the "startCell" tapped
                          const isTapped = (startCell?.row === r && startCell?.col === c);
                          if (isTapped) {
                              cellStyle = [cellStyle, { borderWidth: 2, borderColor: 'yellow' }];
                          }

                          return (
                              <TouchableOpacity
                              key={`cell-${r}-${c}`}
                              style={cellStyle}
                              onPress={() => {
                                  if (cell.team) {
                                  Alert.alert(
                                      `Team #${cell.team.docId}`,
                                      `Name: ${cell.team.teamName}\nFocus: ${cell.team.focus}\nVotes: ${cell.team.votes}`
                                  );
                                  }
                              }}
                              >
                              {/* Show ID if there's a team */}
                              {cell.team && (
                                  <ThemedText type="defaultSemiBold">
                                  {cell.team.docId}
                                  </ThemedText>
                              )}
                              </TouchableOpacity>
                          );
                          })}
                      </View>
                      ))}
                  </View>
                  {/* Transparent Overlay to capture taps - covers entire container */}
                  <View
                      style={StyleSheet.absoluteFill}
                      pointerEvents={overlayEnabled ? "auto" : "none"}
                      onStartShouldSetResponder={() => true}
                      onResponderRelease={(evt) => {
                          const { locationX, locationY } = evt.nativeEvent;
                          handleOverlayTap(locationX, locationY);
                      }}
                  />
                  <PathOverlay
                      pathCells={pathCells}
                      layoutWidth={layoutWidth}
                      layoutHeight={layoutHeight}
                      rows={grid.length}
                      cols={grid[0]?.length || 0}
                  />
              </Container>
          </Container>
          <TouchableOpacity
              style={styles.circularButton}
              onPress={() => { setOverlayEnabled(!overlayEnabled); setPathCells([]);}}
          >
              <Icon
                  name={overlayEnabled ? "book" : "location"}
                  type="ionicon"
                  color="black"
                  size={30}
              />
          </TouchableOpacity>
      </ImageBackground>

  );
}

const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    diningHallContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    stageContainer: {
      flex: 2,
    },
    stage: {
      flexDirection: 'row',
      backgroundColor: '#D2B48C',
      height: '30%',
      alignItems: 'center',
      borderRadius: 5,
      justifyContent: 'center',
    },
    /* The parent container for all the rows */
    allTablesContainer: {
      flex: 8,
      justifyContent: 'space-around',
      flexDirection: 'column',
      marginTop: '30%',
      marginBottom: '40%',
    //   marginHorizontal: '1%',
    },
    /* Each row: horizontally arranged */
    tableRowContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
    //   marginVertical: 2,
    },
    table: {
      height: '100%',
      width: '15%',            // was 20%
      backgroundColor: '#654321',
      borderRadius: 5,
    //   margin: 3,               // was 5
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    aisle: {
      height: '100%',
      width: '15%',            // was 20%
    //   margin: 3,               // was 5
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: 'transparent',
      justifyContent: 'center',
    },
    assignedTable: {
      height: '100%',
      width: '15%',            // was 20%
      backgroundColor: 'red',
      borderRadius: 5,
    //   margin: 3,               // was 5
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    circularButton: {
      position: 'absolute',
      bottom: 100,
      right: 5,
      width: 50,
      height: 50,
      borderRadius: 25, // Half of the width/height for a perfect circle
      backgroundColor: '#D2B48C', // Background color
      alignItems: 'center', // Center icon horizontally
      justifyContent: 'center', // Center icon vertically
      elevation: 5, // Shadow for Android
      shadowColor: '#000', // Shadow color for iOS
      shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
      shadowOpacity: 0.3, // Shadow opacity for iOS
      shadowRadius: 3, // Shadow radius for iOS
    },
});