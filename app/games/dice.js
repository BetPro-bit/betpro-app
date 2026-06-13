import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/context/AuthContext';
import { Button, BalanceChip } from '../../src/components/UI';
import { Colors, Radius } from '../../src/constants/theme';

const DICE_FACES = ['🎲','⚀','⚁','⚂','⚃','⚄','⚅'];

export default function DiceScreen() {
  const { balance, updateBalance } = useAuth();
  const [stake, setStake] = useState('100');
  const [target, setTarget] = useState(50);
  const [diceFace, setDiceFace] = useState('🎲');
  const [history, setHistory] = useState([]);
  const [resultText, setResultText] = useState('Roll to play!');

  const winChance = 100 - target;
  const multiplier = (99 / winChance).toFixed(2);
  const potential = ((parseFloat(stake) || 0) * parseFloat(multiplier)).toFixed(2);

  const roll = (type) => {
    const s = parseFloat(stake);
    if (!s || s < 10) { Alert.alert('Error', 'Minimum stake is KSh 10'); return; }
    if (s > balance) { Alert.alert('Error', 'Insufficient balance'); return; }
    updateBalance(balance - s);
    const rolled = Math.floor(Math.random() * 100) + 1;
    setDiceFace(DICE_FACES[Math.floor(Math.random() * 6) + 1]);
    const won = type === 'over' ? rolled > target : rolled < target;
    const win = parseFloat((s * parseFloat(multiplier)).toFixed(2));
    setHistory(prev => [{ roll: rolled, won }, ...prev.slice(0, 9)]);
    if (won) {
      updateBalance(balance + win);
      setResultText(`✅ Rolled ${rolled}! Won KSh ${win}`);
    } else {
      setResultText(`❌ Rolled ${rolled}. Lost KSh ${s}`);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: Colors.text2, fontSize: 15 }}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.title}>🎲 Dice</Text>
        <BalanceChip balance={balance} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Dice display */}
        <View style={s.diceCard}>
          <Text style={s.diceFace}>{diceFace}</Text>
          <Text style={[s.resultText, resultText.includes('✅') ? { color: Colors.green } : resultText.includes('❌') ? { color: Colors.red } : { color: Colors.text2 }]}>
            {resultText}
          </Text>
        </View>

        {/* Slider */}
        <View style={s.sliderCard}>
          <View style={s.sliderHeader}>
            <Text style={{ color: Colors.text2, fontSize: 13 }}>Roll Over</Text>
            <Text style={{ color: Colors.green, fontSize: 18, fontWeight: '800' }}>{target}</Text>
          </View>
          <View style={s.sliderTrack}>
            <View style={[s.sliderFill, { width: `${target}%` }]} />
            <TouchableOpacity style={[s.sliderThumb, { left: `${target - 2}%` }]} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            {[10, 25, 50, 75, 90].map(v => (
              <TouchableOpacity key={v} onPress={() => setTarget(v)} style={[s.targetBtn, target === v && s.targetBtnActive]}>
                <Text style={{ color: target === v ? Colors.green : Colors.text2, fontSize: 12, fontWeight: '700' }}>{v}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={s.oddsRow}>
            <View style={s.oddsBox}>
              <Text style={s.oddsLabel}>Win Chance</Text>
              <Text style={s.oddsValue}>{winChance}%</Text>
            </View>
            <View style={s.oddsBox}>
              <Text style={s.oddsLabel}>Multiplier</Text>
              <Text style={[s.oddsValue, { color: Colors.green }]}>{multiplier}x</Text>
            </View>
            <View style={s.oddsBox}>
              <Text style={s.oddsLabel}>Payout</Text>
              <Text style={[s.oddsValue, { color: Colors.gold }]}>KSh {potential}</Text>
            </View>
          </View>
        </View>

        {/* Stake */}
        <View style={s.controls}>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>Stake (KSh)</Text>
              <TextInput style={s.input} value={stake} onChangeText={setStake} keyboardType="numeric" placeholderTextColor={Colors.text3} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>Potential Win</Text>
              <View style={[s.input, { justifyContent: 'center' }]}>
                <Text style={{ color: Colors.green, fontWeight: '700', fontSize: 15 }}>KSh {potential}</Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={[s.rollBtn, { backgroundColor: Colors.red }]} onPress={() => roll('under')}>
              <Text style={s.rollBtnText}>Roll Under {target}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.rollBtn, { backgroundColor: Colors.green }]} onPress={() => roll('over')}>
              <Text style={[s.rollBtnText, { color: '#000' }]}>Roll Over {target}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* History */}
        {history.length > 0 && (
          <>
            <Text style={{ color: Colors.text2, fontSize: 14, fontWeight: '600' }}>Recent Rolls</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {history.map((h, i) => (
                <View key={i} style={[s.histBadge, { borderColor: h.won ? Colors.green : Colors.red, backgroundColor: h.won ? Colors.greenGlow : 'rgba(255,71,87,0.12)' }]}>
                  <Text style={{ color: h.won ? Colors.green : Colors.red, fontSize: 12, fontWeight: '700' }}>{h.roll}</Text>
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
  diceCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: 30, alignItems: 'center' },
  diceFace: { fontSize: 90, marginBottom: 12 },
  resultText: { fontSize: 16, fontWeight: '600' },
  sliderCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: 16 },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  sliderTrack: { height: 6, backgroundColor: Colors.bg3, borderRadius: 3, position: 'relative', marginBottom: 12 },
  sliderFill: { height: '100%', backgroundColor: Colors.green, borderRadius: 3 },
  sliderThumb: { position: 'absolute', top: -7, width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.green, borderWidth: 3, borderColor: '#000' },
  targetBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.sm, backgroundColor: Colors.bg3, borderWidth: 1, borderColor: Colors.border },
  targetBtnActive: { borderColor: Colors.green, backgroundColor: Colors.greenGlow },
  oddsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  oddsBox: { flex: 1, backgroundColor: Colors.bg3, borderRadius: Radius.sm, padding: 10, alignItems: 'center' },
  oddsLabel: { fontSize: 11, color: Colors.text3, marginBottom: 4 },
  oddsValue: { fontSize: 14, fontWeight: '800', color: Colors.text },
  controls: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: 16 },
  label: { fontSize: 13, color: Colors.text2, fontWeight: '500', marginBottom: 6 },
  input: { backgroundColor: Colors.bg3, borderWidth: 1, borderColor: Colors.border, color: Colors.text, paddingHorizontal: 12, paddingVertical: 12, borderRadius: Radius.sm, fontSize: 15 },
  rollBtn: { flex: 1, paddingVertical: 14, borderRadius: Radius.sm, alignItems: 'center' },
  rollBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  histBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: Radius.full, borderWidth: 1 },
});
