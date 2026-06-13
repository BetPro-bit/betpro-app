import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authAPI } from '../../src/services/api';
import { Button, Input } from '../../src/components/UI';
import { Colors, Radius } from '../../src/constants/theme';

const COUNTRIES = [
  { code: 'KE', flag: '🇰🇪', name: 'Kenya', dial: '+254' },
  { code: 'TZ', flag: '🇹🇿', name: 'Tanzania', dial: '+255' },
  { code: 'UG', flag: '🇺🇬', name: 'Uganda', dial: '+256' },
  { code: 'GH', flag: '🇬🇭', name: 'Ghana', dial: '+233' },
  { code: 'NG', flag: '🇳🇬', name: 'Nigeria', dial: '+234' },
];

export default function RegisterScreen() {
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleRegister = async () => {
    if (!phone.trim() || phone.length < 9) { Alert.alert('Error', 'Enter a valid phone number'); return; }
    if (password.length < 8) { Alert.alert('Error', 'Password must be at least 8 characters'); return; }
    if (password !== confirm) { Alert.alert('Error', 'Passwords do not match'); return; }
    if (!terms) { Alert.alert('Error', 'Please accept Terms & Conditions'); return; }
    setLoading(true);
    try {
      await authAPI.register(country.dial + phone, password, country.code);
      router.push({ pathname: '/(auth)/otp', params: { phone: country.dial + phone } });
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={s.safe}>
      <LinearGradient colors={['#0d2018', Colors.bg]} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

          <View style={s.header}>
            <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
              <Text style={{ color: Colors.text2, fontSize: 15 }}>← Back</Text>
            </TouchableOpacity>
            <Text style={s.logoText}>Bet<Text style={{ color: Colors.green }}>Pro</Text></Text>
            <View style={{ width: 60 }} />
          </View>

          <View style={s.card}>
            <Text style={s.title}>Create Account 🚀</Text>
            <Text style={s.sub}>Join thousands of winners</Text>

            {/* Country picker */}
            <View>
              <Text style={s.label}>Country</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
                {COUNTRIES.map(c => (
                  <TouchableOpacity
                    key={c.code}
                    onPress={() => setCountry(c)}
                    style={[s.countryChip, country.code === c.code && s.countryActive]}
                  >
                    <Text style={{ fontSize: 18 }}>{c.flag}</Text>
                    <Text style={{ color: country.code === c.code ? Colors.green : Colors.text2, fontSize: 13, fontWeight: '600' }}>
                      {c.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Phone */}
            <View>
              <Text style={s.label}>Phone Number</Text>
              <View style={s.phoneRow}>
                <View style={s.dialCode}>
                  <Text style={{ color: Colors.text, fontSize: 14 }}>{country.flag} {country.dial}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Input
                    value={phone} onChangeText={setPhone}
                    placeholder="7XXXXXXXX" keyboardType="phone-pad" maxLength={9}
                    inputStyle={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                  />
                </View>
              </View>
            </View>

            {/* Password */}
            <View style={{ position: 'relative' }}>
              <Input
                label="Password" value={password} onChangeText={setPassword}
                secureTextEntry={!showPass} placeholder="Min 8 characters"
              />
              <TouchableOpacity style={s.eyeBtn} onPress={() => setShowPass(!showPass)}>
                <Text style={{ fontSize: 18 }}>{showPass ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>

            <Input
              label="Confirm Password" value={confirm} onChangeText={setConfirm}
              secureTextEntry placeholder="Repeat password"
            />

            {/* Terms */}
            <TouchableOpacity style={s.checkRow} onPress={() => setTerms(!terms)}>
              <View style={[s.checkbox, terms && s.checkboxOn]}>
                {terms && <Text style={{ fontSize: 12, color: '#000' }}>✓</Text>}
              </View>
              <Text style={s.termsText}>
                I agree to the <Text style={{ color: Colors.green }}>Terms & Conditions</Text> and confirm I am 18+ years old
              </Text>
            </TouchableOpacity>

            <Button title="Create Account & Verify →" onPress={handleRegister} loading={loading} />

            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ textAlign: 'center', color: Colors.text2, fontSize: 14 }}>
                Already have an account? <Text style={{ color: Colors.green, fontWeight: '700' }}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: 24, paddingTop: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  backBtn: { padding: 4 },
  logoText: { fontSize: 26, fontWeight: '900', color: Colors.text },
  card: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 20, padding: 24, gap: 16 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.text },
  sub: { fontSize: 14, color: Colors.text2, marginTop: -8 },
  label: { fontSize: 13, color: Colors.text2, fontWeight: '500', marginBottom: 4 },
  countryChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.full,
    backgroundColor: Colors.bg3, borderWidth: 1, borderColor: Colors.border, marginRight: 8,
  },
  countryActive: { borderColor: Colors.green, backgroundColor: Colors.greenGlow },
  phoneRow: { flexDirection: 'row', alignItems: 'flex-end' },
  dialCode: {
    backgroundColor: Colors.bg3, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 12, paddingVertical: 14,
    borderTopLeftRadius: Radius.sm, borderBottomLeftRadius: Radius.sm, borderRightWidth: 0,
  },
  eyeBtn: { position: 'absolute', right: 14, top: 36 },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  checkbox: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', marginTop: 1,
  },
  checkboxOn: { backgroundColor: Colors.green, borderColor: Colors.green },
  termsText: { flex: 1, fontSize: 13, color: Colors.text2, lineHeight: 20 },
});
