import React from 'react';
import {
  TouchableOpacity, Text, View, TextInput,
  ActivityIndicator, StyleSheet,
} from 'react-native';
import { Colors, Radius } from '../constants/theme';

// ── Button ────────────────────────────────────────────────────────────────────
export function Button({ title, onPress, variant = 'green', loading, disabled, style, textStyle, icon }) {
  const bg = {
    green:   Colors.green,
    outline: 'transparent',
    ghost:   Colors.bg3,
    red:     Colors.red,
    gold:    Colors.gold,
  }[variant] || Colors.green;

  const tc = {
    green:   '#000',
    outline: Colors.green,
    ghost:   Colors.text,
    red:     '#fff',
    gold:    '#000',
  }[variant] || '#000';

  const borderStyle = variant === 'outline'
    ? { borderWidth: 1, borderColor: Colors.green }
    : {};

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[styles.btn, { backgroundColor: bg }, borderStyle, (disabled || loading) && styles.disabled, style]}
    >
      {loading
        ? <ActivityIndicator color={tc} size="small" />
        : <>
            {icon && <Text style={{ fontSize: 16, marginRight: 6 }}>{icon}</Text>}
            <Text style={[styles.btnText, { color: tc }, textStyle]}>{title}</Text>
          </>
      }
    </TouchableOpacity>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────
export function Input({ label, error, style, inputStyle, ...props }) {
  return (
    <View style={[styles.inputWrap, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, inputStyle]}
        placeholderTextColor={Colors.text3}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ label, color = Colors.green, bg }) {
  return (
    <View style={[styles.badge, { backgroundColor: bg || color + '22', borderColor: color + '44', borderWidth: 1 }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────
export function SectionHeader({ title, action, onAction }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onAction}>
          <Text style={{ color: Colors.green, fontSize: 13, fontWeight: '600' }}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Balance Chip ──────────────────────────────────────────────────────────────
export function BalanceChip({ balance, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.balChip}>
      <Text style={{ fontSize: 13 }}>💰</Text>
      <Text style={styles.balText}>KSh {balance?.toLocaleString() || '0'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, paddingHorizontal: 24, borderRadius: Radius.md,
    minHeight: 50,
  },
  btnText: { fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
  disabled: { opacity: 0.5 },
  inputWrap: { gap: 6 },
  label: { fontSize: 13, color: Colors.text2, fontWeight: '500' },
  input: {
    backgroundColor: Colors.bg3, borderWidth: 1, borderColor: Colors.border,
    color: Colors.text, paddingHorizontal: 14, paddingVertical: 13,
    borderRadius: Radius.sm, fontSize: 15,
  },
  inputError: { borderColor: Colors.red },
  errorText: { fontSize: 12, color: Colors.red, marginTop: 2 },
  card: {
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md, padding: 16,
  },
  badge: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 11, fontWeight: '700' },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20, fontWeight: '800', color: Colors.text, letterSpacing: 0.3,
  },
  balChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.bg3, borderWidth: 1, borderColor: Colors.border2,
    borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 7,
  },
  balText: { fontSize: 14, fontWeight: '700', color: Colors.green },
});
