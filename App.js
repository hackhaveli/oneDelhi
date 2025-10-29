import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import BuyTicketScreen from './screens/BuyTicketScreen';
import CompletePaymentScreen from './screens/CompletePaymentScreen';
import BusTicketsScreen from './screens/BusTicketsScreen';
import BuyTicketsScreen from './screens/BuyTicketsScreen';
import TicketDetailScreen from './screens/TicketDetailScreen';
import AllTicketsScreen from './screens/AllTicketsScreen';
import BuyPassesScreen from './screens/BuyPassesScreen';
import CompletePaymentPassScreen from './screens/CompletePaymentPassScreen';
import PassDetailScreen from './screens/PassDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={BottomTabNavigator} />
        <Stack.Screen name="BuyTicket" component={BuyTicketScreen} />
        <Stack.Screen name="CompletePayment" component={CompletePaymentScreen} />
        <Stack.Screen name="BusTickets" component={BusTicketsScreen} />
        <Stack.Screen name="BuyTickets" component={BuyTicketsScreen} />
        <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
        <Stack.Screen name="AllTickets" component={AllTicketsScreen} />
        <Stack.Screen name="BuyPasses" component={BuyPassesScreen} />
        <Stack.Screen name="CompletePaymentPass" component={CompletePaymentPassScreen} />
        <Stack.Screen name="PassDetail" component={PassDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
