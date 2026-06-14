import React from 'react';
import { View } from 'react-native';

// Web-safe LinearGradient replacement
export function LinearGradient({ colors, style, children, start, end, ...props }) {
  const angle = start && end
    ? Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI)
    : 180;
  
  const gradient = colors ? colors.join(', ') : '#000, #000';
  
  return (
    <View
      style={[
        style,
        {
          background: `linear-gradient(${angle}deg, ${gradient})`,
        },
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

export default LinearGradient;
