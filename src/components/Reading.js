import React, { Component } from 'react';
import { StyleSheet, View, ScrollView,Button ,  ActivityIndicator, Alert,
} from 'react-native';
import { Table, TableWrapper, Row } from 'react-native-table-component';
import GoogleSheet,{batchGet} from 'react-native-google-sheet';






export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['Flatno.', 'Reading'],
      widthArr : [100, 100,],
      tableData: [],
      isLoading: true
    }
  }
  componentDidMount(){
    const param={
      "ranges":'A:Z'
    }
    this.unmount=batchGet(param).then((response)=>{
      console.log("ajshjsdhs",response.valueRanges[0].values);
      // const {valueRanges:[{values}]} = response;
      // console.log('val',values);
      let val= null;
      if(response.valueRanges[0].values){
        val = response.valueRanges[0].values
      }
      this.setState({tableData: val})
    }).then(()=>this.setState({isLoading:false})).catch((e)=>console.log("e",e));
  }         
//  componentWillUnmount(){
//    this.unmount()
//  }
  render() {
    const {tableData, widthArr, tableHead}= this.state;
    const data = [];
    for (let i = 0; i < 30; i += 1) {
      const dataRow = [];
      for (let j = 0; j < 9; j += 1) {
        dataRow.push(`${i}${j}`);
      }
      data.push(dataRow);
    }
    return (
      <View style={styles.container}>
       
   
        <ScrollView horizontal={true}>
          <View>
            <Table borderStyle={{borderColor: '#C1C0B9'}}>
              <Row data={tableHead} widthArr={widthArr} style={styles.head} textStyle={styles.text}/>
            </Table>
            {
         this.state.isLoading
            ? <ActivityIndicator size="large" />
            : (
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{borderColor: '#C1C0B9'}}>
                {
                  tableData != null ? 
                  tableData.map((dataRow, index) => (
                    <Row
                      key={index}
                      data={dataRow}
                      widthArr={widthArr}
                      style={[styles.row, index%2 && {backgroundColor: '#ffffff'}]}
                      textStyle={styles.text}
                    />
                  ))
                  :
                  Alert.alert("There are no readings saved !")

                }
              </Table>
            </ScrollView>
            )}
          </View>
        </ScrollView>
        
      </View>
    )
  }
  
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    paddingTop: 30, 
    backgroundColor: '#ffffff',
    justifyContent:'center' 
  },
  head: { 
    height: 50, 
    backgroundColor: '#6F7BD9' 
  },
  text: { 
    textAlign: 'center', 
    fontWeight: '200' 
  },
  dataWrapper: { 
    marginTop: -1 
  },
  row: { 
    height: 40, 
    backgroundColor: '#F7F8FA' 
  }
});