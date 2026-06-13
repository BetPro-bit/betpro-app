import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/context/AuthContext';
import { Button, BalanceChip } from '../../src/components/UI';
import { Colors, Radius } from '../../src/constants/theme';

export default function MinesScreen() {
  const { balance, updateBalance } = useAuth();
  const [stake, setStake] = useState('100');
  const [mineCount, setMineCount] = useState('5');
  const [grid, setGrid] = useState(Array(25).fill('hidden'));
  const [minePositions, setMinePositions] = useState([]);
  const [gameActive, setGameActive] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const [multiplier, setMultiplier] = useState(1.00);
  const [currentStake, setCurrentStake] = useState(0);

  const startGame = () => {
    const s = parseFloat(stake);
    const mc = parseInt(mineCount);
    if (!s || s < 10) { Alert.alert('Error', 'Minimum stake is KSh 10'); return; }
    if (s > balance) { Alert.alert('Error', 'Insufficient balance'); return; }
    updateBalance(balance - s);
    setCurrentStake(s);
    setRevealed(0);
    setMultiplier(1.00);
    // Place mines
    const mines = [];
    while (mines.length < mc) {
      const r = Math.floor(Math.random() * 25);
      if (!mines.includes(r)) mines.push(r);
    }
    setMinePositions(mines);
    setGrid(Array(25).fill('hidden'));
    setGameActive(true);
  };

  const revealCell = (idx) => {
    if (!gameActive) { Alert.alert('Info', 'Start a game first!'); return; }
    if (grid[idx] !== 'hidden') return;
    const newGrid = [...grid];
    if (minePositions.includes(idx)) {
      // Hit a mine
      newGrid[idx] = 'mine';
      minePositions.forEach(p => { newGrid[p] = 'mine'; });
      setGrid(newGrid);
      setGameActive(false);
      Alert.alert('💥 BOOM!', `You hit a mine!\nLost KSh ${currentStake}`);
    } else {
      newGrid[idx] = 'safe';
      const newRevealed = revealed + 1;
      setRevealed(newRevealed);
      const mc = parseInt(mineCount);
      const newMult = parseFloat((1 + newRevealed * (mc / 10)).toFixed(2));
      setMultiplier(newMult);
      setGrid(newGrid);
    }
  };

  const cashOut = () => {
    if (!gameActive) return;
    const win = parseFloat((currentStake * multiplier).toFixed(2));
    updateBalance(balance + win);
    setGameActive(false);
    Alert.alert('✅ Cashed Out!', `${multiplier}x\nWon KSh ${win}`);
  };

  const cellStyle = (state) => {
    if (state === 'safe') return [s.cell, s.cellSafe];
    if (state === 'mine') return [s.cell, s.cellMine];
    return s.cell;
  };

  const cellEmoji = (state) => {
    if (state === 'safe') return '💎';
    if (state === 'mine') return '💣';
    return '❓';
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: Colors.text2, fontSize: 15 }}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.title}>💣 Mines</Text>
        <BalanceChip balance={balance} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Controls */}
        <View style={s.controls}>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>Stake (KSh)</Text>
              <TextInput style={s.input} value={stake} onChangeText={setStake} keyboardType="numeric" editable={!gameActive} placeholderTextColor={Colors.text3} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>Mines</Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {['3','5','10'].map(n => (
                  <TouchableOpacity key={n} onPress={() => !gameActive && setMineCount(n)}
                    style={[s.mineChip, mineCount === n && s.mineChipActive]}>
                    <Text style={{ color: mineCount === n ? Colors.green : Colors.text2, fontWeight: '700', fontSize: 13 }}>{n}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Multiplier display */}
          {gameActive && (
            <View style={s.multRow}>
              <Text style={{ color: Colors.text2, fontSize: 13 }}>Current Multiplier</Text>
              <Text style={{ color: Colors.green, fontSize: 22, fontWeight: '900' }}>{multiplier}x</Text>
            </View>
          )}

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button title="Start Game" onPress={startGame} disabled={gameActive} style={{ flex: 1 }} />
            <Button title="Cash Out" onPress={cashOut} disabled={!gameActive || revealed === 0} variant={gameActive && revealed > 0 ? 'outline' : 'ghost'} style={{ flex: 1 }} />
          </View>
        </View>

        {/* Grid */}
        <View style={s.grid}>
          {grid.map((cell, i) => (
            <TouchableOpacity key={i} style={cellStyle(cell)} onPress={() => revealCell(i)} activeOpacity={0.8}>
              <Text style={{ fontSize: 22 }}>{cellEmoji(cell)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={{ color: Colors.text2, fontSize: 13, textAlign: 'center' }}>
          {!gameActive && revealed === 0 ? 'Set stake and mines count, then start' :
           gameActive ? `${25 - parseInt(mineCount) - revealed} safe tiles remaining` :
           'Game over — start a new game'}
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: Colors.bg2, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  scroll: { padding: 16, paddingBottom: 60, gap: 16 },
  controls: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: 16 },
  label: { fontSize: 13, color: Colors.text2, fontWeight: '500', marginBottom: 6 },
  input: { backgroundColor: Colors.bg3, borderWidth: 1, borderColor: Colors.border, color: Colors.text, paddingHorizontal: 12, paddingVertical: 12, borderRadius: Radius.sm, fontSize: 15 },
  mineChip: { flex: 1, backgroundColor: Colors.bg3, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.sm, paddingVertical: 10, alignItems: 'center' },
  mineChipActive: { borderColor: Colors.green, backgroundColor: Colors.greenGlow },
  multRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.bg3, borderRadius: Radius.sm, padding: 12, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  cell: { width: '18%', aspectRatio: 1, backgroundColor: Colors.card2, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  cellSafe: { backgroundColor: Colors.greenGlow, borderColor: Colors.green },
  cellMine: { backgroundColor: 'rgba(255,71,87,0.15)', borderColor: Colors.red },
});
