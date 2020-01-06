import { StyleSheet, Dimensions } from 'react-native';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    mainView: {
        marginVertical: 10,
        marginHorizontal: 15
    },
    mainComponentView: {
        flex: 1,
        width: DEVICE_WIDTH-20,
        flexDirection: 'row',
        justifyContent: 'center',
        borderBottomWidth:1,
        borderColor:'#dcdcdc',
        marginBottom:5,
        paddingBottom:5,
    },
    hoteContentView: {
        flex: 5
    },
    hoteStatusView: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
    },
    textMedium: {
        fontSize: 15,
        color: '#9c9b9d',
        fontFamily: 'Roboto_light',
        paddingBottom:5,
    },
    textSmall: {
        fontSize: 13,
        color: '#02a2a2',
        fontFamily: 'Roboto_light',
    },
    textBig: {
        fontSize: 16,
        fontFamily: 'Roboto_medium',
    },
    bookedText: {
        fontSize: 11,
        fontFamily: 'DueDate',
        color: '#809b34',
        transform: [{ rotate: '-8deg' }],
        borderWidth: 2,
        borderColor: '#809b34',
        borderRadius: 5,
        padding: 5,
    },

    canceledTxt: {
        fontSize: 11,
        fontFamily: 'DueDate',
        color: '#cf242a',
        transform: [{ rotate: '-8deg' }],
        borderWidth: 2,
        borderColor: '#cf242a',
        borderRadius: 5,
        padding: 5,
    },

    completedTxt: {
        fontSize: 11,
        fontFamily: 'DueDate',
        color: '#0175b2',
        transform: [{ rotate: '-8deg' }],
        borderWidth: 2,
        borderColor: '#0175b2',
        borderRadius: 5,
        padding: 5,
    },

    StatusCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderColor: 'gray',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    statusTxt: {
        fontSize: 24,
        fontFamily: 'Roboto_light',
        color: '#3fc13e'
    },
    hotelDetails: {
        paddingBottom:5,
        marginBottom: 5,
    },

    personIcon:{
        width:20,
        height:20,
        fontSize:18,
        fontFamily: 'Roboto_light',
        color:'#999',
        marginRight:5,
    },

    calIcon:{
        width:20,
        height:20,
        fontSize:18,
        fontFamily: 'Roboto_light',
        color:'#999',
        marginRight:5,
    },

    starIcon:{
        marginRight:5,
        fontSize:18,
        fontFamily: 'Roboto_light',
        color:'#ed8a19'
    },

    filterIconsView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    filterIcons: {
        color: '#25c5df'
    },
});

export default styles;