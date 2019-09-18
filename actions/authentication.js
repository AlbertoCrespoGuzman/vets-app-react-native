import axios from 'axios';
import { GET_ERRORS, SET_CURRENT_USER } from './types';
import setAuthToken from '../setAuthToken';
import jwt_decode from 'jwt-decode'
const REACT_APP_API_HOST = require('./../utils.json');
import {AsyncStorage} from 'react-native';

export const registerUser = (user, history) => dispatch => {
    _retrieveData = async () => {
        try {
            const jwtToken = await AsyncStorage.getItem('jwtToken');
            if(jwtToken != null && jwtToken && jwtToken.length > 0){
                axios.defaults.headers.common['Authorization'] = jwtToken
                
                axios.post(REACT_APP_API_HOST.api + '/api/users/register', user)
                        .then(res => history.push('/users?registrationSucessfull=true'))
                        .catch(err => {
                            console.log(JSON.stringify(err.response))
                            dispatch({
                                type: GET_ERRORS,
                                payload: err.response.data
                            }); 
                        });
            }else{
                history.push('/login')
            }
        } catch (error) {
          // Error retrieving data
        }
      };
      
    
}

export const loginUser = (user) => dispatch => {
    axios.post(REACT_APP_API_HOST.api + '/api/users/login', user)
            .then(res => {
                console.log('res', res.data)
                const { token } = res.data;
                _storeData = async () => {
                    try {
                        await AsyncStorage.setItem('jwtToken', token)
                        setAuthToken(token);
                        const decoded = jwt_decode(token);
                        dispatch(setCurrentUser(decoded));
                    } catch (error) {
                      // Error saving data
                    }
                  };
                  _storeData()
            })
            .catch((err) => {
                console.log(err)
                console.log(err.response)
                if(err && err.response){
                    dispatch({
                        type: GET_ERRORS,
                        payload: err.response.data
                    })
                }else{
                    console.log(err)
                }
                
            });
}

export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

export const logoutUser = (history) => dispatch => {
    axios.post(REACT_APP_API_HOST.api + '/api/users/logout', {})
            .then(res => {
                _removeData()
            })
            .catch(err => {
                console.log('LOGOUT ->> error !!!-> ', err)
            })

    _removeData = async () => {
        try {
                await AsyncStorage.removeItem('jwtToken')
                await AsyncStorage.removeItem('fcmToken')
                setAuthToken(false);
                dispatch(setCurrentUser({}))
                history.push('/login')
        } catch (error) {
          // Error saving data
        }
      };
}