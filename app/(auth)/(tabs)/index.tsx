import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, FlatList, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, useNavigation } from 'expo-router';
import { supabase } from '@/utils/supabase';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { DrawerActions } from '@react-navigation/native';
import * as Progress from 'react-native-progress';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import TrafficLight from '@/components/TrafficLight';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { StatusBar } from 'expo-status-bar';



const Home = () => {
  const [image, setImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [situation, setSituation] = useState<string | null>("");
  const [colorLight, setColorLight] = useState<string | null>("");
  const [isNft, setIsNft] = useState(false);
  const [data, setData] = useState<any | null>(null);
  const [userDate, setUserDate] = useState<string | null>(null);
  const [days, setDays] = useState<number>(0);
  const [partenaire, setPartenaire] = useState<string | null>("");

  const navigation = useNavigation();

  useEffect(() => {
    loadUserAvatar();
    loadUser();
    // loadNft();
  }, []);



  const loadNft = async () => {
    const {
      data: { user: User },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('nft')
      .select('*')
      .eq('userId1', User?.id);

    if (data && data.length > 0) {
      setIsNft(true);
      setData(data[0]);
    }
  }

  const loadUserAvatar = async () => {
    const {
      data: { user: User },
    } = await supabase.auth.getUser();

    supabase.storage
      .from('avatars')
      .download(`${User?.id}/avatar.png`)
      .then(({ data }) => {
        // console.log(data);
        if (!data) return;

        const fr = new FileReader();
        fr.readAsDataURL(data!);
        fr.onload = () => {
          setImage(fr.result as string);
        };
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadUser = async () => {
    const {
      data: { user: User },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('userId', User?.id);

    if (data) {
      getDays(data[0].birthday);
      setUserDate(data[0].birthday || 'No date provided');
      setUserName(data[0].name || 'No name provided');
      setSituation(data[0].situation);
      setPartenaire(data[0].prenomPartenaire || 'No partenaire provided');
      switch (data[0].situation) {
        case "celibataire":
          setColorLight("verte");
          break;
        case "libre":
          setColorLight("orange");
          break;
        case "couple":
          setColorLight("rouge");
          break;

        default:
          break;
      }
    }
  };

  interface ListData {
    name: string;
    id: number;
    name2: string;
    date: string;
    lieu: string;
  };

  const listData: ListData[] = [
    { name: 'Charly', id: 1, name2: 'Josia', date: '31/12/2022', lieu: 'Paris' },
    { name: 'John', id: 2, name2: 'Doe', date: '31/12/2022', lieu: 'Plaisir' },
    { name: 'Jeanne', id: 3, name2: 'Daj', date: '31/12/2022', lieu: 'Paris' },
    { name: 'Yann', id: 4, name2: 'Die', date: '31/12/2022', lieu: 'Plaisir' },
    { name: 'Lianne', id: 5, name2: 'Due', date: '31/12/2022', lieu: 'Paris' },
    { name: 'John', id: 6, name2: 'Doe', date: '31/12/2022', lieu: 'Plaisir' },

  ];

  const getDays = (userDate: string) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

    const firstDate = new Date(userDate || '2022-12-31');
    const secondDate = new Date();

    const diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
    setDays(diffDays);
    console.log(diffDays);
  }


  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ImageBackground source={require("../../../assets/images/background2.png")} resizeMode="cover" style={styles.image}>
        {/* <View style={{ height: "5%", paddingTop: 10}}>
          <Image source={require("../../../assets/images/logo.png")} resizeMode="contain" style={{ alignSelf: "center", width: 60, height: 60, marginLeft: 15 }} />
        </View> */}
        <View style={styles.topSection}>

          {/* <View style={styles.titleSection}>
            <Text style={styles.titleText}>Bonjour, </Text>
            <Text style={styles.titleTextName}>{userName}</Text>
          </View> */}
          {/* <View style={styles.daysContainer}>
          <Text style={styles.textNumberDays}>0</Text>
          <Text style={styles.textPersonDays}>visite</Text>
        </View> */}
          {/* <View style={styles.profilContainer}>
          <Text style={styles.profilTitle}>Profil complété à 50%</Text>
          <Progress.Bar animated={false} progress={0.5} width={200} height={5} color="#B18CE5" borderColor='#c1c1c1' />
          <TouchableOpacity><Text style={styles.profilButton}>compléter</Text></TouchableOpacity>
        </View> */}
          <View style={styles.trafficLightContainer}>
            <View style={styles.daysContainer}>
              <View>
                <Text style={styles.textNumberDays}>{colorLight === "rouge" ? `${days} jours` : "0 visite"} </Text>
                {/* <Text style={styles.textDays}>jours</Text> */}
              </View>
              <View>
                <Text style={styles.textPersonDays}>{colorLight === "rouge" ? `aux cotés de ${partenaire}` : "sur ton profil"} </Text>
              </View>
            </View>
            <View style={{ maxHeight: '40%', width: "20%" }}>
              <TrafficLight color={situation} />
            </View>
            {/* <View style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 15 }}>En couple</Text>
            </View> */}
            <View style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20, minHeight: "25%" }}>
              <View>
                <Text style={{ fontSize: 25, fontWeight: "700", textAlign: "center" }}>Jode {colorLight} visible</Text>
              </View>
              <View>
                <Text style={{ fontSize: 15, fontWeight: "400", textAlign: "center", color: "#898989" }}>On pourra te retrouver en recherchant ton numéro de téléphone ou ton nom complet</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.bottomSection}>
          <View>
            <View style={{ alignSelf: "center", alignItems: "center", justifyContent: "space-between", flexDirection: "row", width: "90%", marginTop: 5 }}>
              <Feather name="link" size={30} color="#888888" />
              <View>
                <Text style={{ color: "#888888", fontWeight: "bold", fontSize: 15, fontFamily: 'SpaceMono-Regular' }}>Chaîne des engagements</Text>
              </View>
            </View>
            <View>
              <TouchableOpacity style={styles.button}
                onPress={() => router.navigate('demande')} >
                <Text style={styles.buttonText}>Créer un union sur la chaîne</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={listData}
              ItemSeparatorComponent={() => <View style={{ height: 0, backgroundColor: '#cdcdcd' }} />}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-around", marginVertical: 5, padding: 5, borderRadius: 20 }}>
                  {/* <Feather name="link" size={20} color="#c8c8c8" /> */}
                  {/* <FontAwesome6 name="traffic-light" size={24} color="#d3b300" /> */}
                  <Text style={{ color: "#000", fontFamily: 'SpaceMono-Regular' }}>{item.id * 12761489}</Text>

                  <Text style={{ fontFamily: 'SpaceMono-Regular', fontSize: 15, fontWeight: "bold", maxWidth: 200, color: "#000" }}>{item.name} & {item.name2}</Text>
                  <Text style={{ color: "#000", fontFamily: 'SpaceMono-Regular' }}>{item.date}</Text>
                  <Text style={{ color: "#000", fontFamily: 'SpaceMono-Regular' }}>{item.lieu}</Text>
                </View>
              )}
            />
          </View>
        </View>
        <View style={styles.bottomNavContainer}>
          <View style={styles.iconNavContainer}>
            <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
              {image && <Image source={{ uri: image }} style={styles.avatar} />}
              {!image && <View style={styles.avatar} />}
            </TouchableOpacity>
            <Text style={styles.statusText}>situation visible</Text>
          </View>
          <View style={styles.iconNavRightContainer}>
            <TouchableOpacity onPress={() => router.navigate("demande")}>
              <MaterialCommunityIcons name="ring" size={30} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.navigate("search")}>
              <Ionicons name="search" size={30} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        {/* <View style={styles.cardContainer}>
        <Text style={styles.demandeTitle}>Ta demande a été accéptée !</Text>
        <Text style={styles.demandeText}>Vous pouvez maintenant inscrire vos voeux sur la blockchain et valider votre union</Text>
        <TouchableOpacity style={styles.buttonDemande}
          onPress={() => router.navigate('nft')} >
          <Text style={styles.buttonDemandeText}>Créer notre NFT d'engagement</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}>
        <Text style={styles.demandeTitle}>NFT en cours de création</Text>
        <Text style={styles.demandeText}>Les voeux ne sont pas encore complétés</Text>
        <TouchableOpacity style={styles.buttonDemande}
          onPress={() => router.navigate('nft')} >
          <Text style={styles.buttonDemandeText}>Voir le NFT</Text>
        </TouchableOpacity>
      </View> */}
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
  cardContainer: {
    alignSelf: 'center',
    width: '90%',
    backgroundColor: '#151515',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  buttonDemande: {
    alignSelf: 'center',
    minWidth: '70%',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#B18CE5',
    padding: 12,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonDemandeText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#fff'
  },
  demandeTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000'
  },
  demandeText: {
    marginVertical: 15,
    fontSize: 15,
    textAlign: 'center',
    color: '#000'
  },
  bottomNavContainer: {
    position: 'absolute',
    flexDirection: 'row',
    width: '90%',
    padding: 10,
    borderRadius: 50,
    bottom: 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 20,
    backgroundColor: 'rgba(225, 225, 225, 0.8)',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    borderRadius: 100,
  },
  iconNavRightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 30,
  },
  iconNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
    // width: '25%',
  },
  statusText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#000',
    // fontFamily: 'Montserrat'
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: '#2b825b',
    borderRadius: 4,
    padding: 10,
    color: '#000',
  },
  button: {
    alignSelf: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    alignItems: 'center',
    backgroundColor: '#2F215F',
    padding: 9,
  },
  buttonText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#fff',
    // fontFamily: 'Montserrat'
  },
  topSection: {
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    height: '60%',
  },
  bottomSection: {
    alignSelf: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 30,
    width: "95%",
    height: '35%',
    borderWidth: 1,
    borderColor: '#eeeeee',
    paddingBottom: "40%",
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 0.5,
  },
  daysContainer: {
    // flexDirection: 'column',
    // alignSelf: 'flex-end',
    // position: 'absolute',
    // margin: 25,
    // padding: 10,
    height: '15%',
    // width: '90%',
    // justifyContent: 'space-around',
    // alignItems: 'center',
    borderRadius: 10,
    // backgroundColor: 'rgba(255, 255, 255, 0.5)',
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 0,
    // },
    // shadowOpacity: 0.4,
    // shadowRadius: 5.00,
  },
  textNumberDays: {
    fontSize: 40,
    fontWeight: 'bold',
    // fontFamily: 'SpaceMono-Regular',
    color: '#000'
  },
  textPersonDays: {
    fontSize: 15,
    color: '#747474',
    fontFamily: 'SpaceMono-Regular'
  },
  textDays: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
  },
  profilContainer: {
    width: '70%',
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  profilTitle: {
    fontSize: 15,
    color: '#000'
  },
  profilButton: {
    fontSize: 15,
    color: '#616161'
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  titleText: {
    fontSize: 25,
    color: '#8c8c8c',
    fontFamily: 'Montserrat'
  },
  titleTextName: {
    fontSize: 30,
    color: '#8c8c8c',
    fontWeight: 800,
    fontFamily: 'Montserrat',
  },
  trafficLightContainer: {
    height: '100%',
    width: "80%",
    padding: 20,
    borderRadius: 200,
    // minHeight: 300,
    justifyContent: 'center',
    minWidth: 300,
    flexDirection: 'column',
    gap: 20,
    alignItems: 'center',
  },
});
export default Home