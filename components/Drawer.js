import React, { Component } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Drawer as DrawerView, Avatar} from 'react-native-material-ui';

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
            <Animated.View style={{
                width:this.props.openDrawer ? '70%': '0%', 
                height:'100%',
                zIndex: 3000}}>
                <DrawerView >   
                    <DrawerView.Header >
                        <DrawerView.Header.Account
                            avatar={<Avatar text="A" />}
                            accounts={[
                                { avatar: <Avatar text="B" /> },
                                { avatar: <Avatar text="C" /> },
                            ]}
                            footer={{
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
        );
    }
}