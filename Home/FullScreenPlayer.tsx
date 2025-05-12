import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import ProgressBar from "./ProgressBar";
import data from '../../data/Data';
import TrackPlayer, { usePlaybackState } from "react-native-track-player";
import Slider from "@react-native-community/slider";
import { setVolume } from "react-native-track-player/lib/src/trackPlayer";
interface Song {
    id: string;
    title: string;
    artist: string;
    streams: string;
    image: any;
    audio: any;
}

interface MinimizedPlayerProps {
    song: Song;
    onMinimize: () => void;
    onPlay: (song: Song) => void;
}

const FullScreenPlayer: React.FC<MinimizedPlayerProps> = ({ song, onMinimize, onPlay }) => {
    const [volume, setvolume] = useState(0.7);
    const current = usePlaybackState();
    useEffect(() => {
        setIsFavorite(false); // Reset favorite when a new song plays
        setIsLooping(false); // Reset loop state
    }, [song]);
    const [isLooping, setIsLooping] = useState(false); // Loop state
    const [isFavorite, setIsFavorite] = useState(false); // Favorite state
    const loopPlayback = async () => {
        setIsLooping(!isLooping);
        await TrackPlayer.setRepeatMode(isLooping && song.audio );
    };
    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        if (!isFavorite) {
            console.log(`Added ${song.title} to Favorites`);
        } else {
            console.log(`Removed ${song.title} from Favorites`);
        }
    };
    const handlePlay = () => {
        // Call the parent's onPlay function so the song can be played.
        onPlay(song);
    };
    const handleSkipForward = async () => {
        const queue = await TrackPlayer.getQueue();
        const currentTrackIndex = await TrackPlayer.getActiveTrackIndex() ??0;
    
        if (currentTrackIndex < queue.length - 1) {
            await TrackPlayer.skipToNext(); // ✅ Move to next track if available
        } else {
            console.log("Reached the last song. Staying on current track.");
        }
    };
    
    const handleSkipBackward = async () => {
        const position = await TrackPlayer.getPosition();
        const currentTrackIndex = await TrackPlayer.getActiveTrackIndex() ??1;
    
        if (position > 5) {
            await TrackPlayer.seekTo(0); // ✅ Restart the track if played for more than 5 seconds
        } else if (currentTrackIndex > 0) {
            await TrackPlayer.skipToPrevious(); // ✅ Skip to previous track if available
        } else {
            console.log("Already at the first track. Staying on current song.");
        }
    };
    
    const pausePlayback = async () => {
        await TrackPlayer.pause();
    }
    return (
        <View style={styles.fullScreenPlayer}>
            <View style={{ alignItems: "center", flex: 1, justifyContent: "flex-start", width: "100%" }}>
                <View style={{ flexDirection: "row", width: "100%" }}>
                    {/* <TouchableOpacity onPress={onMinimize}>
                        <Image source={{ uri: data.close }} style={styles.close} />
                    </TouchableOpacity> */}
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%" }}>
                        <Image source={{ uri: song.image }} style={styles.albumArt} />
                    </View>
                </View>
                <Text style={styles.songTitle}>{song.title}</Text>
                <Text style={styles.songArtist}>{song.artist}</Text>
                <ProgressBar />
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: "85%" }}>
                    <TouchableOpacity onPress={toggleFavorite} style={{marginTop:18}}>
                        <Image source={{ uri: isFavorite ? data.heart_filled : data.heart }} style={{ width: 30, height: 30 }} />
                    </TouchableOpacity>
                    <View style={{ flexDirection: "row", gap: 15, alignItems: "center", width: "80%", justifyContent: "center", marginTop: 20 }}>
                        <TouchableOpacity onPress={handleSkipBackward} style={styles.playButton}>
                            <Image source={{ uri: data.backward }} style={{ width: 35, height: 35 }} />
                        </TouchableOpacity>
                        {current.state === "paused" || current.state === "stopped" ?
                            <TouchableOpacity onPress={handlePlay} style={styles.playButton}>
                                <Image source={{ uri: data.blue_play }} style={{ width: 45, height: 45 }} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={pausePlayback} style={styles.playButton}>
                                <Image source={{ uri: data.blue_pause }} style={{ width: 45, height: 45 }} />
                            </TouchableOpacity>

                        }
                        <TouchableOpacity onPress={handleSkipForward} style={styles.playButton}>
                            <Image source={{ uri: data.forward }} style={{ width: 35, height: 35 }} />
                        </TouchableOpacity>
                    </View>
                    {/* <TouchableOpacity onPress={loopPlayback} style={{marginTop:18}}>
                        <Image source={{ uri: isLooping ? data.loop : data.loop }} style={{ width: 35, height: 35 }} />
                    </TouchableOpacity> */}
                </View>
            </View>
            
            {/* Volume Control */}
            <View style={styles.volumeContainer}>
                <Image source={{ uri: data.speaker }} style={{ width: 25, height: 25 }} />
                <Slider
                    style={styles.volumeSlider}
                    minimumValue={0}
                    maximumValue={1}
                    step={0.01}
                    value={volume}
                    onSlidingComplete={async (value) => {
                        await TrackPlayer.setVolume(value);
                        setvolume(value) // Seek to selected time
                    }}
                    minimumTrackTintColor="#1877F2"  // 🔵 Blue color for played portion
                    maximumTrackTintColor="#D3D3D3"  // Gray for remaining portion
                    thumbTintColor="#1877F2"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    fullScreenPlayer: {
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#282828",
        position: "absolute",
        bottom: 0,
        paddingVertical: 30,
        width: "100%",
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        height: 550
    },
    volumeContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "80%",
        marginTop: 20,

    },
    volumeLabel: {
        color: "#fff",
        marginRight: 10,
        fontSize: 16,
    },
    volumeSlider: {
        flex: 1,
    },
    playButton: {
        marginLeft: 10,
    },
    albumArt: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginVertical: 10,
        alignSelf: "center",
        objectFit: "cover",
        position: "relative",
        right: 10
    },
    songTitle: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "bold",
    },
    songArtist: {
        color: "#AAAAAA",
        fontSize: 18,
        marginBottom: 20,
    },
    controls: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "60%",
        marginBottom: 20,
    },
    control: {
        color: "#FFFFFF",
        fontSize: 32,
    },
    close: {
        color: "#1877f2",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 25,
        width: 5,
        height: 5,
        padding: 10,
        borderRadius: 60,
        position: "relative",
        top: 10
    },
});

export default FullScreenPlayer;
