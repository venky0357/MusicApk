import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Playlist_data } from '../../data/Data';
import { useNavigation } from '@react-navigation/native';
import Playlists from '../../types/Song';
const Playlist: React.FC = () => {
    const navigate=useNavigation();
    const handleNavigate=(data:Playlists)=>{
        navigate.navigate('PlayListSongs',{data});
    }
    return (
        <View style={styles.container}>
            <Text style={{ color: "white", fontSize: 24 }}>Playlist</Text>
            <View style={{ marginVertical: 20, minWidth: "90%" }}>
                <View style={{ borderBottomWidth: 1, borderBlockColor: "#555", width: "98%", height: 64, alignItems: "center", justifyContent: "flex-start", flexDirection: "row", gap: 20, paddingHorizontal: 10 }}>
                    <View style={{ borderRadius: 4, height: 50, width: 50, alignItems: "center", justifyContent: "center", backgroundColor: "#282828" }}>
                        <MaterialCommunityIcons name={"plus"} size={30} color={"white"} />
                    </View>
                    <Text style={{color:"white",fontWeight:"600"}}>Create New Playlist</Text>
                </View>
                <FlatList
                    data={Playlist_data}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity onPress={()=>handleNavigate(item)} style={{ borderBottomWidth: 1, borderBlockColor: "#555", width: "100%", height: 64, alignItems: "center", justifyContent: "space-between", flexDirection: "row", gap: 20, paddingHorizontal: 10 }}>
                                <View style={{ flexDirection: "row", gap: 20 }}>
                                    <View style={{  alignItems: "center", justifyContent: "center" }}>
                                        <Image source={{ uri: item.image }} style={{ width: 50, height: 50,borderRadius: 4, }} />
                                    </View>
                                    <View style={{ justifyContent: "flex-start", marginVertical: 6 }}>
                                        <Text style={{ color: "white", fontSize: 15 ,fontWeight:"600"}}>{item.title}</Text>
                                        <Text style={{ color: "white", fontSize: 13 }}>{item.songs.length} songs</Text>
                                    </View>
                                </View>
                                <TouchableOpacity>
                                    <MaterialCommunityIcons name={"arrow-right-circle"} size={30} color={"white"} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        </View>
    )
}

export default Playlist;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
})