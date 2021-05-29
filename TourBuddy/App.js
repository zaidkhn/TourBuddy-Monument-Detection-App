import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView ,Image} from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useFonts, Bangers_400Regular } from '@expo-google-fonts/bangers';

var fall= new Animated.Value(1);

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [focus, setFocus]= useState(Camera.Constants.AutoFocus.off);
  const [cameraRef, setCameraRef] = useState(null);
  const [img, setImg] = useState(null);
  const [title1, setTitle] = useState(null);
  const [desc1, setDesc] = useState(null);
  const sheetRef = React.useRef(null);

  let [fontsLoaded] = useFonts({
    Bangers_400Regular,
  });

  

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');

      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  


  const snap= async ()=> {       
   // console.log('Button Pressed');
    if (cameraRef) {
      // console.log('Taking photo');
       const options = { quality: 1, base64: true, fixOrientation: true, 
       exif: true, aspect:[4,3]};
       await cameraRef.takePictureAsync(options).then(photo => {
          photo.exif.Orientation = 1;  
          setImg(photo.uri)       
             
          detect(photo.base64)
          

         // console.log(photo);            
           });     
     }
    }

    const detect= async(base_val)=>{
      //console.log(base_val);
      const us={
        file: base_val
      };
      let res1 = await axios.post('http://40c687cacc4b.ngrok.io/api', us);
      res1.headers['content-type'];
      setTitle(res1.data.title)
      setDesc(res1.data.desc)
      sheetRef.current.snapTo(0);
    }

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      }); 
  
     // console.log(result);
  
      if (!result.cancelled) {
        setImg(result.uri);
        sheetRef.current.snapTo(0);
      }
    };

    if (!fontsLoaded) {
      return(
      <SafeAreaView>
       <Text>app not loaded properly</Text>
       </SafeAreaView>);
    } else {

      const renderContent = () => (
        <View
          style={{
            backgroundColor:'black',
            paddingTop:5,
            padding: 16,
            height: 600,
            borderRadius:30
          }}
        >
          <View style={{flex: 0.15,marginBottom:0,flexDirection:'row',justifyContent:'space-between',backgroundColor:'transparent'}}>
          <Text style={{flex:1,fontSize:16,fontFamily: 'Bangers_400Regular',color:'white',backgroundColor:'transparent'}}>TOURBUDDY</Text>
         </View>

           <Image
                source={{
                  uri:
                   img,
                }}
                style={{ width: "100%", marginTop:5,height: 190, borderRadius:15 }}
              />
          <Text style={{fontSize:35,fontWeight:'700',color:'white',paddingTop:10}}>{title1}</Text>
          <Text style={{fontSize:20,fontWeight:'400',color:'white',paddingTop:10, paddingBottom:10}}>{desc1}</Text>
        </View>
      );
      
     const renderHeader = () => (
        <View style={styles.header}>
          <View style={styles.panelHeader}>
            <View style={styles.panelHandle} />
          </View>
        </View>
      );

  return (
    <SafeAreaView style={styles.container}>
      <Camera style={styles.camera}   type={type} ref={(ref) => { setCameraRef(ref)} 
    }>
          <Text style={{flex:1,padding:10,marginTop:10,fontSize:24,fontFamily: 'Bangers_400Regular',color:'white',backgroundColor:'transparent'}}>TOURBUDDY</Text>

<View style={styles.focusButtonContainer}>     
        <TouchableOpacity
            onPress={() => {
              setFocus(
                focus === Camera.Constants.AutoFocus.off
                  ? Camera.Constants.AutoFocus.on
                  : Camera.Constants.AutoFocus.off
              );
            }}>
        <MaterialCommunityIcons name="image-filter-center-focus-strong-outline" size={100}  color="white" />
        </TouchableOpacity>
        </View>

        
      <View style={styles.buttonContainer}>  
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <MaterialIcons name="flip-camera-android" size={40} color="white" />
                      </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={snap}>
              <MaterialIcons name="camera" size={40} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Entypo name="image" size={40} color="white" />
          </TouchableOpacity>


        </View>
        </Camera>
    
    <BottomSheet
        ref={sheetRef}
        snapPoints={[600,0]}
        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={true}
        renderHeader={renderHeader}
        renderContent={renderContent}
        enabledInnerScrolling={false}
      />
    </SafeAreaView>
    
    
    
  );
}
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    opacity: 1
  },


  onCamClick: {
    flex: 1,
    backgroundColor: 'transparent'
  },

focusButtonContainer:{
flex:1,
marginBottom:'50%',
marginLeft:'auto',
marginRight:'auto',
textAlign: 'center',
backgroundColor: 'transparent',
alignItems:'center',
justifyContent:'center'
},
  buttonContainer: {
    flex: 0.5,
    width:'100%',
    height:'20%',
    //marginBottom:'5%',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    //margin: 20,
  },
  button: {
    flex: 1,
    width:'100%',
    paddingTop:'10%',
    paddingBottom:'10%',
    backgroundColor: '#000',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 18,
    color: 'white',
  }, 
   header: {
    backgroundColor: 'transparent',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingBottom:5,
  },
  panelHeader: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  panelHandle: {
    width: 60,
    height: 5,
    borderRadius: 4,
    backgroundColor: 'silver',
    marginBottom: 3,
  },
});

