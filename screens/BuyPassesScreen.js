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

export default function BuyPassesScreen({ navigation, route }) {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedSourceStop, setSelectedSourceStop] = useState('');
  const [selectedDestinationStop, setSelectedDestinationStop] = useState('');
  const [numberOfPasses, setNumberOfPasses] = useState(1);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showDestModal, setShowDestModal] = useState(false);

  useEffect(() => {
    if (route.params?.selectedRoute) {
      const routeData = delhiRoutes.find(r => r.number === route.params.selectedRoute);
      if (routeData) {
        setSelectedRoute(routeData);
      }
    }
  }, [route.params]);

  const handleBuy = () => {
    if (!selectedRoute || !selectedSourceStop || !selectedDestinationStop) {
      alert('Please select route and stops');
      return;
    }

    navigation.navigate('CompletePaymentPass', {
      routeNumber: selectedRoute.number,
      sourceStop: selectedSourceStop,
      destinationStop: selectedDestinationStop,
      passCount: numberOfPasses,
      totalAmount: 0, // Passes are free
      originalPrice: 0
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#D81B60" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buy Bus Pass</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top Section with Pink Background */}
        <View style={styles.topSection}>
          <View style={styles.pinkBadge}>
            <Text style={styles.badgeText}>FREE PASS</Text>
          </View>
          
          {/* Route Selection */}
          <TouchableOpacity
            style={styles.selectionButton}
            onPress={() => setShowRouteModal(true)}
          >
            <Text style={styles.selectionLabel}>Select Bus Route</Text>
            <Text style={styles.selectionValue}>
              {selectedRoute ? selectedRoute.number : 'Choose Route'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          {/* Source Stop */}
          <View style={styles.stopSection}>
            <Text style={styles.sectionTitle}>Source Stop</Text>
            <TouchableOpacity
              style={styles.stopButton}
              onPress={() => setShowSourceModal(true)}
              disabled={!selectedRoute}
            >
              <View style={styles.stopIconContainer}>
                <View style={styles.stopDot} />
              </View>
              <Text style={[styles.stopText, !selectedRoute && styles.disabledText]}>
                {selectedSourceStop || 'Select Source Stop'}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Destination Stop */}
          <View style={styles.stopSection}>
            <Text style={styles.sectionTitle}>Destination Stop</Text>
            <TouchableOpacity
              style={styles.stopButton}
              onPress={() => setShowDestModal(true)}
              disabled={!selectedRoute}
            >
              <View style={styles.stopIconContainer}>
                <Ionicons name="location" size={20} color="#D81B60" />
              </View>
              <Text style={[styles.stopText, !selectedRoute && styles.disabledText]}>
                {selectedDestinationStop || 'Select Destination Stop'}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Number of Passes */}
          <View style={styles.passCountSection}>
            <Text style={styles.sectionTitle}>Number of passes</Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setNumberOfPasses(Math.max(1, numberOfPasses - 1))}
              >
                <Ionicons name="remove" size={20} color="#D81B60" />
              </TouchableOpacity>
              <Text style={styles.counterText}>{numberOfPasses}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setNumberOfPasses(Math.min(10, numberOfPasses + 1))}
              >
                <Ionicons name="add" size={20} color="#D81B60" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Free Pass Info */}
          <View style={styles.freePassInfo}>
            <MaterialCommunityIcons name="ticket-percent" size={24} color="#D81B60" />
            <Text style={styles.freePassText}>Bus passes are completely FREE!</Text>
          </View>

          {/* Summary */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Passes</Text>
              <Text style={styles.summaryValue}>{numberOfPasses}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹0.0</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Buy Button */}
      <TouchableOpacity style={styles.buyButton} onPress={handleBuy}>
        <Text style={styles.buyButtonText}>GET FREE PASS</Text>
      </TouchableOpacity>

      {/* Route Modal */}
      <Modal
        visible={showRouteModal}
        animationType="slide"
        transparent={true}
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
            <ScrollView>
              {delhiRoutes.map(route => (
                <TouchableOpacity
                  key={route.number}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedRoute(route);
                    setSelectedSourceStop('');
                    setSelectedDestinationStop('');
                    setShowRouteModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{route.number}</Text>
                  <Text style={styles.modalItemSubtext}>{route.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Source Stop Modal */}
      <Modal
        visible={showSourceModal}
        animationType="slide"
        transparent={true}
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
            <ScrollView>
              {selectedRoute?.stops.map((stop, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedSourceStop(stop);
                    setShowSourceModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{stop}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Destination Stop Modal */}
      <Modal
        visible={showDestModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDestModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Destination Stop</Text>
              <TouchableOpacity onPress={() => setShowDestModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {selectedRoute?.stops.map((stop, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedDestinationStop(stop);
                    setShowDestModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{stop}</Text>
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
  topSection: {
    backgroundColor: '#D81B60',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  pinkBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  badgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  selectionButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectionLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    position: 'absolute',
    top: 8,
    left: 16,
  },
  selectionValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginTop: 12,
  },
  bottomSection: {
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    padding: 20,
  },
  stopSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  stopButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  stopIconContainer: {
    width: 24,
    marginRight: 12,
    alignItems: 'center',
  },
  stopDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#666',
  },
  stopText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  disabledText: {
    color: '#999',
  },
  passCountSection: {
    marginBottom: 20,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FCE4EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 40,
  },
  freePassInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCE4EC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  freePassText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#D81B60',
  },
  summary: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D81B60',
  },
  buyButton: {
    backgroundColor: '#D81B60',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  modalItemSubtext: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
});
