import Loading from '@/components/Loading';
import React from 'react';
import { View } from 'react-native';

/**
 * This component shows a loading animation until `_layout.tsx` loads.
 * 
 * On `_layout.tsx` it sends the user to different locations 
 * depending on if the user is logged in.
 * 
 * @requires _layout.tsx needs to send the user to locations other than here
 */
const Index = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Loading />
    </View>
  )
}
export default Index;