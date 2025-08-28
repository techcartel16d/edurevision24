import 'react-native-reanimated'; // ✅ सबसे पहला import
import 'react-native-gesture-handler'; // ✅ फिर ये

import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import Toast from 'react-native-toast-message';
import { Text, TextInput } from 'react-native';

// Disable font scaling globally
if (Text.defaultProps == null) Text.defaultProps = {};
if (TextInput.defaultProps == null) TextInput.defaultProps = {};

Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps.allowFontScaling = false;

const Root = () => {
    const { theme } = useTheme();

    return (
        <PaperProvider theme={theme}>
            <App />
        </PaperProvider>
    );
};

const Main = () => (
    <Provider store={store}>
        <ThemeProvider>
            <Root />
        </ThemeProvider>
        <Toast />
    </Provider>
);

AppRegistry.registerComponent(appName, () => Main);