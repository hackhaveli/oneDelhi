import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  TextInput,
  Image,
  ImageBackground,
  Animated,
  PanResponder
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

// Sample data for nearby stops
const nearbyStops = [
  { id: 1, name: 'Kashmere Gate ISBT', distance: '0.5 km', buses: 12 },
  { id: 2, name: 'Red Fort', distance: '1.2 km', buses: 8 },
  { id: 3, name: 'Chandni Chowk', distance: '1.5 km', buses: 15 },
  { id: 4, name: 'Connaught Place', distance: '2.1 km', buses: 10 },
];

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  // Static location for C.R. Park, Delhi
  const [region] = useState({
    latitude: 28.5413,
    longitude: 77.2390,
    latitudeDelta: 0.02,  // Zoomed in more for better view
    longitudeDelta: 0.02 * (width / height),
  });

  // Animation for bottom sheet
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        // Only allow dragging up
        if (gestureState.dy < 0) {
          Animated.event([null, { dy: pan.y }], { useNativeDriver: false })(_, gestureState);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // Snap to top or bottom based on gesture
        if (gestureState.dy < -50) {
          // Snap to top
          Animated.spring(pan, {
            toValue: { x: 0, y: -300 },
            useNativeDriver: true,
          }).start();
        } else {
          // Snap to bottom
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E31837" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBgWrapper}>
          <ImageBackground
            source={require('../assets/background.png')}
            resizeMode="cover"
            style={styles.headerBg}
          >
            <View style={styles.headerTop}>
              <Image
                source={require('../assets/oneDelhi.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <TouchableOpacity style={styles.settingsBtn}>
                <MaterialCommunityIcons name="cog" size={22} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <MaterialCommunityIcons name="magnify" size={20} color="#fff" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search 500+ Route"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#f1f1f1"
              />
              <TouchableOpacity style={styles.notificationButton}>
                <MaterialCommunityIcons name="bell-outline" size={22} color="#FFA726" />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </View>

      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
          zoomTapEnabled={false}
        >
          {/* Add markers for nearby stops */}
          {nearbyStops.map((stop, index) => (
            <Marker
              key={stop.id}
              coordinate={{
                latitude: region.latitude + (index * 0.002 - 0.003), // Spread out markers
                longitude: region.longitude + (index * 0.002 - 0.003),
              }}
              title={stop.name}
              description={`${stop.distance} • ${stop.buses} buses`}
            >
              <View style={styles.mapMarker}>
                <MaterialCommunityIcons name="bus-stop" size={24} color="#fff" />
              </View>
            </Marker>
          ))}
        </MapView>
      </View>

      {/* Bottom Sheet - Nearby Stops */}
      <Animated.View 
        style={[
          styles.bottomSheet,
          {
            transform: [{ translateY: pan.y }]
          }
        ]}
        {...panResponder.panHandlers}
      >
        {/* Drag Handle */}
        <View style={styles.dragHandle}>
          <View style={styles.dragHandleBar} />
        </View>
        
        <View style={styles.bottomSheetHeader}>
          <Text style={styles.bottomSheetTitle}>Nearby Stops</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.stopsContainer}
          showsVerticalScrollIndicator={false}
        >
          {nearbyStops.map(stop => (
            <TouchableOpacity key={stop.id} style={styles.stopItem}>
              <View style={styles.stopIcon}>
                <MaterialCommunityIcons name="bus-stop" size={20} color="#fff" />
              </View>
              <View style={styles.stopInfo}>
                <Text style={styles.stopName}>{stop.name}</Text>
                <Text style={styles.stopDetails}>
                  {stop.distance} • {stop.buses} buses
                </Text>
              </View>
              <MaterialCommunityIcons 
                name="chevron-right" 
                size={24} 
                color="#9e9e9e" 
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by IIIT-Delhi</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Header styles
  header: {
    backgroundColor: 'transparent',
  },
  headerBgWrapper: {
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerBg: {
    paddingTop: StatusBar.currentHeight + 6,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  headerTop: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsBtn: {
    position: 'absolute',
    right: 8,
    top: 8,
    padding: 6,
  },
  logoImage: {
    height: 58,
    width: 110,
       tintColor: '#fff'
    
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 24,
    paddingHorizontal: 12,
    height: 44,
    marginHorizontal: 8,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#fff',
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',

    marginLeft: 8,
  },
  
  // Map styles
  mapContainer: {
    height: '45%',
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapMarker: {
    backgroundColor: '#E31837',
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Bottom sheet styles
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    elevation: 5,
  },
  dragHandle: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dragHandleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  
  // Stop item styles
  stopsContainer: {
    flex: 1,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  stopIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E31837',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stopInfo: {
    flex: 1,
  },
  stopName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  stopDetails: {
    fontSize: 13,
    color: '#666',
  },
  
  // Footer styles
  footer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
  },
  
  // Utility
  seeAll: {
    color: '#E31837',
    fontSize: 14,
    fontWeight: '500',
  },
});
