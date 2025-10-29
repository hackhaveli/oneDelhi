import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function TicketsScreen({ navigation }) {
  const [busTickets, setBusTickets] = useState([]);

  // Load tickets from storage
  const loadTickets = async () => {
    try {
      const tickets = await AsyncStorage.getItem('busTickets');
      if (tickets) {
        setBusTickets(JSON.parse(tickets));
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
    }
  };

  // Reload tickets when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadTickets();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Header Image */}
      <View style={styles.headerImageContainer}>
        <Image
          source={require('../assets/ticketsheader.jpeg')}
          style={styles.headerImage}
          resizeMode="cover"
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Ticket Type Cards */}
        <View style={styles.ticketTypesContainer}>
          <TouchableOpacity 
            style={styles.ticketCard}
            onPress={() => navigation.navigate('BuyTickets')}
          >
            <View style={styles.ticketIconContainer}>
              <MaterialCommunityIcons name="bus" size={40} color="#4CAF50" />
            </View>
            <Text style={styles.ticketCardTitle}>Bus</Text>
            <Text style={styles.ticketCardSubtitle}>Search & Book</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.ticketCard}>
            <View style={styles.ticketIconContainer}>
              <MaterialCommunityIcons name="ticket-percent" size={40} color="#FF1493" />
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>New</Text>
              </View>
            </View>
            <Text style={styles.ticketCardTitle}>Bus</Text>
            <Text style={styles.ticketCardSubtitle}>Passes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.ticketCard}>
            <View style={styles.ticketIconContainer}>
              <MaterialCommunityIcons name="subway-variant" size={40} color="#DC143C" />
            </View>
            <Text style={styles.ticketCardTitle}>Metro</Text>
            <Text style={styles.ticketCardSubtitle}>Ticket</Text>
          </TouchableOpacity>
        </View>

        {/* My Bus Ticket Section */}
        <View style={styles.ticketSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Bus Ticket</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View all tickets</Text>
            </TouchableOpacity>
          </View>
          {busTickets.length > 0 ? (
            <View style={styles.ticketsList}>
              {busTickets.slice(0, 3).map((ticket) => (
                <View key={ticket.id} style={styles.ticketItemCard}>
                  <View style={styles.ticketHeader}>
                    <Text style={styles.ticketRoute}>{ticket.routeNumber}</Text>
                    <View style={styles.pendingBadge}>
                      <Text style={styles.pendingText}>{ticket.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.ticketDateTime}>{ticket.date} {ticket.time}</Text>
                  <View style={styles.ticketRouteInfo}>
                    <Text style={styles.ticketStop} numberOfLines={1}>{ticket.sourceStop}</Text>
                    <MaterialCommunityIcons name="arrow-right" size={16} color="#666" />
                    <Text style={styles.ticketStop} numberOfLines={1}>{ticket.destinationStop}</Text>
                  </View>
                  <View style={styles.ticketFooter}>
                    <Text style={styles.ticketBusType}>{ticket.busType}</Text>
                    <Text style={styles.ticketPrice}>₹{ticket.totalAmount.toFixed(1)}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyTicketCard}>
              <Text style={styles.noTicketText}>No Tickets Available</Text>
            </View>
          )}
        </View>

        {/* My Metro Ticket Section */}
        <View style={styles.ticketSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Metro Ticket</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View all tickets</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.noTicketCard}>
            <Text style={styles.noTicketText}>No Ticket Available</Text>
          </View>
        </View>

        {/* My Bus Pass Section */}
        <View style={styles.ticketSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Bus Pass</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View all passes</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.clickToViewCard}>
            <Text style={styles.clickToViewText}>Click to View</Text>
          </View>
        </View>

        {/* Bottom spacing for navigation */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by IIIT-Delhi</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerImageContainer: {
    width: width,
    height: height * 0.20,
    backgroundColor: '#e0e0e0',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  ticketTypesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 20,
  },
  ticketCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    width: (width - 60) / 3,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  ticketIconContainer: {
    marginBottom: 8,
    position: 'relative',
  },
  newBadge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: '#FF4444',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  newBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  ticketCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  ticketCardSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  ticketSection: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  viewAllText: {
    fontSize: 14,
    color: '#999',
  },
  emptyTicketCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    height: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketsList: {
    gap: 12,
  },
  ticketItemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    position: 'relative',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketRoute: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  pendingBadge: {
    backgroundColor: 'rgba(227, 24, 55, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    transform: [{ rotate: '-5deg' }],
  },
  pendingText: {
    color: '#E31837',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  ticketDateTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  ticketRouteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  ticketStop: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  ticketBusType: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  ticketPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E31837',
  },
  noTicketCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  noTicketText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  clickToViewCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  clickToViewText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#c62828',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    elevation: 20,
  },
  footerText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});
