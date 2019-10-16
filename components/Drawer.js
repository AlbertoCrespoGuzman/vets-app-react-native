import React, { Component } from 'react';
import { Animated, StyleSheet, Text, View, Image } from 'react-native';
import { Drawer as DrawerView, Avatar} from 'react-native-material-ui';
import logoImage from './../assets/img/logo_white.png'

export default class Drawer extends Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }
     componentDidMount(){
    }
    render() {
        
        return (
            <View
            style={{
                backgroundColor: 'rgba(52, 52, 52, 0.8)',
                width:this.props.openDrawer ? '100%': '0%', 
                zIndex: 3000,
                height:'500%',
                }}>
                <Animated.View style={{
                    backgroundColor: '#0188FE', background: '#0188FE',
                    width:this.props.openDrawer ? '70%': '0%', 
                    height:'100%',
                    zIndex: 3000}}>
                    <DrawerView style={{backgroundColor: '#0188FE', background: '#0188FE'}}>   
                        <DrawerView.Header style={{backgroundColor: '#0188FE', background: '#0188FE'}}>
                            <DrawerView.Header.Account
                                style={{
                                    accountContainer: {color:'white', backgroundColor: '#0188FE'},
                                    container: {color:'white', backgroundColor: '#0188FE'},
                                }}
                                avatar={<Image  source={logoImage} style={{ width: 80, height: 40}}/>}
                                accounts={[
                                ]}
                                footer={{
                                    style:{backgroundColor: '#0188FE'},
                                    dense: false,
                                    centerElement: {
                                        primaryText: this.props.user ?  this.props.user.completename : '',
                                        secondaryText:  this.props.user ? this.props.user.username : '', 
                                    },
                                }}
                            /> 
                        </DrawerView.Header>
                        <DrawerView.Section
                            divider
                            title="Serviços"   
                            items={[      
                                { icon: 'picture-as-pdf', value: 'Exames', active: this.props.activeScreen === 'Exams' ,
                                onPress:  ()=>{
                                    this.props.changeScreen('Exams')
                                },
                                },
                                
                            ]} 
                        
                        />
                        <DrawerView.Section
                            title="Pessoal"
                            items={[
                                { icon: 'contact-mail', value: 'Perfil', active: this.props.activeScreen === 'Profile',
                                    onPress:  ()=>{
                                        this.props.changeScreen('Profile')
                                    },
                                },
                                { icon: 'exit-to-app', value: 'Sair',
                                onPress:  ()=>{
                                    this.props.logoutUser(this.props.history)
                                },
                                },   
                            ]}
                        />

                    </DrawerView>
                </Animated.View>
            </View>
        );
    }
}