import React, { useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';

interface StreamingTextProps {
  text: string;
  isStreaming: boolean;
  style?: any;
}

const StreamingText: React.FC<StreamingTextProps> = ({ text, isStreaming, style }) => {
  const [cursorVisible, setCursorVisible] = useState(true);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStreaming) {
      interval = setInterval(() => {
        setCursorVisible((v) => !v);
      }, 500);
    } else {
      setCursorVisible(false);
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  return (
    <Text style={[styles.text, style]}>
      {text}
      {isStreaming && (
        <Text style={{ opacity: cursorVisible ? 1 : 0 }}>|</Text>
      )}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    // Inherit parent styles
  },
});

export default React.memo(StreamingText);
