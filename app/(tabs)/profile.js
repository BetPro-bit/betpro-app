import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../src/context/AuthContext';
import { Colors, Radius } from '../../src/constants/theme';

const MENU = [
  { icon: '📊', label: 'Betting History',     action: null },
  { icon: '💰', label: 'Deposit & Withdrawal', action: '/(tabs)/wallet' },
  { icon: '🔐', label: 'Change Password',      action: null },
  { icon: '🛡️', label: 'Responsible Gaming',   action: null },
  { icon: '🔔', label: 'Notifications',         action: null },
  { icon: '💬', label: 'Support Chat',          action: null },
  { icon: '⭐', label: 'Rate BetPro',           action: null },
];

export default function ProfileScreen() {
  const { user, balance, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => { await logout(); router.replace('/(auth)/login'); } },
    ]);
  };

  const initials = user?.phone?.slice(-3) || 'BP';

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}><Text style={s.headerTitle}>👤 Profile</Text></View>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Profile card */}
        <LinearGradient colors={['#0a1a12', '#0d1a2e']} style={s.profileCard}>
          <View style={s.avatar}><Text style={s.avatarText}>{initials}</Text></View>
          <Text style={s.userName}>{user?.phone || '+254 700 000 000'}</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
            <View style={s.verifiedBadge}><Text style={{ color: Colors.green, fontSize: 12, fontWeight: '700' }}>✅ Verified</Text></View>
            <View style={s.vipBadge}><Text style={{ color: Colors.gold, fontSize: 12, fontWeight: '700' }}>⭐ VIP</Text></View>
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={s.statsRow}>
          {[['342', 'Total Bets'],['58%', 'Win Rate'],['18K', 'Total Won']].map(([v, l]) => (
            <View key={l} style={s.statCard}>
              <Text style={s.statVal}>{v}</Text>
              <Text style={s.statLabel}>{l}</Text>
            </View>
          ))}
        </View>

        {/* Balance quick view */}
        <View style={s.balRow}>
          <Text style={{ color: Colors.text2, fontSize: 14 }}>Current Balance</Text>
          <Text style={{ color: Colors.green, fontSize: 18, fontWeight: '900' }}>KSh {balance.toLocaleString()}</Text>
        </View>

        {/* Menu */}
        <View style={s.menu}>
          {MENU.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={s.menuItem}
              onPress={() => item.action ? router.push(item.action) : Alert.alert(item.label, 'Coming soon!')}
              activeOpacity={0.7}
            >
              <Text style={s.menuIcon}>{item.icon}</Text>
              <Text style={s.menuLabel}>{item.label}</Text>
              <Text style={{ color: Colors.text3, fontSize: 18 }}>›</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[s.menuItem, { marginTop: 8 }]} onPress={handleLogout} activeOpacity={0.7}>
            <Text style={s.menuIcon}>🚪</Text>
            <Text style={[s.menuLabel, { color: Colors.red }]}>Sign Out</Text>
            <Text style={{ color: Colors.text3, fontSize: 18 }}>›</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ color: Colors.text3, fontSize: 12, textAlign: 'center', marginTop: 16 }}>
          BetPro v1.0.0 • support@betpro.com{'\n'}Please bet responsibly. 18+ only.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 16, paddingVertical: 14, backgroundColor: Colors.bg2, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.text },
  scroll: { padding: 16, paddingBottom: 100, gap: 12 },
  profileCard: { borderRadius: Radius.lg, padding: 24, borderWidth: 1, borderColor: Colors.border2, alignItems: 'center' },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.green, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 26, fontWeight: '800', color: '#000' },
  userName: { fontSize: 18, fontWeight: '700', color: Colors.text },
  verifiedBadge: { backgroundColor: Colors.greenGlow, borderWidth: 1, borderColor: Colors.border2, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  vipBadge: { backgroundColor: 'rgba(255,215,0,0.1)', borderWidth: 1, borderColor: 'rgba(255,215,0,0.3)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: 14, alignItems: 'center' },
  statVal: { fontSize: 22, fontWeight: '900', color: Colors.green },
  statLabel: { fontSize: 11, color: Colors.text3, marginTop: 2, textAlign: 'center' },
  balRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.card, borderRadius: Radius.md, padding: 16, borderWidth: 1, borderColor: Colors.border2 },
  menu: { backgroundColor: Colors.card, borderRadius: Radius.md, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuIcon: { fontSize: 20, width: 26, textAlign: 'center' },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: Colors.text },
});
