import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TripPlanScreen() {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [selectedMode, setSelectedMode] = useState('bus');

  const transportModes = [
    { id: 'bus', name: 'Bus', icon: 'bus' },
    { id: 'metro', name: 'Metro', icon: 'train' },
    { id: 'parking', name: 'Parking', icon: 'car' },
    { id: 'auto', name: 'Auto', icon: 'car-side' },
    { id: 'bike', name: 'Bike', icon: 'bike' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9C1B31" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.spacer} />
        <Image
          source={require('../assets/oneDelhi.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Location Inputs */}
        <View style={styles.locationContainer}>
          {/* From Location */}
          <View style={styles.inputRow}>
            <View style={styles.iconContainer}>
              <View style={styles.locationDot} />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>My Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter starting location"
                placeholderTextColor="#999"
                value={fromLocation}
                onChangeText={setFromLocation}
              />
            </View>
            <TouchableOpacity style={styles.swapButton}>
              <Ionicons name="swap-vertical" size={20} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Connector Line */}
          <View style={styles.connectorLine} />

          {/* To Location */}
          <View style={styles.inputRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="location" size={20} color="#E31837" />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Destination Stop</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter destination"
                placeholderTextColor="#999"
                value={toLocation}
                onChangeText={setToLocation}
              />
            </View>
            <TouchableOpacity style={styles.timeButton}>
              <Ionicons name="time-outline" size={20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Transport Mode Selector */}
        <View style={styles.modeContainer}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              selectedMode === 'bus' && styles.modeButtonActive
            ]}
            onPress={() => setSelectedMode('bus')}
          >
            <MaterialCommunityIcons 
              name="bus" 
              size={24} 
              color={selectedMode === 'bus' ? 'white' : '#666'} 
            />
            <Text style={[
              styles.modeText,
              selectedMode === 'bus' && styles.modeTextActive
            ]}>Bus</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modeIconButton}
            onPress={() => setSelectedMode('metro')}
          >
            <MaterialCommunityIcons name="train" size={24} color="#666" />
            <View style={styles.parkingIndicator}>
              <Ionicons name="car" size={12} color="#666" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modeIconButton}
            onPress={() => setSelectedMode('bike')}
          >
            <MaterialCommunityIcons name="motorbike" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modeIconButton}
            onPress={() => setSelectedMode('car')}
          >
            <MaterialCommunityIcons name="car-side" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modeIconButton}
            onPress={() => setSelectedMode('bicycle')}
          >
            <MaterialCommunityIcons name="bike" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Recent Section */}
        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>Recent</Text>
          <View style={styles.emptyRecent}>
            <MaterialCommunityIcons name="map-marker-outline" size={48} color="#DDD" />
            <Text style={styles.emptyText}>No recent trips</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#9C1B31',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  spacer: {
    width: 32,
  },
  logo: {
 height: 58,
    width: 110,
       tintColor: '#fff'
    
  },
  settingsButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  locationContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#999',
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  input: {
    fontSize: 14,
    color: '#333',
    padding: 0,
  },
  swapButton: {
    padding: 8,
  },
  timeButton: {
    padding: 8,
  },
  connectorLine: {
    width: 2,
    height: 20,
    backgroundColor: '#DDD',
    marginLeft: 27,
    marginVertical: 4,
  },
  modeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  modeButtonActive: {
    backgroundColor: '#9C1B31',
  },
  modeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  modeTextActive: {
    color: 'white',
  },
  modeIconButton: {
    backgroundColor: 'white',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    position: 'relative',
  },
  parkingIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 2,
  },
  recentSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  recentTitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
    fontWeight: '600',
  },
  emptyRecent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  emptyText: {
    fontSize: 14,
    color: '#BBB',
    marginTop: 12,
  },
});
