/**
 * @format
 */

import {AppRegistry,YellowBox} from 'react-native';
import App from './src/components/App';
import {name as appName} from './app.json';


YellowBox.ignoreWarnings([
    'Require cycle:'
  ])
AppRegistry.registerComponent(appName, () => App);
