import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/Home/HomeScreen";
import TrackPlayer, { Capability } from "react-native-track-player";
import SplashScreen from "./screens/Splash/Splash";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Favorites from "./screens/favorites/Favorites";
import Playlist from "./screens/playlists/Playlist";
import RecentlyAdded from "./screens/recents/RecentlyAdded";
import PlayListSongs from "./screens/playlists/PlayListSongs";

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Music: { albumTitle: string; image: string, albumId: number };
  PlayListSongs:undefined;

};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Music") {
            iconName = "music";
          }else if(route.name ==="Favorite"){
            iconName="cards-heart";
          }else if(route.name==="Playlist"){
            iconName="playlist-music";
          }
          else if(route.name==="Recents"){
            iconName="file-music";
          }
          
          return iconName ? <MaterialCommunityIcons name={iconName} size={size} color={color} /> : null;
        },
        tabBarActiveTintColor: "#1877f2",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "black" ,borderColor:"#999"}
      }
    )}
    >
      <Tab.Screen name="Music" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Playlist" component={Playlist} options={{ headerShown: false }} />
      <Tab.Screen name="Favorite" component={Favorites} options={{ headerShown: false }} />
      <Tab.Screen name="Recents" component={RecentlyAdded} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

function App(): React.JSX.Element {
  useEffect(() => {
    const setupPlayer = async () => {
      try {
        await TrackPlayer.setupPlayer();

        await TrackPlayer.updateOptions({
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop,
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
        });

        console.log("✅ TrackPlayer is initialized with capabilities");
      } catch (error) {
        console.error("TrackPlayer setup error:", error);
      }
    };

    setupPlayer();

    return () => {
      TrackPlayer.reset();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: { backgroundColor: "#121212" },
          headerTintColor: "#1877f2",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={MyTabs} options={{ headerShown: false }} />
        <Stack.Screen name="PlayListSongs" component={PlayListSongs} options={{ headerShown: true,headerTitleStyle:{color:"#fff"},headerTitle:"PlayList"}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
