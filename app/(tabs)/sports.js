import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/context/AuthContext';
import { Button, SectionHeader } from '../../src/components/UI';
import { Colors, Radius } from '../../src/constants/theme';

const SPORTS = ['⚡ All','⚽ Football','🏀 Basketball','🎾 Tennis','🏐 Volleyball','🏉 Rugby','🏏 Cricket'];

const MATCHES = [
  { id:1, league:'Premier League', home:'Arsenal', away:'Chelsea', time:"LIVE 67'", score:'1-0', odds:[2.1,3.4,3.8], live:true },
  { id:2, league:'La Liga', home:'Barcelona', away:'Real Madrid', time:"LIVE 82'", score:'3-1', odds:[1.9,3.6,4.2], live:true },
  { id:3, league:'Premier League', home:'Man City', away:'Liverpool', time:'Tomorrow 20:45', score:null, odds:[1.7,3.8,5.5], live:false },
  { id:4, league:'Serie A', home:'Juventus', away:'AC Milan', time:'Today 21:00', score:null, odds:[2.3,3.1,3.4], live:false },
  { id:5, league:'Bundesliga', home:'Bayern Munich', away:'Dortmund', time:'Tomorrow 17:30', score:null, odds:[1.5,4.2,6.5], live:false },
  { id:6, league:'Champions League', home:'PSG', away:'Man City', time:'Wed 21:00', score:null, odds:[2.8,3.3,2.6], live:false },
];

export default function SportsScreen() {
  const { balance, updateBalance } = useAuth();
  const [sport, setSport] = useState(0);
  const [bets, setBets] = useState([]);
  const [slipVisible, setSlipVisible] = useState(false);
  const [stake, setStake] = useState('');

  const addBet = (match, selection, odd) => {
    const existing = bets.findIndex(b => b.matchId === match.id);
    if (existing >= 0) {
      const newBets = [...bets];
      if (newBets[existing].selection === selection) {
        newBets.splice(existing, 1);
      } else {
        newBets[existing] = { matchId: match.id, match: `${match.home} vs ${match.away}`, selection, odd };
      }
      setBets(newBets);
    } else {
      setBets([...bets, { matchId: match.id, match: `${match.home} vs ${match.away}`, selection, odd }]);
    }
  };

  const isSelected = (matchId, selection) => bets.some(b => b.matchId === matchId && b.selection === selection);

  const totalOdds = bets.reduce((a, b) => a * b.odd, 1);
  const potentialWin = (parseFloat(stake) * totalOdds).toFixed(2);

  const placeBet = () => {
    const s = parseFloat(stake);
    if (!s || s < 22) { Alert.alert('Error', 'Minimum stake is KSh 22'); return; }
    if (s > balance) { Alert.alert('Error', 'Insufficient balance'); return; }
    updateBalance(balance - s);
    setBets([]);
    setStake('');
    setSlipVisible(false);
    Alert.alert('🎉 Bet Placed!', `Stake: KSh ${s}\nPotential Win: KSh ${potentialWin}`);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}><Text style={s.headerTitle}>⚽ Sports Betting</Text></View>

      {/* Sport tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabs} contentContainerStyle={{ paddingHorizontal: 12, gap: 4 }}>
        {SPORTS.map((sp, i) => (
          <TouchableOpacity key={i} style={[s.tab, sport === i && s.tabActive]} onPress={() => setSport(i)}>
            <Text style={[s.tabText, sport === i && s.tabTextActive]}>{sp}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <SectionHeader title={sport === 0 ? 'All Matches' : SPORTS[sport]} />
        {MATCHES.map(m => (
          <View key={m.id} style={s.matchCard}>
            {/* Header */}
            <View style={s.matchHeader}>
              <Text style={s.leagueName}>⚽ {m.league}</Text>
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                {m.live && <View style={s.liveBadge}><Text style={s.liveTxt}>LIVE</Text></View>}
                <Text style={s.matchTime}>{m.time}</Text>
              </View>
            </View>

            {/* Teams */}
            <View style={s.teamsRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.teamName}>{m.home}</Text>
                <View style={s.formRow}>
                  {['w','w','d','w','l'].map((r, i) => (
                    <View key={i} style={[s.formDot, r === 'w' ? s.dotW : r === 'd' ? s.dotD : s.dotL]} />
                  ))}
                </View>
              </View>
              <View style={s.scoreBox}>
                <Text style={s.scoreText}>{m.score || 'vs'}</Text>
                <Text style={s.scoreLabel}>{m.live ? 'LIVE' : 'FT'}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={s.teamName}>{m.away}</Text>
                <View style={[s.formRow, { justifyContent: 'flex-end' }]}>
                  {['l','w','w','d','w'].map((r, i) => (
                    <View key={i} style={[s.formDot, r === 'w' ? s.dotW : r === 'd' ? s.dotD : s.dotL]} />
                  ))}
                </View>
              </View>
            </View>

            {/* Odds */}
            <View style={s.oddsRow}>
              {[['1 Home', m.odds[0]], ['X Draw', m.odds[1]], ['2 Away', m.odds[2]]].map(([label, odd]) => (
                <TouchableOpacity
                  key={label}
                  style={[s.oddBtn, isSelected(m.id, label) && s.oddBtnSelected]}
                  onPress={() => addBet(m, label, odd)}
                  activeOpacity={0.8}
                >
                  <Text style={s.oddLabel}>{label}</Text>
                  <Text style={[s.oddValue, isSelected(m.id, label) && { color: Colors.green }]}>{odd}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bet Slip FAB */}
      {bets.length > 0 && (
        <TouchableOpacity style={s.slipFab} onPress={() => setSlipVisible(true)}>
          <Text style={{ fontSize: 20 }}>🎟</Text>
          <View style={s.slipCount}><Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>{bets.length}</Text></View>
        </TouchableOpacity>
      )}

      {/* Bet Slip Modal */}
      <Modal visible={slipVisible} transparent animationType="slide" onRequestClose={() => setSlipVisible(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modal}>
            <View style={s.modalHandle} />
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>🎟 Bet Slip ({bets.length})</Text>
              <TouchableOpacity onPress={() => setSlipVisible(false)}><Text style={{ color: Colors.text2, fontSize: 22 }}>✕</Text></TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 200 }}>
              {bets.map((b, i) => (
                <View key={i} style={s.slipItem}>
                  <Text style={s.slipMatch}>{b.match}</Text>
                  <Text style={s.slipSel}>{b.selection}</Text>
                  <Text style={s.slipOdd}>{b.odd}</Text>
                </View>
              ))}
            </ScrollView>
            <View style={s.slipTotal}>
              <View style={s.slipRow}><Text style={{ color: Colors.text2 }}>Total Odds</Text><Text style={{ color: Colors.text, fontWeight: '800' }}>{totalOdds.toFixed(2)}</Text></View>
              <View style={s.slipRow}>
                <Text style={{ color: Colors.text2 }}>Stake</Text>
                <TextInput style={s.stakeInput} value={stake} onChangeText={setStake} keyboardType="numeric" placeholder="KSh" placeholderTextColor={Colors.text3} />
              </View>
              <View style={{ height: 1, backgroundColor: Colors.border, marginVertical: 8 }} />
              <View style={s.slipRow}>
                <Text style={{ color: Colors.text2 }}>Potential Win</Text>
                <Text style={{ color: Colors.green, fontWeight: '900', fontSize: 18 }}>KSh {isNaN(potentialWin) ? '0.00' : potentialWin}</Text>
              </View>
            </View>
            <Button title="Place Bet" onPress={placeBet} />
            <Text style={{ color: Colors.text3, fontSize: 11, textAlign: 'center', marginTop: 8 }}>Min stake: KSh 22 per bet</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 16, paddingVertical: 14, backgroundColor: Colors.bg2, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.text },
  tabs: { backgroundColor: Colors.bg2, borderBottomWidth: 1, borderBottomColor: Colors.border, maxHeight: 48 },
  tab: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: Colors.green },
  tabText: { fontSize: 13, fontWeight: '600', color: Colors.text2, whiteSpace: 'nowrap' },
  tabTextActive: { color: Colors.green },
  scroll: { padding: 16, paddingBottom: 100 },

  matchCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: 14, marginBottom: 10 },
  matchHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  leagueName: { fontSize: 11, color: Colors.text3, fontWeight: '600', letterSpacing: 0.5 },
  matchTime: { fontSize: 11, color: Colors.text2 },
  liveBadge: { backgroundColor: Colors.red, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  liveTxt: { color: '#fff', fontSize: 10, fontWeight: '800' },
  teamsRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  teamName: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  formRow: { flexDirection: 'row', gap: 3 },
  formDot: { width: 8, height: 8, borderRadius: 4 },
  dotW: { backgroundColor: Colors.green },
  dotD: { backgroundColor: Colors.gold },
  dotL: { backgroundColor: Colors.red },
  scoreBox: { backgroundColor: Colors.bg3, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center', minWidth: 60 },
  scoreText: { fontSize: 18, fontWeight: '800', color: Colors.text },
  scoreLabel: { fontSize: 10, color: Colors.text3, marginTop: 2 },
  oddsRow: { flexDirection: 'row', gap: 6 },
  oddBtn: { flex: 1, backgroundColor: Colors.bg3, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.sm, padding: 8, alignItems: 'center' },
  oddBtnSelected: { borderColor: Colors.green, backgroundColor: Colors.greenGlow },
  oddLabel: { fontSize: 10, color: Colors.text3, marginBottom: 3 },
  oddValue: { fontSize: 15, fontWeight: '800', color: Colors.text },

  slipFab: {
    position: 'absolute', bottom: 80, right: 16,
    backgroundColor: Colors.green, width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.green, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 8,
  },
  slipCount: { position: 'absolute', top: -4, right: -4, backgroundColor: Colors.red, width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modal: { backgroundColor: Colors.bg2, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40 },
  modalHandle: { width: 40, height: 4, backgroundColor: Colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: Colors.text },
  slipItem: { backgroundColor: Colors.bg3, borderRadius: Radius.sm, padding: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  slipMatch: { flex: 1, fontSize: 12, color: Colors.text2 },
  slipSel: { fontSize: 13, fontWeight: '700', color: Colors.text, marginHorizontal: 8 },
  slipOdd: { fontSize: 15, fontWeight: '800', color: Colors.green },
  slipTotal: { backgroundColor: Colors.bg3, borderRadius: Radius.sm, padding: 14, marginVertical: 12 },
  slipRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  stakeInput: { backgroundColor: Colors.bg, borderWidth: 1, borderColor: Colors.border, color: Colors.text, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.sm, fontSize: 15, width: 120, textAlign: 'right' },
});
