import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions } from "react-native";
import TrackPlayer, { usePlaybackState } from "react-native-track-player";
import { StackScreenProps } from "@react-navigation/stack";
import data, { FavouriteAlbums } from "../../data/Data";

type MusicScreenProps = StackScreenProps<
    { MusicScreen: { albumTitle: string; image: any; albumId: number } },
    "MusicScreen"
>;

const MusicScreen: React.FC<MusicScreenProps> = ({ route, navigation }) => {
    const current = usePlaybackState();
    const [currentSongId, setCurrentSongId] = useState<number | null>(null);
    const { albumTitle, image, albumId } = route?.params;
    const [songs, setSongs] = useState<any[]>([]);
    const { width, height } = Dimensions.get("screen");
    // Fetch songs based on albumId
    const album = FavouriteAlbums.find((album) => album.id === albumId);
    useEffect(() => {
        if (album?.songs) {
            setSongs(album.songs);
        }
    }, [albumId]);

    // Set the navigation header
    useLayoutEffect(() => {
        navigation.setOptions({
            title: albumTitle,
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#282828" },
            headerTitleStyle: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
            headerTintColor: "#FFFFFF",
        });
    }, [navigation, albumTitle]);

    // Play a song using TrackPlayer
    const playSong = async (selectedSong: any) => {
        try {
            await TrackPlayer.reset(); // ✅ Clear existing queue

            // Find the selected album
            const album = FavouriteAlbums.find((album) => album.id === albumId);
            if (!album?.songs) return;

            // Sort queue: Start from the selected song, then play remaining
            const selectedIndex = album.songs.findIndex((song) => song.id === selectedSong.id);
            const orderedQueue = [
                ...album.songs.slice(selectedIndex), // Selected song + remaining songs
                ...album.songs.slice(0, selectedIndex), // Songs before selected song
            ];

            // Add songs to the queue
            await TrackPlayer.add(
                orderedQueue.map((song) => ({
                    id: song.id.toString(),
                    url: song.audio,
                    title: song.title,
                    artist: song.artist,
                    artwork: song.image,
                }))
            );

            // Set currently playing song ID
            setCurrentSongId(selectedSong.id);

            // Start playing
            await TrackPlayer.play();
        } catch (error) {
            console.error("Error playing song:", error);
        }
    };

    const pausePlayback = async () => {
        await TrackPlayer.pause();
        setCurrentSongId(null);
    }
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", gap: 10, alignItems: "flex-start", padding: 10 }}>
                <Image
                    source={{ uri: image }}
                    style={[styles.albumImage, { width: width * (1 / 3), marginLeft: 5 }]}
                />
                <View style={styles.albumDetails}>
                    <Text style={styles.albumTitle}>🎬 {album?.title}</Text>
                    <View >
                        <Text style={styles.albumInfo} numberOfLines={1} ellipsizeMode="tail">Music</Text>
                        <Text style={styles.boldText} numberOfLines={1} ellipsizeMode="tail">{album?.music}</Text>
                    </View>
                    <View>
                        <Text style={styles.albumInfo} >Directors:</Text>
                        <Text style={styles.boldText} numberOfLines={1} ellipsizeMode="tail">{album?.director}</Text>
                    </View>
                    <View>
                        <Text style={styles.albumInfo}>Producer:</Text>
                        <Text style={styles.boldText} numberOfLines={1} ellipsizeMode="tail">{album?.producer}</Text>
                    </View>
                </View>
            </View>
            <FlatList
                data={songs}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.songItem}>
                        {/* Song Image */}
                        <Image source={{ uri: item.image }} style={styles.songImage} />

                        {/* Song Details */}
                        <View style={styles.songDetails}>
                            <Text style={styles.songTitle}>{item.title}</Text>
                            <Text style={styles.songArtist}>{item.artist}</Text>
                        </View>
                        {currentSongId === item.id ? ( // ✅ Show pause only for the playing song
                            <TouchableOpacity onPress={pausePlayback} style={styles.playButton}>
                                <Image source={{ uri: data.blue_pause }} style={styles.playIcon} />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => playSong(item)} style={styles.playButton}>
                                <Image source={{ uri: data.blue_play }} style={styles.playIcon} />
                            </TouchableOpacity>
                        )}
                    </View>
                )
                }
                showsVerticalScrollIndicator={false}
            />

        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        padding: 20,
    },
    albumDetails: {
        flex: 1,
        justifyContent: "flex-start",
        paddingHorizontal: 10,
        width: "100%"
    },
    albumTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 5,
    },
    albumInfo: {
        fontSize: 12,
        color: "#AAAAAA",
        width: "100%"
    },
    boldText: {
        fontSize: 12,
        marginBottom: 3,
        color: "#FFFFFF",
        fontWeight: "500",
        width: "100%"
    },
    albumImage: {
        height: 150,
        borderRadius: 10,
        marginBottom: 20,
    },
    songItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        backgroundColor: "#1E1E1E",
        padding: 10,
        borderRadius: 10,
    },
    songImage: {
        width: 60,
        height: 60,
        borderRadius: 5,
    },
    songDetails: {
        flex: 1,
        marginLeft: 10,
    },
    songTitle: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    songArtist: {
        color: "#AAAAAA",
        fontSize: 14,
    },
    playButton: {
        padding: 10,
    },
    playIcon: {
        width: 30,
        height: 30,
    },
});

export default MusicScreen;
