import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QuoteCard from '../components/QuoteCard';
import AddQuoteModal from '../components/AddQuoteModal';
import { STOIC_QUOTES } from '../data/quotes';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const STORAGE_KEY = '@stoic_custom_quotes';
const BATCH_SIZE = 10;

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildFeed(stoicQuotes, customQuotes, batchIndex) {
  const rand = seededRandom(batchIndex * 1337 + 42);
  const pool = [...stoicQuotes];
  const shuffled = pool.sort(() => rand() - 0.5);
  const batch = shuffled.slice(0, BATCH_SIZE);

  if (customQuotes.length === 0) return batch;

  const result = [...batch];
  const insertCount = Math.max(1, Math.floor(BATCH_SIZE * 0.3));

  for (let i = 0; i < insertCount; i++) {
    const quote = customQuotes[Math.floor(rand() * customQuotes.length)];
    const pos = Math.floor(rand() * (result.length + 1));
    result.splice(pos, 0, { ...quote, _insertId: `${batchIndex}-${i}` });
  }

  return result;
}

export default function HomeScreen() {
  const [feed, setFeed] = useState([]);
  const [customQuotes, setCustomQuotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [batchIndex, setBatchIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadCustomQuotes();
  }, []);

  useEffect(() => {
    const initial = buildFeed(STOIC_QUOTES, customQuotes, 0);
    setFeed(initial.map((q, i) => ({ ...q, _feedId: `${i}-${q.id || q._insertId || i}` })));
    setBatchIndex(1);
  }, [customQuotes]);

  const loadCustomQuotes = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCustomQuotes(JSON.parse(stored));
      }
    } catch {
      // ignore storage errors
    }
  };

  const saveCustomQuote = async (quoteData) => {
    const newQuote = {
      id: `custom_${Date.now()}`,
      text: quoteData.text,
      author: quoteData.author,
      isCustom: true,
    };
    const updated = [...customQuotes, newQuote];
    setCustomQuotes(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }
  };

  const loadMore = useCallback(() => {
    const newBatch = buildFeed(STOIC_QUOTES, customQuotes, batchIndex);
    const newItems = newBatch.map((q, i) => ({
      ...q,
      _feedId: `${batchIndex}-${i}-${q.id || q._insertId || i}`,
    }));
    setFeed((prev) => [...prev, ...newItems]);
    setBatchIndex((prev) => prev + 1);
  }, [batchIndex, customQuotes]);

  const renderItem = useCallback(
    ({ item, index }) => <QuoteCard item={item} index={index} />,
    []
  );

  const getItemLayout = useCallback(
    (_, index) => ({
      length: SCREEN_HEIGHT,
      offset: SCREEN_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <FlatList
        ref={flatListRef}
        data={feed}
        renderItem={renderItem}
        keyExtractor={(item) => item._feedId}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        getItemLayout={getItemLayout}
        removeClippedSubviews
        initialNumToRender={3}
        maxToRenderPerBatch={5}
        windowSize={5}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <Text style={styles.addButtonIcon}>+</Text>
      </TouchableOpacity>

      <AddQuoteModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={saveCustomQuote}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  addButton: {
    position: 'absolute',
    bottom: 36,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#7f9cf5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7f9cf5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  addButtonIcon: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 32,
  },
});
