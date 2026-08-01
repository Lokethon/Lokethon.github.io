import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatInput from '@/components/chat/ChatInput';
import EmptyChat from '@/components/chat/EmptyChat';
import TypingIndicator from '@/components/chat/TypingIndicator';
import { useChat } from '@/hooks/useChat';
import { useChatStore } from '@/store/chatStore';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { sendMessage, isStreaming, error } = useChat(id);
  const { conversations } = useChatStore();
  
  const conversation = conversations.find(c => c.id === id);
  const flatListRef = useRef<FlatList>(null);

  if (!conversation) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{ color: colors.danger }}>Conversation not found.</Text>
      </View>
    );
  }

  // Ensure latest messages are at the bottom using inverted FlatList
  const reversedMessages = [...conversation.messages].reverse();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ChatHeader 
        personName={conversation.personName}
        personRelationship={conversation.personRelationship}
        onBack={() => router.back()} 
      />
      
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={reversedMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          inverted
          contentContainerStyle={styles.messageList}
          ListEmptyComponent={<EmptyChat />}
          ListHeaderComponent={isStreaming ? <TypingIndicator /> : null}
        />
        
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        <ChatInput 
          onSend={sendMessage} 
          disabled={isStreaming} 
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  messageList: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
    padding: spacing.sm,
  },
});
