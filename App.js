import React, { useState }  from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { NativeRouter, Route, Link } from "react-router-native";
import store from './store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './setAuthToken'
import { setCurrentUser, logoutUser } from './actions/authentication';
import { COLOR, ThemeContext, getTheme } from 'react-native-material-ui';
import { Toolbar } from 'react-native-material-ui';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Home from './components/Home';
import Exams from './components/Exams';

import {AsyncStorage} from 'react-native';
import { Navigation } from 'react-native-navigation';

Navigation.registerComponent('drawer.Home', () => HomeScreen);
Navigation.registerComponent('drawer.Login', () => LoginScreen);
 
_storeData = async () => { 
  try {
    console.log('_storeData function...')
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      if(jwtToken != null && jwtToken && jwtToken.length > 0) {
        setAuthToken(jwtToken);
        const decoded = jwt_decode(jwtToken);
        store.dispatch(setCurrentUser(decoded));

        const currentTime = Date.now() / 1000;
        if(decoded.exp < currentTime) {
          store.dispatch(logoutUser());
          window.location.href = '/login'
        }
      }else{
        console.log('No token saved')
      }
  } catch (error) {
    // Error saving data
  }
};

function App() {
  const [theme, setTheme] = useState({
    palette: {
      type: "light",
      primary: {
        main: '#13aa52'
      },
      secondary: {
        main: '#E33E7F'
      },
      accent: {
        main: '#E33E7F'
      },
      background: {
        default: "#e6e6e6"
      }
    }
  })
  
  const uiTheme = {
    palette: {
      primaryColor: COLOR.green500,
    },
    toolbar: {
      container: {
        height: 50,
      },
    },
  };
  _storeData() 
  return (
    <View style={styles.container}>
    <Provider store = { store }>
      <ThemeContext.Provider value={getTheme(uiTheme)}>
      <NativeRouter>
              <Navbar navigation={Navigation}/>
              <Route exact path="/login" component={ Login } />
              <Route exact path="/" component={ Home } />
              <Route exact path="/exams" component={ Exams } />
          </NativeRouter>
      </ThemeContext.Provider>
      </Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App