import { put } from 'redux-saga/effects'
import  { loadExamsSuccess } from './../actions/actions'
const REACT_APP_API_HOST = require('./../utils.json');

function *getExams(axios, actions){
    
    const dados = yield axios.get(REACT_APP_API_HOST.api + '/api/files/')
        console.log(dados.data)
        yield put(loadExamsSuccess(dados.data))
    
}
export default getExams