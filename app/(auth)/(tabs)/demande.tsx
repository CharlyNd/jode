import { View, Text, TextInput, StyleSheet, SafeAreaView, Image, ActivityIndicator, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/utils/supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import * as Progress from 'react-native-progress';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import * as SMS from 'expo-sms';
import * as MailComposer from 'expo-mail-composer';


export default function Demande() {
  const [prenom, setPrenom] = useState('');
  const [demande, setDemande] = useState(false)
  const [userName, setUserName] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [mail, setMail] = useState('');
  const [message, setMessage] = useState(`${prenom},  acceptes-tu de t'unir digitalement à ${userName} ?`);
  const [canal, setCanal] = useState('sms');
  const [showNext, setShowNext] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    setLoading(true);
    loadUserName();
    loadDemande().then(() => loadDemandeImage());
  }, []);

  const getAvatarUrl = async (User: string) => {
    const { data: { publicUrl } } = await supabase.storage.from('demandes')
      .getPublicUrl(`${User}/demande.png`)

    setImgUrl(publicUrl);
    return publicUrl;
  };

  const loadDemandeImage = async () => {
    const {
      data: { user: User },
    } = await supabase.auth.getUser();

    supabase.storage
      .from('demandes')
      .download(`${User?.id}/demande.png`)
      .then(({ data }) => {
        setLoading(false);
        // console.log(data);
        if (!data) return;

        const fr = new FileReader();
        fr.readAsDataURL(data!);
        fr.onload = () => {
          setImgUrl(fr.result as string);
        };
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadDemande = async () => {
    const {
      data: { user: User },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('demandes')
      .select('*')
      .eq('userId', User?.id);

    if (data && data.length > 0) {
      setDemande(true);
      setData(data[0]);
    }
  }

  const loadUserName = async () => {
    const {
      data: { user: User },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('users')
      .select('name')
      .eq('userId', User?.id);

    if (data) {
      setUserName(data[0].name || 'No name provided');
    }
  };

  const createDemande = async (url: string) => {
    const {
      data: { user: User },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('demandes')
      .upsert({ prenom: prenom, userId: User?.id, imageUrl: url, phone: phone, email: mail }, { onConflict: 'userId' })
      .select();
    console.log(error);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  const validateImage = async () => {
    setLoading(true);
    const {
      data: { user: User },
    } = await supabase.auth.getUser();

    if (image) {
      const base64 = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
      const filePath = `${User?.id}/demande.png`;
      await supabase.storage.from('demandes').upload(filePath, decode(base64));
    }

    getAvatarUrl(User!.id).then((result) => {
      console.log(result);
      createDemande(result);
      setImgUrl(result);
    }).then(() => {
      loadDemande()
    }).then(() => {
      setLoading(false);
      setDemande(true);
      loadDemandeImage();
    });
  };


  const sendMessage = async () => {
    const isAvailable = await SMS.isAvailableAsync();

    if (isAvailable) {
      await SMS.sendSMSAsync(
        phone,
        `Bonjour ${data.prenom}, clique sur le lien ci dessous, une surprise t'y attends... \n\n https://apps.apple.com/fr/app/the-kut/id1601107524 `,
        {
          // attachments: {
          //   uri: 'path/myfile.png',
          //   mimeType: 'image/png',
          //   filename: 'myfile.png',
          // },
        }
      );
    } else {
      // misfortune... there's no SMS available on this device
    }
  }

  const sendEmail = async () => {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (isAvailable) {
      const options = {
        recipients: [data.email],
        subject: 'Union digital',
        body: `Bonjour ${data.prenom}, clique sur le lien ci dessous, une surprise t'y attends... \n\n https://apps.apple.com/fr/app/the-kut/id1601107524 `,

        attachments: [],
      };

      MailComposer.composeAsync(options)
        .then(result => {
          if (result.status === MailComposer.MailComposerStatus.SENT) {
            Alert.alert('Success', 'Email sent successfully');
          } else {
            Alert.alert('Error', 'Failed to send email');
          }
        })
        .catch(error => {
          Alert.alert('Error', error.message);
        });
    } else {
      Alert.alert('Error', 'MailComposer is not available on this device');
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      {
        loading && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              elevation: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              gap: 10,
            }}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )
      }

      {!demande ?
        <ScrollView automaticallyAdjustKeyboardInsets keyboardDismissMode='on-drag' style={styles.formContainer}>
          <View style={styles.containerTop}>
            {!showNext ?
              <TouchableOpacity
                onPress={() => router.replace('/(auth)')} >
                <Ionicons name="chevron-back-sharp" size={30} color="black" />
              </TouchableOpacity> : null}
            <Text style={styles.title}>Ma e-demande</Text>
            <View style={{ flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
              <Text style={{ fontSize: 13 }}>{showNext ? "2 / 2" : "1 / 2"}</Text>
              <Progress.Bar animated={true} progress={showNext ? 1 : 0.5} width={showNext ? 150 : 70} height={5} color="#2F215F" borderColor='#c1c1c1' />
            </View>
          </View>
          <Text style={styles.inputTitle}>Ajoute une image qui représente ta demande</Text>
          {image && <TouchableOpacity onPress={pickImage}>
            <Image source={{ uri: image }} style={styles.avatar} />
            <View style={styles.editButtonContainer}>
              <Image source={require("../../../assets/images/edit.png")} style={styles.editButtonStyle} />
            </View>
          </TouchableOpacity>}
          {!image &&
            <TouchableOpacity onPress={pickImage}>
              <View style={styles.avatar}>
                <FontAwesome5 name="images" size={50} color="#c5c5c5" />
              </View>
              <View style={styles.editButtonContainer}>
                <Image source={require("../../../assets/images/edit.png")} style={styles.editButtonStyle} />
              </View>
            </TouchableOpacity>}
          <View style={styles.containerNewDemande}>
            <View style={{ display: showNext ? "none" : "flex" }}>
              <Text style={styles.demandeText}>{`${prenom}, acceptes-tu la demande d'union digital de ${userName} ?`}</Text>
              <View style={styles.questionButtonContainer}>
                <TouchableOpacity style={styles.button}
                  disabled={true}
                  onPress={() => console.log("ok")} >
                  <Text style={styles.buttonText}>Oui</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSecond}
                  disabled={true}
                  onPress={() => console.log("ok")} >
                  <Text style={styles.buttonTextSecond}>Non</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.explication}>{`Seul ${userName} sera informé de ta réponse. \nEn cas de réponse positive, vous formaliserez et publierez, ensemble, votre engagement sur la blockchain`}</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputTitle}>Prénom ou Surnom</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ou son surnom"
                  value={prenom}
                  onChangeText={setPrenom}
                />
              </View>
              <View style={{ marginTop: 30 }}>
                <TouchableOpacity style={prenom === "" ? styles.buttonDisable : styles.button} disabled={prenom === ""}
                  onPress={() => image === null ? Alert.alert("Attention", "Es-tu sure de vouloir continuer sans image ?", [
                    {
                      text: 'Non, je veux ajouter une image',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    { text: 'Oui, je continue', onPress: () => setShowNext(!showNext) },
                  ]) : setShowNext(!showNext)} >
                  <Text style={styles.buttonText}>Suivant</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{ display: showNext ? "flex" : "none" }}>
            <View style={{ marginLeft: 10, flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: 20, marginTop: 30 }}>
              <Text>Envoyer par</Text>
              <View style={{ flexDirection: "row", gap: 20, justifyContent: "space-around" }}>
                <TouchableOpacity onPress={() => setCanal("sms")}>
                  <View style={{ borderWidth: 2, borderColor: canal === "sms" ? "#000" : "#a8a8a8", padding: 10, borderRadius: 10, alignItems: "center", width: 70 }}>
                    <Text style={{ color: canal === "sms" ? "#000" : "#a8a8a8", fontWeight: "bold" }}>SMS</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCanal("email")}>
                  <View style={{ borderWidth: 2, borderColor: canal === "email" ? "#000" : "#a8a8a8", padding: 10, borderRadius: 10, alignItems: "center", width: 70 }}>
                    <Text style={{ color: canal === "email" ? "#000" : "#a8a8a8", fontWeight: "bold" }}>Email</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            {canal === "sms" ?
              <View style={styles.inputContainer}>
                <Text style={styles.inputTitle}>Numéro de téléphone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="06 XX XX XX XX"
                  value={phone}
                  onChangeText={setPhone}
                  inputMode="tel"
                />
              </View>
              :
              <View style={styles.inputContainer}>
                <Text style={styles.inputTitle}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Jode@gmail.com"
                  value={mail}
                  onChangeText={setMail}
                  inputMode='email'
                />
              </View>
            }
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Message d'invitation</Text>
              <TextInput
                style={styles.input}
                placeholder="Son email"
                multiline
                value={`Bonjour ${prenom}, clique sur le lien ci dessous, une surprise t'y attends... \n\n https://apps.apple.com/fr/app/the-kut/id1601107524 `}
                onChangeText={setMessage}
              />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginTop: 30 }}>
              <TouchableOpacity style={styles.button}
                onPress={() => validateImage()} >
                <Text style={styles.buttonText}>Enregistrer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonSecond}
                onPress={() => setShowNext(!showNext)} >
                <Text style={styles.buttonTextSecond}>Retour</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        :
        data &&
        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <View style={{
            alignItems: 'center',
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 30
          }}>
            <TouchableOpacity
              onPress={() => router.replace('/(auth)')} >
              <Ionicons name="chevron-back-sharp" size={30} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Ma e-demande</Text>
          </View>
          <Text>Aperçu de ta demande que verra {data.prenom} lors de son inscription</Text>
          <View style={{ width: "25%", height: 1, backgroundColor: "#c1c1c1", marginTop: 20, marginBottom: 30 }} />
          {/* <Ionicons name="checkmark-circle" size={100} color="#2F215F" /> */}
          {imgUrl && <Image source={{ uri: imgUrl }} style={styles.avatar} />}
          {!imgUrl && <View style={styles.avatar} />}
          <Text style={styles.demandeText}>{`${data.prenom}, acceptes-tu la demande d'union digital de ${userName} ?`}</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", gap: 20 }}>
            <TouchableOpacity style={styles.button}
              disabled={true}
              onPress={() => console.log("ok")} >
              <Text style={styles.buttonText}>Oui</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSecond}
              disabled={true}
              onPress={() => console.log("ok")} >
              <Text style={styles.buttonTextSecond}>Non</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.explication}>{`Seul ${userName} sera informé de ta réponse. \nEn cas de réponse positive, vous formaliserez et publierez, ensemble, votre engagement sur la blockchain`}</Text>
          <View style={{ width: "25%", height: 1, backgroundColor: "#c1c1c1", marginTop: 30, marginBottom: 30 }} />

          <TouchableOpacity style={styles.button}
            onPress={() => data.email === "" ? sendMessage() : sendEmail()} >
            <Text style={styles.buttonText}>Envoyer par {data.email === "" ? "SMS" : "email"}</Text>
          </TouchableOpacity>
        </View>}
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "#faf7f7",
  },
  containerTop: {
    alignItems: 'center',
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30
  },
  containerNewDemande: {
    paddingBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: "#faf7f7"
  },
  questionButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 20
  },
  avatar: {
    width: "100%",
    height: 300,
    backgroundColor: '#e0e0e0',
    alignSelf: 'center',
    alignItems: "center",
    borderRadius: 20,
    justifyContent: "center"
  },
  editButtonContainer: {
    marginTop: -30,
    alignSelf: 'center',
  },
  avatarStyle: {
    width: 120,
    height: 120,
    alignSelf: "center",
  },
  editButtonStyle: {
    width: 50,
    height: 50,
    alignSelf: "center",
  },
  demandeText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 15
  },
  explication: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    color: "#a8a8a8"
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignSelf: 'center',
    borderRadius: 10,
    minWidth: 130,
    alignItems: 'center',
    backgroundColor: '#2F215F',
    padding: 12,
  },
  buttonDisable: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignSelf: 'center',
    borderRadius: 10,
    width: 130,
    alignItems: 'center',
    backgroundColor: '#b7b7b7',
    padding: 12,
  },
  buttonSecond: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignSelf: 'center',
    borderRadius: 10,
    width: 130,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2F215F',
    padding: 12,
  },
  buttonTextSecond: {
    fontSize: 15,
    textAlign: 'center',
    color: '#2F215F'
  },
  buttonText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#fff'
  },
  formContainer: {
    width: '90%',
    alignSelf: 'center',
  },
  inputTitle: {
    marginLeft: 10,
    marginBottom: 5
  },
  inputContainer: {
    marginTop: 20
  },
  input: {
    backgroundColor: '#FFF',
    paddingVertical: 15,
    borderColor: '#ccc',
    borderWidth: 0.5,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    color: "#2F215F",
  }
});