import { put } from 'redux-saga/effects'
import  { loadProfileSuccess } from './../actions/actions'
const REACT_APP_API_HOST = require('./../utils.json');

function *getProfile(axios, actions){
    console.log('profileSagas')    
    const dados = yield axios.get(REACT_APP_API_HOST.api + '/api/users/me')
        yield put(loadProfileSuccess(dados.data))
    
}
export default getProfile