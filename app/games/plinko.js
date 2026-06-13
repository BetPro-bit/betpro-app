import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/context/AuthContext';
import { Button, BalanceChip } from '../../src/components/UI';
import { Colors, Radius } from '../../src/constants/theme';

const BUCKETS = {
  low:    [{ m:2,c:Colors.gold },{ m:1.5,c:Colors.green },{ m:1.2,c:Colors.green },{ m:0.5,c:Colors.blue },{ m:0.3,c:Colors.text2 },{ m:0.5,c:Colors.blue },{ m:1.2,c:Colors.green },{ m:1.5,c:Colors.green },{ m:2,c:Colors.gold }],
  medium: [{ m:5,c:Colors.gold },{ m:2,c:Colors.green },{ m:1,c:Colors.blue },{ m:0.5,c:Colors.text2 },{ m:0.2,c:Colors.red },{ m:0.5,c:Colors.text2 },{ m:1,c:Colors.blue },{ m:2,c:Colors.green },{ m:5,c:Colors.gold }],
  high:   [{ m:10,c:Colors.gold },{ m:3,c:Colors.green },{ m:0.5,c:Colors.blue },{ m:0.2,c:Colors.red },{ m:0,c:Colors.red },{ m:0.2,c:Colors.red },{ m:0.5,c:Colors.blue },{ m:3,c:Colors.green },{ m:10,c:Colors.gold }],
};

const WEIGHTS = [0.01, 0.06, 0.14, 0.24, 0.10, 0.24, 0.14, 0.06, 0.01];

export default function PlinkoScreen() {
  const { balance, updateBalance } = useAuth();
  const [stake, setStake] = useState('100');
  const [risk, setRisk] = useState('medium');
  const [dropping, setDropping] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [ballPos, setBallPos] = useState(null);

  const drop = () => {
    const s = parseFloat(stake);
    if (!s || s < 10) { Alert.alert('Error', 'Minimum stake is KSh 10'); return; }
    if (s > balance) { Alert.alert('Error', 'Insufficient balance'); return; }
    updateBalance(balance - s);
    setDropping(true);
    setResult(null);

    // Pick bucket based on weights
    let rand = Math.random(), cumul = 0, idx = 4;
    for (let i = 0; i < WEIGHTS.length; i++) {
      cumul += WEIGHTS[i];
      if (rand <= cumul) { idx = i; break; }
    }

    // Animate ball dropping
    const buckets = BUCKETS[risk];
    setBallPos(idx);
    setTimeout(() => {
      const seg = buckets[idx];
      const win = parseFloat((s * seg.m).toFixed(2));
      updateBalance(balance + win);
      setResult({ mult: seg.m, win, color: seg.c });
      setHistory(prev => [{ mult: seg.m, win }, ...prev.slice(0, 7)]);
      setDropping(false);
      setBallPos(null);
    }, 1500);
  };

  const buckets = BUCKETS[risk];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: Colors.text2, fontSize: 15 }}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.title}>🎯 Plinko</Text>
        <BalanceChip balance={balance} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Plinko board */}
        <View style={s.board}>
          {/* Pegs */}
          {[1,2,3,4,5,6,7,8].map(row => (
            <View key={row} style={[s.pegRow, { paddingHorizontal: row * 4 }]}>
              {Array(row + 1).fill(0).map((_, i) => (
                <View key={i} style={s.peg} />
              ))}
            </View>
          ))}
          {/* Ball indicator */}
          {dropping && (
            <View style={s.ballRow}>
              {buckets.map((_, i) => (
                <View key={i} style={s.ballSlot}>
                  {ballPos === i && <View style={s.ball} />}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Buckets */}
        <View style={s.bucketsRow}>
          {buckets.map((b, i) => (
            <View key={i} style={[s.bucket, { backgroundColor: b.c + '22', borderColor: b.c + '88' }, ballPos === i && { borderColor: b.c, backgroundColor: b.c + '44' }]}>
              <Text style={[s.bucketText, { color: b.c }]}>{b.m}x</Text>
            </View>
          ))}
        </View>

        {/* Result */}
        {result && (
          <View style={[s.resultBox, { borderColor: result.mult >= 1 ? Colors.green : Colors.red }]}>
            <Text style={{ color: result.color, fontSize: 22, fontWeight: '900' }}>
              {result.mult}x — {result.mult >= 1 ? '🎉 Won' : '😔 Lost'} KSh {result.win}
            </Text>
          </View>
        )}

        {/* Controls */}
        <View style={s.controls}>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>Stake (KSh)</Text>
              <TextInput style={s.input} value={stake} onChangeText={setStake} keyboardType="numeric" editable={!dropping} placeholderTextColor={Colors.text3} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>Risk Level</Text>
              <View style={{ flexDirection: 'row', gap: 4 }}>
                {['low','medium','high'].map(r => (
                  <TouchableOpacity key={r} onPress={() => !dropping && setRisk(r)}
                    style={[s.riskBtn, risk === r && s.riskBtnActive]}>
                    <Text style={{ color: risk === r ? Colors.green : Colors.text2, fontSize: 11, fontWeight: '700', textTransform: 'capitalize' }}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          <Button title={dropping ? 'Ball Dropping...' : 'Drop Ball 🎯'} onPress={drop} disabled={dropping} />
        </View>

        {/* History */}
        {history.length > 0 && (
          <>
            <Text style={{ color: Colors.text2, fontSize: 14, fontWeight: '600' }}>Recent Drops</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {history.map((h, i) => (
                <View key={i} style={[s.histBadge, { borderColor: h.mult >= 1 ? Colors.green : Colors.red, backgroundColor: h.mult >= 1 ? Colors.greenGlow : 'rgba(255,71,87,0.1)' }]}>
                  <Text style={{ color: h.mult >= 1 ? Colors.green : Colors.red, fontSize: 12, fontWeight: '700' }}>{h.mult}x</Text>
                </View>
              ))}
            </View>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: Colors.bg2, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  scroll: { padding: 16, paddingBottom: 60, gap: 16 },
  board: { backgroundColor: Colors.bg3, borderRadius: Radius.lg, padding: 16, alignItems: 'center', minHeight: 200, gap: 12 },
  pegRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  peg: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.text2 },
  ballRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-around' },
  ballSlot: { flex: 1, alignItems: 'center', height: 16 },
  ball: { width: 14, height: 14, borderRadius: 7, backgroundColor: Colors.gold },
  bucketsRow: { flexDirection: 'row', gap: 3 },
  bucket: { flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: 4, borderWidth: 1 },
  bucketText: { fontSize: 9, fontWeight: '800' },
  resultBox: { borderWidth: 2, borderRadius: Radius.md, padding: 16, alignItems: 'center', backgroundColor: Colors.card },
  controls: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: 16 },
  label: { fontSize: 13, color: Colors.text2, fontWeight: '500', marginBottom: 6 },
  input: { backgroundColor: Colors.bg3, borderWidth: 1, borderColor: Colors.border, color: Colors.text, paddingHorizontal: 12, paddingVertical: 12, borderRadius: Radius.sm, fontSize: 15 },
  riskBtn: { flex: 1, backgroundColor: Colors.bg3, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.sm, paddingVertical: 8, alignItems: 'center' },
  riskBtnActive: { borderColor: Colors.green, backgroundColor: Colors.greenGlow },
  histBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: Radius.full, borderWidth: 1 },
});
