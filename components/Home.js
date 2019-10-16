import React, { Component } from 'react';
import { StyleSheet, Text, View, Image,ImageBackground } from 'react-native';
import {PermissionsAndroid} from 'react-native';
import backgroundImage from './../assets/img/carousel1.jpg'
import logoImage from './../assets/img/logo_white.png'
import { Button } from 'react-native-material-ui';
import navigation from './../navigation'

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
        }else{
          if(nextProps.auth.isAuthenticated) {
            console.log('pushhhhh me to')
            this.props.history.push(navigation.exams)
          }
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
            <ImageBackground source={backgroundImage}  style={{width: '100%', height: '100%', alignItems: 'center',flex:1, justifyContent:'center'  }}>
              <Image  source={logoImage} style={{ width: 200, height: 100}}/>
              <Button onPress={()=>{
                this.props.history.push(navigation.login);
            }}  style={{ position: 'absolute', right: '0', zIndex:999999}} raised primary text="Consulte seu exame" />    
            </ImageBackground>
        );
    }
}