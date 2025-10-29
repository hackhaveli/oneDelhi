import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

export default function PassDetailScreen({ navigation, route }) {
  const { pass } = route.params;
  const [showQR, setShowQR] = useState(false);

  // Check if pass is valid (within 1 hour of booking)
  const isPassValid = () => {
    const oneHourInMs = 60 * 60 * 1000;
    const currentTime = Date.now();
    const timeDifference = currentTime - pass.timestamp;
    return timeDifference < oneHourInMs && pass.status !== 'INVALID';
  };

  const passValid = isPassValid();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#D81B60" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Pass Card */}
        <View style={styles.passCard}>
          {/* Pink Top Line */}
          <View style={styles.pinkTopLine} />
          
          <Text style={styles.passTitle}>Transport Dept. of Delhi</Text>
          
          <View style={styles.passRow}>
            <Text style={styles.passId}>{pass.id}</Text>
            <Text style={styles.totalAmount}>₹0.0</Text>
          </View>

          <View style={styles.divider} />

          {/* Route and Fare */}
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Text style={styles.label}>Bus Route</Text>
              <Text style={styles.value}>{pass.routeNumber}</Text>
            </View>
            <View style={styles.infoRight}>
              <Text style={styles.labelRight}>Fare</Text>
              <Text style={styles.valueRight}>₹0.0</Text>
            </View>
          </View>

          {/* Booking Time and Passes */}
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Text style={styles.label}>Booking Time</Text>
              <Text style={styles.value}>{pass.date} | {pass.time}</Text>
            </View>
            <View style={styles.infoRight}>
              <Text style={styles.labelRight}>Bus Tickets</Text>
              <Text style={styles.valueRight}>{pass.passCount}</Text>
            </View>
          </View>

          {/* Starting Stop */}
          <View style={styles.stopSection}>
            <Text style={styles.label}>Starting stop</Text>
            <Text style={styles.stopName}>{pass.sourceStop}</Text>
          </View>

          {/* Ending Stop */}
          <View style={styles.stopSection}>
            <Text style={styles.label}>Ending stop</Text>
            <Text style={styles.stopName}>{pass.destinationStop}</Text>
          </View>

          {/* Transaction ID */}
          <Text style={styles.transactionId}>T{pass.timestamp}</Text>

          {/* Show QR Code Button */}
          {passValid ? (
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

          {/* Pass Type */}
          <Text style={styles.passType}>Single journey pass</Text>
        </View>

        {/* Status Message */}
        {!passValid && (
          <Text style={styles.expiredMessage}>
            This pass has expired (valid for 1 hour after booking)
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
                value={`PASS:${pass.id}:${pass.routeNumber}:${pass.timestamp}`}
                size={250}
                backgroundColor="white"
                color="black"
              />
            </View>
            
            <Text style={styles.qrSubtext}>Show this to the conductor</Text>
            <Text style={styles.freePassText}>FREE BUS PASS</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D81B60',
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
  passCard: {
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
  passTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  passRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  passId: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D81B60',
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
    backgroundColor: '#D81B60',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
    marginBottom: 12,
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
    marginBottom: 12,
  },
  invalidText: {
    color: '#E31837',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  passType: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
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
  freePassText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D81B60',
    marginTop: 12,
    letterSpacing: 1,
  },
});
