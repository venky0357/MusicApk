import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const RecentlyAdded:React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>RecentlyAdded</Text>
    </View>
  )
}

export default RecentlyAdded
const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: "#121212",
      paddingHorizontal:10,
      paddingVertical:20
    },
  })