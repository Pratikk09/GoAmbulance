/**
 * GoAmbulance
 *
 * @format
 */

import React from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';
import {persistor, store} from '@store/index';
import Application from '@navigation/index';
import '@translation/index';

function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <KeyboardProvider>
              <ActionSheetProvider>
                <>
                  <StatusBar barStyle="dark-content" />
                  <Application />
                </>
              </ActionSheetProvider>
            </KeyboardProvider>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
