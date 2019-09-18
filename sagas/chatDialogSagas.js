import { put } from 'redux-saga/effects'
import  { loadChatDialogSuccess } from './../actions/actions'

const REACT_APP_API_HOST = require('./../utils.json');

function *getChatDialog(axios, actions){
        const dados = yield axios.get(REACT_APP_API_HOST.api + '/api/comments/file/' + actions.file_id)
        
        yield put(loadChatDialogSuccess(dados.data, actions.file_id))
    
}
export default getChatDialog