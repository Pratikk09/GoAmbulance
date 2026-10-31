import React, {useCallback, useEffect, useState} from 'react';
import {
  AppState,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Svg, {Defs, LinearGradient, Rect, Stop} from 'react-native-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  PERMISSIONS,
  RESULTS,
  check,
  checkNotifications,
  request,
  requestNotifications,
} from 'react-native-permissions';
import CustomButtonWithLoader from '@components/CustomButtons/CustomButtonWithLoader';
import CustomToggle from '@components/CustomToggle/CustomToggle';
import IconBack from '@assets/svg/permissions/IconBack.svg';
import LogoClinicCloud from '@assets/svg/permissions/LogoClinicCloud.svg';
import IconPin from '@assets/svg/permissions/IconPin.svg';
import IconBell from '@assets/svg/permissions/IconBell.svg';
import Route from '@assets/svg/permissions/Route.svg';
import PinDestination from '@assets/svg/permissions/PinDestination.svg';
import Ambulance from '@assets/svg/permissions/Ambulance.svg';
import {fonts} from '@constant/fontfamily';
import {PermissionScreenProps} from '@navigation/screens';
import {navigateAndSimpleReset} from '@navigation/utils';
import {openSetting} from '@utils/permision';

// Values from the Figma "02 Permissions" frame (node 41:79), which is 390 wide.
const DESIGN_WIDTH = 390;

const PERMISSION_COLORS = {
  primary: '#0B5BD8',
  brand: '#0B4FB5',
  title: '#0F1B33',
  body: '#5B6577',
  cardBackground: '#F6F9FD',
  cardBorder: '#E3EAF5',
  iconTile: '#E1EDFD',
  building: 'rgba(227,238,254,0.9)',
  groundTop: '#EEF4FD',
};

const BUILDINGS = [
  {left: 24, top: 80, width: 44, height: 170},
  {left: 76, top: 120, width: 36, height: 130},
  {left: 118, top: 60, width: 52, height: 190},
  {left: 250, top: 100, width: 40, height: 150},
  {left: 298, top: 70, width: 46, height: 180},
  {left: 350, top: 130, width: 30, height: 120},
];

const LOCATION_PERMISSION =
  Platform.OS === 'ios'
    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

const BLOCKED_MESSAGE =
  'This permission is turned off. Please enable it in your app settings.';

const PermissionScreen = ({navigation}: PermissionScreenProps) => {
  const {width} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scale = width / DESIGN_WIDTH;
  const s = (value: number) => value * scale;

  const [locationGranted, setLocationGranted] = useState(false);
  const [notificationGranted, setNotificationGranted] = useState(false);

  const refreshPermissions = useCallback(async () => {
    const location = await check(LOCATION_PERMISSION);
    const {status: notification} = await checkNotifications();
    setLocationGranted(location === RESULTS.GRANTED);
    setNotificationGranted(notification === RESULTS.GRANTED);
  }, []);

  // Re-check when the driver comes back from the settings app.
  useEffect(() => {
    refreshPermissions();
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        refreshPermissions();
      }
    });
    return () => subscription.remove();
  }, [refreshPermissions]);

  const requestLocation = async () => {
    const result = await request(LOCATION_PERMISSION);
    setLocationGranted(result === RESULTS.GRANTED);
    if (result === RESULTS.BLOCKED) {
      openSetting(BLOCKED_MESSAGE);
    }
    return result === RESULTS.GRANTED;
  };

  const requestNotification = async () => {
    const {status} = await requestNotifications(['alert', 'sound', 'badge']);
    setNotificationGranted(status === RESULTS.GRANTED);
    if (status === RESULTS.BLOCKED) {
      openSetting(BLOCKED_MESSAGE);
    }
    return status === RESULTS.GRANTED;
  };

  const onContinue = async () => {
    if (!locationGranted) {
      await requestLocation();
    }
    if (!notificationGranted) {
      await requestNotification();
    }
    navigateAndSimpleReset('MainNavigator', undefined);
  };

  const permissionCards = [
    {
      key: 'location',
      title: 'Location Access',
      description:
        'Share your live location with dispatch and get the fastest route.',
      icon: <IconPin width={22} height={22} />,
      granted: locationGranted,
      onPress: requestLocation,
    },
    {
      key: 'notifications',
      title: 'Notifications',
      description: 'Get new job alerts, updates and emergency messages.',
      icon: <IconBell width={22} height={22} />,
      granted: notificationGranted,
      onPress: requestNotification,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16},
        ]}>
        <View style={styles.brandRow}>
          {navigation.canGoBack() && (
            <Pressable
              onPress={navigation.goBack}
              hitSlop={12}
              style={styles.backButton}>
              <IconBack width={24} height={24} />
            </Pressable>
          )}
          <LogoClinicCloud width={36} height={36} />
          <Text style={styles.brandText}>Go Ambulance</Text>
        </View>

        <Text style={styles.title}>Allow Permissions</Text>
        <Text style={styles.subtitle}>
          These permissions help you receive assignments and navigate
          smoothly.
        </Text>

        {permissionCards.map(card => (
          <View key={card.key} style={styles.card}>
            <View style={styles.iconTile}>{card.icon}</View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDescription}>{card.description}</Text>
            </View>
            <CustomToggle
              value={card.granted}
              disabled={card.granted}
              onPress={card.onPress}
              activeColor={PERMISSION_COLORS.primary}
            />
          </View>
        ))}

        <View style={styles.spacer} />

        <View style={[styles.illustration, {height: s(250)}]}>
          {BUILDINGS.map((building, index) => (
            <View
              key={index}
              style={[
                styles.building,
                {
                  left: s(building.left),
                  top: s(building.top),
                  width: s(building.width),
                  height: s(building.height),
                },
              ]}
            />
          ))}
          <Svg
            width={s(390)}
            height={s(50)}
            style={[styles.ground, {top: s(200)}]}>
            <Defs>
              <LinearGradient id="groundGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={PERMISSION_COLORS.groundTop} />
                <Stop offset="1" stopColor="white" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#groundGradient)" />
          </Svg>
          <Route
            width={s(200)}
            height={s(130)}
            style={[styles.absolute, {left: s(96), top: s(40)}]}
          />
          <PinDestination
            width={s(44)}
            height={s(56)}
            style={[styles.absolute, {left: s(226), top: s(8)}]}
          />
          <Ambulance
            width={s(176)}
            height={s(99)}
            style={[styles.absolute, {left: s(70), top: s(142)}]}
          />
        </View>

        <View style={styles.footer}>
          <CustomButtonWithLoader
            text="Continue"
            onPress={onContinue}
            btnStyle={styles.continueButton}
            textStyle={styles.continueButtonText}
            isLoading={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default PermissionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    flexGrow: 1,
  },
  absolute: {
    position: 'absolute',
  },
  brandRow: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  backButton: {
    position: 'absolute',
    left: 20,
  },
  brandText: {
    fontSize: 24,
    color: PERMISSION_COLORS.brand,
    fontFamily: fonts['Gantari-SemiBold'],
  },
  title: {
    marginTop: 38,
    fontSize: 29,
    textAlign: 'center',
    color: PERMISSION_COLORS.title,
    fontFamily: fonts['Gantari-Bold'],
  },
  subtitle: {
    width: 310,
    alignSelf: 'center',
    marginTop: 11,
    marginBottom: 38,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    color: PERMISSION_COLORS.body,
    fontFamily: fonts['Gantari-Regular'],
  },
  card: {
    minHeight: 92,
    marginHorizontal: 20,
    marginBottom: 12,
    paddingVertical: 16,
    paddingLeft: 15,
    paddingRight: 17,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: PERMISSION_COLORS.cardBorder,
    backgroundColor: PERMISSION_COLORS.cardBackground,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PERMISSION_COLORS.iconTile,
  },
  cardText: {
    flex: 1,
    marginLeft: 14,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 17,
    color: PERMISSION_COLORS.title,
    fontFamily: fonts['Gantari-SemiBold'],
  },
  cardDescription: {
    maxWidth: 178,
    marginTop: 5,
    fontSize: 13,
    lineHeight: 18,
    color: PERMISSION_COLORS.body,
    fontFamily: fonts['Gantari-Regular'],
  },
  spacer: {
    flex: 1,
    minHeight: 20,
  },
  illustration: {
    width: '100%',
    overflow: 'hidden',
  },
  ground: {
    position: 'absolute',
    left: 0,
  },
  building: {
    position: 'absolute',
    borderRadius: 6,
    backgroundColor: PERMISSION_COLORS.building,
  },
  footer: {
    paddingHorizontal: 20,
  },
  continueButton: {
    height: 56,
    borderRadius: 14,
    marginTop: 12,
    backgroundColor: PERMISSION_COLORS.primary,
    shadowColor: PERMISSION_COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: {width: 0, height: 6},
    elevation: 6,
  },
  continueButtonText: {
    fontSize: 17,
    textTransform: 'none',
    fontFamily: fonts['Gantari-Bold'],
  },
});
