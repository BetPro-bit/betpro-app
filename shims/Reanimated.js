// Web shim for react-native-reanimated
import { Animated } from 'react-native';

export const useSharedValue = (val) => ({ value: val });
export const useAnimatedStyle = (fn) => { try { return fn(); } catch(e) { return {}; } };
export const withTiming = (val) => val;
export const withSpring = (val) => val;
export const withRepeat = (val) => val;
export const withSequence = (...vals) => vals[vals.length - 1];
export const withDelay = (_, val) => val;
export const runOnJS = (fn) => fn;
export const runOnUI = (fn) => fn;
export const cancelAnimation = () => {};
export const useAnimatedRef = () => ({ current: null });
export const useAnimatedScrollHandler = () => () => {};
export const useAnimatedGestureHandler = () => () => {};
export const useDerivedValue = (fn) => ({ value: fn() });
export const interpolate = (val, input, output) => {
  if (!input || !output || input.length < 2) return output ? output[0] : val;
  const index = input.findIndex((v, i) => val <= v || i === input.length - 1);
  if (index === 0) return output[0];
  const t = (val - input[index - 1]) / (input[index] - input[index - 1]);
  return output[index - 1] + t * (output[index] - output[index - 1]);
};
export const Extrapolation = { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' };
export const Easing = {
  linear: (t) => t,
  ease: (t) => t,
  quad: (t) => t * t,
  cubic: (t) => t * t * t,
  bezier: () => (t) => t,
  in: (fn) => fn,
  out: (fn) => fn,
  inOut: (fn) => fn,
};
export const FadeIn = {};
export const FadeOut = {};
export const SlideInRight = {};
export const SlideOutLeft = {};
export const ZoomIn = {};
export const ZoomOut = {};
export const Layout = {};
export const createAnimatedComponent = (Component) => Component;

export default {
  View: Animated.View,
  Text: Animated.Text,
  ScrollView: Animated.ScrollView,
  Image: Animated.Image,
  FlatList: Animated.FlatList,
  createAnimatedComponent: (Component) => Component,
};
