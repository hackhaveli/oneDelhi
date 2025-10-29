import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

export default function TicketDetailScreen({ navigation, route }) {
  const { ticket } = route.params;
  const [showQR, setShowQR] = useState(false);

  // Check if ticket is valid (within 1 hour of booking)
  const isTicketValid = () => {
    const oneHourInMs = 60 * 60 * 1000;
    const currentTime = Date.now();
    const timeDifference = currentTime - ticket.timestamp;
    return timeDifference < oneHourInMs && ticket.status !== 'INVALID';
  };

  const ticketValid = isTicketValid();
  const backgroundColor = ticketValid ? '#FF6B35' : '#E31837';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Ticket Card */}
        <View style={styles.ticketCard}>
          <Text style={styles.ticketTitle}>Transport Dept. of Delhi</Text>
          
          <View style={styles.ticketRow}>
            <Text style={styles.ticketId}>{ticket.id}</Text>
            <Text style={styles.totalAmount}>₹{ticket.totalAmount.toFixed(1)}</Text>
          </View>

          <View style={styles.divider} />

          {/* Route and Fare */}
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Text style={styles.label}>Bus Route</Text>
              <Text style={styles.value}>{ticket.routeNumber}</Text>
            </View>
            <View style={styles.infoRight}>
              <Text style={styles.labelRight}>Fare</Text>
              <Text style={styles.valueRight}>₹{(ticket.totalAmount / ticket.ticketCount).toFixed(1)}</Text>
            </View>
          </View>

          {/* Booking Time and Tickets */}
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Text style={styles.label}>Booking Time</Text>
              <Text style={styles.value}>{ticket.date} | {ticket.time}</Text>
            </View>
            <View style={styles.infoRight}>
              <Text style={styles.labelRight}>Bus Tickets</Text>
              <Text style={styles.valueRight}>{ticket.ticketCount}</Text>
            </View>
          </View>

          {/* Starting Stop */}
          <View style={styles.stopSection}>
            <Text style={styles.label}>Starting stop</Text>
            <Text style={styles.stopName}>{ticket.sourceStop}</Text>
          </View>

          {/* Ending Stop */}
          <View style={styles.stopSection}>
            <Text style={styles.label}>Ending stop</Text>
            <Text style={styles.stopName}>{ticket.destinationStop}</Text>
          </View>

          {/* Transaction ID */}
          <Text style={styles.transactionId}>T{ticket.timestamp}</Text>

          {/* Show QR Code Button */}
          {ticketValid ? (
            <TouchableOpacity 
              style={styles.qrButton}
              onPress={() => setShowQR(true)}
            >
              <MaterialCommunityIcons name="qrcode" size={24} color="white" />
              <Text style={styles.qrButtonText}>Show QR code</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.invalidBadge}>
              <Text style={styles.invalidText}>INVALID</Text>
            </View>
          )}
        </View>

        {/* Status Message */}
        {!ticketValid && (
          <Text style={styles.expiredMessage}>
            This ticket has expired (valid for 1 hour after booking)
          </Text>
        )}
      </ScrollView>

      {/* QR Code Modal */}
      <Modal
        visible={showQR}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowQR(false)}
      >
        <View style={styles.qrModalOverlay}>
          <View style={styles.qrModalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowQR(false)}
            >
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
            
            <Text style={styles.qrTitle}>Scan QR Code</Text>
            
            <View style={styles.qrContainer}>
              <QRCode
                value={`TICKET:${ticket.id}:${ticket.routeNumber}:${ticket.timestamp}`}
                size={250}
                backgroundColor="white"
                color="black"
              />
            </View>
            
            <Text style={styles.qrSubtext}>Show this to the conductor</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  ticketCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketId: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#DDD',
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoLeft: {
    flex: 1,
  },
  infoRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  labelRight: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
    textAlign: 'right',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  valueRight: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'right',
  },
  stopSection: {
    marginBottom: 16,
  },
  stopName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginTop: 4,
  },
  transactionId: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    marginVertical: 12,
    letterSpacing: 0.5,
  },
  qrButton: {
    backgroundColor: '#FF6B35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  qrButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  invalidBadge: {
    backgroundColor: '#FDD',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E31837',
  },
  invalidText: {
    color: '#E31837',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  expiredMessage: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
  qrModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrModalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '85%',
    maxWidth: 350,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    marginTop: 8,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  qrSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
});
