import { loadDataSuccess } from "../actions"
import { put } from  'redux-saga/effects'

const REACT_APP_API_HOST = require('./../utils.json');

import axios from 'axios'

function *postLogin(){
    const response = yield axios.post()
    yield put(loadDataSuccess(response))
}

export default postLogin