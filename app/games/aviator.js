import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Animated } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../src/context/AuthContext';
import { Button, BalanceChip } from '../../src/components/UI';
import { Colors, Radius } from '../../src/constants/theme';

export default function AviatorScreen() {
  const { balance, updateBalance } = useAuth();
  const [stake, setStake] = useState('50');
  const [autoCash, setAutoCash] = useState('');
  const [multiplier, setMultiplier] = useState(1.00);
  const [gameState, setGameState] = useState('idle'); // idle | flying | crashed
  const [betActive, setBetActive] = useState(false);
  const [currentStake, setCurrentStake] = useState(0);
  const [history, setHistory] = useState([1.23, 4.56, 2.11, 1.05, 8.72, 3.40, 1.01]);
  const intervalRef = useRef(null);
  const multRef = useRef(1.0);

  const startFlight = () => {
    const s = parseFloat(stake);
    if (!s || s < 10) { Alert.alert('Error', 'Minimum stake is KSh 10'); return; }
    if (s > balance) { Alert.alert('Error', 'Insufficient balance'); return; }
    updateBalance(balance - s);
    setCurrentStake(s);
    setBetActive(true);
    setGameState('flying');
    multRef.current = 1.0;
    setMultiplier(1.00);
    const crashAt = Math.random() < 0.4 ? (1 + Math.random() * 1.5) : (2 + Math.random() * 8);
    const auto = parseFloat(autoCash);
    intervalRef.current = setInterval(() => {
      multRef.current += 0.03 + multRef.current * 0.015;
      setMultiplier(parseFloat(multRef.current.toFixed(2)));
      if (auto && multRef.current >= auto) { handleCashOut(); return; }
      if (multRef.current >= crashAt) {
        clearInterval(intervalRef.current);
        setGameState('crashed');
        setBetActive(false);
        setHistory(prev => [parseFloat(multRef.current.toFixed(2)), ...prev.slice(0, 9)]);
        Alert.alert('💥 Crashed!', `Crashed at ${multRef.current.toFixed(2)}x\nLost KSh ${s}`);
      }
    }, 100);
  };

  const handleCashOut = () => {
    if (!betActive) return;
    clearInterval(intervalRef.current);
    const win = parseFloat((currentStake * multRef.current).toFixed(2));
    updateBalance(balance + win);
    setBetActive(false);
    setGameState('idle');
    Alert.alert('✅ Cashed Out!', `${multRef.current.toFixed(2)}x\nWon KSh ${win}`);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const crashed = gameState === 'crashed';
  const flying = gameState === 'flying';

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => { clearInterval(intervalRef.current); router.back(); }}>
          <Text style={{ color: Colors.text2, fontSize: 15 }}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.title}>✈️ Aviator</Text>
        <BalanceChip balance={balance} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Game area */}
        <LinearGradient colors={['#0a0010', '#130020']} style={s.gameArea}>
          <View style={s.track}>
            <Text style={{ position: 'absolute', bottom: flying ? '60%' : 10, left: flying ? '70%' : '10%', fontSize: 36, transition: 'all 0.5s' }}>✈️</Text>
            <View style={s.crashLine} />
          </View>
          <Text style={[s.multiplier, crashed && { color: Colors.red }, flying && { color: Colors.green }]}>
            {multiplier.toFixed(2)}x
          </Text>
          <Text style={{ color: Colors.text2, fontSize: 13, marginTop: 4 }}>
            {gameState === 'idle' ? 'Place bet to start' : gameState === 'flying' ? 'Flight in progress...' : `💥 Crashed at ${multiplier.toFixed(2)}x`}
          </Text>
          {/* Live players */}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            {['John @2.4x', 'Mary @1.8x', 'Ali @3.1x'].map(p => (
              <View key={p} style={s.playerBadge}><Text style={{ color: Colors.green, fontSize: 11, fontWeight: '600' }}>{p}</Text></View>
            ))}
          </View>
        </LinearGradient>

        {/* Controls */}
        <View style={s.controls}>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>Stake (KSh)</Text>
              <TextInput style={s.input} value={stake} onChangeText={setStake} keyboardType="numeric" editable={!flying} placeholderTextColor={Colors.text3} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>Auto Cash Out</Text>
              <TextInput style={s.input} value={autoCash} onChangeText={setAutoCash} keyboardType="numeric" placeholder="e.g. 2.00" editable={!flying} placeholderTextColor={Colors.text3} />
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button title="Place Bet" onPress={startFlight} disabled={flying} style={{ flex: 1 }} />
            <Button title="Cash Out" onPress={handleCashOut} disabled={!betActive} variant={betActive ? 'outline' : 'ghost'} style={{ flex: 1 }} />
          </View>
        </View>

        {/* Crash history */}
        <Text style={s.histTitle}>Recent Crashes</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {history.map((h, i) => (
            <View key={i} style={[s.histBadge, { backgroundColor: h >= 2 ? Colors.greenGlow : 'rgba(255,71,87,0.12)', borderColor: h >= 2 ? Colors.green : Colors.red }]}>
              <Text style={{ color: h >= 2 ? Colors.green : Colors.red, fontSize: 12, fontWeight: '700' }}>{h}x</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: Colors.bg2, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  scroll: { padding: 16, paddingBottom: 60, gap: 16 },
  gameArea: { borderRadius: Radius.lg, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(168,85,247,0.3)', minHeight: 200 },
  track: { width: '100%', height: 120, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, marginBottom: 12, position: 'relative', overflow: 'hidden' },
  crashLine: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.green, opacity: 0.3 },
  multiplier: { fontSize: 64, fontWeight: '900', color: Colors.text },
  playerBadge: { backgroundColor: Colors.greenGlow, borderWidth: 1, borderColor: Colors.border2, paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  controls: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: 16 },
  label: { fontSize: 13, color: Colors.text2, fontWeight: '500', marginBottom: 6 },
  input: { backgroundColor: Colors.bg3, borderWidth: 1, borderColor: Colors.border, color: Colors.text, paddingHorizontal: 12, paddingVertical: 12, borderRadius: Radius.sm, fontSize: 15 },
  histTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  histBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, borderWidth: 1 },
});
