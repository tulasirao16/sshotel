import React from 'react';
// import { observer, inject } from 'mobx-react';
import { Image, TouchableOpacity, ScrollView } from 'react-native';
import { View, Text, Icon, Button, Left, Right, Label } from 'native-base';
// import styles from './css/FavouritesCompontCss';
import StarRating from 'react-native-star-rating';

export default class Rating extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    this.state = {
        starCount: 3.5
    };
  }
  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }

  render() {
    const navigation = this.props.navigation;
    return (
      <ScrollView>
       <StarRating
            disabled={false}
            starStyle={{ fontSize:15}}
            containerStyle={{width:70}}
            fullStarColor='#f7931e'
            maxStars={5}
            rating={this.state.starCount}
            selectedStar={(rating) => this.onStarRatingPress(rating)}
        />
      </ScrollView>
    )
  }
}

