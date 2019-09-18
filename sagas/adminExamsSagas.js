import { put } from 'redux-saga/effects'
import  { loadAdminExamsSuccess } from './../actions/actions'

const REACT_APP_API_HOST = require('./../utils.json');

function *getAdminExams(axios){

    const dados = yield axios.get(REACT_APP_API_HOST.api + '/api/files/')
        console.log(dados.data)
        yield put(loadAdminExamsSuccess(dados.data))
    
}
export default getAdminExams
