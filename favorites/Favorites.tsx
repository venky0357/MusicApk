import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Favorites: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text>Favorites</Text>
        </View>
    )
}

export default Favorites;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        paddingHorizontal: 10,
        paddingVertical: 20
    },
})