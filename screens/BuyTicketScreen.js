import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function BuyTicketScreen({ navigation, route }) {
  const [selectedRoute, setSelectedRoute] = useState('Current Route');
  const [sourceStop, setSourceStop] = useState('Source Stop');
  const [destinationStop, setDestinationStop] = useState('Destination Stop');
  const [busType, setBusType] = useState('AC');
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [showRouteList, setShowRouteList] = useState(false);
  const [timeLeft, setTimeLeft] = useState(177); // 2:57 in seconds

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const routes = [
    { id: '539A', from: 'Safdurjung Terminal', to: 'NajafGarh Terminal' },
    { id: '966B', from: 'Sultanpuri Terminal', to: 'Nizamuddin Railway Station' },
    { id: 'CENTRALSECRETARIAT', from: 'Central Secretariat Metro St...', to: 'PM Sangrahalaya (In Gate)' },
    { id: '0405(NS)', from: 'Mori Gate Terminal', to: 'Badarpur Border (T)' },
    { id: '408', from: 'Raghubir Nagar F Block', to: 'Nizamuddin Railway Station' },
    { id: '926A', from: 'Tikri Border Metro Station', to: 'Peera Garhi Depot' },
  ];

  const basePrice = 10.0;
  const discount = 0.1; // 10% discount
  const totalPrice = basePrice * numberOfTickets;
  const discountedPrice = totalPrice * (1 - discount);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#c62828" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buy tickets</Text>
      </View>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>Pay within {formatTime(timeLeft)}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Route Info Card */}
        <View style={styles.routeCard}>
          <Text style={styles.cardTitle}>Route Info</Text>
          
          {/* Route Selector */}
          <TouchableOpacity 
            style={styles.routeSelector}
            onPress={() => setShowRouteList(!showRouteList)}
          >
            <MaterialCommunityIcons name="subway-variant" size={24} color="#333" />
            <Text style={styles.routeSelectorText}>{selectedRoute}</Text>
          </TouchableOpacity>

          {/* Route List */}
          {showRouteList && (
            <View style={styles.routeList}>
              {routes.map((route) => (
                <TouchableOpacity
                  key={route.id}
                  style={styles.routeItem}
                  onPress={() => {
                    setSelectedRoute(`${route.id}-${route.to.split(' ')[0]}`);
                    setSourceStop(route.from);
                    setDestinationStop(route.to);
                    setShowRouteList(false);
                  }}
                >
                  <View style={styles.routeItemHeader}>
                    <MaterialCommunityIcons name="bus" size={20} color="#333" />
                    <Text style={styles.routeId}>{route.id}</Text>
                  </View>
                  <View style={styles.routeStops}>
                    <View style={styles.stopItem}>
                      <MaterialCommunityIcons name="map-marker" size={16} color="#c62828" />
                      <Text style={styles.stopText}>{route.from}</Text>
                    </View>
                    <View style={styles.stopItem}>
                      <MaterialCommunityIcons name="map-marker" size={16} color="#c62828" />
                      <Text style={styles.stopText}>{route.to}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* From - To */}
          <Text style={styles.sectionLabel}>From - To</Text>
          
          <View style={styles.stopContainer}>
            <View style={styles.stopIcon}>
              <View style={styles.blackDot} />
            </View>
            <Text style={styles.stopText}>{sourceStop}</Text>
          </View>

          <View style={styles.stopContainer}>
            <View style={styles.stopIcon}>
              <MaterialCommunityIcons name="map-marker" size={24} color="#333" />
            </View>
            <Text style={styles.stopText}>{destinationStop}</Text>
          </View>

          {/* Bus Type */}
          <Text style={styles.sectionLabel}>Bus Type</Text>
          <View style={styles.busTypeContainer}>
            <TouchableOpacity
              style={[styles.busTypeButton, busType === 'AC' && styles.busTypeButtonActive]}
              onPress={() => setBusType('AC')}
            >
              <Text style={[styles.busTypeText, busType === 'AC' && styles.busTypeTextActive]}>
                AC
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.busTypeButton, busType === 'Non-AC' && styles.busTypeButtonActive]}
              onPress={() => setBusType('Non-AC')}
            >
              <Text style={[styles.busTypeText, busType === 'Non-AC' && styles.busTypeTextActive]}>
                Non-AC
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Number of Tickets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Number of tickets</Text>
          <View style={styles.ticketCountContainer}>
            {[1, 2, 3].map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.ticketCountButton,
                  numberOfTickets === num && styles.ticketCountButtonActive,
                ]}
                onPress={() => setNumberOfTickets(num)}
              >
                <Text
                  style={[
                    styles.ticketCountText,
                    numberOfTickets === num && styles.ticketCountTextActive,
                  ]}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Amount Payable */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amount Payable</Text>
          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Text style={styles.originalPrice}>₹{totalPrice.toFixed(1)}</Text>
              <Text style={styles.discountedPrice}>₹{discountedPrice.toFixed(1)}</Text>
            </View>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{(discount * 100).toFixed(1)}% off</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Buy Button */}
      <TouchableOpacity
        style={styles.buyButton}
        onPress={() => navigation.navigate('CompletePayment', {
          route: selectedRoute,
          from: sourceStop,
          to: destinationStop,
          tickets: numberOfTickets,
          price: discountedPrice,
          originalPrice: totalPrice,
        })}
      >
        <Text style={styles.buyButtonText}>BUY</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c62828',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  timerContainer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  timerText: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    backgroundColor: '#c62828',
    paddingHorizontal: 20,
  },
  routeCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  routeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#333',
  },
  routeSelectorText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
  routeList: {
    maxHeight: 300,
    marginBottom: 15,
  },
  routeItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  routeItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#1a1a1a',
  },
  routeStops: {
    marginLeft: 28,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  stopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  stopIcon: {
    marginRight: 15,
  },
  blackDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  stopText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  busTypeContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  busTypeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  busTypeButtonActive: {
    backgroundColor: '#c62828',
    borderColor: '#c62828',
  },
  busTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  busTypeTextActive: {
    color: 'white',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 15,
  },
  ticketCountContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  ticketCountButton: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketCountButtonActive: {
    backgroundColor: '#c62828',
    borderWidth: 2,
    borderColor: 'white',
  },
  ticketCountText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  ticketCountTextActive: {
    color: 'white',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  originalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  discountBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  discountText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buyButton: {
    backgroundColor: '#c62828',
    marginHorizontal: 20,
    marginVertical: 15,
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  buyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
