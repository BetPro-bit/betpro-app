import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/context/AuthContext';
import { BalanceChip, SectionHeader, Badge } from '../../src/components/UI';
import { Colors, Radius } from '../../src/constants/theme';

const GAMES = [
  { id: 'aviator', icon: '✈️', name: 'Aviator', hot: true },
  { id: 'mines',   icon: '💣', name: 'Mines',   hot: false },
  { id: 'wheel',   icon: '🎡', name: 'Wheel',   hot: false },
  { id: 'dice',    icon: '🎲', name: 'Dice',    hot: false },
  { id: 'plinko',  icon: '🎯', name: 'Plinko',  hot: false },
];

const WINNERS = [
  { name: 'James K.', game: 'Aviator', amount: '48,200', avatar: 'J' },
  { name: 'Mary W.',  game: 'Football', amount: '12,500', avatar: 'M' },
  { name: 'Ali M.',   game: 'Mines',   amount: '8,750',  avatar: 'A' },
  { name: 'Grace N.', game: 'Wheel',   amount: '25,000', avatar: 'G' },
];

export default function HomeScreen() {
  const { balance } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Top Bar */}
      <View style={s.topBar}>
        <View style={s.logoRow}>
          <View style={s.logoIcon}><Text style={{ fontSize: 16 }}>🎯</Text></View>
          <Text style={s.logo}>Bet<Text style={{ color: Colors.green }}>Pro</Text></Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <BalanceChip balance={balance} onPress={() => router.push('/(tabs)/wallet')} />
          <TouchableOpacity style={s.notifBtn}>
            <Text style={{ fontSize: 18 }}>🔔</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Live ticker */}
      <View style={s.ticker}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 20, paddingHorizontal: 16 }}>
          {['⚽ Man City 2-1 Arsenal  LIVE 78\'', '🏆 Jackpot: KSh 4,200,000', '⚽ Chelsea 0-0 Liverpool  LIVE 34\'', '🎉 James won KSh 48,200!'].map((t, i) => (
            <Text key={i} style={s.tickerText}>{t}</Text>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.green} />}
      >

        {/* Hero Banner */}
        <LinearGradient colors={['#0a2012', '#0d1a2e', '#0a0f1a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.hero}>
          <Text style={s.heroTag}>🏆 MEGA JACKPOT</Text>
          <Text style={s.heroTitle}>Win Big.{'\n'}Bet Smart.</Text>
          <Text style={s.heroSub}>Today's Jackpot Prize Pool</Text>
          <Text style={s.jackpot}>KSh 4,200,000</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <TouchableOpacity style={s.heroBtnGreen} onPress={() => router.push('/(tabs)/sports')}>
              <Text style={{ color: '#000', fontWeight: '800', fontSize: 15 }}>Bet Now →</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.heroBtnOutline} onPress={() => router.push('/(tabs)/casino')}>
              <Text style={{ color: Colors.green, fontWeight: '700', fontSize: 14 }}>Casino 🎰</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Games */}
        <SectionHeader title="🎮 Featured Games" action="See All" onAction={() => router.push('/(tabs)/casino')} />
        <View style={s.gamesRow}>
          {GAMES.map(g => (
            <TouchableOpacity
              key={g.id}
              style={[s.gameCard, g.hot && s.gameCardHot]}
              onPress={() => router.push('/games/' + g.id)}
              activeOpacity={0.8}
            >
              {g.hot && <View style={s.hotBadge}><Text style={s.hotText}>HOT</Text></View>}
              <Text style={s.gameIcon}>{g.icon}</Text>
              <Text style={s.gameName}>{g.name}</Text>
              <Text style={s.gameMin}>Min KSh 10</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          {[['24K+','Active Players'],['4.2M','Jackpot KSh'],['98%','Payout Rate']].map(([v,l]) => (
            <View key={l} style={s.statCard}>
              <Text style={s.statVal}>{v}</Text>
              <Text style={s.statLabel}>{l}</Text>
            </View>
          ))}
        </View>

        {/* Recent Winners */}
        <SectionHeader title="🏆 Recent Winners" />
        {WINNERS.map((w, i) => (
          <View key={i} style={s.winnerItem}>
            <View style={s.winnerAvatar}><Text style={{ fontSize: 18, fontWeight: '800', color: '#000' }}>{w.avatar}</Text></View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={s.winnerName}>{w.name}</Text>
              <Text style={s.winnerGame}>{w.game}</Text>
            </View>
            <Text style={s.winnerAmount}>KSh {w.amount}</Text>
          </View>
        ))}

        {/* Promotions */}
        <SectionHeader title="🎁 Promotions" style={{ marginTop: 8 }} />
        <LinearGradient colors={['#0d1a2e', '#0a2012']} style={s.promoCard}>
          <Text style={s.promoTag}>WELCOME BONUS</Text>
          <Text style={s.promoBonus}>100% Match</Text>
          <Text style={s.promoDesc}>Deposit KSh 500+ and get double your first deposit up to KSh 5,000</Text>
          <TouchableOpacity style={s.promoBtn} onPress={() => router.push('/(tabs)/wallet')}>
            <Text style={{ color: '#000', fontWeight: '700', fontSize: 13 }}>Claim Bonus →</Text>
          </TouchableOpacity>
        </LinearGradient>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: Colors.bg2, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoIcon: { width: 32, height: 32, backgroundColor: Colors.green, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  logo: { fontSize: 22, fontWeight: '900', color: Colors.text },
  notifBtn: { padding: 4 },
  ticker: {
    backgroundColor: Colors.bg2, paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  tickerText: { fontSize: 12, color: Colors.text2, whiteSpace: 'nowrap' },
  scroll: { padding: 16, paddingBottom: 100, gap: 16 },

  // Hero
  hero: { borderRadius: Radius.lg, padding: 24, borderWidth: 1, borderColor: Colors.border2, overflow: 'hidden' },
  heroTag: { fontSize: 11, fontWeight: '700', color: Colors.green, letterSpacing: 2, marginBottom: 6 },
  heroTitle: { fontSize: 38, fontWeight: '900', color: Colors.text, lineHeight: 42, marginBottom: 8 },
  heroSub: { color: Colors.text2, fontSize: 14, marginBottom: 6 },
  jackpot: { fontSize: 44, fontWeight: '900', color: Colors.gold },
  heroBtnGreen: { backgroundColor: Colors.green, paddingHorizontal: 20, paddingVertical: 12, borderRadius: Radius.sm },
  heroBtnOutline: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.green },

  // Games
  gamesRow: { flexDirection: 'row', gap: 8 },
  gameCard: {
    flex: 1, backgroundColor: Colors.card2, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md, padding: 10, alignItems: 'center', position: 'relative',
  },
  gameCardHot: { borderColor: Colors.green },
  hotBadge: { position: 'absolute', top: 4, right: 4, backgroundColor: Colors.red, borderRadius: 4, paddingHorizontal: 4, paddingVertical: 1 },
  hotText: { fontSize: 8, fontWeight: '800', color: '#fff' },
  gameIcon: { fontSize: 28, marginBottom: 4 },
  gameName: { fontSize: 11, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  gameMin: { fontSize: 9, color: Colors.text3, marginTop: 2 },

  // Stats
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: 14, alignItems: 'center' },
  statVal: { fontSize: 24, fontWeight: '900', color: Colors.green },
  statLabel: { fontSize: 11, color: Colors.text3, marginTop: 2, textAlign: 'center' },

  // Winners
  winnerItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card,
    borderRadius: Radius.sm, padding: 12, marginBottom: 8,
  },
  winnerAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.green, alignItems: 'center', justifyContent: 'center' },
  winnerName: { fontSize: 14, fontWeight: '600', color: Colors.text },
  winnerGame: { fontSize: 12, color: Colors.text3 },
  winnerAmount: { fontSize: 15, fontWeight: '800', color: Colors.gold },

  // Promo
  promoCard: { borderRadius: Radius.lg, padding: 20, borderWidth: 1, borderColor: Colors.border2 },
  promoTag: { fontSize: 11, fontWeight: '700', color: Colors.green, letterSpacing: 1, marginBottom: 4 },
  promoBonus: { fontSize: 38, fontWeight: '900', color: Colors.gold, marginBottom: 4 },
  promoDesc: { fontSize: 13, color: Colors.text2, marginBottom: 12, lineHeight: 20 },
  promoBtn: { backgroundColor: Colors.green, alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.sm },
});
