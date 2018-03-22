import React from 'react'
import RX from 'reactxp'
import ReactXpApp from './src/App'
import { AppRegistry } from 'react-native';

RX.App.initialize(true, true);
RX.UserInterface.setMainView(<ReactXpApp />);


AppRegistry.registerComponent('helloworldxpxp', () => ReactXpApp);