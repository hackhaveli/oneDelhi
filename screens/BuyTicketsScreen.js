import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import delhiRoutes from '../data/delhiRoutes';

const { width } = Dimensions.get('window');

export default function BuyTicketsScreen({ navigation, route }) {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedSourceStop, setSelectedSourceStop] = useState('');
  const [selectedDestinationStop, setSelectedDestinationStop] = useState('');
  const [busType, setBusType] = useState('Non-AC');
  const [ticketCount, setTicketCount] = useState(1);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [timer, setTimer] = useState(160); // 2:40 in seconds

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format timer
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Calculate amount
  const calculateAmount = () => {
    if (!selectedRoute) return 0;
    const fare = selectedRoute.fare[busType];
    return fare * ticketCount;
  };

  // Handle route selection
  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    setSelectedSourceStop('');
    setSelectedDestinationStop('');
    setShowRouteModal(false);
  };

  // Handle source stop selection
  const handleSourceStopSelect = (stop) => {
    setSelectedSourceStop(stop);
    setShowSourceModal(false);
  };

  // Handle destination stop selection
  const handleDestinationStopSelect = (stop) => {
    setSelectedDestinationStop(stop);
    setShowDestinationModal(false);
  };

  // Handle buy ticket
  const handleBuy = () => {
    if (!selectedRoute || !selectedSourceStop || !selectedDestinationStop) {
      alert('Please fill all required fields');
      return;
    }
    
    const amount = calculateAmount();
    
    // Navigate to CompletePayment screen with booking data
    navigation.navigate('CompletePayment', {
      routeNumber: selectedRoute.routeNumber,
      sourceStop: selectedSourceStop,
      destinationStop: selectedDestinationStop,
      busType: busType,
      ticketCount: ticketCount,
      totalAmount: amount,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E31837" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buy tickets</Text>
        <View style={styles.backButton} />
      </View>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <View style={styles.timerBox}>
          <Text style={styles.timerText}>Pay within {formatTimer(timer)}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Route Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Route Info</Text>
          
          {/* Current Route */}
          <TouchableOpacity 
            style={styles.inputField}
            onPress={() => setShowRouteModal(true)}
          >
            <MaterialCommunityIcons name="subway-variant" size={20} color="#333" />
            <Text style={[styles.inputText, !selectedRoute && styles.placeholderText]}>
              {selectedRoute ? selectedRoute.routeNumber : 'Current Route'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>

          <Text style={styles.sectionLabel}>From - To</Text>

          {/* Source Stop */}
          <TouchableOpacity 
            style={styles.inputField}
            onPress={() => {
              if (!selectedRoute) {
                alert('Please select a route first');
                return;
              }
              setShowSourceModal(true);
            }}
          >
            <View style={styles.stopIcon}>
              <View style={styles.stopDot} />
            </View>
            <Text style={[styles.inputText, !selectedSourceStop && styles.placeholderText]}>
              {selectedSourceStop || 'Source Stop'}
            </Text>
          </TouchableOpacity>

          {/* Destination Stop */}
          <TouchableOpacity 
            style={styles.inputField}
            onPress={() => {
              if (!selectedRoute) {
                alert('Please select a route first');
                return;
              }
              setShowDestinationModal(true);
            }}
          >
            <MaterialCommunityIcons name="map-marker" size={20} color="#333" />
            <Text style={[styles.inputText, !selectedDestinationStop && styles.placeholderText]}>
              {selectedDestinationStop || 'Destination Stop'}
            </Text>
          </TouchableOpacity>

          {/* Bus Type */}
          <Text style={styles.sectionLabel}>Bus Type</Text>
          <View style={styles.busTypeContainer}>
            <TouchableOpacity 
              style={[styles.busTypeButton, busType === 'AC' && styles.busTypeButtonActive]}
              onPress={() => setBusType('AC')}
              disabled={!selectedRoute || selectedRoute.fare.AC === 0}
            >
              <Text style={[styles.busTypeText, busType === 'AC' && styles.busTypeTextActive]}>
                AC
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.busTypeButton, busType === 'Non-AC' && styles.busTypeButtonActive]}
              onPress={() => setBusType('Non-AC')}
              disabled={!selectedRoute || selectedRoute.fare['Non-AC'] === 0}
            >
              <Text style={[styles.busTypeText, busType === 'Non-AC' && styles.busTypeTextActive]}>
                Non-AC
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Light section starts here */}
        <View style={styles.lightSection}>
          {/* Number of tickets */}
          <View style={styles.ticketCountSection}>
            <Text style={styles.ticketCountLabel}>Number of tickets</Text>
            <View style={styles.ticketCountContainer}>
              {[1, 2, 3].map((count) => (
                <TouchableOpacity
                  key={count}
                  style={[
                    styles.ticketCountButton,
                    ticketCount === count && styles.ticketCountButtonActive
                  ]}
                  onPress={() => setTicketCount(count)}
                >
                  <Text style={[
                    styles.ticketCountText,
                    ticketCount === count && styles.ticketCountTextActive
                  ]}>
                    {count}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Amount Payable */}
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Amount Payable</Text>
            <View style={styles.amountBox}>
              <Text style={styles.amountText}>₹{calculateAmount()}</Text>
            </View>
          </View>

          {/* Buy Button */}
          <TouchableOpacity 
            style={styles.buyButton}
            onPress={handleBuy}
          >
            <Text style={styles.buyButtonText}>BUY</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Route Selection Modal */}
      <Modal
        visible={showRouteModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRouteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Route</Text>
              <TouchableOpacity onPress={() => setShowRouteModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {delhiRoutes.map((route) => (
                <TouchableOpacity
                  key={route.id}
                  style={styles.routeItem}
                  onPress={() => handleRouteSelect(route)}
                >
                  <MaterialCommunityIcons name="bus" size={20} color="#333" />
                  <View style={styles.routeInfo}>
                    <Text style={styles.routeNumber}>{route.routeNumber}</Text>
                    <View style={styles.routeStops}>
                      <MaterialCommunityIcons name="map-marker-outline" size={14} color="#E31837" />
                      <Text style={styles.routeStopText}>{route.sourceStop}</Text>
                    </View>
                    <View style={styles.routeStops}>
                      <MaterialCommunityIcons name="map-marker" size={14} color="#E31837" />
                      <Text style={styles.routeStopText}>{route.destinationStop}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Source Stop Selection Modal */}
      <Modal
        visible={showSourceModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSourceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Source Stop</Text>
              <TouchableOpacity onPress={() => setShowSourceModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {selectedRoute && selectedRoute.stops.map((stop, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.stopItem}
                  onPress={() => handleSourceStopSelect(stop)}
                >
                  <Text style={styles.stopText}>{stop}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Destination Stop Selection Modal */}
      <Modal
        visible={showDestinationModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDestinationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Destination Stop</Text>
              <TouchableOpacity onPress={() => setShowDestinationModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {selectedRoute && selectedRoute.stops.map((stop, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.stopItem}
                  onPress={() => handleDestinationStopSelect(stop)}
                >
                  <Text style={styles.stopText}>{stop}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E31837',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#E31837',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  timerContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  timerBox: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 12,
  },
  inputText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    marginLeft: 10,
  },
  placeholderText: {
    color: '#999',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    marginBottom: 8,
  },
  stopIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#333',
  },
  busTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  busTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  busTypeButtonActive: {
    backgroundColor: '#E31837',
    borderColor: '#E31837',
  },
  busTypeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  busTypeTextActive: {
    color: '#fff',
  },
  ticketCountSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  ticketCountLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  ticketCountContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  ticketCountButton: {
    width: 60,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  ticketCountButtonActive: {
    backgroundColor: '#E31837',
    borderColor: '#E31837',
  },
  ticketCountText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  ticketCountTextActive: {
    color: '#fff',
  },
  amountSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  amountBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  amountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E31837',
  },
  lightSection: {
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  buyButton: {
    backgroundColor: '#E31837',
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalList: {
    padding: 16,
  },
  routeItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  routeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  routeNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  routeStops: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  routeStopText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  stopItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  stopText: {
    fontSize: 15,
    color: '#333',
  },
});
