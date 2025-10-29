import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function CompletePaymentPassScreen({ navigation, route }) {
  const bookingData = route?.params || {};
  const { routeNumber, sourceStop, destinationStop, passCount, totalAmount } = bookingData;
  const [timeLeft, setTimeLeft] = useState(164); // 2:44 in seconds

  // Countdown timer with redirect to home when expired
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Save as expired pass and redirect
          handleExpiredPass();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    return { date, time };
  };

  const handleExpiredPass = async () => {
    const { date, time } = getCurrentDateTime();
    
    try {
      // Create expired pass object
      const pass = {
        id: `DL1PD${Date.now().toString().slice(-4)}`,
        routeNumber: routeNumber || 'N/A',
        sourceStop: sourceStop || 'N/A',
        destinationStop: destinationStop || 'N/A',
        passCount: passCount || 1,
        totalAmount: 0,
        date: date,
        time: time,
        status: 'INVALID',
        timestamp: Date.now(),
      };

      // Save to storage
      const existingPasses = await AsyncStorage.getItem('busPasses');
      const passes = existingPasses ? JSON.parse(existingPasses) : [];
      passes.unshift(pass);
      await AsyncStorage.setItem('busPasses', JSON.stringify(passes));
    } catch (error) {
      console.error('Error saving expired pass:', error);
    }

    // Navigate to home
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  const handleGetPass = async () => {
    const { date, time } = getCurrentDateTime();
    
    try {
      // Create pass object (free pass)
      const pass = {
        id: `DL1PD${Date.now().toString().slice(-4)}`,
        routeNumber: routeNumber || 'N/A',
        sourceStop: sourceStop || 'N/A',
        destinationStop: destinationStop || 'N/A',
        passCount: passCount || 1,
        totalAmount: 0,
        date: date,
        time: time,
        status: 'VALID',
        timestamp: Date.now(),
      };

      // Get existing passes
      const existingPasses = await AsyncStorage.getItem('busPasses');
      const passes = existingPasses ? JSON.parse(existingPasses) : [];
      
      // Add new pass
      passes.unshift(pass);
      
      // Save passes
      await AsyncStorage.setItem('busPasses', JSON.stringify(passes));

      // Show success and navigate
      Alert.alert(
        'Success!',
        'Your free bus pass has been generated successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Main', { screen: 'Tickets' })
          }
        ]
      );
    } catch (error) {
      console.error('Error saving pass:', error);
      Alert.alert('Error', 'Failed to generate pass. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#D81B60" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Get Free Pass</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Pass Info Card */}
        <View style={styles.passCard}>
          <View style={styles.pinkTopLine} />
          
          <View style={styles.freePassBadge}>
            <MaterialCommunityIcons name="ticket-percent" size={20} color="#D81B60" />
            <Text style={styles.freeBadgeText}>FREE PASS</Text>
          </View>

          <View style={styles.routeInfo}>
            <View style={styles.routeHeader}>
              <Text style={styles.routeLabel}>Bus Route</Text>
              <Text style={styles.routeNumber}>{routeNumber}</Text>
            </View>

            <View style={styles.stopsContainer}>
              <View style={styles.stopRow}>
                <View style={styles.stopDot} />
                <View style={styles.stopInfo}>
                  <Text style={styles.stopLabel}>From</Text>
                  <Text style={styles.stopName}>{sourceStop}</Text>
                </View>
              </View>

              <View style={styles.connector} />

              <View style={styles.stopRow}>
                <Ionicons name="location" size={20} color="#D81B60" />
                <View style={styles.stopInfo}>
                  <Text style={styles.stopLabel}>To</Text>
                  <Text style={styles.stopName}>{destinationStop}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Passes</Text>
              <Text style={styles.detailValue}>{passCount}</Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Fare</Text>
              <Text style={[styles.detailValue, styles.freeText]}>₹0.0</Text>
            </View>
          </View>
        </View>

        {/* Info Message */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color="#D81B60" />
          <Text style={styles.infoText}>
            This pass is completely FREE and valid for single journey use within 1 hour.
          </Text>
        </View>
      </ScrollView>

      {/* Fixed Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Get Pass Button */}
        <TouchableOpacity style={styles.getPassButton} onPress={handleGetPass}>
          <Text style={styles.getPassButtonText}>GET FREE PASS</Text>
        </TouchableOpacity>

        {/* Timer Badge */}
        <View style={styles.timerBadge}>
          <Ionicons name="time-outline" size={16} color="#D81B60" />
          <Text style={styles.timerText}>Complete within {formatTime(timeLeft)}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#D81B60',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    padding: 20,
  },
  passCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  pinkTopLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#D81B60',
  },
  freePassBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#FCE4EC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 20,
    gap: 8,
  },
  freeBadgeText: {
    color: '#D81B60',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  routeInfo: {
    marginBottom: 16,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  routeLabel: {
    fontSize: 14,
    color: '#666',
  },
  routeNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D81B60',
  },
  stopsContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 16,
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stopDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#666',
  },
  stopInfo: {
    flex: 1,
  },
  stopLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  stopName: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  connector: {
    width: 2,
    height: 20,
    backgroundColor: '#DDD',
    marginLeft: 17,
    marginVertical: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  detailLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  freeText: {
    color: '#D81B60',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#FCE4EC',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  bottomSection: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  getPassButton: {
    backgroundColor: '#D81B60',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  getPassButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCE4EC',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
    gap: 8,
  },
  timerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D81B60',
  },
});
