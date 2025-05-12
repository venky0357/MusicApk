import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SplashScreen:React.FC = () => {
  const navigation = useNavigation();
  const fadeAnim = new Animated.Value(0); // Initial opacity set to 0

  useEffect(() => {
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500, // 1.5 sec fade-in
      useNativeDriver: true,
    }).start();

    // Navigate to main screen after 2 sec
    setTimeout(() => {
      navigation.navigate("Home"  as never);
    }, 5000);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={{uri:"https://htiqqxnpmiqbymxvaunh.supabase.co/storage/v1/object/public/music//music-app.png"}}
        style={[styles.logo, { opacity: fadeAnim }]}
      />
      <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
        Feel the Beat. Live the Music.
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Black background
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  tagline: {
    fontSize: 18,
    color: "#00aaff", // Blue text
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SplashScreen;
