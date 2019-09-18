import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {PermissionsAndroid} from 'react-native';

export default class Home extends Component {
    constructor(props){
        super(props)
        this.getPermission = this.getPermission.bind(this)
        this.state = {
            
        }
    }
    componentDidMount(){
        if(Platform.OS === 'android' && !this.state.androidPermission) {
            this.getPermission()
        }
    }
    getPermission = async () => {
        try {
            if (Platform.OS === 'android') {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                  title: 'Parapeti',
                  message:
                    'Parapeti precisa da sua autorização para fazer download e salvar os exames no seu dispositivo',
                  buttonNegative: 'Cancelar',
                  buttonPositive: 'Aceitar',
                },
              )// I used redux saga here. 'yield' keywoard. You don't have to use that. You can use async - await or Promises.
        
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                this.setState({
                    androidPermission: true
                })
              }
            } else {
              // iOS here, so you can go to your Save flow directly
            }
          } catch (e) {
            console.log(e);
          }
    }
    render() {
        return (
            <Text  style={{backgroundColor: 'red', marginTop:100}}>
                Home Component 22222222
            </Text>
        );
    }
}