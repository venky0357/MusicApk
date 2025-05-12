import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import React, { useEffect, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TrackPlayer, { Track, State } from 'react-native-track-player';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';

const PlayListSongs: React.FC = ({ route }) => {
    const { data } = route?.params;
    const [songs, setSongs] = useState(data.songs); // State for drag-and-drop
    const [currentSongId, setCurrentSongId] = useState<number | null>(null);

    // Setup TrackPlayer when component mounts
    useEffect(() => {
        setupTrackPlayer();
    }, []);

    // Initialize TrackPlayer
    const setupTrackPlayer = async () => {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.reset();
    };

    // Convert songs to TrackPlayer format
    const trackList: Track[] = songs.map((song: { id: number; audio: any; title: string; artist: string; image: string; }) => ({
        id: song.id.toString(),
        url: song.audio,
        title: song.title,
        artist: song.artist,
        artwork: song.image,
    }));

    // Function to handle Play All button
    const playAllSongs = async () => {
        await TrackPlayer.reset(); // Clear the previous queue
        await TrackPlayer.add(trackList); // Add new tracks
        await TrackPlayer.play(); // Start playing
        setCurrentSongId(songs[0].id); // Set first song as playing
    };

    // Function to handle Shuffle button
    const shuffleSongs = async () => {
        const shuffled = [...songs].sort(() => Math.random() - 0.5); // Shuffle the song list
        setSongs(shuffled); // Update state
        await TrackPlayer.reset();
        await TrackPlayer.add(shuffled.map(song => ({
            id: song.id.toString(),
            url: song.audio,
            title: song.title,
            artist: song.artist,
            artwork: song.image,
        })));
        await TrackPlayer.play();
        setCurrentSongId(shuffled[0].id);
    };

    // Function to handle individual song play
    const playSong = async (selectedSong: any) => {
        await TrackPlayer.reset();
        await TrackPlayer.add({
            id: selectedSong.id.toString(),
            url: selectedSong.audio,
            title: selectedSong.title,
            artist: selectedSong.artist,
            artwork: selectedSong.image,
        });
        await TrackPlayer.play();
        setCurrentSongId(selectedSong.id);
    };

    // Function to pause playback
    const pausePlayback = async () => {
        await TrackPlayer.pause();
        setCurrentSongId(null);
    };

    // Function to update the song order after dragging
    const handleDragEnd = ({ data }: { data: any[] }) => {
        setSongs(data);
    };

    return (
        <View style={styles.container}>
            {/* Playlist Header */}
            <View style={styles.playlistHeader}>
                <Image source={{ uri: data.image }} style={styles.playlistImage} />
                <View style={styles.details}>
                    <Text style={styles.title}>{data.title}</Text>
                    <View style={{ flexDirection: "row", gap: 8, width: "100%" }}>
                        {/* Play All Button */}
                        <TouchableOpacity style={styles.info} onPress={playAllSongs}>
                            <Text style={styles.infoText} numberOfLines={1} ellipsizeMode='tail'>Play All</Text>
                            <Text style={styles.infoText}>({songs.length})</Text>
                        </TouchableOpacity>
                        {/* Shuffle Button */}
                        <TouchableOpacity style={styles.info} onPress={shuffleSongs}>
                            <Text style={styles.infoText} numberOfLines={1} ellipsizeMode='tail'>Shuffle</Text>
                            <MaterialCommunityIcons size={18} name="shuffle" color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Draggable Song List */}
            <DraggableFlatList
                data={songs}
                keyExtractor={(item) => item.id.toString()}
                onDragEnd={handleDragEnd}
                showsVerticalScrollIndicator={false}
                style={{marginBottom:100}}
                renderItem={({ item, drag, isActive }: RenderItemParams<any>) => (
                    <TouchableOpacity
                        onLongPress={drag} // Start drag on long press
                        style={[styles.songItem, isActive && { backgroundColor: "#333" }]}
                    >
                        <MaterialCommunityIcons size={28} name="drag" color="white" />
                        <View style={styles.songDetails}>
                            <Text style={styles.songTitle}>{item.title}</Text>
                            <View style={{ flexDirection: "row", gap: 3, alignItems: "center" }}>
                                <Text style={styles.songArtist}>{item.artist},</Text>
                                <Text style={styles.songStreams}>{item.streams} Streams</Text>
                            </View>
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
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

export default PlayListSongs;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        paddingHorizontal: 10,
        paddingVertical: 20
    },
    infoText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 14,
        maxWidth: "70%",
    },
    info: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 60,
        backgroundColor: "#1877f2",
        width: "45%",
        flexDirection: "row",
        gap: 5,
        marginTop: 15
    },
    playIcon: {
        width: 30,
        height: 30,
    },
    playlistHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20
    },
    playlistImage: {
        width: 100,
        height: 100,
        borderRadius: 10
    },
    details: {
        marginLeft: 15,
        flex: 1
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white"
    },
    songItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1E1E1E",
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        justifyContent: "flex-start"
    },
    songDetails: {
        flex: 1,
        marginLeft: 10
    },
    songTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white"
    },
    songArtist: {
        fontSize: 14,
        color: "gray"
    },
    songStreams: {
        fontSize: 12,
        color: "#888"
    },
    playButton: {
        padding: 10
    }
});
