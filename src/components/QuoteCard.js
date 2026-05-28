import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const CARD_COLORS = [
  ['#1a1a2e', '#16213e'],
  ['#0f3460', '#1a1a2e'],
  ['#162032', '#0f3460'],
  ['#1e1e2e', '#2d2b55'],
  ['#16213e', '#0f3460'],
  ['#1a1a2e', '#162032'],
];

export default function QuoteCard({ item, index }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const colorPair = CARD_COLORS[index % CARD_COLORS.length];
  const isCustom = item.isCustom;

  return (
    <View style={[styles.card, { backgroundColor: colorPair[0] }]}>
      <View style={[styles.accentBar, { backgroundColor: isCustom ? '#c9a84c' : '#7f9cf5' }]} />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {isCustom && (
          <View style={styles.customBadge}>
            <Text style={styles.customBadgeText}>MY QUOTE</Text>
          </View>
        )}

        <Text style={styles.quoteSymbol}>"</Text>
        <Text style={styles.quoteText}>{item.text}</Text>
        <View style={styles.divider} />
        <Text style={styles.authorText}>— {item.author}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: '25%',
    width: 4,
    height: '50%',
    borderRadius: 2,
  },
  content: {
    paddingHorizontal: 40,
    paddingVertical: 60,
    maxWidth: 360,
    alignItems: 'center',
  },
  customBadge: {
    borderWidth: 1,
    borderColor: '#c9a84c',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 24,
  },
  customBadgeText: {
    color: '#c9a84c',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  quoteSymbol: {
    fontSize: 80,
    color: 'rgba(255,255,255,0.08)',
    fontFamily: 'serif',
    lineHeight: 70,
    alignSelf: 'flex-start',
    marginBottom: -20,
  },
  quoteText: {
    color: '#e8e8f0',
    fontSize: 20,
    lineHeight: 32,
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 24,
  },
  authorText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
