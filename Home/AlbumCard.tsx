import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { StackNavigationProp } from "@react-navigation/stack";
interface Album {
  image: any; // Accept both local and remote images
  title: string;
  id:number;
}
type NavigationProps = StackNavigationProp<RootStackParamList, "Music">;

const AlbumCard: React.FC<Album> = ({ image, title,id }) => {
  const navigation = useNavigation<NavigationProps>();
  const handleAlbum = () => {
    navigation.navigate('Music', { albumTitle: title, image: image,albumId:id })
  }
  return (
    <TouchableOpacity style={styles.card} onPress={handleAlbum}>
      <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginRight: 15,
    alignItems: "center",
    width: 110, // Match card width with image
    overflow: "hidden",
  },
  image: {
    width: "100%", // Use full width of the card
    height: 120, // Maintain a fixed height,
    borderRadius: 5
  },
  title: {
    marginTop: 8,
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600"
  },
});

export default AlbumCard;
