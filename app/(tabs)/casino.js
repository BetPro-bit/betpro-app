import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius } from '../../src/constants/theme';

const GAMES = [
  { id: 'aviator', icon: '✈️', name: 'Aviator', desc: 'Multiplier crash game', hot: true },
  { id: 'mines',   icon: '💣', name: 'Mines',   desc: 'Avoid the mines',       hot: false },
  { id: 'wheel',   icon: '🎡', name: 'Lucky Wheel', desc: 'Spin to win',       hot: false },
  { id: 'dice',    icon: '🎲', name: 'Dice',    desc: 'Roll your luck',         hot: false },
  { id: 'plinko',  icon: '🎯', name: 'Plinko',  desc: 'Drop the ball, win big', hot: false },
];

export default function CasinoScreen() {
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}><Text style={s.headerTitle}>🎮 Casino Games</Text></View>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        <LinearGradient colors={['#0d001a', '#1a0030']} style={s.heroBanner}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#a855f7', letterSpacing: 2, marginBottom: 6 }}>🎰 CASINO</Text>
          <Text style={{ fontSize: 36, fontWeight: '900', color: Colors.text, marginBottom: 4 }}>Play & <Text style={{ color: '#a855f7' }}>Win</Text></Text>
          <Text style={{ color: Colors.text2, fontSize: 14 }}>Instant wins, real money</Text>
        </LinearGradient>

        <Text style={s.minNote}>⚡ All games — Minimum stake KSh 10</Text>

        <View style={s.grid}>
          {GAMES.map(g => (
            <TouchableOpacity
              key={g.id}
              style={[s.gameCard, g.id === 'plinko' && { width: '100%' }]}
              onPress={() => router.push('/games/' + g.id)}
              activeOpacity={0.85}
            >
              {g.hot && <View style={s.hotBadge}><Text style={s.hotTxt}>HOT</Text></View>}
              <Text style={s.gameIcon}>{g.icon}</Text>
              <Text style={s.gameName}>{g.name}</Text>
              <Text style={s.gameDesc}>{g.desc}</Text>
              <View style={s.minBadge}><Text style={s.minBadgeTxt}>Min KSh 10</Text></View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 16, paddingVertical: 14, backgroundColor: Colors.bg2, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.text },
  scroll: { padding: 16, paddingBottom: 100, gap: 16 },
  heroBanner: { borderRadius: Radius.lg, padding: 24, borderWidth: 1, borderColor: 'rgba(168,85,247,0.3)' },
  minNote: { fontSize: 13, color: Colors.text2, textAlign: 'center', paddingVertical: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gameCard: {
    width: '47%', backgroundColor: Colors.card2, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.lg, padding: 20, alignItems: 'center', position: 'relative',
  },
  hotBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: Colors.red, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  hotTxt: { fontSize: 9, fontWeight: '800', color: '#fff' },
  gameIcon: { fontSize: 48, marginBottom: 8 },
  gameName: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  gameDesc: { fontSize: 12, color: Colors.text3, textAlign: 'center', marginBottom: 10 },
  minBadge: { backgroundColor: Colors.greenGlow, borderWidth: 1, borderColor: Colors.border2, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  minBadgeTxt: { color: Colors.green, fontSize: 11, fontWeight: '700' },
});
