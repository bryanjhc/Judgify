import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import { AspectRatio, useTheme, Center, Button, Box, VStack, HStack, Stack, Switch, Heading } from "native-base";
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset, useAnimatedScrollHandler } from 'react-native-reanimated';


const { width } = Dimensions.get('window');
const img_Height = 250;

export default function SelectionScreen() {

  const router = useRouter();
  const theme = useTheme();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });
  const imageAnimatedStyle =  useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-img_Height, 0, img_Height],
            [-img_Height / 2, 0, img_Height * 0.75]
          )
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-img_Height, 0, img_Height],
            [2, 1, 1]
          )
        }
      ]
      }
  });

  return (
      <View style={styles.container}>
          <Animated.ScrollView ref={scrollRef} onScroll={scrollHandler} scrollEventThrottle={16}>
            <Animated.Image source={require('../assets/images/JudgeIconBG.png')} style={[styles.image, imageAnimatedStyle]} />
            <View style={styles.titleContainer}>
              <Text style={styles.titleFont}>Welcome to Judgify</Text>
            </View>
            <View style={{padding:25}}></View>
            <Box alignItems="center">
              <Box
                maxW="1000"
                maxH={250}
                rounded="lg"
                overflow="hidden"
                borderColor="coolGray.200"
                borderWidth="1"
                _dark={{
                  borderColor: "coolGray.600",
                  backgroundColor: "gray.700",
                }}
                _web={{
                  shadow: 10,
                  borderWidth: 0,
                }}
                _light={{
                  backgroundColor: "gray.50",
                  shadow: 5,
                }}
              >
                <View style={styles.choiceContainer}>
                  <Text style={styles.titleFont}>Choose Your Role</Text>
                  <VStack space={2}>
                    <Button
                      bg="primary.700"
                      _pressed={{ bg: "primary.500" }}
                      _text={{
                        fontSize: "lg",
                        fontWeight: "bold",
                        color: "white",
                      }}
                      size="lg"
                      width="200"
                      rounded="full"
                      //onPress
                    >
                      User
                    </Button>
                    <Button
                      bg="primary.700"
                      _pressed={{ bg: "primary.500" }}
                      _text={{
                        fontSize: "lg",
                        fontWeight: "bold",
                        color: "white",
                      }}
                      size="lg"
                      width="200"
                      rounded="full"
                      //onPress
                    >
                      Admin
                    </Button>
                  </VStack>
                </View>
              </Box>
            </Box>
          </Animated.ScrollView>
          <Box
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              width="100%"
              bg="#E0E0E0"
              py={8}
              px={6}
              // _text={{
              //   color: "white",
              //   textAlign: "center",
              // }}
            >
              <Text style={{fontWeight:'bold'}}>Contact Us</Text>
              <Text>Email: nicholastok0101@gmail.com | bryanchew22@gmail.com</Text>
              <Text>Phone: 97253745</Text>
              <Text>© 2025 Judgify. All rights reserved.</Text>
            </Box>
      </View>

  );
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    paddingTop: 50,
    backgroundColor: 'white'
  },
  image : {
    width,
    height: img_Height
  },
  titleContainer: {
    textAlign: 'center',
    gap: 8,
    backgroundColor: '#e6f7ff',
  },
  titleFont: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20
  },
  choiceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactFont: {
    fontWeight: 'bold'
  }
});
