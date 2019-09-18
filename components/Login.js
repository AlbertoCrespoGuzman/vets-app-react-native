import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../actions/authentication'
import { Card, Button } from 'react-native-material-ui';
import { NativeRouter, Route, Link } from "react-router-native";
import { TextField } from 'react-native-material-textfield';
import {AsyncStorage} from 'react-native';
import firebase from 'react-native-firebase'

class Login extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            errors: {},
            android_token: '',
            iphone_token: ''
        }
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleEmailChange(e) {
        e = e.replace(" ", "")
        this.setState({
            username: e
        })
    }
    handlePasswordChange(e) {
        this.setState({
            password: e
        })
    }
    handleSubmit(e) {
        
        
        this.checkPermission()
        console.log('puto token antes de enviar...', this.state.android_token)
        const user = {
            username: this.state.username,
            password: this.state.password,
            android_token:this.state.android_token,
            iphone_token: this.state.iphone_token
        }
        this.props.loginUser(user);
    }

    componentDidMount() {
        this.checkPermission()
        if(this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
    }
    getPushNotificationToken =async () =>{
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        console.log("before fcmToken: ", fcmToken);
        if (!fcmToken) {
          fcmToken = await firebase.messaging().getToken();
          if (fcmToken) {
            console.log("after fcmToken: ", fcmToken);
            this.setState({
                android_token: fcmToken
            })
            await AsyncStorage.setItem('fcmToken', fcmToken);
          }
        }else{
            this.setState({
                android_token: fcmToken
            })
        }
      }
      
       requestPermission = async() => {
        firebase.messaging().requestPermission()
          .then(() => {
            this.getPushNotificationToken();
          })
          .catch(error => {
            console.log('permission rejected');
          });
      }
       checkPermission = async() => {
           console.log('checkingFirebasePermission!!!!-----')
        firebase.messaging().hasPermission()
          .then(enabled => {
              console.log('checkPermission')
            if (enabled) {
              console.log("Permission granted");
              this.getPushNotificationToken();
            } else {
              console.log("Request Permission");
              this.requestPermission();
            }
          });
      }
    componentWillReceiveProps(nextProps) {
        if(nextProps.auth.isAuthenticated) {
            this.props.history.push('/')
        }
        if(nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    render() {
        const {errors} = this.state
        return(
            <View style={{flex:1, width: '100%', height:'100%', alignContent: 'center'}}>
                <Card style={{flex:1, width: '100%', height:'100%', alignContent: 'center', padding: 10}}>
                    <Text style={{marginBottom: 10}}>Parapeti Login</Text>
                    <TextField
                        label='E-mail'
                        id="username"
                        value={ this.state.username }
                        name="username"
                        onChangeText={this.handleEmailChange}
                        autoCapitalize="none" 
                        containerStyle={{marginBottom: 10}}
                    />
                    {errors.username && (<Text id="username-text" style={{color: 'red',marginTop:2, marginBottom: 10}}>{errors.username}</Text>)}
                    <TextField
                    secureTextEntry={true}
                    label='Senha'
                    id="password"
                    value={ this.state.password }
                    name="password"
                    onChangeText={this.handlePasswordChange}
                    containerStyle={{marginBottom: 10}}
                    />
                    {errors.password && (<Text id="password-text" style={{color: 'red'}}>{errors.password}</Text>)}
                    <Button fullWidth={true} raised primary style={{marginBottom: 10}} type="submit" text="Login" onPress={this.handleSubmit}/>
                   
                    <Link component={ AdapterLink } to="/forgot_password">
                                    <Text>Esqueceu sua senha?</Text> 
                     </Link>       
                    
                </Card>
            </View>
        )
    }
}
const AdapterLink = React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />);

//  const [labelWidth, setLabelWidth] = React.useState(0)
//  const [name, setName] = React.useState('Composed TextField')
// /  const labelRef = React.useRef(null)
  
Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth, 
    errors: state.errors
})

export  default connect(mapStateToProps, { loginUser })(Login)
