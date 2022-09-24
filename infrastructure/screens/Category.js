import { useState, useEffect, useCallback } from 'react';
import { View,Text,StyleSheet, SafeAreaView, Platform, StatusBar, FlatList } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Questrial_400Regular } from '@expo-google-fonts/questrial';
import { Theme } from '../components/Theme';
import { Card,Title,Button } from 'react-native-paper';
import { db } from '../../services/firebase';
import { collection,where,query,onSnapshot } from 'firebase/firestore';

export function Category({navigation,route}){
    const [appIsReady, setAppIsReady] = useState(false);
    const [services,setServices] = useState([]);
    const {categoryName} = route.params;

    const q = collection(db,'services');
    const filter = query(q,where('category','==',categoryName));

    useEffect(() => {
        const allServices = [];

        onSnapshot(filter,(onSnap) => {
            onSnap.forEach(item => {
                const itemData = item.data();
                itemData.docId = item.id;
                allServices.push(itemData);
                setServices(allServices);
            })
        })
    },[]);

    console.log('Therapy only',services);

    useEffect(() => {
        async function prepare() {
            try {
                await Font.loadAsync({Questrial_400Regular});
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (e) {
                console.warn(e);
            } finally {
                setAppIsReady(true);
            }
        }
        prepare();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
        await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }

    //For Flatlist: to display each service
    function ServiceCard(service){
        return(
            <Card style={{marginBottom:Theme.sizes[2]}}>
                <Card.Cover source={{ uri: service.imageUrl }} />
                <Card.Title title={service.title} subtitle={'name'}/>
                <Card.Content>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceRowText}>NGN{service.price}</Text>
                        <Text style={styles.priceRowText}>{service.category}</Text>
                    </View>
                </Card.Content>
                <Card.Actions>
                    <Button 
                    mode='contained' 
                    color={Theme.colors.ui.nursePurple}
                    contentStyle={{paddingHorizontal:8}}
                    >Order</Button>
                </Card.Actions>
            </Card>
        )
       
    }

    return (
        <SafeAreaView style={styles.areaView}>
            <View style={styles.container}>
                <View style={styles.servicesList}>
                    <FlatList 
                    data={services}
                    renderItem={({item}) => {
                        return ServiceCard(item)
                    }}
                    key={({item}) => item.docId}
                    showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    areaView:{
        flex:1,
        marginTop:Platform.OS === 'android' ? StatusBar.currentHeight : null
    },
    container:{
        flex:1,
        padding:Theme.sizes[3],
        justifyContent:'space-between'
    },
    priceRow:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    priceRowText:{
        color:'gray'
    }
})