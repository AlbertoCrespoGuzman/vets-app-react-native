import { put } from 'redux-saga/effects'
import  { loadUsersSuccess } from './../actions/actions'


function *getUsers(axios, actions){
    console.log('usersSagas')    
    const dados = yield axios.get(REACT_APP_API_HOST.api + '/api/users/')
        console.log(dados.data)
        yield put(loadUsersSuccess(dados.data))
    
}
export default getUsers