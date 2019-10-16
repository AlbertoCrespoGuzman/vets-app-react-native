import React, { Component } from 'react';
import { loadChatDialogRequest } from '../actions/actions'
import { connect } from 'react-redux'
import {Text, View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Keyboard } from  'react-native'
import { Dialog, Card, ListItem, Avatar, Icon } from 'react-native-material-ui'
import axios from 'axios'
import PropTypes from 'prop-types'
import Moment from 'moment'
import { TextField } from 'react-native-material-textfield';
const REACT_APP_API_HOST = require('./../utils.json');
import * as Progress from 'react-native-progress';
import {
    ScrollIntoView,
    wrapScrollView
  } from 'react-native-scroll-into-view'

class ChatDialog extends Component {
    constructor(props){
        super(props)
        
        this.state = {
            openDialog: true,
            scroll: 'paper',
            message: '',
            noReadMessageTag: false,
            noReadSendToServer: false,
            maxChatRefresh: 10,
            refreshIntervalTime: 15000,
            chatRefreshInterval: false,
            currentChatRefresh: 0,
            keyboardIsVisible: false,
            scrolledOnce: false
        }
        this.renderMessage = this.renderMessage.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleMessageChange = this.handleMessageChange.bind(this)
        this.postMessage = this.postMessage.bind(this)
        this.getMessages = this.getMessages.bind(this)
        
        this.renderAvatar = this.renderAvatar.bind(this)
        this.scrolledOnce = false
    }
    
    componentDidMount(){
            this.kbShow = Keyboard.addListener('keyboardDidShow', 
            ()=>{
                this.setState({
                    keyboardIsVisible: true
                })
            })
            this.kbHide = Keyboard.addListener('keyboardDidHide', 
            ()=>{
                this.setState({
                    keyboardIsVisible: false
                })
            })
            this.props.loadChatDialogExams(this.props.file._id)
    }
    
    componentDidUpdate() {
        if(this.state.noReadMessageTag && !this.state.noReadSendToServer &&  this.scrolledOnce < 2){
            console.log('componentDidUpdate -> this.messagesNoReadRef (1)', this.scrolledOnce)
            setTimeout(()=>{
                if(this.messagesNoReadRef){
                    this.messagesNoReadRef.scrollIntoView({})
                }
            }, 1500)
            
            this.scrolledOnce = this.scrolledOnce + 1

        }else if(!this.state.noReadMessageTag && !this.state.noReadSendToServer && this.scrolledOnce < 2){
            console.log('componentDidUpdate -> else (2)', this.scrolledOnce)
            setTimeout(()=>{
                if(this.messagesEndRef){
                    this.messagesEndRef.scrollIntoView({})   
                }
            }, 1500)
            this.scrolledOnce = this.scrolledOnce + 1
        }
        if(!this.state.chatRefreshInterval){
            console.log('componentDidUpdate() -> !this.state.chatRefreshInterval', !this.state.chatRefreshInterval)
            this.state.chatRefreshInterval = setInterval(this.getMessages, this.state.refreshIntervalTime);
        }
      }
      getMessages(){
        if(this.state.currentChatRefresh < this.state.maxChatRefresh){
                axios.get(REACT_APP_API_HOST.api + '/api/comments/file/' + this.props.file._id)
                .then((data) => {
                    var comments = data.data
                    if(comments && comments.length > this.props.comments.length){
                        var commentsToAdd = []
                        comments.forEach(comment => {
                            var exists = false
                            this.props.comments.forEach(commentProp => {
                                if(comment._id === commentProp._id) exists = true
                            })
                            if(!exists) commentsToAdd.push(comment)
                        })
                        commentsToAdd.forEach(comment => {
                            this.props.comments.push(comment)
                            this.scrolledOnce = 0
                        })
                        
                //      this.state.noReadMessageTag = false
                //      this.state.noReadSendToServer = false
                    }
                    this.setState({
                        currentChatRefresh: this.state.currentChatRefresh + 1
                    })

                    console.log('this.state.currentChatRefresh', this.state.currentChatRefresh)
                    console.log('this.state.maxChatRefresh', this.state.maxChatRefresh)

                    if(this.state.currentChatRefresh >= this.state.maxChatRefresh){
                        clearInterval(this.state.chatRefreshInterval)
                        this.setState({
                            chatRefreshInterval: false
                        })
                        console.log('clearInterval because -> this.state.currentChatRefresh >= this.state.maxChatRefresh')
                    }
                })
                .catch((error) => {
                    clearInterval(this.state.chatRefreshInterval)
                    this.setState({
                        chatRefreshInterval: false
                    })
                    console.log('clearInterval because ERROR', JSON.stringify(error))
                })
            }
      }
    isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        if(this.state.noReadMessageTag && !this.state.noReadSendToServer){
            const paddingToBottom = 60;
            return layoutMeasurement.height + contentOffset.y >=
              contentSize.height - paddingToBottom;
        }else{
            return false
        }
        
      };
      
      
      componentWillUnmount() {
            this.kbShow.remove()
            this.kbHide.remove()
            clearInterval(this.state.chatRefreshInterval)
            this.setState({
                chatRefreshInterval: false
            })
            console.log('clearInterval because UNMOUNT')
      }
    handleClose(){
        console.log('handleClose')
        this.setState({
            openDialog: false,
            noReadMessageTag: false
        })
        this.props.removeDialog()
    }
    handleMessageChange(e){
        this.setState({
            message: e
        })
    }
    postMessagesRead(){
        console.log('postMessagesRead')
        axios.patch(REACT_APP_API_HOST.api + '/api/comments/read/file/' + this.props.file._id, {})
                .then(file => {
                    this.setState({
                        noReadSendToServer: true
                    })
                    if(file && file.data){
                        this.props.updateFile(file.data)
                    }
                    
                })
                .catch(err => {
                    console.log('error trying to update as read messages')
                })
    }
    renderAvatar(comment, position){
        if(comment.sender.admin){
            if(comment.sender._id === this.props.auth.user._id  && position === 'left'){
                return (
                    <TouchableOpacity 
                    style={{float: comment.sender._id === this.props.auth.user._id ? 'left' : 'right'}} 
                    onPress={()=>{ 
                       console.log('comment.sender._id', comment.sender._id)
                       console.log('this.props.auth.user._id', this.props.auth.user._id)
                   }}>
                       <View >
                           <Avatar icon="person" color="white" style={{backgroundColor:'#2196f3'}}/>
                       </View>
                   </TouchableOpacity>
                )
            }else if(comment.sender._id != this.props.auth.user._id  && position === 'right'){
                return (
                    <TouchableOpacity 
                    style={{float: comment.sender._id === this.props.auth.user._id ? 'left' : 'right'}} 
                    onPress={()=>{ 
                       console.log('comment.sender._id', comment.sender._id)
                       console.log('this.props.auth.user._id', this.props.auth.user._id)
                   }}>
                       <View >
                           <Avatar icon="person" color="white" style={{backgroundColor:'#2196f3'}}/>
                       </View>
                   </TouchableOpacity>
                )
            }else{
                <View />
            }
            
        }else{
            if(comment.sender._id === this.props.auth.user._id  && position === 'left'){
                return (
                    <TouchableOpacity
                        style={{backgroundColor: 'orange', float: comment.sender._id === this.props.auth.user._id ? 'left' : 'right'}} 
                        onPress={()=>{ }}>
                        <View >
                            <Avatar iconColor="white"
                                    text={comment.sender.completename 
                                            && comment.sender.completename.length
                                            && comment.sender.completename.length > 0 ? 
                                            comment.sender.completename.substring(0,1) : comment.sender.username.substring(0,1)} />
                            
                        </View>
                    </TouchableOpacity>
                )
            }else if(comment.sender._id != this.props.auth.user._id  && position === 'right'){
                return (
                    <TouchableOpacity
                        style={{backgroundColor: 'orange', float: comment.sender._id === this.props.auth.user._id ? 'left' : 'right'}} 
                        onPress={()=>{ }}>
                        <View >
                            <Avatar iconColor="white"
                                    text={comment.sender.completename 
                                            && comment.sender.completename.length
                                            && comment.sender.completename.length > 0 ? 
                                            comment.sender.completename.substring(0,1) : comment.sender.username.substring(0,1)} />
                            
                        </View>
                    </TouchableOpacity>
                )
            }else{
                <View />
            }
            
        }
    }
    renderMessage(comment, index){
        const { classes } = this.props
        console.log(comment == null)
        if(!this.state.noReadMessageTag && !comment.read && comment.sender._id != this.props.auth.user._id){
            return (
                    <ScrollIntoView immediate={true} key={comment._id} 
                    ref={ref => (this.messagesNoReadRef = ref)} >
                        <View style={{width:'100%',alignSelf:'center', marginRight:20}}>
                            {!this.state.noReadMessageTag && !comment.read && comment.sender._id != this.props.auth.user._id && (
                                <View  >
                                    <Card style={{backgroundColor: '#e3f2fd'}}>
                                            <View style={{backgroundColor: '#e3f2fd'}}>
                                                <Text style={{fontSize: 10,alignSelf: 'center'}}>Mensagens não lidas</Text>
                                            </View>
                                    </Card>   
                                </View>
                            )}
                        </View>
                        {!this.state.noReadMessageTag && !comment.read && comment.sender._id != this.props.auth.user._id && (this.state.noReadMessageTag = true)}
                        <View key={comment._id} style={{width:'100%',alignSelf:'center', marginRight:20}}>
                        <View style={{maxWidth:'80%',  flex:1, flexDirection:'row', marginLeft: comment.sender._id === this.props.auth.user._id ? 0 : 'auto'}}>
                                    { /* this.renderAvatar(comment, 'left') */ }
                                    
                                    <Card >
                                        <View style={{backgroundColor: comment.sender.admin ? '#e3f2fd' : 'white', padding: 10}}>
                                            <View style={{float: 'left',marginRight:10}}>
                                                    <Text style={{fontSize:11}}>
                                                        {comment.sender.completename}
                                                    </Text>
                                            </View>
                                            <View style={{float: 'left'}}>
                                                    <Text  style={{fontSize:10, color: 'gray'}}>
                                                        {convertDate(comment.sentTime) }
                                                    </Text>
                                            </View>
                                            </View>
                                            <View style={{backgroundColor: comment.sender.admin ? '#e3f2fd' : 'white', paddingLeft: 10,paddingRight:10, paddingBottom: 10,  paddingTop: 0}}>
                                                <Text >
                                                        {comment.message}
                                                </Text>
                                            </View>
                                    </Card>
                                    { /*this.renderAvatar(comment, 'right') */}
                            </View>
                            
                    </View>
                    </ScrollIntoView>
                    
            )
        }else{   
            return(
            <View key={comment._id} style={{width:'100%',alignSelf:'center', marginRight:20}}>
                <View style={{maxWidth:'80%',  flex:1, flexDirection:'row', marginLeft: comment.sender._id === this.props.auth.user._id ? 0 : 'auto'}}>
                            { /* this.renderAvatar(comment, 'left') */ }
                            
                            <Card >
                                <View style={{backgroundColor: comment.sender.admin ? '#e3f2fd' : 'white', padding: 10}}>
                                    <View style={{float: 'left',marginRight:10}}>
                                            <Text style={{fontSize:11}}>
                                                {comment.sender.completename}
                                            </Text>
                                    </View>
                                    <View style={{float: 'left'}}>
                                            <Text  style={{fontSize:10, color: 'gray'}}>
                                                {convertDate(comment.sentTime) }
                                            </Text>
                                    </View>
                                    </View>
                                    <View style={{backgroundColor: comment.sender.admin ? '#e3f2fd' : 'white', paddingLeft: 10,paddingRight:10, paddingBottom: 10,  paddingTop: 0}}>
                                        <Text >
                                                {comment.message}
                                        </Text>
                                    </View>
                            </Card>
                              { /*this.renderAvatar(comment, 'right') */}
                    </View>
                     
            </View>
            )
        }
    }

    
    postMessage(){
        if(this.state.message && this.state.message.length > 0){
            Keyboard.dismiss()

            const comment = {
                message: this.state.message,
                file: this.props.file._id,
                sender: this.props.auth.user._id,
                receiver: this.props.auth.user._id === this.props.file.user._id ? this.props.file.admin._id : this.props.file.user._id,
            }
            this.setState({
                message: '',
                currentChatRefresh: 0
            })
            axios.post(REACT_APP_API_HOST.api + '/api/comments/file/' + this.props.file._id, comment)
                    .then(res => {
                        this.scrolledOnce = 0
                        if(this.props.comments && this.props.comments.length < 5){
                            this.postMessagesRead()
                        }
                        this.props.loadChatDialogExams(this.props.file._id)
                    })
                    .catch(err => {
                        console.log(err)
                        alert('Erro enviand sua mensagem, por favor conferir se está conectado na internet.')
                    })
        }
    }

    
    render() { 
        const scrollIntoViewOptions ={
            align: 'auto',
            animated: true,
        }
        return (
           
            <View
                style={{ blackgroundColor: 'white', borderRadius: 3, flex:1, margin: 10, height:'100%', width: '100%', position: 'absolute', top: 0, bottom: 0, left:0, right:0 }}
                
            >
                <KeyboardAvoidingView 
                        style={{flex: 1, height: '100%' , marginTop:10, marginBottom: 10}}
                    >
                        <View style={{flex:1, width:'100%', flexDirection: 'row', minHeight:'10%'}}>
                            <View style={{float: 'left', width: '90%'}}>
                                    <Text style={{fontSize: 18}}>Messagens do exame: {this.props.file.displayName} </Text>
                            </View>
                            <View style={{float:'right', width: '10%',marginVertical: 'auto', alignSelf:'center'}}>
                                        <TouchableOpacity 
                                            edge="end" color="inherit" 
                                            onPress={this.handleClose} style={{float: 'right',marginVertical: 'auto' }}>
                                            <View style={{float: 'right',marginVertical: 'auto' }}>
                                                <Icon name="close" color='black' size={20}/>
                                            </View>
                                            </TouchableOpacity>
                            </View>
                        </View>
                        <CustomScrollView  
                                style={{backgroundColor: '#eee', marginTop: 10, maxHeight:'80%', minHeight:'80%'}} id="messages-container"
                                scrollIntoViewOptions={scrollIntoViewOptions}
                                onScroll={({nativeEvent}) => {
                                    if (!this.props.isFetching &&this.isCloseToBottom(nativeEvent)) {
                                        this.postMessagesRead()
                                    }
                                  }}
                                  scrollEventThrottle={400}>
                                  {this.props.isFetching && (
                                      <View style={{flex:1, width:'100%',backgroundColor: '#eee', minHeight: 300, margin:10}} >
                                        <Progress.Circle size={30} borderWidth={2} indeterminate={true} style={{alignSelf:'center'}}/>
                                     </View>
                                  )}
                                  {!this.props.isFetching && (
                                      <View style={{flex:1, width:'100%',backgroundColor: '#eee', minHeight: 300, margin:10,}} >
                                            {(this.state.noReadMessageTag = false)}
                                            {this.props.comments && this.props.comments.length > 0 && this.props.comments.map(this.renderMessage) }
                                            {!this.state.noReadMessageTag &&(
                                                <ScrollIntoView immediate={true}
                                                ref={ref => (this.messagesEndRef = ref)} >
                                                    <View style={{backgroundColor:'transparent', height: 1}} onBlur={()=>{ console.log('focused')}}/>
                                                </ScrollIntoView>
                                            )}
                                            
                                    </View>
                                  )}
                            
                        </CustomScrollView>
                    <View style={{flex: 1, flexDirection:'row', minHeight:'10%', maxHeight:'20%', justifyContent:'space-around', alignItems: 'center', borderColor: 'blue', borderRadius:10}}>
                                <TextField
                                    label="Faça sua pergunta..."
                                    value={this.state.message}
                                    onChangeText={this.handleMessageChange}
                                    containerStyle={{width:'80%', alignSelf:'center',marginVertical: 'auto'}}
                                    style={{marginTop:0}}
                                />  
                                <TouchableOpacity 
                                 edge="end" color="inherit" 
                                 onPress={this.postMessage}
                                 style={{float: 'right',marginVertical: 'auto' }} >
                                    <View style={{float: 'right',marginVertical: 'auto' }}>
                                        <Icon name="send" />
                                    </View>
                                </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
            </View>
        );
    }
}
const CustomScrollView = wrapScrollView(ScrollView);

ChatDialog.propTypes = {
    auth: PropTypes.object.isRequired
}
function convertDate(date){
    return  Moment(date).format('DD/MM/YYYY hh:mm A')
    }
const mapStateToProps = (state) => {
    return {
        isFetching: state.chatDialog.isFetching,
        comments: state.chatDialog.data,
        error: state.chatDialog.error,
        auth: state.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadChatDialogExams: (file_id) => dispatch(loadChatDialogRequest(file_id))
    }
} 
export default connect(mapStateToProps, mapDispatchToProps)(ChatDialog)