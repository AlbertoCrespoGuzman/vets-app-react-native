import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/authentication';
import { withRouter } from 'react-router-native';
import { Button } from 'react-native-material-ui';
import { Toolbar } from 'react-native-material-ui';
import { StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Route, Link } from "react-router-native";
import Home from './Home';
import Drawer from './Drawer';
import Login from './Login';
import navigation from './../navigation'


const drawerWidth = 240;


class Navbar extends Component {


    constructor(props){
        super(props)
        this.state = {
            openDrawer: false,
            activeScreen: ''
        }
        this.changeScreen = this.changeScreen.bind(this)
        this.toogleDrawer = this.toogleDrawer.bind(this)
    }

    componentDidMount(){
     
        _this = this
        setTimeout(function (){
            if(_this.props.auth.isAuthenticated) {
                _this.props.history.push(navigation.exams)
            }
        }, 700)
       
    }
    toogleDrawer() {
        this.setState({
            openDrawer: !this.state.openDrawer
        })    
    }
    changeScreen(newScreen){
        this.setState({
            activeScreen: newScreen
        })
        switch(newScreen){
            case 'Exams':
            this.props.history.push(navigation.exams)
            this.toogleDrawer()
            break;
            case 'Profile':
            this.props.history.push(navigation.profile)
            this.toogleDrawer()
            break;
        }
        
    }
    render() {
       
        const {isAuthenticated, user} = this.props.auth;   
        
        const authLinks = (
     //       <div className={classes.sectionDesktop} style={{ position: 'absolute', right: '0'}}>
     //           <Button  onClick={this.onLogout.bind(this)} color="inherit" style={{ marginRight:30}} >Sair</Button>
     //       </div>
     ''
        )
      const guestLinks = (
            <Button onPress={()=>{
                this.props.history.push(navigation.login);
            }}  style={{ position: 'absolute', right: '0', zIndex:999999}} raised primary text="Consulte seu exame" />
      )
      
        return(
            <View style={{ width:'100%',top:0, position:'absolute' }}>
                <Toolbar
                        leftElement= {isAuthenticated ? "menu" : "" }
                        rightElement={
                            isAuthenticated ? authLinks : guestLinks
                        }
                        onLeftElementPress={() => this.toogleDrawer()} 
                    />
                    { isAuthenticated ? <Drawer activeScreen={this.state.activeScreen} changeScreen={this.changeScreen} openDrawer={this.state.openDrawer} logoutUser={this.props.logoutUser} history={this.props.history} user={user}/> : <Text></Text>}
            </View>
          
        )
    }
}

Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

//ResponsiveDrawer.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
 //   container: PropTypes.object,
 // };
export default connect(mapStateToProps, { logoutUser })(withRouter(Navbar));