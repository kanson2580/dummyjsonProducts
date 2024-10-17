import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, Button, TextInput, ScrollView, Image, Alert, TouchableOpacity, useWindowDimensions, FlatList } from 'react-native';

import FastImage from 'react-native-fast-image';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import useStore from './store';

import YellowStar from './285661_star_icon.png';
import WhiteStar from './2849817_favorite_star_favorites_favourite_multimedia_icon.png';

const HomeScreen = ({ route, navigation }) => {
  console.log('=============== HomeScreen ============');

  const { currentUser, setCurrentUser } = useStore();
  console.log('\u001b[34m', 'currentUser in HomeScreen :::::::::::::', typeof currentUser, JSON.stringify(currentUser));

  const [products, setProducts] = useState([]);
  useEffect(() => {
    console.log('products :::::::::::', typeof products, JSON.stringify(products));
  }, [products]);

  const getData = () => {
    fetch('https://dummyjson.com/products')
      .then(res => res.json())
      .then((result) => {
        setProducts((prev) => {
          return (
            [
              ...result.products
            ]
          )
        })
      });
  };

  useEffect(() => {
    if (!currentUser) {
      Alert.alert('로그인 정보가 없습니다.');
      navigation.navigate('Login');
    } else if (!!currentUser) {
      getData();
    }
  }, [currentUser]);

  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <View style={{ flex: 1, width: '100%', padding: 20, backgroundColor: 'white', justifyContent: 'flex-start', alignItems: 'center' }}>
        <Text style={{ color: 'black' }}>Home Screen</Text>

        {Array.isArray(products) && products.length !== 0 && products.map((product, index) => {
          return (
            <TouchableOpacity key={index} style={{ width: '100%', marginVertical: 20, justifyContent: 'flex-start', alignItems: 'flex-start' }}
              onPress={() => {
                navigation.navigate('Product', {
                  productId: product.id
                })
              }}
            >
              <Text style={{ color: 'black' }}>
                id: {product.id}
              </Text>
              <Text style={{ color: 'black' }}>
                title: {product.title}
              </Text>
              <Text style={{ color: 'black' }}>
                price: ${product.price}
              </Text>

              <View style={{ width: '100%', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                <FastImage source={{ uri: product.thumbnail }} style={{ width: 200, height: 200 }} resizeMode={FastImage.resizeMode.contain} />
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    </ScrollView>
  );
};


const ProductScreen = ({ route, navigation }) => {
  console.log('=============== ProductScreen ============');
  const { productId } = route.params;

  const { width, height } = useWindowDimensions();

  const [product, setProduct] = useState(null);
  useEffect(() => {
    if (product) {
      console.log('product in ProductScreen ::::::::::::', typeof product, JSON.stringify(product));
    }
  }, [product]);

  const getData = () => {
    console.log('================ getData ===============');
    fetch(`https://dummyjson.com/products/${productId}`)
      .then(res => res.json())
      .then((result) => {
        setProduct((prev) => {
          return (
            {
              ...result
            }
          )
        })
      });
  };


  useEffect(() => {
    getData();
  }, [route.params]);

  return (
    <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
      <View style={{ flex: 1, padding: 20, backgroundColor: 'white', justifyContent: 'flex-start', alignItems: 'center' }}>
        <Text style={{ color: 'black' }}>ProductScreen</Text>

        {!!product &&
          <View style={{ width: '100%', marginVertical: 20, justifyContent: 'flex-start', alignItems: 'flex-start' }} >
            <Text style={{ color: 'black' }}>
              id: {product.id}
            </Text>
            <Text style={{ color: 'black' }}>
              title: {product.title}
            </Text>
            <Text style={{ color: 'black' }}>
              price: ${product.price}
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
              {product.images.map((image, index) => {
                return (
                  <View key={index} style={{ borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <FastImage
                      source={{ uri: image, priority: FastImage.priority.normal }}
                      style={{ width: width - 42, height: 400 }}
                      resizeMode={FastImage.resizeMode.contain}
                      progressiveRenderingEnabled={true}
                    />
                    <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'center', alignItems: 'center' }}>
                      {product.images.map((value, key) => {
                        return (
                          <View key={key} style={{ width: 20, height: 5, marginHorizontal: 3, borderRadius: 5, backgroundColor: index == key ? 'black' : 'darkgray' }} />
                        )
                      })}
                    </View>
                  </View>
                )
              })}
            </ScrollView>

            <View style={{ width: '100%', marginVertical: 20, padding: 20, borderWidth: 1, borderRadius: 15, borderColor: 'black', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              <Text style={{ color: 'black' }}>
                {product.description}
              </Text>
            </View>

            {product.reviews &&
              <View style={{ width: '100%', marginVertical: 20, padding: 20, borderWidth: 1, borderRadius: 15, borderColor: 'black', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                {product.reviews.map((review, index) => {
                  let okStars = ['whiteStar', 'whiteStar', 'whiteStar', 'whiteStar', 'whiteStar'];                  

                  okStars.map((star, index)=>{
                    if (index < review.rating){
                      okStars[index] = 'YellowStar'
                    }
                  });

                  return (
                    <View key={index} style={{ width: '100%', marginVertical: 10, paddingVertical: 5, borderBottomWidth: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                      <View style={{ flexDirection: 'row' }}>
                        {okStars.map((star, key) => {
                          return (
                            <FastImage key={key} source={star == 'YellowStar' ? YellowStar : WhiteStar} style={{ width: 15, height: 15 }} resizeMode={FastImage.resizeMode.contain} />
                          )
                        })}
                      </View>
                      <Text style={{ color: 'black' }}>
                        평점: {review.rating}
                      </Text>
                      <Text style={{ color: 'black' }}>
                        글쓴이: {review.reviewerName}
                      </Text>
                      <Text style={{ color: 'black' }}>
                        이메일: {review.reviewerEmail}
                      </Text>

                      <View style={{ width: '100%', padding: 10, borderWidth: 1, borderRadius: 5 }}>
                        <Text style={{ color: 'black' }}>
                          {review.comment}
                        </Text>
                      </View>


                      <Text style={{ color: 'black' }}>
                        {review.date}
                      </Text>
                    </View>
                  )
                })}
              </View>
            }

          </View>
        }
      </View>
    </ScrollView>
  )
};

const LoginScreen = ({ route, navigation }) => {
  console.log('=============== LoginScreen ============');

  const { currentUser, setCurrentUser } = useStore();
  useEffect(() => {
    if (!!currentUser) {
      navigation.navigate('Home');
    }
  }, [currentUser]);

  const [user, setUser] = useState({
    email: '',
    password: ''
  });
  useEffect(() => {
    console.log('user ::::::::::::', typeof user, JSON.stringify(user));
  }, [user]);

  const submit = () => {
    console.log('============== submit ==========');
    fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'emilys',
        password: 'emilyspass',
        expiresInMins: 30, // optional, defaults to 60
      }),
      credentials: 'include' // Include cookies (e.g., accessToken) in the request
    })
      .then(res => res.json())
      .then((result) => {
        console.log('result :::::::::::::::', typeof result, JSON.stringify(result));
        if (result.accessToken) {
          setCurrentUser({
            id: result.id,
            username: result.username,
            email: result.email,
            image: result.image,
            accessToken: result.accessToken
          })
        }
      })
      .catch((error) => {
        console.log('error on submit :::::::::::::::::', error);
      });
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: 'white', justifyContent: 'flex-start', alignItems: 'center' }}>
      <Text>LoginScreen</Text>

      <View style={{ width: '100%', margin: 20 }}>
        <Text style={{ color: 'black' }}>
          email :::
        </Text>
        <TextInput
          style={{ width: '100%', color: 'black', backgroundColor: 'white', borderWidth: 1, borderColor: 'black' }}
          value={user.email}
          onChangeText={(txt) => {
            setUser((prev) => {
              return (
                {
                  ...prev,
                  email: txt
                }
              )
            })
          }}
        />
      </View>

      <View style={{ width: '100%', margin: 20 }}>
        <Text style={{ color: 'black' }}>
          password :::
        </Text>
        <TextInput
          style={{ width: '100%', color: 'black', backgroundColor: 'white', borderWidth: 1, borderColor: 'black' }}
          value={user.password}
          onChangeText={(txt) => {
            setUser((prev) => {
              return (
                {
                  ...prev,
                  password: txt
                }
              )
            })
          }}
        />
      </View>

      <View style={{ width: '100%', margin: 20 }}>
        <Button title='login' onPress={() => { submit(); }} />
      </View>
    </View>
  )
};


const Stack = createNativeStackNavigator();


const App = () => {
  console.log('=============== App ============');
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerTitle: '' }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Product" component={ProductScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;