import React, { Component } from 'react';
import { loadExamsRequest } from '../actions/actions'
import { connect } from 'react-redux'
import Moment from 'moment'
import axios from 'axios'
import { Animated, StyleSheet, Text, View, TouchableOpacity,ScrollView } from 'react-native';
import * as Progress from 'react-native-progress';
import { Table, TableWrapper, Row, Cell, Rows } from 'react-native-table-component';
import { Card, Icon, Badge } from 'react-native-material-ui';
import PropTypes from 'prop-types';
const REACT_APP_API_HOST = require('./../utils.json');
import RNFetchBlob from 'react-native-fetch-blob'
import {AsyncStorage} from 'react-native';
import ChatDialog from './ChatDialog' 


class Exams extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            currentDialog: null,
            tableData: [],
            tableHead:['Nome','Data', 'Ações'],
            examsCount:0,
            examDownloading: false,
            badgeCommentMustUpdate: false
        }
        this.removeDialog = this.removeDialog.bind(this)
        this.updateFile = this.updateFile.bind(this)
        this.getToken = this.getToken.bind(this)
        this.showChatDialog = this.showChatDialog.bind(this)
        this.showActions = this.showActions.bind(this)
        this.renderRows = this.renderRows.bind(this)
    }
    
    updateFile(fileUpdated){
        
        for(var i=0;i<this.props.exams.length;i++){
            if(this.props.exams[i]._id === fileUpdated._id){
                this.props.exams[i] = fileUpdated
            }
        }
        this.setState({
            badgeCommentMustUpdate: true
        })
    }
    componentDidMount(){
        
        if(!this.state.token){
            this.getToken()
        }
        this.props.loadExams()
    }
    componentDidUpdate(){
        
        if(this.state.examsCount != this.props.exams.length || this.state.badgeCommentMustUpdate){
            var exams = []
            this.props.exams.forEach(exam => {
                var row = []
                row.push(exam.displayName)
                row.push(convertDateMin(exam.lastActivity))
                row.push(this.showActions(exam))
                exams.push(row)
            })
            this.setState({
                tableData: exams,
                examsCount: this.props.exams.length,
                badgeCommentMustUpdate: false
            })
        }
        
    }
    removeDialog(){
        this.setState({
            currentDialog: null
        })
    }
    
    getToken = async () => { 
        try {
            const jwtToken = await AsyncStorage.getItem('jwtToken');
            if(jwtToken != null && jwtToken && jwtToken.length > 0) {
              this.setState({
                token: jwtToken
              })
            }
        }catch(err){
        }
    }
    showExam = (file, index) => {
        
        if(file){
            
        return(
                <TouchableOpacity 
                style={{marginLeft: 15}}
                onPress= {() => {   
                    if(!this.state.examDownloading){
                        if(Platform.OS === 'android'){
                            this.setState({
                                examDownloading: true
                            })
                            const { config, fs } = RNFetchBlob
                            let DownloadDir = fs.dirs.DownloadDir
                            let options = {
                                fileCache: true,
                                addAndroidDownloads : {
                                useDownloadManager : true,
                                notification : true,
                                title : file.displayName, 
                                path: DownloadDir + file.displayName + '.pdf', 
                                description : 'Parapeti'
                                }
                            }
                            config(options)
                            .fetch('GET', REACT_APP_API_HOST.api + '/api/files/' + file._id, {
                                    Authorization : this.state.token,
                                })
                                .then((response) => {
                                    this.setState({
                                        examDownloading: false
                                    })
                                    this.props.loadExams()
                                })
                                // Status code is not 200
                                .catch((errorMessage, statusCode) => {
                                })
                        
                        }    
                    }
                    
                    }}>
                    <View>
                        {this.state.examDownloading && (
                            <Progress.Circle size={10} borderWidth={1} indeterminate={true} />
                        )}
                        {!this.state.examDownloading && (
                            <Icon name="visibility"/>
                        )}
                    </View>
                </TouchableOpacity>
            )
        }else{
            return (<View></View>)
        }
    }
    showChatDialog(file, index){
        
        if(file && file.commentsEnabled === true){
            return (
            <TouchableOpacity 
                onPress= {() => {   
                    this.setState({
                        currentDialog: <ChatDialog updateFile={this.updateFile} file={file} removeDialog={this.removeDialog}/>
                    })
                }} >
                    <View style={{marginLeft:10}}>
                        {this.props.auth.user.admin && file.adminNoReadCommentsCount === 0 && (
                            <Icon name="email"/>
                        )}
                        {!this.props.auth.user.admin && file.customerNoReadCommentsCount === 0 && (
                            <Icon name="email"/>
                        )}
                        {this.props.auth.user.admin && file.adminNoReadCommentsCount > 0 && (
                            <Badge text={file.adminNoReadCommentsCount} >
                                <Icon name="email" />
                            </Badge>
                        )}
                        {!this.props.auth.user.admin && file.customerNoReadCommentsCount > 0 && (
                            <Badge text={file.customerNoReadCommentsCount} >
                                <Icon name="email" />
                            </Badge>
                        )}
                    </View>
                    
                </TouchableOpacity>
                )
        }else{
            return (
                <View ></View>
            )
        }
    }
    showActions(rowData, index){
        return (
            <View style={{flex:1, alignSelf: 'center', justifyContent:'center', alignItems: 'center', flexDirection: 'row'}}>
                {this.showExam(rowData, index)}
                {this.showChatDialog(rowData, index)}
            </View>
        )
    }
   
    renderRows(rowData, index){
        var file = null
        this.props.exams.forEach(exam => {
            if(exam._id === rowData[2]){
                file = exam
            }
        })
        if(file != null){
            
            return (
                <Row data={rowData}  flexArr={[2, 1, 1]} style={file.read ? styles.rowRead : styles.rowNoRead} textStyle={styles.text}/>
                )
        }else{
            return (
                <Row data={rowData}  flexArr={[2, 1, 1]} style={styles.rowRead} textStyle={styles.text}/>
                )
        }
    }


    render() {
        const state = this.state;
        
        return (
            <View style={{flex:1, justifyContent:'center', alignItems: this.props.isFetching ? 'center' : 'stretch', width:'100%', height: '100%', marginTop:40}}>       
                {!this.state.currentDialog && (
                    <View style={{flex:1, justifyContent:'center', alignItems: this.props.isFetching ? 'center' : 'stretch', width:'100%', height: '100%', marginTop:40}}>       
                            {this.props.isFetching && (
                                <View style={{flex:1, justifyContent:'center', alignItems: this.props.isFetching ? 'center' : 'stretch', width:'100%', height: '100%', marginTop:40}}>
                                    <Progress.Circle size={50} borderWidth={5} indeterminate={true} style={{alignSelf: 'center'}}/>
                                </View>
                            )}
                            {!this.props.isFetching && (
                                <ScrollView tyle={{flex:1, justifyContent:'center', alignItems: this.props.isFetching ? 'center' : 'stretch', width:'100%'}}>
                                    <Card style={{width: '100%', marginTop: 50}}>
                                        <Table borderStyle={{borderColor: 'transparent', color: 'black', width: '100%', zIndex:0}}>
                                            <Row flexArr={[2, 1, 1]} data={this.state.tableHead} style={styles.head} textStyle={styles.text}/>
                                            <TableWrapper flexArr={[2, 1, 1]}>
                                                {this.state.tableData.map(this.renderRows)}
                                            </TableWrapper>
                                        </Table>
                                    </Card>
                                </ScrollView>
                            )}
                        
                    </View>
                )}
                {this.state.currentDialog && (
                <View style={this.state.currentDialog ? styles.showChatDialog : styles.noShowChatDialog}>
                    {this.state.currentDialog}
                </View>
                )}
            </View>
        )
    }
}



const styles = StyleSheet.create({
    container: { flex: 1, padding: 5, paddingTop: 0, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#ffffff', borderBottomColor: '#cccccc' },
    text: { margin: 10, marginTop: 12, marginBottom: 12 },
    rowRead: { height: 60,flexDirection: 'row', backgroundColor: '#ffffff', borderWidth: 1, borderBottomColor: '#cccccc', borderColor: '#ffffff' },
    rowNoRead: { height: 60,flexDirection: 'row', backgroundColor: '#CCCCCC' , borderWidth: 1, borderBottomColor: '#cccccc', borderColor: '#ffffff' },
    btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },
    btnText: { textAlign: 'center', color: '#fff' },
    showChatDialog: {position: 'absolute', left: 10, top: 10, right: 20, bottom: 10, zIndex: 3500},
    noShowChatDialog: {height:0, width: 0}
  })
function convertDateMin(date){
    return  Moment(date).format('DD/MM/YY')
 }
 function convertDateMax(date){  
    return  Moment(date).format('DD/MM/YYYY hh:mm A')
 }
const mapStateToProps = (state) => {
    return {
        isFetching: state.exams.isFetching,
        exams: state.exams.data,
        error: state.exams.error,
        auth: state.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadExams: () => dispatch(loadExamsRequest())
    }
} 

Exams.propTypes = {
    auth: PropTypes.object.isRequired
}


export default connect(mapStateToProps, mapDispatchToProps)(Exams)