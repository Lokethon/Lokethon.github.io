import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '@/theme';

type AccordionProps = {
  title: string;
  children: React.ReactNode;
};

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity 
        style={styles.accordionHeader} 
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.accordionTitle}>{title}</Text>
        <Text style={styles.accordionIcon}>{expanded ? '−' : '+'}</Text>
      </TouchableOpacity>
      {expanded && <View style={styles.accordionContent}>{children}</View>}
    </View>
  );
};

export default function LegalInfoScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Know Your Rights</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.introText}>
          Scold provides a safe space to vent, but if you are experiencing genuine harassment or abuse, it is important to know your legal rights.
        </Text>

        <Accordion title="Workplace Harassment (POSH Act)">
          <Text style={styles.contentText}>
            The Prevention of Sexual Harassment (POSH) Act protects employees from workplace harassment. Every organization with 10 or more employees must have an Internal Complaints Committee (ICC).
          </Text>
        </Accordion>

        <Accordion title="Filing a Complaint">
          <Text style={styles.contentText}>
            1. Document everything: Save emails, messages, and take notes of dates and times.{"\n"}
            2. Report to HR or ICC: Submit a formal written complaint.{"\n"}
            3. Follow up: The committee is legally obligated to investigate within a specific timeframe.
          </Text>
        </Accordion>

        <Accordion title="Your Rights as an Employee">
          <Text style={styles.contentText}>
            • Right to a safe working environment.{"\n"}
            • Right to confidentiality during investigations.{"\n"}
            • Protection against retaliation for filing a complaint.
          </Text>
        </Accordion>

        <Accordion title="When to Seek Legal Help">
          <Text style={styles.contentText}>
            If internal mechanisms fail, or if the harassment involves threats of violence, extortion, or severe emotional distress, it may be time to consult a lawyer or contact law enforcement.
          </Text>
        </Accordion>

        <Accordion title="Helpline Numbers">
          <Text style={styles.contentText}>
            • National Emergency: 112{"\n"}
            • Women's Helpline: 1091{"\n"}
            • Cyber Crime: 1930
          </Text>
        </Accordion>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    padding: spacing.xs,
    width: 50,
  },
  backText: {
    ...typography.body,
    color: colors.primary,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  content: {
    padding: spacing.lg,
  },
  introText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  accordionContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surfaceElevated,
  },
  accordionTitle: {
    ...typography.body,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  accordionIcon: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  accordionContent: {
    padding: spacing.md,
  },
  contentText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
