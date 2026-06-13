import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Animated, Easing } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/context/AuthContext';
import { Button, BalanceChip } from '../../src/components/UI';
import { Colors, Radius } from '../../src/constants/theme';

const SEGMENTS = [
  { label: '0.2x', color: Colors.red,    mult: 0.2 },
  { label: '0.5x', color: Colors.gold,   mult: 0.5 },
  { label: '1.5x', color: Colors.green,  mult: 1.5 },
  { label: '2x',   color: Colors.blue,   mult: 2.0 },
  { label: '5x',   color: '#a855f7',     mult: 5.0 },
  { label: '0.5x', color: Colors.gold,   mult: 0.5 },
  { label: '1.5x', color: Colors.green,  mult: 1.5 },
  { label: '3x',   color: Colors.green,  mult: 3.0 },
];

export default function WheelScreen() {
  const { balance, updateBalance } = useAuth();
  const [stake, setStake] = useState('100');
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const spinAnim = useRef(new Animated.Value(0)).current;
  const currentDeg = useRef(0);

  const spin = () => {
    const s = parseFloat(stake);
    if (!s || s < 10) { Alert.alert('Error', 'Minimum stake is KSh 10'); return; }
    if (s > balance) { Alert.alert('Error', 'Insufficient balance'); return; }
    updateBalance(balance - s);
    setSpinning(true);
    setResult(null);
    const resultIdx = Math.floor(Math.random() * SEGMENTS.length);
    const segDeg = 360 / SEGMENTS.length;
    const targetDeg = currentDeg.current + 1800 + (SEGMENTS.length - resultIdx) * segDeg;
    currentDeg.current = targetDeg % 360;
    spinAnim.setValue(0);
    Animated.timing(spinAnim, {
      toValue: targetDeg,
      duration: 3200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      const seg = SEGMENTS[resultIdx];
      const win = parseFloat((s * seg.mult).toFixed(2));
      updateBalance(balance + win - s + (balance - (balance - s)));
      setResult({ ...seg, win, stake: s });
      setSpinning(false);
      if (seg.mult >= 1) Alert.alert('🎉 You Won!', `${seg.label} — KSh ${win}`);
      else Alert.alert('😔 Better luck!', `${seg.label} — Lost KSh ${(s - win).toFixed(2)}`);
    });
  };

  const rotate = spinAnim.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] });

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: Colors.text2, fontSize: 15 }}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.title}>🎡 Lucky Wheel</Text>
        <BalanceChip balance={balance} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Wheel */}
        <View style={s.wheelContainer}>
          <Text style={s.pointer}>▼</Text>
          <Animated.View style={[s.wheel, { transform: [{ rotate }] }]}>
            {SEGMENTS.map((seg, i) => (
              <View key={i} style={[s.segment, { transform: [{ rotate: `${i * (360 / SEGMENTS.length)}deg` }] }]}>
                <View style={[s.segInner, { backgroundColor: seg.color + '33', borderColor: seg.color }]}>
                  <Text style={[s.segLabel, { color: seg.color }]}>{seg.label}</Text>
                </View>
              </View>
            ))}
          </Animated.View>
          <View style={s.center}><Text style={{ fontSize: 22 }}>🎯</Text></View>
        </View>

        {/* Multipliers legend */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginVertical: 8 }}>
          {SEGMENTS.map((seg, i) => (
            <View key={i} style={[s.legend, { backgroundColor: seg.color + '22', borderColor: seg.color + '66' }]}>
              <Text style={{ color: seg.color, fontSize: 12, fontWeight: '700' }}>{seg.label}</Text>
            </View>
          ))}
        </View>

        {/* Result */}
        {result && (
          <View style={[s.resultBox, { borderColor: result.mult >= 1 ? Colors.green : Colors.red }]}>
            <Text style={{ color: result.mult >= 1 ? Colors.green : Colors.red, fontSize: 20, fontWeight: '900' }}>
              {result.mult >= 1 ? '🎉' : '😔'} {result.label} — {result.mult >= 1 ? 'Won' : 'Lost'} KSh {result.win}
            </Text>
          </View>
        )}

        {/* Controls */}
        <View style={s.controls}>
          <Text style={s.label}>Stake (KSh)</Text>
          <TextInput style={s.input} value={stake} onChangeText={setStake} keyboardType="numeric" editable={!spinning} placeholderTextColor={Colors.text3} />
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, marginBottom: 14 }}>
            {[50, 100, 500, 1000].map(a => (
              <TouchableOpacity key={a} style={s.quickBtn} onPress={() => setStake(String(a))}>
                <Text style={{ color: Colors.text, fontSize: 12, fontWeight: '600' }}>{a}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button title={spinning ? 'Spinning...' : 'SPIN! 🎡'} onPress={spin} disabled={spinning} />
          <Text style={{ color: Colors.text3, fontSize: 12, textAlign: 'center', marginTop: 8 }}>Min stake: KSh 10</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: Colors.bg2, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  scroll: { padding: 16, paddingBottom: 60, gap: 16, alignItems: 'center' },
  wheelContainer: { width: 260, height: 260, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  pointer: { fontSize: 28, color: Colors.gold, position: 'absolute', top: -20, zIndex: 10 },
  wheel: { width: 240, height: 240, borderRadius: 120, backgroundColor: Colors.bg3, borderWidth: 4, borderColor: Colors.gold, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  segment: { position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'flex-start' },
  segInner: { marginTop: 10, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1 },
  segLabel: { fontSize: 11, fontWeight: '800' },
  center: { position: 'absolute', width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.bg, borderWidth: 4, borderColor: Colors.gold, alignItems: 'center', justifyContent: 'center' },
  legend: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, borderWidth: 1 },
  resultBox: { borderWidth: 2, borderRadius: Radius.md, padding: 14, alignItems: 'center', width: '100%', backgroundColor: Colors.card },
  controls: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: 16, width: '100%' },
  label: { fontSize: 13, color: Colors.text2, fontWeight: '500', marginBottom: 6 },
  input: { backgroundColor: Colors.bg3, borderWidth: 1, borderColor: Colors.border, color: Colors.text, paddingHorizontal: 12, paddingVertical: 12, borderRadius: Radius.sm, fontSize: 15, textAlign: 'center' },
  quickBtn: { flex: 1, backgroundColor: Colors.bg3, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.sm, paddingVertical: 8, alignItems: 'center' },
});
