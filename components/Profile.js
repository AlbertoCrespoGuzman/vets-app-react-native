import React, { Component } from 'react';
import { loadProfileRequest } from '../actions/actions'
import { Animated, StyleSheet, Text, View, TouchableOpacity,ScrollView, Button } from 'react-native';
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Card, Icon, Badge, ListItem } from 'react-native-material-ui'
import * as Progress from 'react-native-progress';
import axios from 'axios'
const REACT_APP_API_HOST = require('./../utils.json');

class Profile extends Component {
    
    constructor(props){
        
        super(props)
        this.state = {
            isEditing: false,
            tab: 0,
            errors: false,
            message: false,
            isSaving: false,
            password: '',
            confirmPassword: ''
        }
        
        this.handleTabsChange = this.handleTabsChange.bind(this)
        this.changeToEditProfile = this.changeToEditProfile.bind(this)
        this.handleinputChange = this.handleinputChange.bind(this)
        this.saveProfile = this.saveProfile.bind(this)
        this.postPassword = this.postPassword.bind(this)
        this.handleinputPasswordChange = this.handleinputPasswordChange.bind(this)
    }
    
    componentDidMount(){
        this.props.loadProfile()
    }
    postPassword(){
        if(!this.state.password || !this.state.confirmPassword){
            this.setState({
                errors: 'Por favor, escrever senha e confirmar a mesma'
            })
        }else if(this.state.password.length < 6){
            this.setState({
                errors: 'A senha deve ter minimo 6 carateres'
            })
        }else if(this.state.password != this.state.confirmPassword){
            this.setState({
                errors: 'A senhas não coincidem'
            })
        }else{
            this.setState({
                isSaving: true
            })
            axios.post(REACT_APP_API_HOST.api + '/api/users/reset_password', {password: this.state.password,
                                                     confirmPassword: this.state.confirmPassword})
                  .then(res => {
                        this.setState({
                            password: '',
                            confirmPassword: '',
                            isSaving: false,
                            message: 'Sua senha foi redefinida com sucesso'
                        })
                  })
                  .catch(err => {
                      if(err && err.response){
                          this.setState({
                              errors: JSON.stringify(err.response),
                              isSaving: false
                          })
                      }
                  })
        }
        
    }
    saveProfile(){
        this.setState({
            isSaving: true
        })
        axios.post(REACT_APP_API_HOST.api + '/api/users/me', this.props.profile)
            .then(res => {
                
                this.props.profile.address = res.data.address
                this.props.profile.cpf = res.data.cpf
                this.props.profile.completename = res.data.completename
                
                this.setState({
                    isSaving: false,
                    isEditing: false
                })
            })
            .catch(err => {
                this.setState({
                    errors: JSON.stringify(err.response)
                })
            })
    }
    handleinputChange(e) {
        const varName = e.target.name
        this.props.profile[varName] = e.target.value
        this.setState({})
    }
    handleinputPasswordChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSelectTypeChange(e){
        this.setState({
            type: e.target.value
        })
    }
    handleSubmitProfile(e) {
        e.preventDefault();
    }
    handleTabsChange(event, newValue){
        this.setState({
            tab: newValue
        })
    }
    changeToEditProfile(){
        this.setState({
            isEditing : true
        })
    }
    render() {
        return (
            <View style={{marginTop:120, marginLeft:80, width: '100%', height: '100%', flex: 1, justifyContent: 'center', alignContent:'center'}}>
               <Text>
                   Meu Perfil
               </Text>
               
               <Card style={{marginTop:10, width: '70%'}}>
                    <View 
                    value={this.state.tab} onChange={this.handleTabsChange} aria-label="Meu Perfil">
                    <View label="Detalhes Conta" {...a11yProps(0)} />
                    <View label="Modificar Senha" {...a11yProps(1)} />
                    </View>
                <TabPanel value={this.state.tab} index={0}>
                {!this.props.isFetching &&(
                        <form onSubmit={ this.handleSubmitProfile }>
                            <View className={classes.Text} fullWidth={true} >
                                <Text htmlFor="type-error">Tipo de Usuário</Text>
                                <select
                                value={this.props.profile.type}
                                onChange={this.handleSelectTypeChange}
                                name="type"
                                disabled={true}
                                >
                                    <ListItem value={0}>
                                        <em>Escolha tipo de usuário</em>
                                    </ListItem>
                                    <ListItem value={1}>Cliente</ListItem>
                                    <ListItem value={2}>Clínica</ListItem>
                                    <ListItem value={3}>Veterinário</ListItem>
                                    <ListItem value={4}>Administrador</ListItem>
                                </select>
                                
                            </View>
                                <Text className={classes.Text} fullWidth={true} margin={PropTypes.margin}>
                                    <Text htmlFor="username">E-mail</Text>
                                    <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    onChange={this.handleinputChange}
                                    aria-describedby="username-text"
                                    onChange={ this.handleinputChange }
                                    value={ this.props.profile.username }
                                    disabled={true}
                                    />
                                    
                                </Text>
                                <Text className={classes.Text} fullWidth={true} >
                                    <Text htmlFor="completename">Nome Completo</Text>
                                    <input
                                    type="text"
                                    id="completename"
                                    name="completename"
                                    onChange={this.handleinputChange}
                                    aria-describedby="completename-text"
                                    value={ this.props.profile.completename }
                                    disabled={!this.state.isEditing}
                                    />
                                    {this.props.error.completename && (<Text id="completename-text">{this.props.error.completename}</Text>)}
                                </Text>
                                <Text className={classes.Text} fullWidth={true} >
                                    <Text htmlFor="cpf">CPF/CNPJ</Text>
                                    <input
                                    type="text"
                                    id="cpf"
                                    name="cpf"
                                    aria-describedby="cpf-text"
                                    onChange={ this.handleinputChange }
                                    value={ this.props.profile.cpf }
                                    disabled={!this.state.isEditing}
                                    />
                                    {this.props.error.cpf && (<Text id="cpf-text">{this.props.error.cpf}</Text>)}
                                </Text>
                                <Text className={classes.Text} fullWidth={true} >
                                    <Text htmlFor="address">Endereço</Text>
                                    <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    aria-describedby="address-text"
                                    onChange={ this.handleinputChange }
                                    value={ this.props.profile.address }
                                    disabled={!this.state.isEditing}
                                    />
                                    {this.props.error.address && (<Text id="address-text">{this.props.error.address}</Text>)}
                                </Text>
                            
                            <View>
                                {!this.state.isSaving && !this.state.isEditing && 
                                    (<Button 
                                        onClick={this.changeToEditProfile}
                                        fullWidth={true} variant="outlined" color="primary" type="submit" >
                                        Modificar Perfil
                                </Button> )}
                                {!this.state.isSaving && this.state.isEditing &&
                                    (<Button 
                                        onClick={this.saveProfile}
                                        fullWidth={true} variant="contained" color="primary" type="submit" >
                                        Salvar
                                </Button> )}
                                
                                {this.state.isSaving && (
                                    <View
                                    container
                                    spacing={0}
                                    direction="column"
                                    alignItems="center"
                                    justify="center"
                                    style={{marginTop: 30}}
                                >
                                         <Progress.Circle size={10} borderWidth={1} indeterminate={true} />
                                    </View>
                                )}
                            </View>
                            </form>
                            )}
                </TabPanel>
                <TabPanel value={this.state.tab} index={1}>
                {!this.props.isFetching &&(
                        <form onSubmit={ this.handleSubmitProfile }>
                            
                                <Text className={classes.Text} fullWidth={true} margin={PropTypes.margin}>
                                    <Text htmlFor="password">Nova senha</Text>
                                    <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    onChange={this.handleinputPasswordChange}
                                    aria-describedby="password-text"
                                    value={ this.state.password }
                                    />
                                </Text>
                                <Text className={classes.Text} fullWidth={true} margin={PropTypes.margin}>
                                    <Text htmlFor="confirmPassword">Confirmar Nova senha</Text>
                                    <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    onChange={this.handleinputPasswordChange}
                                    aria-describedby="confirmPassword-text"
                                    value={ this.state.confirmPassword }
                                    />
                                </Text>
                                {this.state.errors && (<Text id="password-text" style={{color: 'red'}}>{this.state.errors}</Text>)}
                                {this.state.message && (<Text id="password-text" style={{color: 'green'}}>{this.state.message}</Text>)}
                            <CardActions>
                                {!this.state.isSaving &&
                                    (<Button 
                                        onClick={this.postPassword}
                                        fullWidth={true} variant="contained" color="primary" type="submit" >
                                        Redefinir Senha
                                </Button> )}
                                
                                {this.state.isSaving && (
                                    <View
                                    container
                                    spacing={0}
                                    direction="column"
                                    alignItems="center"
                                    justify="center"
                                    style={{marginTop: 30}}
                                >
                                         <Progress.Circle size={10} borderWidth={1} indeterminate={true} />
                                    </View>
                                )}
                            </CardActions>
                            </form>
                            )}
                </TabPanel>
                </Card>
            </View>
        );
    }
}
const classes = {}
function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <Text
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        <Text p={3}>{children}</Text>
      </Text>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  
  

const mapStateToProps = (state) => {
    return {
        isFetching: state.profile.isFetching,
        profile: state.profile.data,
        error: state.profile.error
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadProfile: () => dispatch(loadProfileRequest())
    }
} 

export default connect(mapStateToProps, mapDispatchToProps)(Profile)