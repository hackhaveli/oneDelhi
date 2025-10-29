import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function CompletePaymentScreen({ navigation, route }) {
  const bookingData = route?.params || {};
  const { routeNumber, sourceStop, destinationStop, busType, ticketCount, totalAmount } = bookingData;
  const [timeLeft, setTimeLeft] = useState(164); // 2:44 in seconds

  // Countdown timer with redirect to home when expired
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          Alert.alert(
            'Time Expired',
            'Your booking time has expired. Please try again.',
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('Main', { screen: 'Bus' }),
              },
            ]
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigation]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString('default', { month: 'short' });
    const year = now.getFullYear();
    const time = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    return `${day} ${month}, ${year} | ${time}`;
  };

  const handlePayment = async () => {
    try {
      // Create ticket object
      const ticket = {
        id: Date.now().toString(),
        routeNumber: routeNumber || 'N/A',
        sourceStop: sourceStop || 'N/A',
        destinationStop: destinationStop || 'N/A',
        busType: busType || 'Non-AC',
        ticketCount: ticketCount || 1,
        totalAmount: totalAmount || 0,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        status: 'VALID',
        timestamp: Date.now(),
      };

      // Get existing tickets
      const existingTickets = await AsyncStorage.getItem('busTickets');
      const tickets = existingTickets ? JSON.parse(existingTickets) : [];
      
      // Add new ticket
      tickets.unshift(ticket);
      
      // Save to storage
      await AsyncStorage.setItem('busTickets', JSON.stringify(tickets));

      Alert.alert(
        'Payment Successful',
        'Your ticket has been booked successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Main', { screen: 'Tickets' }),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving ticket:', error);
      Alert.alert('Error', 'Failed to save ticket. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E31837" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complete Payment</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Ticket Info Card */}
        <View style={styles.ticketCard}>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.dateTimeText}>{getCurrentDateTime()}</Text>
          </View>

          <View style={styles.ticketInfo}>
            <View style={styles.routeHeader}>
              <MaterialCommunityIcons name="bus" size={20} color="#1a1a1a" />
              <Text style={styles.routeText}>{routeNumber || 'N/A'}</Text>
            </View>
            
            <View style={styles.priceInfo}>
              <Text style={styles.priceLabel}>₹{(totalAmount / ticketCount || 0).toFixed(1)} x {ticketCount || 1} = </Text>
              <Text style={styles.priceValue}>₹{(totalAmount || 0).toFixed(1)}</Text>
            </View>
          </View>

          <View style={styles.routeDetails}>
            <View style={styles.locationRow}>
              <Text style={styles.locationText}>{sourceStop || 'Source'}</Text>
              <Ionicons name="arrow-forward" size={20} color="#666" />
              <Text style={styles.locationText}>{destinationStop || 'Destination'}</Text>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>UPI</Text>
          <View style={styles.upiContainer}>
            <Text style={styles.noUpiText}>No supported UPI apps found in your device</Text>
          </View>
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Others</Text>
          <TouchableOpacity 
            style={styles.paymentOption}
            onPress={handlePayment}
          >
            <View style={styles.paymentOptionLeft}>
              <MaterialCommunityIcons name="credit-card" size={24} color="#E31837" />
              <Text style={styles.paymentOptionText}>Wallet, Cards or Net banking</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Pay Button */}
      <View style={styles.payBar}>
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Pay</Text>
        </TouchableOpacity>
      </View>

      {/* Timer at Bottom */}
      <View style={styles.timerContainer}>
        <View style={styles.timerBadge}>
          <Text style={styles.timerText}>Pay within {formatTime(timeLeft)}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#E31837',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  ticketCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateTimeContainer: {
    backgroundColor: '#808080',
    padding: 15,
  },
  dateTimeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  ticketInfo: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#1a1a1a',
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  routeDetails: {
    padding: 15,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationText: {
    fontSize: 14,
    color: '#1a1a1a',
    flex: 1,
  },
  paymentSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  upiContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  noUpiText: {
    fontSize: 14,
    color: '#999',
  },
  paymentOption: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentOptionText: {
    fontSize: 16,
    color: '#1a1a1a',
    marginLeft: 15,
  },
  timerContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  timerBadge: {
    backgroundColor: '#E31837',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  timerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  payBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 70,
    paddingHorizontal: 20,
  },
  payButton: {
    backgroundColor: '#E31837',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
