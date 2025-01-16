import Loading from '@/components/Loading';
import { View } from 'react-native';

import { registerRootComponent } from 'expo';

/**
 * This component shows a loading animation until `_layout.tsx` loads.
 * 
 * On `_layout.tsx` it sends the user to different locations 
 * depending on if the user is logged in.
 * 
 * @requires _layout.tsx needs to send the user to locations other than here
 */
function Index() {
    return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Loading />
    </View>
  )
}

let AppEntryPoint = Index;

if (process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true') {
  AppEntryPoint = require('../.storybook').default;
  registerRootComponent(AppEntryPoint);
} 

export default AppEntryPoint;
/** When Index is exported default, Expo Router automatically `registerRootComponent` */