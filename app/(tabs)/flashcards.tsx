import React, { useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Extrapolate, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function Flashcards() {
  const deleteCard = () => {
    if (flashcards.length === 0) return;
    setFlashcards((prev) => {
      const updated = prev.filter((_, i) => i !== index);
  
      if (updated.length === 0) {
        setIndex(0);
      } else if (index >= updated.length) {
        setIndex(updated.length - 1);
      }
      flip.value = 0;
      return updated;
    });
  };
  const [flashcards, setFlashcards] = useState<{ question: string; answer: string }[]>([]);
  const [index, setIndex] = useState(0);
  const [questionInput, setQuestionInput] = useState('');
  const [answerInput, setAnswerInput] = useState('');
  const translateX = useSharedValue(0);
  const flip = useSharedValue(0);

  const addCard = () => {
    if (questionInput.trim() && answerInput.trim()) {
      setFlashcards((prev) => [...prev, { question: questionInput, answer: answerInput }]);
      setQuestionInput('');
      setAnswerInput('');
      setIndex(flashcards.length);
      flip.value = 0;
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (flashcards.length === 0) return;
    setIndex((prev) => {
      let next = direction === 'left' ? prev + 1 : prev - 1;
      if (next < 0) next = flashcards.length - 1;
      if (next >= flashcards.length) next = 0;
      return next;
    });
    flip.value = 0;
  };

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX > 100) {
        translateX.value = withSpring(width, {}, () => {
          runOnJS(handleSwipe)('right');
          translateX.value = 0;
        });
      } else if (event.translationX < -100) {
        translateX.value = withSpring(-width, {}, () => {
          runOnJS(handleSwipe)('left');
          translateX.value = 0;
        });
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
    ],
  }));

  const frontAnimatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden',
      transform: [
        { rotateY: `${flip.value}deg` },
      ],
      opacity: interpolate(flip.value, [0, 90], [1, 0], Extrapolate.CLAMP),
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden',
      transform: [
        { rotateY: `${flip.value + 180}deg` },
      ],
      opacity: interpolate(flip.value, [90, 180], [0, 1], Extrapolate.CLAMP),
    };
  });

  const handleFlip = () => {
    flip.value = withSpring(flip.value === 0 ? 180 : 0, { damping: 15, stiffness: 80 });
  };

  const card = flashcards[index];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {flashcards.length === 0 ? (
        <Text style={styles.noCards}>No flashcards yet! Add one below.</Text>
      ) : (
        <GestureDetector gesture={gesture}>
          <Pressable onPress={handleFlip}>
              <Animated.View style={[styles.card, animatedCardStyle]}>
                <Animated.View style={[frontAnimatedStyle, { justifyContent: 'center', alignItems: 'center', flex: 1 }]}> 
                  <Text
                    style={styles.question}
                    numberOfLines={5}
                    ellipsizeMode="tail"
                  >
                    {card.question}
                  </Text>
                </Animated.View>
                <Animated.View style={[backAnimatedStyle, { justifyContent: 'center', alignItems: 'center', flex: 1 }]}> 
                  <Text
                    style={styles.answer}
                    numberOfLines={5}
                    ellipsizeMode="tail"
                  >
                    {card.answer}
                  </Text>
                </Animated.View>
              </Animated.View>
          </Pressable>
        </GestureDetector>
      )}

      {flashcards.length > 0 && (
        <View style={{ alignItems: 'center', marginBottom: 10 }}>
          <Text style={styles.counter}>
            {index + 1} / {flashcards.length}
          </Text>
          <TouchableOpacity style={styles.deleteButton} onPress={deleteCard}>
            <Text style={styles.deleteButtonText}>Delete Card</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Question"
          placeholderTextColor="#777"
          value={questionInput}
          onChangeText={setQuestionInput}
          style={styles.input}
        />
        <TextInput
          placeholder="Answer"
          placeholderTextColor="#777"
          value={answerInput}
          onChangeText={setAnswerInput}
          style={styles.input}
        />
        <TouchableOpacity style={styles.addButton} onPress={addCard}>
          <Text style={styles.addButtonText}>Add Card</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 20,
  },
  noCards: {
    color: '#777',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    width: 320,
    height: 250,
    backgroundColor: '#111',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    padding: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  question: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  answer: {
    color: '#0f0',
    fontSize: 18,
    textAlign: 'center',
  },
  counter: {
    color: '#777',
    fontSize: 16,
    marginBottom: 10,
  },
  inputContainer: {
    width: '100%',
    marginTop: 10,
  },
  input: {
    backgroundColor: '#111',
    color: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#ff9500',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
