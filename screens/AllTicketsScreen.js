import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function AllTicketsScreen({ navigation }) {
  const [busTickets, setBusTickets] = useState([]);

  // Check if ticket is valid (within 1 hour)
  const isTicketValid = (ticket) => {
    const oneHourInMs = 60 * 60 * 1000;
    const currentTime = Date.now();
    const timeDifference = currentTime - ticket.timestamp;
    return timeDifference < oneHourInMs;
  };

  // Load tickets from storage and update status
  const loadTickets = async () => {
    try {
      const tickets = await AsyncStorage.getItem('busTickets');
      if (tickets) {
        const parsedTickets = JSON.parse(tickets);
        // Update ticket status based on time
        const updatedTickets = parsedTickets.map(ticket => {
          if (ticket.status === 'VALID' && !isTicketValid(ticket)) {
            return { ...ticket, status: 'INVALID' };
          }
          return ticket;
        });
        // Save updated tickets back to storage
        await AsyncStorage.setItem('busTickets', JSON.stringify(updatedTickets));
        setBusTickets(updatedTickets);
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

  // Get border color based on ticket status
  const getBorderColor = (ticket) => {
    if (ticket.status === 'INVALID') {
      return '#FF6B35'; // Orange/Red for invalid
    }
    return '#4FC3F7'; // Blue for valid
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Bus Tickets</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {busTickets.length > 0 ? (
          busTickets.map((ticket) => (
            <TouchableOpacity
              key={ticket.id}
              style={[
                styles.ticketCard,
                { borderLeftColor: getBorderColor(ticket) }
              ]}
              onPress={() => navigation.navigate('TicketDetail', { ticket })}
              activeOpacity={0.7}
            >
              <View style={styles.ticketHeader}>
                <Text style={styles.routeNumber}>{ticket.routeNumber}</Text>
                <Text style={styles.amount}>₹{ticket.totalAmount.toFixed(1)}</Text>
              </View>
              
              <View style={styles.ticketRow}>
                <Text style={styles.dateTime}>{ticket.date} | {ticket.time}</Text>
                <Text style={styles.ticketCount}>x {ticket.ticketCount}</Text>
              </View>

              <View style={styles.routeInfo}>
                <Text style={styles.stopName} numberOfLines={1}>{ticket.sourceStop}</Text>
                <MaterialCommunityIcons name="arrow-right" size={16} color="#666" />
                <Text style={styles.stopName} numberOfLines={1}>{ticket.destinationStop}</Text>
              </View>

              <View style={styles.ticketFooter}>
                <Text style={styles.fare}>₹{(ticket.totalAmount / ticket.ticketCount).toFixed(1)}</Text>
                <Text style={styles.transactionId}>T{ticket.timestamp}</Text>
              </View>

              {/* Show INVALID stamp only for expired tickets */}
              {ticket.status === 'INVALID' && (
                <View style={styles.invalidStamp}>
                  <Text style={styles.invalidStampText}>INVALID</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="ticket-outline" size={64} color="#CCC" />
            <Text style={styles.emptyText}>No Tickets Available</Text>
            <Text style={styles.emptySubtext}>Book your first bus ticket to see it here</Text>
          </View>
        )}
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  ticketCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
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
  routeNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateTime: {
    fontSize: 12,
    color: '#666',
  },
  ticketCount: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  stopName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  fare: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  transactionId: {
    fontSize: 10,
    color: '#BBB',
    letterSpacing: 0.5,
  },
  invalidStamp: {
    position: 'absolute',
    top: '35%',
    right: '25%',
    transform: [{ rotate: '-15deg' }],
    backgroundColor: 'rgba(227, 24, 55, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#E31837',
  },
  invalidStampText: {
    color: '#E31837',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#BBB',
    marginTop: 8,
  },
});
