import React, {useState} from 'react';
import {
  View,
  Text,
  ToastAndroid,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  TextInput,
  Button,
} from 'react-native';
import {
  Header,
  Left,
  Body,
  Right,
  Icon,
  Title,
  Picker,
  Form,
  Input,
  Label,
  Item,
  Button as ButtonX,
} from 'native-base';
// import {Input, Button} from 'react-native-elements';
import {StackActions} from '@react-navigation/native';
import ImagePicker from 'react-native-image-picker';
import {SafeAreaView} from 'react-native-safe-area-context';
import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import {useSelector, useDispatch} from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import {getUser} from '../redux/actions/user';

const url = 'http://192.168.1.135:8888/api/v1/users/';
const imgUrl = 'http://192.168.1.135:8888/public/img/';

const Profile = props => {
  // const userMe = useSelector(state => state.user.user);
  const user = useSelector(state => state.user.user);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);
  const [birth, setBirth] = useState(user.birth);
  const [gender, setGender] = useState(user.gender);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(birth));
  const [image, setImage] = useState(false);
  const dispatch = useDispatch();

  const postData = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('address', address);
    formData.append('birth', birth);
    formData.append('gender', gender);
    formData.append('image', {
      uri: image.uri,
      type: image.type,
      name: image.fileName,
    });
    Axios.patch(url + user.username, formData, {
      headers: {
        usertoken: AsyncStorage.getItem('token'),
      },
    })
      .then(x => {
        console.log(x);
        Axios.get(url + user.username).then(resolve => {
          dispatch(getUser(resolve.data[0]));
          ToastAndroid.show('Edit success!', ToastAndroid.SHORT);
          props.navigation.navigate('profile');
        });
        // this.setState({
        //   name: '',
        //   description: '',
        //   price: '',
        //   stock: '',
        //   category: 0,
        //   image: {uri: null, type: null, fileName: null},
        // });
      })
      .catch(reject => {
        ToastAndroid.show('Adding failed!', ToastAndroid.SHORT);
        console.log(reject);
      });
  };

  const picker = async () => {
    const options = {
      title: 'Select Image',
      takePhotoButtonTitle: 'Take photo from camera',
      chooseFromLibraryButtonTitle: 'Choose photo from gallery',
    };

    ImagePicker.showImagePicker(options, response => {
      // console.log('Response = ', response.uri);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        setImage(response);
      }
    });
  };

  return (
    <SafeAreaView>
      <Header
        style={{backgroundColor: 'rgba(33,150,243,1)'}}
        androidStatusBarColor="rgba(25,118,210,1)">
        <Left>
          <ButtonX transparent onPress={() => props.navigation.goBack()}>
            <Icon name="arrow-back" />
          </ButtonX>
        </Left>
        <Body>
          <Title>Edit Profile</Title>
        </Body>
        <Right />
      </Header>
      <View>
        <Form style={{alignItems: 'center'}}>
          <Image
            source={{uri: image ? image.uri : imgUrl + user.image}}
            style={styles.image}
          />
          <Item stackedLabel>
            <Label style={styles.label}>Username</Label>
            <Input
              defaultValue={name}
              onChange={e => setName(e.nativeEvent.text)}
            />
          </Item>
          <Item stackedLabel>
            <Label style={styles.label}>Email</Label>
            <Input
              defaultValue={email}
              onChange={e => setEmail(e.nativeEvent.text)}
            />
          </Item>
          <Item stackedLabel>
            <Label style={styles.label}>Phone</Label>
            <Input
              defaultValue={phone}
              onChange={e => setPhone(e.nativeEvent.text)}
            />
          </Item>
          <Item stackedLabel>
            <Label style={styles.label}>Address</Label>
            <Input
              defaultValue={address}
              onChange={e => setAddress(e.nativeEvent.text)}
            />
          </Item>
          <Picker
            style={{width: '70%', marginTop: 10}}
            iosHeader="Select one"
            mode="dropdown"
            selectedValue={user.gender}
            onValueChange={value => setGender(value)}>
            <Item label="Male" value={0} />
            <Item label="Female" value={1} />
          </Picker>
          <Button
            title="Date"
            onPress={async () => {
              if (show) {
                await setShow(false);
                setShow(true);
              } else {
                setShow(true);
              }
            }}
          />
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              timeZoneOffsetInMinutes={0}
              value={date || new Date(birth)}
              mode={'data'}
              is24Hour={true}
              display="default"
              onChange={e => {
                setDate(e.nativeEvent.timestamp);
                console.log(e.nativeEvent.timestamp);
                console.log(new Date(e.nativeEvent.timestamp).slice(0, 10));
              }}
            />
          )}
        </Form>
        {/* <Picker
            selectedValue={this.state.category}
            style={styles.picker}
            onValueChange={value => this.setState({category: value})}>
            {this.props.products.categoryList.map((item, index) => {
              return (
                <Picker.Item
                  key={index}
                  label={item.name}
                  value={parseFloat(item.id)}
                />
              );
            })}
          </Picker> */}
        <Button onPress={picker} title="Select Image" />
        {/* <Image style={styles.preview} source={{uri: this.state.image.uri}} /> */}
      </View>
      <Button
        title="Change"
        // onPress={this.postData}
        onPress={() => {
          postData();
        }}
      />
      <Button
        title="Logout"
        onPress={() => {
          console.log(user);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    marginVertical: 15,
    width: 100,
    height: 100,
  },
});

export default Profile;

// class Modalx extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       show: false,
//       category: 0,
//       image: {uri: null, type: null, fileName: null},
//     };
//     this.hideModal = this.hideModal.bind(this);
//     this.picker = this.picker.bind(this);
//     this.postData = this.postData.bind(this);
//   }

// hideModal() {
//   this.setState({
//     show: false,
//   });
// }

//   handleBackPress() {
//     this.props.event;
//   }
//   componentDidMount() {
//     BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
//   }
//   nothing() {
//     return false;
//   }

// textChange(value, type) {
//   this.setState({
//     [type]: value,
//   });
// }

//   render() {
//     // this.getName();
//     return (
//       <SafeAreaView
//         style={styles.containerMain}
//         //   onRequestClose={
//         //     this.props.show === true ? this.props.event : this.nothing
//         //   }
//       >
//         <StatusBar backgroundColor="rgba(0,0,0,.3)" translucent={false} />
//         {/* <TouchableOpacity style={styles.back} onPress={this.props.event}>
//           <Ionicons name="md-arrow-round-back" size={30} />
//           <Text style={styles.backText}>Back</Text>
//         </TouchableOpacity> */}
//         <View style={styles.container}>
//           <TextInput
//             value={this.state.name}
//             label="Name"
//             onChange={e => this.setState({name: e.nativeEvent.text})}
//           />
//           <TextInput
//             value={this.state.description}
//             label="Description"
//             onChange={e => this.setState({description: e.nativeEvent.text})}
//           />
//           <TextInput
//             value={this.state.price}
//             label="Price"
//             onChange={e => this.setState({price: e.nativeEvent.text})}
//           />
//           <TextInput
//             value={this.state.stock}
//             label="Stock"
//             onChange={e => this.setState({stock: e.nativeEvent.text})}
//           />
//           {/* <Picker
//             selectedValue={this.state.category}
//             style={styles.picker}
//             onValueChange={value => this.setState({category: value})}>
//             {this.props.products.categoryList.map((item, index) => {
//               return (
//                 <Picker.Item
//                   key={index}
//                   label={item.name}
//                   value={parseFloat(item.id)}
//                 />
//               );
//             })}
//           </Picker> */}
//           <Button onPress={this.picker} title="Select Image" />
//           <Image style={styles.preview} source={{uri: this.state.image.uri}} />
//         </View>
//         <Button
//           title="Change"
//           // onPress={this.postData}
//           onPress={this.postData}
//         />
//       </SafeAreaView>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   containerMain: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'whitesmoke',
//     marginTop: 20,
//   },
//   inputCon: {
//     alignItems: 'center',
//   },
//   back: {
//     flexDirection: 'row',
//     padding: 10,
//     backgroundColor: 'whitesmoke',
//   },
//   backText: {
//     fontSize: 22,
//     marginHorizontal: 10,
//     fontWeight: 'bold',
//   },
//   input: {
//     marginBottom: 40,
//     width: '90%',
//   },
//   inputText: {
//     textAlign: 'center',
//   },
//   label: {
//     marginTop: 20,
//   },
//   button: {
//     width: '85%',
//   },
//   buttonRed: {
//     width: '85%',
//     backgroundColor: 'red',
//   },
//   buttonCon: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   buttonImage: {
//     height: 30,
//     borderRadius: 0,
//   },
//   picker: {
//     width: '60%',
//     height: 50,
//     marginTop: -20,
//     marginBottom: 20,
//   },
//   preview: {
//     width: 100,
//     height: 100,
//     marginTop: 2,
//   },
// });

// const mapStateToProps = state => {
//   return {
//     products: state.products,
//   };
// };

// export default Modalx;
