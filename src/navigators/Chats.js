import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ChatList from '../screens/ChatList';
import ChatMain from '../screens/ChatMain';
import ChatFriend from '../screens/ChatFriend';
import ProfileFriend from '../screens/ProfileFriend';
import MapsFriend from '../screens/MapsFriend';

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => console.log('OK!!!'), []);

  return (
    <Stack.Navigator
      headerMode="none"
      mode="modal"
      initialRouteName="chat-list">
      <Stack.Screen name="chat-list" component={ChatList} />
      <Stack.Screen name="chat-main" component={ChatMain} />
      <Stack.Screen name="chat-friend" component={ChatFriend} />
      <Stack.Screen name="profile-friend" component={ProfileFriend} />
      <Stack.Screen name="maps-friend" component={MapsFriend} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default App;
