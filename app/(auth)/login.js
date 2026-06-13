import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/context/AuthContext';
import { Button, Input } from '../../src/components/UI';
import { Colors, Radius } from '../../src/constants/theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    if (!phone.trim()) { Alert.alert('Error', 'Enter your phone number'); return; }
    if (!password) { Alert.alert('Error', 'Enter your password'); return; }
    setLoading(true);
    try {
      await login(phone.trim(), password);
      router.replace('/(tabs)/home');
    } catch (e) {
      Alert.alert('Login Failed', e.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={s.safe}>
      <LinearGradient colors={['#0d2018', Colors.bg]} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

          {/* Logo */}
          <View style={s.logoRow}>
            <View style={s.logoIcon}><Text style={{ fontSize: 22 }}>🎯</Text></View>
            <Text style={s.logoText}>Bet<Text style={{ color: Colors.green }}>Pro</Text></Text>
          </View>

          {/* Card */}
          <View style={s.card}>
            <Text style={s.title}>Welcome Back 👋</Text>
            <Text style={s.sub}>Sign in to your BetPro account</Text>

            {/* Phone */}
            <View style={s.phoneRow}>
              <View style={s.ccBox}>
                <Text style={{ color: Colors.text, fontSize: 14 }}>🇰🇪 +254</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="7XXXXXXXX"
                  keyboardType="phone-pad"
                  maxLength={9}
                  inputStyle={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                />
              </View>
            </View>

            {/* Password */}
            <View style={{ position: 'relative' }}>
              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                placeholder="Enter password"
              />
              <TouchableOpacity style={s.eyeBtn} onPress={() => setShowPass(!showPass)}>
                <Text style={{ fontSize: 18 }}>{showPass ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>

            {/* Forgot */}
            <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 4 }}>
              <Text style={{ color: Colors.green, fontSize: 13, fontWeight: '600' }}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button title="Sign In →" onPress={handleLogin} loading={loading} style={{ marginTop: 8 }} />

            <View style={s.divider}><View style={s.line} /><Text style={s.orText}>or</Text><View style={s.line} /></View>

            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={s.registerText}>
                Don't have an account? <Text style={{ color: Colors.green, fontWeight: '700' }}>Register Free</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Demo hint */}
          <View style={s.hint}>
            <Text style={{ color: Colors.text3, fontSize: 12, textAlign: 'center' }}>
              Demo: use any phone number + password
            </Text>
          </View>

          {/* Bottom */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 16 }}>
            {['⚽ Sports', '🎮 Casino', '💰 M-Pesa'].map(f => (
              <View key={f} style={{ backgroundColor: Colors.bg3, paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full }}>
                <Text style={{ color: Colors.text2, fontSize: 12 }}>{f}</Text>
              </View>
            ))}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: 24, paddingTop: 40 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 32 },
  logoIcon: {
    width: 44, height: 44, backgroundColor: Colors.green,
    borderRadius: 10, alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontSize: 32, fontWeight: '900', color: Colors.text, letterSpacing: 1 },
  card: {
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 20, padding: 24, gap: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20,
    elevation: 10,
  },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text },
  sub: { fontSize: 14, color: Colors.text2, marginTop: -8 },
  phoneRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 0 },
  ccBox: {
    backgroundColor: Colors.bg3, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 12, paddingVertical: 14,
    borderTopLeftRadius: Radius.sm, borderBottomLeftRadius: Radius.sm,
    borderRightWidth: 0,
  },
  eyeBtn: { position: 'absolute', right: 14, top: 36 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  line: { flex: 1, height: 1, backgroundColor: Colors.border },
  orText: { color: Colors.text3, fontSize: 13 },
  registerText: { textAlign: 'center', color: Colors.text2, fontSize: 14 },
  hint: {
    marginTop: 16, padding: 12, backgroundColor: Colors.bg3,
    borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.border,
  },
});
