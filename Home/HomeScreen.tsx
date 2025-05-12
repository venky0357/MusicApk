import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import AlbumCard from "./AlbumCard";
import MinimizedPlayer from "./MinimizedPlayer";
import FullScreenPlayer from "./FullScreenPlayer";
import TrackPlayer, { Event, State, useTrackPlayerEvents } from "react-native-track-player";
import data, { FavouriteAlbums, Favouritesongs } from "../../data/Data";
import { Song } from "../../types/Song";

const HomeScreen: React.FC = () => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const playSong = (song: Song) => {
    setCurrentSong(song);
    handlePlay(song);
  };
  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async (event) => {
    const currentTrack = await TrackPlayer.getActiveTrackIndex();
    const playerState = await (await TrackPlayer.getPlaybackState()).state;
    const trackObject = await TrackPlayer.getTrack(Number(currentTrack));
  
    // If the track changes and the state is "ended", play next
    if (event.track === currentTrack && playerState === State.Ended) {
      try {
        await TrackPlayer.skipToNext();
        await TrackPlayer.play();
      } catch (error) {
        console.log("No more tracks in queue:", error);
      }
    }
    if (trackObject) {
      setCurrentSong({
        id: trackObject.id,
        title: String(trackObject.title),
        artist: String(trackObject.artist),
        image: trackObject.artwork, // ✅ Updates UI
        audio: trackObject.url,
        streams: "", // Add streams if needed
      });
    }
  });
  const handlePlay = async (selectedSong: Song) => {
    try {
      await TrackPlayer.reset(); // Clear previous queue
      // Get the index of the selected song
      const selectedIndex = Favouritesongs.findIndex((song) => song.id === selectedSong.id);
  
      // Slice the array to get remaining songs
      const songsToQueue = [
        ...Favouritesongs.slice(selectedIndex), // Play from selected song
        ...Favouritesongs.slice(0, selectedIndex), // Play remaining in loop
      ];
  
      // Add songs to TrackPlayer
      await TrackPlayer.add(songsToQueue.map((song) => ({
        id: song.id,
        url: song.audio,
        title: song.title,
        artist: song.artist,
        artwork: song.image,
      })));
  
      // Start playing the first song in queue (selected song)
      await TrackPlayer.play();
  
      setCurrentSong(selectedSong); // Update UI state
      console.log(`Playing: ${selectedSong.title}`);
    } catch (error) {
      console.log("playSong error:", error);
    }
  };
  
  console.log("current:", currentSong);
  return (
    <View style={{ backgroundColor: "#282828" }}>
      <ScrollView style={[styles.container, currentSong === null ? { marginBottom: 0 } : { marginBottom: 60 }]} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: data.profile }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.profileName}>Venkatesh</Text>
            <Text style={styles.profileType}>My Music</Text>
          </View>
        </View>

        <View style={{ padding: 15, flex: 1, paddingHorizontal: 20 }}>
          <Text style={styles.heading}>Listen to the Latest Music</Text>

          {/* Recently Played */}
          <Text style={styles.sectionTitle}>Favorite Albums</Text>
          <FlatList
            data={FavouriteAlbums}
            horizontal
            keyExtractor={(item) => item.image}
            renderItem={({ item }) => (
              <AlbumCard image={item.image} title={item.title} id={item.id}/>
            )}
            showsHorizontalScrollIndicator={false}
            style={{ height: 150 }}

          />

          {/* Recommended for You */}
          <Text style={styles.sectionTitle}>Favorite Music</Text>
          <FlatList
            data={Favouritesongs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.recommendCard}
                onPress={() => playSong(item)}
              >
                <Image source={{ uri: item.image }} style={styles.recommendImage} />
                <View>
                  <Text style={styles.songTitle}>{item.title}</Text>
                  <Text style={styles.songDetails}>
                    {item.artist} - {item.streams} streams
                  </Text>
                  <Text style={styles.playPause}>{"▶ Play"}</Text>
                </View>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
      {currentSong !== null &&
        <View style={{ borderWidth: 1, borderColor: "white", width: "100%" }}>
          {/* Minimized & Full-Screen Player */}
          {currentSong && !isFullScreen && (
            <MinimizedPlayer
              song={currentSong}
              onExpand={() => setIsFullScreen(true)}
              onPlay={() => handlePlay(currentSong)}
            />
          )}
          <Modal visible={isFullScreen} animationType="slide" transparent={true} onRequestClose={()=>setIsFullScreen(false)}>
            <TouchableOpacity style={styles.modalBackground} onPress={()=>setIsFullScreen(false)}>
              {currentSong && isFullScreen && (
                <FullScreenPlayer
                  song={currentSong}
                  onMinimize={() => setIsFullScreen(false)}
                  onPlay={() => handlePlay(currentSong)}
                />
              )}
            </TouchableOpacity>
          </Modal>
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.61)", // Dark background for better UX
    justifyContent: "flex-end",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 15,
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#282828",
    paddingBottom: 15,
    padding: 15,
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 35,
    height: 35,
  },
  profileName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  profileType: {
    color: "#1877f2",
    fontSize: 15,
    fontWeight: "600",
  },
  heading: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "bold",
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 15,
  },
  recommendCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  recommendImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  songTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  songDetails: {
    color: "#AAAAAA",
    fontSize: 12,
  },
  playPause: {
    color: "#f9f9f9",
    fontSize: 14,
    marginTop: 5,
  },
});

export default HomeScreen;


