import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { DashboardScreen } from './src/screens/DashboardScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />
      <DashboardScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#090d16',
  },
});
