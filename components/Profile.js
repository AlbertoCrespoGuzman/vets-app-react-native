import React, { Component } from 'react';
import { loadProfileRequest } from '../actions/actions'
import { Animated, StyleSheet, Text, View, TouchableOpacity,ScrollView, Button, Picker, TextInput } from 'react-native';
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
        this.handleCompleteName = this.handleCompleteName.bind(this)
        this.handleCpf = this.handleCpf.bind(this)
        this.handleAddress = this.handleAddress.bind(this)
        this.handleCrmv = this.handleCrmv.bind(this)
        this.handleTechnicalSupport = this.handleTechnicalSupport.bind(this)
        this.handlePhone = this.handlePhone.bind(this)
        this.handleinputConfirmPasswordChange = this.handleinputConfirmPasswordChange.bind(this)
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
       
        this.props.profile[varName] = e
        this.setState({})
        
    }
    handleCompleteName(e) {
        this.props.profile['completename'] = e
        this.setState({})
    }
    handleCpf(e) {
        this.props.profile['cpf'] = e
        this.setState({})
    }
    handleAddress(e) {
        this.props.profile['address'] = e
        this.setState({})
    }
    handleCrmv(e) {
        this.props.profile['crmv'] = e
        this.setState({})
    }
    handleTechnicalSupport(e) {
        this.props.profile['technicalSupport'] = e
        this.setState({})
    }
    handlePhone(e) {
        console.log(e)
        this.props.profile.phone = e
        this.setState({})
    }
    handleinputPasswordChange(e){
        this.setState({
            password: e
        })
    }
    handleinputConfirmPasswordChange(e){
        this.setState({
            confirmPassword: e
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
            <ScrollView style={{marginTop:40, width: '100%', height: '100%', flex: 1}}>
               <View style={{marginTop:40, width: '100%', height: '100%', flex: 1, justifyContent: 'center', alignContent:'center'}}>
               
               
               <Card style={{marginTop:10, width: '70%', padding:15}}>
                    <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-around'}}
                    value={this.state.tab} onChange={this.handleTabsChange} aria-label="Meu Perfil">
                        <Button title="Detalhes Conta" onPress={()=> {this.setState({tab:0})}} color={this.state.tab === 0 ? 'grey' : '#0188FE'}/>
                        <Button title="Modificar Senha" onPress={()=> {this.setState({tab:1})}}  color={this.state.tab === 1 ? 'grey' : '#0188FE'}/>
                    </View>
                <View >
                {!this.props.isFetching && this.state.tab === 0 && (
                        <View style={{padding:15}}>
                            <View className={classes.Text} fullWidth={true} >
                                <Text htmlFor="type-error">Tipo de Usuário</Text>
                                <Picker
                                selectedValue={this.props.profile.type}
                                onValueChange={this.handleSelectTypeChange}
                                name="type"
                                enabled={false}
                                >
                                    <Picker.Item value={0} label="Escolha tipo de usuário" />
                                    
                                    <Picker.Item value={1} label="Cliente"/>
                                    <Picker.Item value={2} label="Clínica"/>
                                    <Picker.Item value={3} label="Veterinário"/>
                                    <Picker.Item value={4} label="Administrador"/>
                                </Picker>
                                
                            </View>
                                <View className={classes.Text} fullWidth={true} margin={PropTypes.margin}>
                                    <Text htmlFor="username">E-mail</Text>
                                    <TextInput
                                    type="text"
                                    id="username"
                                    name="username"
                                    aria-describedby="username-text"
                                    value={ this.props.profile.username }
                                    editable={false}
                                    />
                                    
                                </View>
                                <View className={classes.Text} fullWidth={true} >
                                    <Text htmlFor="completename">Nome Completo</Text>
                                    <TextInput
                                    type="text"
                                    id="completename"
                                    name="completename"
                                    onChangeText={this.handleCompleteName}
                                    aria-describedby="completename-text"
                                    value={ this.props.profile.completename }
                                    editable={this.state.isEditing}
                                    />
                                    {this.props.error.completename && (<Text id="completename-text">{this.props.error.completename}</Text>)}
                                </View>
                                <View className={classes.Text} fullWidth={true} >
                                    <Text htmlFor="cpf">CPF/CNPJ</Text>
                                    <TextInput
                                    type="text"
                                    id="cpf"
                                    name="cpf"
                                    aria-describedby="cpf-text"
                                    onChangeText={ this.handleCpf }
                                    value={ this.props.profile.cpf }
                                    editable={this.state.isEditing}
                                    />
                                    {this.props.error.cpf && (<Text id="cpf-text">{this.props.error.cpf}</Text>)}
                                </View>
                                <View className={classes.Text} fullWidth={true} >
                                    <Text htmlFor="phone">Phone</Text>
                                    <TextInput
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    aria-describedby="phone-text"
                                    onChangeText={ this.handlePhone }
                                    value={ this.props.profile.phone }
                                    editable={this.state.isEditing}
                                    />
                                    {this.props.error.phone && (<Text id="phone-text">{this.props.error.phone}</Text>)}
                                </View>
                                {!this.props.profile.vet && (
                                
                                <View className={classes.Text} fullWidth={true} >
                                    <Text htmlFor="address">Endereço</Text>
                                    <TextInput
                                    type="text"
                                    id="address"
                                    name="address"
                                    aria-describedby="address-text"
                                    onChangeText={ this.handleAddress }
                                    value={ this.props.profile.address }
                                    editable={this.state.isEditing}
                                    />
                                    {this.props.error.address && (<Text id="address-text">{this.props.error.address}</Text>)}
                                </View>
                                )}
                                { (this.props.profile.vet || this.props.profile.clinic) && (
                                
                                <View className={classes.Text} fullWidth={true} >
                                    <Text htmlFor="cmrv">CMRV</Text>
                                    <TextInput
                                    type="text"
                                    id="cmrv"
                                    name="cmrv"
                                    aria-describedby="cmrv-text"
                                    onChangeText={ this.handleCrmv }
                                    value={ this.props.profile.cmrv }
                                    editable={this.state.isEditing}
                                    />
                                    {this.props.error.cmrv && (<Text id="cmrv-text">{this.props.error.cmrv}</Text>)}
                                </View>
                                )}
                                {this.props.profile.clinic && (
                                
                                <View className={classes.Text} fullWidth={true} >
                                    <Text htmlFor="technicalSupport">Responsável Técnico</Text>
                                    <TextInput
                                    type="text"
                                    id="technicalSupport"
                                    name="technicalSupport"
                                    aria-describedby="technicalSupport-text"
                                    onChangeText={ this.handleTechnicalSupport }
                                    value={ this.props.profile.technicalSupport }
                                    editable={this.state.isEditing}
                                    />
                                    {this.props.error.technicalSupport && (<Text id="technicalSupport-text">{this.props.error.technicalSupport}</Text>)}
                                </View>
                                )}
                            <View style={{width:'100%'}}>
                                {!this.state.isSaving && !this.state.isEditing && 
                                    (<Button 
                                        onPress={this.changeToEditProfile}
                                        title="Modificar Perfil"/>
                                         )}
                                {!this.state.isSaving && this.state.isEditing &&
                                    (<Button 
                                        onPress={this.saveProfile} 
                                        title="Salvar"/>
                                        )}
                                
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
                            </View>
                            )}
                </View>
                <View >
                {!this.props.isFetching && this.state.tab === 1 && (
                        <View style={{padding:15}}>
                            
                                <View className={classes.Text} fullWidth={true} margin={PropTypes.margin}>
                                    <Text htmlFor="password">Nova senha</Text>
                                    <TextInput
                                    type="password"
                                    id="password"
                                    name="password"
                                    onChangeText={this.handleinputPasswordChange}
                                    aria-describedby="password-text"
                                    value={ this.state.password }
                                    />
                                </View>
                                <View className={classes.Text} fullWidth={true} margin={PropTypes.margin}>
                                    <Text htmlFor="confirmPassword">Confirmar Nova senha</Text>
                                    <TextInput
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    onChangeText={this.handleinputConfirmPasswordChange}
                                    aria-describedby="confirmPassword-text"
                                    value={ this.state.confirmPassword }
                                    />
                                </View>
                                {this.state.errors && (<Text id="password-text" style={{color: 'red'}}>{this.state.errors}</Text>)}
                                {this.state.message && (<Text id="password-text" style={{color: 'green'}}>{this.state.message}</Text>)}
                            <View>
                                {!this.state.isSaving &&
                                    (<Button 
                                        onPress={this.postPassword}
                                        title="Redefinir Senha"/>
                                        )}
                                
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
                            </View>
                            )}
                </View>
                </Card>
                </View>
            </ScrollView>
        );
    }
}
const classes = {}
function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <View
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        <Text p={3}>{children}</Text>
      </View>
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