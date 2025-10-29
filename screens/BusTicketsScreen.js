import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ImageBackground,
  ScrollView,
  FlatList,
  Keyboard,
  Platform,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import delhiBusStops from '../data/delhiBusStops';

// Get first 5 bus stops for the nearby stops section
const nearbyStops = delhiBusStops.slice(0, 5);

const { width, height } = Dimensions.get('window');

const DELHI_REGION = {
  latitude: 28.6139,
  longitude: 77.2090,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function BusTicketsScreen({ navigation }) {
  const mapRef = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [activeInput, setActiveInput] = useState('source'); // 'source' or 'destination'
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Handle location search
  const handleSearch = useCallback(() => {
    if (!searchText.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    const searchTerm = searchText.toLowerCase();
    const filtered = delhiBusStops.filter(stop => 
      stop.name.toLowerCase().includes(searchTerm) ||
      stop.routes.some(route => route.number.includes(searchTerm))
    );
    
    setSearchResults(filtered);
    setShowSearchResults(true);
    Keyboard.dismiss();
  }, [searchText]);

  // Handle location selection from search results
  const handleLocationSelect = (stop) => {
    const { name, lat: latitude, lng: longitude, routes } = stop;
    const newRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    const locationData = {
      name,
      address: `Buses: ${routes.map(r => r.number).join(', ')}`,
      ...newRegion,
      routes // Store routes for reference
    };

    if (activeInput === 'source') {
      setSource(locationData);
    } else {
      setDestination(locationData);
    }

    setSearchText('');
    setShowSearchResults(false);
    
    // Animate map to selected location
    mapRef.current.animateToRegion(newRegion, 1000);
  };

  // Toggle between source and destination input
  const toggleActiveInput = (inputType) => {
    setActiveInput(inputType);
    setSearchText('');
    setSearchResults([]);
    setShowSearchResults(false);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header with Search */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <View style={styles.inputWrapper}>
              <View style={styles.toggleButtons}>
                <TouchableOpacity 
                  style={[
                    styles.toggleButton, 
                    activeInput === 'source' && styles.activeToggleButton
                  ]}
                  onPress={() => toggleActiveInput('source')}
                >
                  <Text style={[
                    styles.toggleButtonText,
                    activeInput === 'source' && styles.activeToggleButtonText
                  ]}>
                    From
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.toggleButton, 
                    activeInput === 'destination' && styles.activeToggleButton
                  ]}
                  onPress={() => toggleActiveInput('destination')}
                >
                  <Text style={[
                    styles.toggleButtonText,
                    activeInput === 'destination' && styles.activeToggleButtonText
                  ]}>
                    To
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.searchInputWrapper}>
                <Ionicons 
                  name="search" 
                  size={20} 
                  color="#757575" 
                  style={styles.searchIcon} 
                />
                <TextInput
                  style={styles.searchInput}
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholder={`Search ${activeInput === 'source' ? 'boarding' : 'destination'} stop...`}
                  placeholderTextColor="#999"
                  onSubmitEditing={handleSearch}
                  returnKeyType="search"
                />
                {searchText.length > 0 && (
                  <TouchableOpacity 
                    onPress={() => {
                      setSearchText('');
                      setShowSearchResults(false);
                    }}
                    style={styles.searchActionIcon}
                  >
                    <Ionicons name="close-circle" size={20} color="#757575" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Map Section */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={DELHI_REGION}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={false}
          showsMyLocationButton={false}
        >
          {source && (
            <Marker coordinate={source}>
              <View style={styles.markerContainer}>
                <View style={[styles.markerPin, { backgroundColor: '#4CAF50' }]}>
                  <Text style={styles.markerText}>A</Text>
                </View>
              </View>
            </Marker>
          )}
          {destination && (
            <Marker coordinate={destination}>
              <View style={styles.markerContainer}>
                <View style={[styles.markerPin, { backgroundColor: '#F44336' }]}>
                  <Text style={styles.markerText}>B</Text>
                </View>
              </View>
            </Marker>
          )}
        </MapView>

        {/* Search Results */}
        {showSearchResults && searchResults.length > 0 && (
          <View style={styles.searchResults}>
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.searchResultItem}
                  onPress={() => handleLocationSelect(item)}
                >
                  <View style={styles.busStopIcon}>
                    <Ionicons name="bus" size={18} color="#fff" />
                  </View>
                  <View style={styles.resultTextContainer}>
                    <Text style={styles.resultTitle}>{item.name}</Text>
                    <View style={styles.routeContainer}>
                      {item.routes.slice(0, 3).map((route, idx) => (
                        <View key={idx} style={styles.routeTag}>
                          <Text style={styles.routeText}>{route.number}</Text>
                        </View>
                      ))}
                      {item.routes.length > 3 && (
                        <Text style={styles.moreRoutes}>+{item.routes.length - 3} more</Text>
                      )}
                    </View>
                  </View>
                  <Ionicons 
                    name="chevron-forward" 
                    size={20} 
                    color="#757575" 
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      {/* Bottom Panel */}
      <View style={styles.bottomPanel}>
        <View style={styles.panelHandle} />
        
        {source && destination ? (
          <View style={styles.directionsContainer}>
            <View style={styles.directionsHeader}>
              <Text style={styles.directionsTitle}>Directions</Text>
              <TouchableOpacity onPress={() => {
                setSource(null);
                setDestination(null);
              }}>
                <Text style={styles.clearButton}>Clear</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.directionsSteps}>
              <View style={styles.step}>
                <View style={[styles.stepIcon, { backgroundColor: '#4CAF50' }]}>
                  <Text style={styles.stepText}>A</Text>
                </View>
                <Text style={styles.stepText} numberOfLines={1}>
                  {source.name}
                </Text>
              </View>
              
              <View style={styles.stepDivider}>
                <View style={styles.dividerLine} />
              </View>
              
              <View style={styles.step}>
                <View style={[styles.stepIcon, { backgroundColor: '#F44336' }]}>
                  <Text style={styles.stepText}>B</Text>
                </View>
                <Text style={styles.stepText} numberOfLines={1}>
                  {destination.name}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.directionsButton}
              onPress={() => {
                navigation.navigate('BuyTickets');
              }}
            >
              <Text style={styles.directionsButtonText}>Buy Tickets</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.nearbyStopsContainer}>
            <Text style={styles.nearbyStopsTitle}>Nearby Stops</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.nearbyStopsList}
              style={styles.nearbyStopsScrollView}
            >
              {delhiBusStops.map((stop, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.stopCard}
                  onPress={() => {
                    const region = {
                      latitude: stop.latitude,
                      longitude: stop.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    };
                    mapRef.current.animateToRegion(region, 1000);
                  }}
                >
                  <View style={styles.stopIcon}>
                    <Ionicons name="bus" size={20} color="#fff" />
                  </View>
                  <Text style={styles.stopName} numberOfLines={1}>
                    {stop.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  searchContainer: {
    padding: 15,
    backgroundColor: 'transparent',
  },
  searchInputContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputWrapper: {
    marginBottom: 5,
  },
  toggleButtons: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 3,
    marginBottom: 10,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeToggleButton: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeToggleButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchActionIcon: {
    marginLeft: 10,
    padding: 4,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
    paddingRight: 10,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  searchResults: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 300,
    elevation: 4,
    zIndex: 1000,
    marginTop: 4,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  busStopIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E31837',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resultTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  resultTitle: {
    fontSize: 16,
    color: '#212121',
    fontWeight: '500',
    marginBottom: 4,
  },
  routeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  routeTag: {
    backgroundColor: '#E3F2FD',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 4,
  },
  routeText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '500',
  },
  moreRoutes: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 4,
  },
  noResultsContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    color: '#757575',
    fontSize: 16,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    maxHeight: height * 0.4,
  },
  panelHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
  nearbyStopsContainer: {
    flex: 1,
  },
  nearbyStopsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  nearbyStopsList: {
    paddingBottom: 10,
  },
  stopCard: {
    width: 120,
    marginRight: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  stopIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  stopName: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  directionsContainer: {
    flex: 1,
  },
  directionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  directionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  clearButton: {
    color: '#1E88E5',
    fontSize: 16,
    fontWeight: '500',
  },
  directionsSteps: {
    marginBottom: 20,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  stepDivider: {
    paddingLeft: 15,
    height: 20,
    justifyContent: 'center',
    marginBottom: 5,
  },
  dividerLine: {
    width: 2,
    height: '100%',
    backgroundColor: '#BDBDBD',
    marginLeft: 13,
  },
  directionsButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  directionsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerPin: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
