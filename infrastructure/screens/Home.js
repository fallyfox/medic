import { useState, useEffect, useCallback,useContext } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Theme } from '../components/Theme';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Profile } from './Profile';
import { History } from './History';
import { Notifications } from './Notifications';
import { CustomerHome } from './customers/CustomerHome';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../Globals/Appcontext';

const Tab = createBottomTabNavigator();

export function Home({navigation}){
    const [appIsReady, setAppIsReady] = useState(false);
    const {signedIn} = useContext(AppContext);

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

    return (
        !signedIn ? navigation.navigate('Login') :
        <Tab.Navigator 
        screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
            let iconName;
    
            if (route.name === 'My Home') {
            iconName = focused ? 'home-sharp' : 'home-outline';
            } else if (route.name === 'Profile') {
            iconName = focused ? 'ios-person-circle' : 'ios-person-circle-outline';
            }else if (route.name === 'History') {
            iconName = focused ? 'md-file-tray-stacked' : 'ios-file-tray-stacked-outline';
            }else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
            }
    
            return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Theme.colors.ui.nursePurple,
        tabBarInactiveTintColor: Theme.colors.ui.darkGreen,
        })}
        >
            <Tab.Screen name='My Home' component={CustomerHome} options={{headerShown:false}}/>
            <Tab.Screen name='Profile' component={Profile} options={{headerShown:false}}/>
            <Tab.Screen name='History' component={History} options={{headerShown:false}}/>
            <Tab.Screen name='Notifications' component={Notifications} options={{headerShown:false}}/>
        </Tab.Navigator>
    );
}
