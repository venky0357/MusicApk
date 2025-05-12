import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import TrackPlayer, { useProgress } from "react-native-track-player";

const ProgressBar: React.FC = () => {
    const progress = useProgress(); // Get current track progress

    return (
        <View style={styles.container}>
            {/* Time Display */}
            <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{formatTime(progress.position)}</Text>
                <Text style={styles.timeText}>{formatTime(progress.duration)}</Text>
            </View>

            {/* Progress Bar Slider */}
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={progress.duration}
                value={progress.position}
                onSlidingComplete={async (value) => {
                    await TrackPlayer.seekTo(value); // Seek to selected time
                }}
                minimumTrackTintColor="#1877F2"  // 🔵 Blue color for played portion
                maximumTrackTintColor="#D3D3D3"  // Gray for remaining portion
                thumbTintColor="#1877F2"         // 🔵 Blue color for the thumb
            />
        </View>
    );
};

// Format time function (mm:ss)
const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center",
        marginTop: 10,
    },
    timeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "90%",
    },
    timeText: {
        color: "#FFF",
        fontSize: 14,
    },
    slider: {
        width: "90%",
        height: 40,
    },
});

export default ProgressBar;
