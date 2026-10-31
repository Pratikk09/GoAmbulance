import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  AppState,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, {Defs, LinearGradient, Rect, Stop} from 'react-native-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LogoClinicCloud from '@assets/svg/home/LogoClinicCloud.svg';
import IconBell from '@assets/svg/home/IconBell.svg';
import IconUser from '@assets/svg/home/IconUser.svg';
import IconCheck from '@assets/svg/home/IconCheck.svg';
import AmbulanceAvailable from '@assets/svg/home/AmbulanceAvailable.svg';
import AmbulanceOffline from '@assets/svg/home/AmbulanceOffline.svg';
import IconPowerDark from '@assets/svg/home/IconPowerDark.svg';
import IconPowerWhite from '@assets/svg/home/IconPowerWhite.svg';
import IconPowerOfflineCircle from '@assets/svg/home/IconPowerOfflineCircle.svg';
import IconPowerDisabled from '@assets/svg/home/IconPowerDisabled.svg';
import IconStatWheel from '@assets/svg/home/IconStatWheel.svg';
import IconStatRoute from '@assets/svg/home/IconStatRoute.svg';
import IconStatClock from '@assets/svg/home/IconStatClock.svg';
import IconLocOffCircle from '@assets/svg/home/IconLocOffCircle.svg';
import IconLocOffRed from '@assets/svg/home/IconLocOffRed.svg';
import IconPinWhite from '@assets/svg/home/IconPinWhite.svg';
import IconWifi from '@assets/svg/home/IconWifi.svg';
import IconVan from '@assets/svg/home/IconVan.svg';
import CustomButtonWithLoader from '@components/CustomButtons/CustomButtonWithLoader';
import {fonts} from '@constant/fontfamily';
import {
  useGetDriverMeQuery,
  useGetTripsQuery,
  useUpdateDriverStatusMutation,
} from '@rtkServices/DriverService';
import {useAppDispatch, useAppSelector} from '@store/index';
import {setOnlineSince} from '@store/DriverManager';
import {showToast} from '@utils/general';
import {enableLocation, getCurrentPosition, isLocationUsable} from '@utils/location';

// Values from the Figma frames 03 Home – Available (44:2), 03b Offline (49:2), 03c GPS Disabled (49:101).
const HOME_COLORS = {
  background: '#F3F7FC',
  headerTop: '#0A47A8',
  headerBottom: '#1B66D2',
  primary: '#0B5BD8',
  title: '#0F1B33',
  body: '#5B6577',
  avatar: '#CFE0F8',
  onDuty: '#22C55E',
  offDuty: '#7A869A',
  iconTile: '#E3EEFE',
  shadow: 'rgb(11,42,102)',
  disabled: '#C3CEDF',
  green: '#16A34A',
  red: '#E53935',
};

const CARD_THEMES = {
  available: {
    from: '#DFF7EC',
    to: '#C7EFDD',
    circle: '#22B573',
    title: HOME_COLORS.title,
  },
  offline: {
    from: '#EEF2F8',
    to: '#DDE4EF',
    circle: '#8493AA',
    title: HOME_COLORS.title,
  },
  gpsOff: {
    from: '#FDEAEA',
    to: '#F9D3D3',
    circle: HOME_COLORS.red,
    title: '#B71C1C',
  },
};

const HEADER_HEIGHT_BELOW_STATUS_BAR = 226;

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Good Morning,';
  }
  return hour < 17 ? 'Good Afternoon,' : 'Good Evening,';
};

const isToday = (iso?: string | null) =>
  !!iso && new Date(iso).toDateString() === new Date().toDateString();

const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
};

const GradientFill = ({
  id,
  from,
  to,
  radius = 0,
}: {
  id: string;
  from: string;
  to: string;
  radius?: number;
}) => (
  <Svg style={StyleSheet.absoluteFill}>
    <Defs>
      <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor={from} />
        <Stop offset="1" stopColor={to} />
      </LinearGradient>
    </Defs>
    <Rect width="100%" height="100%" rx={radius} fill={`url(#${id})`} />
  </Svg>
);

const StatTile = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <View style={[styles.tile, styles.statTile]}>
    <View style={styles.statIconTile}>{icon}</View>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const StatusTile = ({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueColor: string;
}) => (
  <View style={[styles.tile, styles.statusTile]}>
    {icon}
    <Text style={styles.statusLabel}>{label}</Text>
    <Text style={[styles.statusValue, {color: valueColor}]} numberOfLines={1}>
      {value}
    </Text>
  </View>
);

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user.user);
  const onlineSince = useAppSelector(state => state.driver.onlineSince);
  const socketConnected = useAppSelector(state => state.driver.socketConnected);

  const {data: me, isFetching, refetch} = useGetDriverMeQuery();
  const {data: trips = [], refetch: refetchTrips} = useGetTripsQuery({});
  const [updateStatus, {isLoading: isUpdating}] = useUpdateDriverStatusMutation();

  const [gpsUsable, setGpsUsable] = useState(true);
  const [now, setNow] = useState(Date.now());

  // AVAILABLE and BUSY (on a trip) are on duty; OFFLINE is off.
  const isAvailable =
    ['AVAILABLE', 'BUSY'].includes(me?.ambulance?.status) || !!me?.activeTrip;
  const mode = !gpsUsable ? 'gpsOff' : isAvailable ? 'available' : 'offline';
  const cardTheme = CARD_THEMES[mode];

  const driverName =
    me?.driver?.fullName ?? user?.fullName ?? user?.name ?? '';
  const vehicleNumber = me?.ambulance?.vehicleNumber ?? '—';

  const checkGps = useCallback(async () => {
    setGpsUsable(await isLocationUsable());
  }, []);

  // Re-check GPS when coming back from settings, and tick the on-duty timer.
  useEffect(() => {
    checkGps();
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        checkGps();
      }
    });
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => {
      subscription.remove();
      clearInterval(timer);
    };
  }, [checkGps]);

  // Keep the local on-duty timer in step with the server status.
  useEffect(() => {
    if (!me) {
      return;
    }
    if (isAvailable && !onlineSince) {
      dispatch(setOnlineSince(Date.now()));
    } else if (!isAvailable && onlineSince) {
      dispatch(setOnlineSince(null));
    }
  }, [me, isAvailable, onlineSince, dispatch]);

  const stats = useMemo(() => {
    const todays = trips.filter(trip => isToday(trip.timestamps?.acceptedAt));
    return {
      trips: String(todays.length),
      // TODO: the backend doesn't track distance yet (integration guide §16).
      distance: '–',
      // Not tracked by the backend either; counted on the device since going available.
      onDuty: onlineSince ? formatDuration(now - onlineSince) : '–',
    };
  }, [trips, onlineSince, now]);

  const goAvailable = async () => {
    if (!(await isLocationUsable())) {
      setGpsUsable(false);
      return;
    }
    let body: DriverStatusBody = {status: 'AVAILABLE'};
    try {
      const {coords} = await getCurrentPosition();
      body = {...body, latitude: coords.latitude, longitude: coords.longitude};
    } catch (error: any) {
      // No fix yet (e.g. indoors). The server still accepts this if a location was
      // sent in the last 5 minutes; otherwise it answers 400 with a message.
      console.log('No location fix for going online', error?.message);
    }
    try {
      await updateStatus(body).unwrap();
      dispatch(setOnlineSince(Date.now()));
    } catch (error: any) {
      showToast(
        error?.data?.message || 'Could not go available. Please try again.',
      );
    }
  };

  const goOffline = async () => {
    try {
      await updateStatus({status: 'OFFLINE'}).unwrap();
      dispatch(setOnlineSince(null));
    } catch (error: any) {
      // 409 while on a trip.
      showToast(error?.data?.message || 'Could not go offline. Please try again.');
    }
  };

  const onEnableLocation = async () => {
    await enableLocation();
    checkGps();
  };

  const onRefresh = () => {
    refetch();
    refetchTrips();
    checkGps();
  };

  const statusCard = {
    available: {
      icon: <IconCheck width={30} height={30} />,
      title: "You're Available",
      description: 'You will receive new assignments from the dispatch team.',
      ambulance: <AmbulanceAvailable width={176} height={99} />,
    },
    offline: {
      icon: <IconPowerOfflineCircle width={28} height={28} />,
      title: "You're Offline",
      description: 'You are not receiving new assignments.',
      ambulance: <AmbulanceOffline width={176} height={99} />,
    },
    gpsOff: {
      icon: <IconLocOffCircle width={28} height={28} />,
      title: 'GPS is Disabled',
      description:
        'Enable location to receive assignments and share your live location.',
      ambulance: null,
    },
  }[mode];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View
        style={[
          styles.headerBackground,
          {height: insets.top + HEADER_HEIGHT_BELOW_STATUS_BAR},
        ]}>
        <GradientFill
          id="homeHeader"
          from={HOME_COLORS.headerTop}
          to={HOME_COLORS.headerBottom}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {paddingTop: insets.top + 8},
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={onRefresh}
            tintColor="white"
          />
        }>
        <View style={styles.topRow}>
          <View style={styles.brand}>
            <LogoClinicCloud width={34} height={34} />
            <Text style={styles.brandText}>Go Ambulance</Text>
          </View>
          <Pressable
            hitSlop={10}
            onPress={() => showToast('Notifications are coming soon')}>
            <IconBell width={24} height={24} />
          </Pressable>
        </View>

        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <IconUser width={28} height={28} />
          </View>
          <View style={styles.profileText}>
            <Text style={styles.greeting}>{greeting()}</Text>
            <Text style={styles.driverName} numberOfLines={1}>
              {driverName}
            </Text>
          </View>
          <View
            style={[
              styles.dutyChip,
              isAvailable ? styles.dutyChipOn : styles.dutyChipOff,
            ]}>
            <Text style={styles.dutyChipText}>
              {isAvailable ? 'ON DUTY' : 'OFF DUTY'}
            </Text>
          </View>
        </View>

        <View style={styles.statusCard}>
          <GradientFill
            id={`statusCard-${mode}`}
            from={cardTheme.from}
            to={cardTheme.to}
            radius={28}
          />
          <View
            style={[styles.statusCircle, {backgroundColor: cardTheme.circle}]}>
            {statusCard.icon}
          </View>
          <Text style={[styles.statusTitle, {color: cardTheme.title}]}>
            {statusCard.title}
          </Text>
          <Text style={styles.statusDescription}>{statusCard.description}</Text>
          {statusCard.ambulance && (
            <View style={styles.ambulance}>{statusCard.ambulance}</View>
          )}

          {mode === 'available' && (
            <CustomButtonWithLoader
              text="Go Offline"
              onPress={goOffline}
              isLoading={isUpdating}
              disabled={isUpdating}
              icon={<IconPowerDark width={20} height={20} />}
              btnStyle={[styles.cardButton, styles.goOfflineButton]}
              textStyle={[styles.cardButtonText, styles.goOfflineText]}
            />
          )}
          {mode === 'offline' && (
            <CustomButtonWithLoader
              text="Go Available"
              onPress={goAvailable}
              isLoading={isUpdating}
              disabled={isUpdating}
              icon={<IconPowerWhite width={20} height={20} />}
              btnStyle={[styles.cardButton, styles.primaryButton]}
              textStyle={styles.cardButtonText}
            />
          )}
          {mode === 'gpsOff' && (
            <CustomButtonWithLoader
              text="Enable Location"
              onPress={onEnableLocation}
              icon={<IconPinWhite width={20} height={20} />}
              btnStyle={[
                styles.cardButton,
                styles.primaryButton,
                styles.enableLocationButton,
              ]}
              textStyle={styles.cardButtonText}
            />
          )}
        </View>

        {mode === 'gpsOff' ? (
          <>
            <View style={[styles.tileRow, styles.statusTileRow]}>
              <StatusTile
                icon={<IconLocOffRed width={22} height={22} />}
                label="GPS"
                value="Off"
                valueColor={HOME_COLORS.red}
              />
              <StatusTile
                icon={<IconWifi width={22} height={22} />}
                label="Network"
                value={socketConnected ? 'Connected' : 'Disconnected'}
                valueColor={socketConnected ? HOME_COLORS.green : HOME_COLORS.red}
              />
              <StatusTile
                icon={<IconVan width={22} height={22} />}
                label="Vehicle"
                value={vehicleNumber}
                valueColor={HOME_COLORS.primary}
              />
            </View>
            {/* Duty can't change without location, as in the design. */}
            <View style={styles.disabledButton}>
              <IconPowerDisabled width={20} height={20} />
              <Text style={styles.cardButtonText}>
                {isAvailable ? 'Go Offline' : 'Go Available'}
              </Text>
            </View>
          </>
        ) : (
          <View style={[styles.tileRow, styles.statTileRow]}>
            <StatTile
              icon={<IconStatWheel width={18} height={18} />}
              label="Today's Trips"
              value={stats.trips}
            />
            <StatTile
              icon={<IconStatRoute width={18} height={18} />}
              label="Distance"
              value={stats.distance}
            />
            <StatTile
              icon={<IconStatClock width={18} height={18} />}
              label="On Duty"
              value={stats.onDuty}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const tileShadow = {
  shadowColor: HOME_COLORS.shadow,
  shadowOpacity: 0.08,
  shadowRadius: 7,
  shadowOffset: {width: 0, height: 4},
  elevation: 3,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HOME_COLORS.background,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  topRow: {
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    fontSize: 22,
    color: 'white',
    fontFamily: fonts['Gantari-Bold'],
  },
  profileRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2.5,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: HOME_COLORS.avatar,
  },
  profileText: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  greeting: {
    fontSize: 13.5,
    color: 'rgba(255,255,255,0.85)',
    fontFamily: fonts['Gantari-Regular'],
  },
  driverName: {
    marginTop: 3,
    fontSize: 21,
    color: 'white',
    fontFamily: fonts['Gantari-Bold'],
  },
  dutyChip: {
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dutyChipOn: {
    width: 96,
    backgroundColor: HOME_COLORS.onDuty,
  },
  dutyChipOff: {
    width: 104,
    backgroundColor: HOME_COLORS.offDuty,
  },
  dutyChipText: {
    fontSize: 12.5,
    color: 'white',
    fontFamily: fonts['Gantari-Bold'],
  },
  statusCard: {
    marginTop: 38,
    paddingTop: 26,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
    borderRadius: 28,
    shadowColor: HOME_COLORS.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: {width: 0, height: 10},
    elevation: 8,
  },
  statusCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTitle: {
    marginTop: 16,
    fontSize: 26,
    textAlign: 'center',
    fontFamily: fonts['Gantari-Bold'],
  },
  statusDescription: {
    width: 270,
    marginTop: 9,
    fontSize: 14.5,
    lineHeight: 21,
    textAlign: 'center',
    color: HOME_COLORS.body,
    fontFamily: fonts['Gantari-Regular'],
  },
  ambulance: {
    marginTop: 10,
  },
  cardButton: {
    height: 54,
    marginTop: 15,
    borderRadius: 14,
  },
  enableLocationButton: {
    marginTop: 44,
  },
  goOfflineButton: {
    borderWidth: 1.6,
    borderColor: '#19A974',
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  primaryButton: {
    backgroundColor: HOME_COLORS.primary,
    shadowColor: HOME_COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: {width: 0, height: 6},
    elevation: 6,
  },
  cardButtonText: {
    fontSize: 16.5,
    color: 'white',
    textTransform: 'none',
    fontFamily: fonts['Gantari-Bold'],
  },
  goOfflineText: {
    color: HOME_COLORS.title,
    fontFamily: fonts['Gantari-SemiBold'],
  },
  tileRow: {
    flexDirection: 'row',
    gap: 11.5,
  },
  statTileRow: {
    marginTop: 26,
  },
  statusTileRow: {
    marginTop: 28,
  },
  tile: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: 'white',
    ...tileShadow,
  },
  statTile: {
    height: 112,
    paddingTop: 12,
  },
  statIconTile: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: HOME_COLORS.iconTile,
  },
  statLabel: {
    marginTop: 8,
    fontSize: 12,
    color: HOME_COLORS.body,
    fontFamily: fonts['Gantari-Regular'],
  },
  statValue: {
    marginTop: 4,
    fontSize: 21,
    color: HOME_COLORS.title,
    fontFamily: fonts['Gantari-Bold'],
  },
  statusTile: {
    height: 92,
    paddingTop: 12,
    paddingHorizontal: 6,
  },
  statusLabel: {
    marginTop: 10,
    fontSize: 11.5,
    color: HOME_COLORS.body,
    fontFamily: fonts['Gantari-Regular'],
  },
  statusValue: {
    marginTop: 4,
    fontSize: 13,
    fontFamily: fonts['Gantari-Bold'],
  },
  disabledButton: {
    height: 56,
    marginTop: 24,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: HOME_COLORS.disabled,
  },
});
