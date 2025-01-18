// This should be the VIEW of the location

import { View, Text, Image, StyleSheet, Platform, FlatList } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

export default function HomeScreen() {

  const router = useRouter();

    const classes = [
      {
        startTime: '07:30',
        endTime: '09:00',
        title: 'Breakfast',
        bgColor:'#E0FFFF',
        picture: require('@/assets/images/breakfast.jpg')
      },
      {
        startTime: '11:30',
        endTime: '12:30',
        title: 'Lunch',
        bgColor:'#E6E6FA',
        picture: require('@/assets/images/lunch.jpg')
      },
      {
        startTime: '12:30',
        endTime: '12.45',
        title: 'Hacking Ends',
        bgColor:'#FAF0E6',
        picture: require('@/assets/images/finish.jpg')
      },
      {
        startTime: '12:45',
        endTime: '15:00',
        title: 'Project Fair & Judging',
        bgColor:'#FAFAD2',
        picture: require('@/assets/images/pitch.jpg')
      },
      {
        startTime: '15:00',
        endTime: '16:00',
        title: 'Closing Ceremony',
        bgColor:'#E0FFFF',
        picture: require('@/assets/images/closing ceremony.avif')
      },{
        startTime: '16:00',
        endTime: '',
        title: 'End of Hack&Roll 2025!',
        bgColor:'#E6E6FA',
        picture: require('@/assets/images/goodbye.jpg')
      },
      // Add more classes as needed
    ];
    const renderClassItem = ({ item }: { item: typeof classes[0] }) => (
      <View style={styles.classItem}>
        <View style={styles.timelineContainer}>
          <View style={styles.timelineDot} />
          <View style={styles.timelineLine} />
        </View>
  
        <View style={styles.classContent}>
          <View style={styles.classHours}>
            <Text style={styles.startTime}>{item.startTime}</Text>
            <Text style={styles.endTime}>{item.endTime}</Text>
          </View>
  
          <View style={[styles.card,{backgroundColor:item.bgColor}]}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Image source = {item.picture} style={styles.picture} />
          </View>
        </View>
      </View>
    );
  
    const renderHeader = () => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hack&Roll 2025</Text>
          <Text style={styles.headerSubtitle}>19 Jan, 7:30am - 4:00pm</Text>
        </View>
  
        <View style={styles.body}>
          <Image source={require('@/assets/images/hackandroll2025logo.png')}  style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>NUS Hackers</Text>
            <Text style={styles.userRole}>Organiser</Text>
          </View>
        </View>
      </View>
    );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/JudgeIconBG.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Hey There!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Welcome to NUSuperJudges!</ThemedText>
      </ThemedView>
      

      <Text style={styles.title}>Event Schedule</Text>

      <FlatList
      contentContainerStyle={{paddingHorizontal:16}}
        data={classes}
        ListHeaderComponent={renderHeader}
        renderItem={renderClassItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft:16
  },
  card: {
    flex:1,
    backgroundColor: '#ff7f50',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 16,
    padding: 16,
  },
  header: {
    marginBottom: 8,
  },
  headerTitle: {
    color:'#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    color:'#ffffff',
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 8,
  },
  picture: {
    width: '100%',
    height: 80,
    borderRadius: 10,
    marginRight: 8,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'#ffffff',
  },
  userRole: {
    fontSize: 12,
    color:'#ffffff',
  },
  classItem: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timelineContainer: {
    width: 30,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff7f50',
    marginBottom: 8,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#ff7f50',
  },
  classContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  classHours: {
    marginRight: 8,
    alignItems: 'flex-end',
  },
  startTime: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  endTime: {
    fontSize: 16,
  },
  cardTitle: {
    fontSize: 16,
    color: '#00008B',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: '#00008B',
    marginBottom: 8,
  },
  studentListContainer:{
    marginRight:10,
  },
  studentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: -3,
    borderWidth:1,
    borderColor:'#fff'
  },
});