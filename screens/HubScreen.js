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
import MapView, { Marker } from 'react-native-maps';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Sample data for charging stations and parking
const stations = [
  { id: 1, type: 'ev', name: 'EESL', address: 'NDMC Parking, Charak Palika Hospital', distance: '11.99 KM', available: '1/1', rate: '₹10 per unit', lat: 28.6139, lng: 77.2090 },
  { id: 2, type: 'ev', name: 'EESL', address: 'NDMC OUTSIDE', distance: '12.5 KM', available: '0/0', rate: '₹10 per unit', lat: 28.6289, lng: 77.2190 },
  { id: 3, type: 'parking', name: 'Parking', address: 'Connaught Place', distance: '5.2 KM', rate: '₹20/hr', lat: 28.6304, lng: 77.2177 },
  { id: 4, type: 'ev', name: 'Charging Point', address: 'Rajiv Chowk', distance: '6.1 KM', available: '2/3', rate: '₹12 per unit', lat: 28.6328, lng: 77.2197 },
];

export default function HubScreen() {
  const [selectedTab, setSelectedTab] = useState('ev');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStations = stations.filter(s => s.type === selectedTab);

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

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search 0+ charge points"
          placeholderTextColor="#BBB"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 28.6139,
            longitude: 77.2090,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {stations.map(station => (
            <Marker
              key={station.id}
              coordinate={{ latitude: station.lat, longitude: station.lng }}
            >
              <View style={styles.markerContainer}>
                <MaterialCommunityIcons
                  name={station.type === 'ev' ? 'ev-station' : 'parking'}
                  size={24}
                  color="white"
                />
              </View>
            </Marker>
          ))}
        </MapView>

        {/* Filter Icon */}
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options" size={24} color="#333" />
        </TouchableOpacity>

        {/* Location Button */}
        <TouchableOpacity style={styles.locationButton}>
          <Ionicons name="locate" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'ev' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('ev')}
        >
          <MaterialCommunityIcons
            name="ev-station"
            size={20}
            color={selectedTab === 'ev' ? 'white' : '#666'}
          />
          <Text style={[styles.tabText, selectedTab === 'ev' && styles.tabTextActive]}>
            EV Stations
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'parking' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('parking')}
        >
          <MaterialCommunityIcons
            name="parking"
            size={20}
            color={selectedTab === 'parking' ? 'white' : '#666'}
          />
          <Text style={[styles.tabText, selectedTab === 'parking' && styles.tabTextActive]}>
            Parking Spots
          </Text>
        </TouchableOpacity>
      </View>

      {/* Station List */}
      <ScrollView style={styles.stationList} showsVerticalScrollIndicator={false}>
        {filteredStations.map(station => (
          <View key={station.id} style={styles.stationCard}>
            <View style={styles.stationHeader}>
              <View style={styles.stationInfo}>
                <Text style={styles.stationName}>{station.name}</Text>
                {station.available && (
                  <View style={styles.availabilityBadge}>
                    <Text style={styles.availabilityText}>{station.available} AVAIL</Text>
                  </View>
                )}
                <Text style={styles.distanceText}>{station.distance}</Text>
              </View>
              <MaterialCommunityIcons name="store" size={24} color="#E31837" />
            </View>
            <Text style={styles.stationAddress}>{station.address}</Text>
            <View style={styles.stationFooter}>
              <View style={styles.rateContainer}>
                <Text style={styles.rateLabel}>
                  {station.type === 'ev' ? 'GB/DC' : 'Rate'}
                </Text>
                <Text style={styles.rateValue}>{station.rate}</Text>
              </View>
              <View style={styles.supportsContainer}>
                <Text style={styles.supportsLabel}>Supports:</Text>
                <MaterialCommunityIcons name="car" size={16} color="#666" />
              </View>
            </View>
          </View>
        ))}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  mapContainer: {
    height: 300,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    backgroundColor: '#2E7D32',
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'white',
  },
  filterButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  locationButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  tabButton: {
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
  tabButtonActive: {
    backgroundColor: '#E31837',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: 'white',
  },
  stationList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  stationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stationInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  availabilityBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  availabilityText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  distanceText: {
    fontSize: 12,
    color: '#E31837',
    fontWeight: '600',
  },
  stationAddress: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  stationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rateLabel: {
    fontSize: 12,
    color: '#666',
  },
  rateValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  supportsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  supportsLabel: {
    fontSize: 12,
    color: '#666',
  },
});
