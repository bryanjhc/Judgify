import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Dimensions, TextInput } from 'react-native';

const screen = Dimensions.get('window');

const formatNumber = (number: number) => `0${number}`.slice(-2);

const getRemaining = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = time - mins * 60;
    return { mins: formatNumber(mins), secs: formatNumber(secs) };
}

export default function App() {
  const [remainingSecs, setRemainingSecs] = useState(180);
  const [isActive, setIsActive] = useState(false);
  const { mins, secs } = getRemaining(remainingSecs);

  const toggle = () => {
    setIsActive(!isActive);
  }

  const reset3min = () => {
    setRemainingSecs(180);
    setIsActive(false);
  }

  const reset1min = () => {
    setRemainingSecs(60);
    setIsActive(false);
  }

  const reset5sec = () => {
    setRemainingSecs(5);
    setIsActive(false);
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isActive) {
      interval = setInterval(() => {
        setRemainingSecs((remainingSecs: number) => remainingSecs - 1);
      }, 1000);
      if (remainingSecs === 0) {
        clearInterval(interval);
        setIsActive(false);
      }
    } else if (!isActive && remainingSecs !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, remainingSecs]);


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {remainingSecs <= 0 
      ? <Text style={styles.timeUpText}>Time's up!</Text> 
      : <Text style={styles.timerText}>{`${mins}:${secs}`}</Text>}
    <TouchableOpacity onPress={toggle} style={isActive ? styles.buttonA : styles.buttonU}>
        <Text style={isActive ? styles.buttonTextA : styles.buttonTextU}>{isActive ? 'Pause' : 'Start'}</Text>
    </TouchableOpacity>
    <View style={styles.resetContainer}>
      <TouchableOpacity onPress={reset3min} style={[styles.resetButton, styles.buttonReset]}>
          <Text style={[styles.resetButtonText, styles.buttonTextReset]}>Reset</Text>
          <Text style={[styles.resetButtonText, styles.buttonTextReset]}>3 min</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={reset1min} style={[styles.resetButton, styles.buttonReset]}>
          <Text style={[styles.resetButtonText, styles.buttonTextReset]}>Reset</Text>
          <Text style={[styles.resetButtonText, styles.buttonTextReset]}>1 min</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonA: {
      borderWidth: 10,
      borderColor: '#ffaf80',
      width: screen.width / 2,
      height: screen.width / 2,
      borderRadius: screen.width / 2,
      alignItems: 'center',
      justifyContent: 'center'
  },
  buttonTextA: {
      fontSize: 45,
      color: '#ffaf80'
  },
    buttonU: {
        borderWidth: 10,
        borderColor: 'lightgreen',
        width: screen.width / 2,
        height: screen.width / 2,
        borderRadius: screen.width / 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonTextU: {
        fontSize: 45,
        color: 'lightgreen'
    },
  resetContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        paddingHorizontal: 50,
        paddingVertical: 10
    },
  resetButton: {
        borderWidth: 10,
        borderColor: '#ffaf80',
        width: screen.width / 3,
        height: screen.width / 3,
        borderRadius: screen.width / 2,
        alignItems: 'center',
        justifyContent: 'center'
  },
  resetButtonText: {
        fontSize: 25,
        color: '#ffaf80'
    },
  customText: {
        fontSize: 25,
        color: '#000'
    },
  timerText: {
      color: '#555',
      fontSize: 90,
      marginBottom: 20
  },
  timeUpText: {
    color: 'red',
    fontSize: 70,
    marginBottom: 20
  },
  buttonReset: {
      marginTop: 20,
      borderColor: "#FF851B"
  },
  buttonTextReset: {
    color: "#FF851B"
  }
});