import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import TrackPlayer, { usePlaybackState, useProgress } from "react-native-track-player";
import data from "../../data/Data";

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
    onExpand: () => void;
    onPlay: (song: Song) => void;
}

const MinimizedPlayer: React.FC<MinimizedPlayerProps> = ({ song, onExpand, onPlay }) => {
    const current = usePlaybackState();
    const progress = useProgress();
    const handlePlay = () => {
        // Call the parent's onPlay function so the song can be played.
        onPlay(song);
    };
    const stopPlayback = async () => {
        await TrackPlayer.stop();
        // setIsPlaying(false);
    };
    const pausePlayback = async () => {
        await TrackPlayer.pause();
    }
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    return (
        <View style={styles.minimizedPlayer}>
            <TouchableOpacity onPress={onExpand} style={{ flexDirection: "row", alignItems: "center", width: "70%", overflow: "hidden" }}>
                <Image source={{ uri: song.image }} style={styles.songImage} />
                <View style={styles.songDetails}>
                    <Text style={styles.songTitle} numberOfLines={1} ellipsizeMode="tail">{song.title}</Text>
                    <Text style={styles.songArtist} numberOfLines={1} ellipsizeMode="tail">{song.artist}</Text>
                </View>
                <View style={{ marginHorizontal: 30, flexDirection: "row", gap: 5 }}>
                    {current.state === "playing" ?
                        <Text style={styles.timeText}>{formatTime(progress.position)}</Text>
                        :
                        <Text style={styles.timeText}>{formatTime(progress.duration)}</Text>
                    }
                    {/* {current.state === "playing" &&<Text style={{color:"white"}}>-</Text>} */}
                </View>
            </TouchableOpacity>

            {/* Play/Pause button */}
            <View style={{ flexDirection: "row", gap: 15, alignItems: "center", width: "30%" }}>
                {current.state === "paused" || current.state === "stopped" ?
                    <TouchableOpacity onPress={handlePlay} style={styles.playButton}>
                        <Image source={{ uri: data.play }} style={{ width: 30, height: 30 }} />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={pausePlayback} style={styles.playButton}>
                        <Image source={{ uri: data.pause }} style={{ width: 30, height: 30 }} />
                    </TouchableOpacity>

                }
                <TouchableOpacity onPress={stopPlayback}>
                    <Image source={{ uri: data.stop }} style={{ width: 30, height: 30 }} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    minimizedPlayer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#282828",
        paddingHorizontal: 5,
        paddingVertical: 6,
        position: "absolute",
        bottom: 0,
        elevation:10,
        shadowColor:"#333"
    },
    timeText: {
        color: "#FFF",
        fontSize: 14,
    },
    playButton: {
        marginLeft: 10,
    },
    songImage: {
        width: 50,
        height: 50,
        borderRadius: 3,
    },
    songDetails: {
        marginLeft: 10,
        justifyContent: "center",
        width: "48%"
    },
    songTitle: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    songArtist: {
        color: "#AAAAAA",
        fontSize: 12,
    },
    playPause: {
        color: "#FFFFFF",
        fontSize: 24,
    },
});

export default MinimizedPlayer;
