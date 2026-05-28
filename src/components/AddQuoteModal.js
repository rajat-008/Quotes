import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';

export default function AddQuoteModal({ visible, onClose, onSave }) {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const slideAnim = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 600,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleSave = () => {
    const trimmedText = text.trim();
    const trimmedAuthor = author.trim();

    if (!trimmedText) {
      Alert.alert('Missing quote', 'Please enter the quote text.');
      return;
    }

    onSave({
      text: trimmedText,
      author: trimmedAuthor || 'Me',
    });

    setText('');
    setAuthor('');
    onClose();
  };

  const handleClose = () => {
    setText('');
    setAuthor('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />

        <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.handle} />

          <Text style={styles.title}>Add Your Quote</Text>
          <Text style={styles.subtitle}>It will appear randomly while you scroll</Text>

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>QUOTE</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Enter your quote here..."
              placeholderTextColor="rgba(255,255,255,0.25)"
              value={text}
              onChangeText={setText}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              maxLength={400}
            />
            <Text style={styles.charCount}>{text.length} / 400</Text>

            <Text style={styles.label}>AUTHOR (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Your name or leave blank"
              placeholderTextColor="rgba(255,255,255,0.25)"
              value={author}
              onChangeText={setAuthor}
              maxLength={60}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveText}>Save Quote</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
    maxHeight: '85%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#e8e8f0',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    marginBottom: 28,
  },
  label: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '600',
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    color: '#e8e8f0',
    fontSize: 16,
    padding: 14,
    minHeight: 120,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    lineHeight: 24,
  },
  charCount: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 11,
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    color: '#e8e8f0',
    fontSize: 16,
    padding: 14,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 28,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  cancelText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 15,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 2,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7f9cf5',
  },
  saveText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
