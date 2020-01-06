import React from 'react';
// import { observer } from 'mobx-react';
import { Animated, TextInput } from 'react-native';
import { View } from 'native-base';

export default class FloatingLabelInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: 'false',
    };
  }

  componentWillMount() {
    this._animatedIsFocused = new Animated.Value(this.props.value === '' ? 0 : 1);
  }
  componentWillReceiveProps (newProps) {
    if (newProps.isError) {
      this.setState({ isFocused: 'error' });
    }
  }

  componentDidMount() {
    if (this.props.onRef != null) {
        this.props.onRef(this)
    }
  }
  onSubmitEditing() {
    this.props.onSubmitEditing();
  }

  focus() {
      this.textInput.focus()
  }


  handleFocus = () => this.setState({ isFocused: 'true' });
  handleBlur = () => this.setState({ isFocused: 'false' });

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: (this.state.isFocused || this.props.value !== '') ? 1 : 0,
      duration: 0,
    }).start();
  }

  render() {
    const { label, ...props } = this.props;
    const labelStyle = {
      position: 'absolute',
      left: 0,
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [14, 14],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#8a8786', '#454545'],
      }),
      fontFamily: 'Roboto_light'
    };
    return (
      <View style={{ paddingTop: 18, }}>
        <Animated.Text style={labelStyle}>
          {label}
        </Animated.Text>
        <TextInput
          {...props}
          style={this.state.isFocused === 'true'
          ? { height: 26, fontSize: 17, color: '#333333', fontFamily: 'Roboto_light', borderBottomWidth: 2, borderBottomColor: '#025d8c' }
          : (this.state.isFocused === 'error'
            ? { height: 26, fontFamily: 'Roboto_light', fontSize: 17, color: '#000', borderBottomWidth: 1, borderBottomColor: 'red' }
            : { height: 26, fontFamily: 'Roboto_light', fontSize: 17, color: '#000', borderBottomWidth: 1, borderBottomColor: '#01a4a2' }
          )}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          underlineColorAndroid='transparent'
          ref={input => this.textInput = input}
          onSubmitEditing={this.onSubmitEditing.bind(this)}
          blurOnSubmit
        />
      </View>
    );
  }
}
