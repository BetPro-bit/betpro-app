import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authAPI } from '../../src/services/api';
import { Button } from '../../src/components/UI';
import { Colors, Radius } from '../../src/constants/theme';

export default function OTPScreen() {
  const { phone } = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputs = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => { if (t <= 1) { clearInterval(interval); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (text, idx) => {
    const newOtp = [...otp];
    newOtp[idx] = text;
    setOtp(newOtp);
    if (text && idx < 5) inputs.current[idx + 1]?.focus();
    if (!text && idx > 0) inputs.current[idx - 1]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) { Alert.alert('Error', 'Enter the complete 6-digit code'); return; }
    setLoading(true);
    try {
      await authAPI.verifyOTP(phone, code);
      Alert.alert('Success! 🎉', 'Account verified. Please login.', [
        { text: 'Login Now', onPress: () => router.replace('/(auth)/login') }
      ]);
    } catch (e) {
      Alert.alert('Invalid OTP', e.message || 'Try again');
    } finally { setLoading(false); }
  };

  const resendOTP = () => {
    if (timer > 0) return;
    setTimer(60);
    Alert.alert('Sent!', 'New OTP sent to ' + phone);
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 32 }}>
          <Text style={{ color: Colors.text2, fontSize: 15 }}>← Back</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 60, textAlign: 'center', marginBottom: 16 }}>📱</Text>
        <Text style={s.title}>Verify Phone</Text>
        <Text style={s.sub}>Enter the 6-digit code sent to{'\n'}
          <Text style={{ color: Colors.green, fontWeight: '700' }}>{phone || '+254 7XX XXX XXX'}</Text>
        </Text>

        {/* OTP inputs */}
        <View style={s.otpRow}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={r => inputs.current[i] = r}
              style={[s.otpInput, digit && s.otpFilled]}
              value={digit}
              onChangeText={t => handleChange(t.slice(-1), i)}
              keyboardType="numeric"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <Button title="Verify & Activate" onPress={handleVerify} loading={loading} style={{ marginTop: 8 }} />

        <TouchableOpacity onPress={resendOTP} style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ color: Colors.text2, fontSize: 14 }}>
            Didn't receive code?{' '}
            <Text style={{ color: timer > 0 ? Colors.text3 : Colors.green, fontWeight: '700' }}>
              {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
            </Text>
          </Text>
        </TouchableOpacity>

        <View style={s.hint}>
          <Text style={{ color: Colors.text3, fontSize: 12, textAlign: 'center' }}>Demo OTP: 123456</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1, padding: 24, paddingTop: 32 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, textAlign: 'center', marginBottom: 8 },
  sub: { fontSize: 14, color: Colors.text2, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  otpRow: { flexDirection: 'row', gap: 10, justifyContent: 'center', marginBottom: 24 },
  otpInput: {
    width: 50, height: 58, borderRadius: Radius.sm,
    backgroundColor: Colors.bg3, borderWidth: 2, borderColor: Colors.border,
    color: Colors.text, fontSize: 24, fontWeight: '700', textAlign: 'center',
  },
  otpFilled: { borderColor: Colors.green },
  hint: {
    marginTop: 24, padding: 12, backgroundColor: Colors.bg3,
    borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.border,
  },
});
