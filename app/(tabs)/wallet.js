import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Modal, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../src/context/AuthContext';
import { Button, SectionHeader } from '../../src/components/UI';
import { paymentsAPI } from '../../src/services/api';
import { Colors, Radius } from '../../src/constants/theme';

const QUICK_AMOUNTS = [100, 500, 1000, 2000, 5000];

const TRANSACTIONS = [
  { type: 'deposit',    icon: '💰', desc: 'M-Pesa Deposit',     amount: +2000, date: '2026-06-10' },
  { type: 'win',        icon: '🏆', desc: 'Football Bet Win',   amount: +1500, date: '2026-06-10' },
  { type: 'bet',        icon: '⚽', desc: 'Arsenal vs Chelsea', amount: -500,  date: '2026-06-09' },
  { type: 'withdrawal', icon: '📤', desc: 'M-Pesa Withdrawal',  amount: -1000, date: '2026-06-08' },
  { type: 'deposit',    icon: '💰', desc: 'M-Pesa Deposit',     amount: +3000, date: '2026-06-07' },
];

export default function WalletScreen() {
  const { balance, updateBalance } = useAuth();
  const [depModal, setDepModal] = useState(false);
  const [withModal, setWithModal] = useState(false);
  const [depPhone, setDepPhone] = useState('');
  const [depAmount, setDepAmount] = useState('');
  const [withPhone, setWithPhone] = useState('');
  const [withAmount, setWithAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState(TRANSACTIONS);

  const handleDeposit = async () => {
    if (!depPhone || depPhone.length < 9) { Alert.alert('Error', 'Enter valid phone number'); return; }
    const amt = parseInt(depAmount);
    if (!amt || amt < 20) { Alert.alert('Error', 'Minimum deposit is KSh 20'); return; }
    setLoading(true);
    try {
      const res = await paymentsAPI.deposit(depPhone, amt);
      if (res.success) {
        setDepModal(false);
        Alert.alert('📱 STK Push Sent!',
          `Enter your M-Pesa PIN on ${depPhone} to confirm KSh ${amt} deposit.\n\nCheckout ID: ${res.data?.checkoutRequestId}`,
          [{ text: 'OK', onPress: () => {
            // Poll or simulate confirmation after 5s
            setTimeout(() => {
              updateBalance(balance + amt);
              setTransactions(prev => [{
                type: 'deposit', icon: '💰',
                desc: 'M-Pesa Deposit', amount: +amt,
                date: new Date().toISOString().split('T')[0],
              }, ...prev]);
              Alert.alert('✅ Deposit Confirmed!', `KSh ${amt} added to your BetPro wallet`);
            }, 5000);
          }}]
        );
      }
    } catch (e) {
      Alert.alert('Deposit Failed', e.message);
    } finally { setLoading(false); }
  };

  const handleWithdraw = async () => {
    const amt = parseInt(withAmount);
    if (!withPhone) { Alert.alert('Error', 'Enter M-Pesa number'); return; }
    if (!amt || amt < 100) { Alert.alert('Error', 'Minimum withdrawal is KSh 100'); return; }
    if (amt > balance) { Alert.alert('Error', 'Insufficient balance'); return; }
    setLoading(true);
    try {
      const res = await paymentsAPI.withdraw(withPhone, amt);
      updateBalance(balance - amt);
      setTransactions(prev => [{ type: 'withdrawal', icon: '📤', desc: 'M-Pesa Withdrawal', amount: -amt, date: new Date().toISOString().split('T')[0] }, ...prev]);
      setWithModal(false);
      Alert.alert('✅ Withdrawal Sent!', `KSh ${amt} sent to +254${withPhone}. Ref: ${res.reference}`);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Text style={s.headerTitle}>💰 Wallet</Text>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Balance card */}
        <LinearGradient colors={['#0a1a12', '#0d1a2e']} style={s.balCard}>
          <Text style={s.balLabel}>Total Balance</Text>
          <Text style={s.balAmount}>KSh {balance.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</Text>
          <Text style={s.bonusText}>Bonus: KSh 500.00</Text>
          <View style={s.actionRow}>
            <TouchableOpacity style={s.actionBtn} onPress={() => setDepModal(true)}>
              <Text style={{ fontSize: 20, marginBottom: 4 }}>💳</Text>
              <Text style={s.actionBtnText}>Deposit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.actionBtn, { borderColor: Colors.border }]} onPress={() => setWithModal(true)}>
              <Text style={{ fontSize: 20, marginBottom: 4 }}>📤</Text>
              <Text style={[s.actionBtnText, { color: Colors.text2 }]}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Transactions */}
        <SectionHeader title="📋 Recent Transactions" />
        {transactions.map((t, i) => (
          <View key={i} style={s.txnItem}>
            <View style={[s.txnIcon, { backgroundColor: t.amount > 0 ? Colors.greenGlow : 'rgba(255,71,87,0.1)' }]}>
              <Text style={{ fontSize: 18 }}>{t.icon}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={s.txnDesc}>{t.desc}</Text>
              <Text style={s.txnDate}>{t.date}</Text>
            </View>
            <Text style={[s.txnAmount, { color: t.amount > 0 ? Colors.green : Colors.red }]}>
              {t.amount > 0 ? '+' : ''}KSh {Math.abs(t.amount).toLocaleString()}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* ── DEPOSIT MODAL ── */}
      <Modal visible={depModal} transparent animationType="slide" onRequestClose={() => setDepModal(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modal}>
            <View style={s.modalHandle} />
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>💳 Deposit via M-Pesa</Text>
              <TouchableOpacity onPress={() => setDepModal(false)}>
                <Text style={{ color: Colors.text2, fontSize: 22 }}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* M-Pesa branding */}
            <View style={s.mpesaBadge}>
              <Text style={{ fontSize: 28 }}>📱</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: Colors.text, fontWeight: '700', fontSize: 14 }}>Lipa na M-Pesa</Text>
                <Text style={{ color: Colors.text2, fontSize: 12 }}>Instant deposit to your wallet</Text>
              </View>
              <View style={s.instantBadge}><Text style={{ color: Colors.green, fontSize: 11, fontWeight: '700' }}>Instant</Text></View>
            </View>

            {/* Phone input */}
            <Text style={s.inputLabel}>M-Pesa Phone Number</Text>
            <View style={s.phoneRow}>
              <View style={s.dialBox}><Text style={{ color: Colors.text, fontSize: 14 }}>🇰🇪 +254</Text></View>
              <TextInput
                style={s.phoneInput} placeholder="7XXXXXXXX" value={depPhone}
                onChangeText={setDepPhone} keyboardType="phone-pad" maxLength={9}
                placeholderTextColor={Colors.text3}
              />
            </View>

            {/* Amount input */}
            <Text style={[s.inputLabel, { marginTop: 12 }]}>Amount (KSh)</Text>
            <TextInput
              style={s.amountInput} placeholder="Min KSh 20" value={depAmount}
              onChangeText={setDepAmount} keyboardType="numeric"
              placeholderTextColor={Colors.text3}
            />

            {/* Quick amounts */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 12 }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {QUICK_AMOUNTS.map(a => (
                  <TouchableOpacity key={a} style={s.quickBtn} onPress={() => setDepAmount(String(a))}>
                    <Text style={{ color: Colors.text, fontSize: 13, fontWeight: '600' }}>KSh {a.toLocaleString()}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <Button title="💳 Pay Now" onPress={handleDeposit} loading={loading} />
            <Text style={s.modalNote}>You will receive an M-Pesa STK push. Enter your PIN to confirm.</Text>
          </View>
        </View>
      </Modal>

      {/* ── WITHDRAW MODAL ── */}
      <Modal visible={withModal} transparent animationType="slide" onRequestClose={() => setWithModal(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modal}>
            <View style={s.modalHandle} />
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>📤 Withdraw via M-Pesa</Text>
              <TouchableOpacity onPress={() => setWithModal(false)}>
                <Text style={{ color: Colors.text2, fontSize: 22 }}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={s.balRow}>
              <Text style={{ color: Colors.text2, fontSize: 13 }}>Available Balance</Text>
              <Text style={{ color: Colors.green, fontWeight: '700', fontSize: 15 }}>KSh {balance.toFixed(2)}</Text>
            </View>

            <Text style={[s.inputLabel, { marginTop: 12 }]}>Withdrawal Amount (KSh)</Text>
            <TextInput
              style={s.amountInput} placeholder="Min KSh 100" value={withAmount}
              onChangeText={setWithAmount} keyboardType="numeric"
              placeholderTextColor={Colors.text3}
            />

            <Text style={[s.inputLabel, { marginTop: 12 }]}>M-Pesa Number</Text>
            <View style={s.phoneRow}>
              <View style={s.dialBox}><Text style={{ color: Colors.text, fontSize: 14 }}>🇰🇪 +254</Text></View>
              <TextInput
                style={s.phoneInput} placeholder="7XXXXXXXX" value={withPhone}
                onChangeText={setWithPhone} keyboardType="phone-pad" maxLength={9}
                placeholderTextColor={Colors.text3}
              />
            </View>

            <Button title="📤 Withdraw Now" onPress={handleWithdraw} loading={loading} style={{ marginTop: 16 }} />
            <Text style={s.modalNote}>Withdrawals processed instantly to your M-Pesa</Text>
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
  scroll: { padding: 16, paddingBottom: 100, gap: 12 },

  balCard: { borderRadius: Radius.lg, padding: 24, borderWidth: 1, borderColor: Colors.border2 },
  balLabel: { color: Colors.text3, fontSize: 13, marginBottom: 6 },
  balAmount: { fontSize: 44, fontWeight: '900', color: Colors.green },
  bonusText: { color: Colors.text3, fontSize: 12, marginTop: 4, marginBottom: 20 },
  actionRow: { flexDirection: 'row', gap: 12 },
  actionBtn: {
    flex: 1, alignItems: 'center', padding: 14,
    backgroundColor: Colors.green, borderRadius: Radius.md,
  },
  actionBtnText: { fontSize: 14, fontWeight: '700', color: '#000' },

  txnItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: Radius.sm, padding: 14, marginBottom: 8 },
  txnIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  txnDesc: { fontSize: 14, fontWeight: '600', color: Colors.text },
  txnDate: { fontSize: 12, color: Colors.text3, marginTop: 2 },
  txnAmount: { fontSize: 15, fontWeight: '800' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modal: { backgroundColor: Colors.bg2, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40 },
  modalHandle: { width: 40, height: 4, backgroundColor: Colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: Colors.text },
  mpesaBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.bg3, borderRadius: Radius.sm, padding: 12, marginBottom: 16,
  },
  instantBadge: { backgroundColor: Colors.greenGlow, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border2 },
  inputLabel: { fontSize: 13, color: Colors.text2, fontWeight: '500', marginBottom: 6 },
  phoneRow: { flexDirection: 'row', alignItems: 'center' },
  dialBox: { backgroundColor: Colors.bg3, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 12, paddingVertical: 14, borderTopLeftRadius: Radius.sm, borderBottomLeftRadius: Radius.sm, borderRightWidth: 0 },
  phoneInput: { flex: 1, backgroundColor: Colors.bg3, borderWidth: 1, borderColor: Colors.border, color: Colors.text, paddingHorizontal: 12, paddingVertical: 13, borderTopRightRadius: Radius.sm, borderBottomRightRadius: Radius.sm, fontSize: 15 },
  amountInput: { backgroundColor: Colors.bg3, borderWidth: 1, borderColor: Colors.border, color: Colors.text, paddingHorizontal: 14, paddingVertical: 13, borderRadius: Radius.sm, fontSize: 15 },
  quickBtn: { backgroundColor: Colors.bg3, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full },
  balRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Colors.bg3, borderRadius: Radius.sm, padding: 12, marginBottom: 4 },
  modalNote: { fontSize: 12, color: Colors.text3, textAlign: 'center', marginTop: 10 },
});
