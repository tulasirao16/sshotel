import { StyleSheet, Dimensions } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#eef5fd',
        justifyContent:'center',
        alignItems:'center'
    },

    content: {
        backgroundColor: '#fff',
        marginBottom: 5,
        borderRadius: 10,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        margin:12,
        width:DEVICE_WIDTH - 30,
    },

    input: {
        paddingBottom: 10,
    },

    TextAreaView:{
        marginTop: 10,
    },

    labels: {
        color: '#333333',
        fontFamily: 'Roboto_medium',
        fontSize: 14,
    },

    textArea: {
        height: 60,
        justifyContent: "flex-start",
        color: '#333',
        fontFamily: 'Roboto_medium',
        fontSize: 14,
        borderColor: '#009688',
        borderBottomWidth: 1,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 5,
        flexDirection: 'row',
        // width: DEVICE_WIDTH - 30
    },

    linearStyles: {
        width: DEVICE_WIDTH,

    },
    headerMainView: {
        flexDirection: 'row',
        width: DEVICE_WIDTH,
        height: 50,
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginBottom: 0,
        justifyContent: 'center'
      },
      headerLeft: {
        flex: 1
      },
      iconMenuStyle: {
        color: '#fff',
        fontSize: 25
      },
      iconDeleteStyle: {
        color: '#fff',
        fontSize: 20
      },
      iconAddStyle: {
        color: '#fff',
        fontSize: 28
      },
      headerBody: {
        flex: 6
      },
      headerTitleStyle: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Roboto_light',
      },
      headerRight: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
    
      noAmenities: {
        paddingVertical: Device_Height/6,
        justifyContent: 'center',
        alignItems: 'center'
      },
    
      noAmenitiesText:{
        color:'#025d8c',
        fontSize: 14,
        fontFamily: 'Roboto_medium',
      },
      status: {
        zIndex: 10,
        width: DEVICE_WIDTH,
        height: 21,
        backgroundColor: 'transparent',
        elevation: 0
      },
    getCenterView: {
        // { marginHorizontal: 10, marginTop: 30 }
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    BtnText: {
        fontFamily: 'Roboto_medium',
        fontSize: 15,
        color: '#fff',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    linearBtnStyles: {
        borderRadius: 22
    },
    bodyContainer: {
        padding: 20,
        width: DEVICE_WIDTH - 40
      },
      headingStyle: {
        paddingVertical: 4,
        color: '#01a4a2',
    
      },
      textStyle: {
        color: '#000',
        paddingVertical: 2,
      },
      view: {
        paddingBottom:5,
        marginBottom:10,
        width:DEVICE_WIDTH,
        borderBottomWidth:1,
        borderColor:'#e3e3e3'
    },
      getCenterView: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      BtnText: {
        fontFamily: 'Roboto_light',
        fontSize: 14,
        color: '#fff',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
    
    textFont: {
        fontFamily: 'Roboto_medium'
      },
    



    
});

export default styles;