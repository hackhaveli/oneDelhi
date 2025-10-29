import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const faqData = {
  general: [
    { id: 1, question: 'ETM Related issue' },
  ],
  driver: [
    { id: 2, question: 'Rash Driving' },
    { id: 3, question: 'Not stopping the bus at stop' },
    { id: 4, question: 'Driving the bus slow or fast' },
    { id: 5, question: 'Late arrival or departure of the Bus' },
    { id: 6, question: 'Wrong route' },
    { id: 7, question: 'Driver not allowed Ladies/Sr. Citizens to board from the front gate' },
    { id: 8, question: 'Driver misbehave' },
  ],
  conductor: [
    { id: 9, question: 'The conductor refused to give a complaint book' },
    { id: 10, question: 'Conductor misbehave' },
    { id: 11, question: 'Conductor not issuing the ticket after taking money' },
  ],
};

export default function HelpScreen() {
  const [activeTab, setActiveTab] = useState('FAQs');
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

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

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'FAQs' && styles.tabActive]}
          onPress={() => setActiveTab('FAQs')}
        >
          <Text style={[styles.tabText, activeTab === 'FAQs' && styles.tabTextActive]}>
            FAQs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Complaints' && styles.tabActive]}
          onPress={() => setActiveTab('Complaints')}
        >
          <Text style={[styles.tabText, activeTab === 'Complaints' && styles.tabTextActive]}>
            My Complaints
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* FAQs Section */}
        <Text style={styles.sectionTitle}>FAQs</Text>

        {/* General */}
        <View style={styles.category}>
          <Text style={styles.categoryTitle}>General</Text>
          {faqData.general.map(faq => (
            <TouchableOpacity
              key={faq.id}
              style={styles.faqItem}
              onPress={() => toggleExpand(faq.id)}
            >
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <View style={styles.expandIcon}>
                <Ionicons name="add-circle-outline" size={24} color="#666" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Driver */}
        <View style={styles.category}>
          <Text style={styles.categoryTitle}>Driver</Text>
          {faqData.driver.map(faq => (
            <TouchableOpacity
              key={faq.id}
              style={styles.faqItem}
              onPress={() => toggleExpand(faq.id)}
            >
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <View style={styles.expandIcon}>
                <Ionicons name="add-circle-outline" size={24} color="#666" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Conductor */}
        <View style={styles.category}>
          <Text style={styles.categoryTitle}>Conductor</Text>
          {faqData.conductor.map(faq => (
            <TouchableOpacity
              key={faq.id}
              style={styles.faqItem}
              onPress={() => toggleExpand(faq.id)}
            >
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <View style={styles.expandIcon}>
                <Ionicons name="add-circle-outline" size={24} color="#666" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Can't find what you're looking for */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Can't find what you're looking for?</Text>
          <TouchableOpacity style={styles.complaintButton}>
            <Text style={styles.complaintButtonText}>Raise New Complaint</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: '#E31837',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  tabTextActive: {
    color: '#333',
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  category: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E31837',
    marginBottom: 12,
  },
  faqItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  expandIcon: {
    marginLeft: 12,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  complaintButton: {
    backgroundColor: '#E31837',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  complaintButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
