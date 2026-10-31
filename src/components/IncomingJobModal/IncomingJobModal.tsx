import React, {useEffect, useState} from 'react';
import {
  Linking,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, {Defs, LinearGradient, Rect, Stop} from 'react-native-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomButtonWithLoader from '@components/CustomButtons/CustomButtonWithLoader';
import IconSiren from '@assets/svg/jobOffer/IconSiren.svg';
import LogoClinicCloud from '@assets/svg/jobOffer/LogoClinicCloud.svg';
import IconHeart from '@assets/svg/jobOffer/IconHeart.svg';
import IconPin from '@assets/svg/jobOffer/IconPin.svg';
import IconClock from '@assets/svg/jobOffer/IconClock.svg';
import {fonts} from '@constant/fontfamily';
import {useAppSelector} from '@store/index';
import {offerExpiresAt, respondToJob} from '@utils/jobAlert';

// Values from the Figma Emergency Request popup (node 42:2).
const JOB_COLORS = {
  background: '#F3F7FC',
  headerTop: '#0A47A8',
  headerBottom: '#1B66D2',
  bannerTop: '#E94A4F',
  bannerBottom: '#C62828',
  red: '#E0383E',
  title: '#0F1B33',
  body: '#5B6577',
  cardBorder: '#F3DCDC',
  iconTile: '#FDE8E8',
  divider: '#F0E4E4',
  declineBackground: '#EEF2F8',
  declineBorder: '#DDE4EF',
};

const HEADER_HEIGHT_BELOW_STATUS_BAR = 226;

const secondsLeft = (expiresAt: number) =>
  Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));

const formatCountdown = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
};

const IncomingJobModal = () => {
  const job = useAppSelector(state => state.jobOffer.incomingJob);
  const insets = useSafeAreaInsets();
  const [remaining, setRemaining] = useState(0);
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    if (!job) {
      return;
    }
    const expiresAt = offerExpiresAt(job);
    setRemaining(secondsLeft(expiresAt));
    const timer = setInterval(() => {
      const left = secondsLeft(expiresAt);
      setRemaining(left);
      if (left === 0) {
        clearInterval(timer);
        // The server moves the offer on by itself after the timeout.
        respondToJob(job.caseId, 'missed');
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [job]);

  if (!job) {
    return null;
  }

  const onAccept = async () => {
    setIsAccepting(true);
    await respondToJob(job.caseId, 'accepted');
    setIsAccepting(false);
  };

  // The offer has no address or destination yet; those come with the trip after accepting.
  const rows = [
    {
      key: 'condition',
      label: job.patientName
        ? `Patient Condition · ${job.patientName}`
        : 'Patient Condition',
      value: job.triageSummary,
      link: undefined,
      icon: <IconHeart width={26} height={26} />,
    },
    {
      key: 'pickup',
      label: 'Pickup Location',
      value: `${job.distanceKm} km away`,
      link: job.pickup?.mapsLink,
      icon: <IconPin width={26} height={26} />,
    },
  ];

  return (
    <Modal
      visible
      animationType="slide"
      statusBarTranslucent
      // The driver has to choose Accept or Decline; back does nothing.
      onRequestClose={() => {}}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Svg
          style={[
            styles.headerBackground,
            {height: insets.top + HEADER_HEIGHT_BELOW_STATUS_BAR},
          ]}>
          <Defs>
            <LinearGradient id="jobHeader" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={JOB_COLORS.headerTop} />
              <Stop offset="1" stopColor={JOB_COLORS.headerBottom} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#jobHeader)" />
        </Svg>

        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            {paddingTop: insets.top + 8, paddingBottom: insets.bottom + 20},
          ]}>
          <View style={styles.brandRow}>
            <LogoClinicCloud width={34} height={34} />
            <Text style={styles.brandText}>Go Ambulance</Text>
          </View>

          <View style={styles.bannerWrap}>
            <View style={styles.banner}>
              <Svg style={StyleSheet.absoluteFill}>
                <Defs>
                  <LinearGradient id="jobBanner" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={JOB_COLORS.bannerTop} />
                    <Stop offset="1" stopColor={JOB_COLORS.bannerBottom} />
                  </LinearGradient>
                </Defs>
                <Rect
                  width="100%"
                  height="100%"
                  rx={20}
                  fill="url(#jobBanner)"
                />
              </Svg>
              <Text style={styles.bannerText}>EMERGENCY REQUEST</Text>
            </View>
            <View style={styles.sirenBadge}>
              <IconSiren width={40} height={40} />
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>New Assignment</Text>
              <View style={styles.timerChip}>
                <IconClock width={16} height={16} />
                <Text style={styles.timerText}>
                  {formatCountdown(remaining)}
                </Text>
              </View>
            </View>

            {rows.map((row, index) => (
              <View
                key={row.key}
                style={[
                  styles.row,
                  index < rows.length - 1 && styles.rowDivider,
                ]}>
                <View style={styles.iconTile}>{row.icon}</View>
                <View style={styles.rowText}>
                  <Text style={styles.rowLabel}>{row.label}</Text>
                  <Text style={styles.rowValue}>{row.value}</Text>
                  {!!row.link && (
                    <Text
                      style={styles.rowLink}
                      onPress={() => row.link && Linking.openURL(row.link)}>
                      View on map
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>

          <View style={styles.buttonRow}>
            <CustomButtonWithLoader
              text="Decline"
              onPress={() => respondToJob(job.caseId, 'rejected')}
              disabled={isAccepting}
              mainbtnStyle={styles.buttonSlot}
              btnStyle={styles.declineButton}
              textStyle={[styles.buttonText, styles.declineText]}
            />
            <CustomButtonWithLoader
              text="Accept"
              onPress={onAccept}
              isLoading={isAccepting}
              disabled={isAccepting}
              mainbtnStyle={styles.buttonSlot}
              btnStyle={styles.acceptButton}
              textStyle={styles.buttonText}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default IncomingJobModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: JOB_COLORS.background,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    fontSize: 22,
    color: 'white',
    fontFamily: fonts['Gantari-Bold'],
  },
  bannerWrap: {
    marginTop: 27,
    paddingTop: 38,
  },
  banner: {
    height: 81,
    paddingTop: 36,
    borderRadius: 20,
    shadowColor: JOB_COLORS.bannerBottom,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 8},
    elevation: 8,
  },
  bannerText: {
    fontSize: 20,
    letterSpacing: 1,
    textAlign: 'center',
    color: 'white',
    fontFamily: fonts['Gantari-Bold'],
  },
  sirenBadge: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    shadowColor: JOB_COLORS.bannerBottom,
    shadowOpacity: 0.28,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 6},
    elevation: 10,
  },
  card: {
    marginTop: 6,
    paddingBottom: 1,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: JOB_COLORS.cardBorder,
    backgroundColor: 'white',
    shadowColor: JOB_COLORS.bannerBottom,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 8},
    elevation: 3,
  },
  cardHeader: {
    height: 62,
    paddingLeft: 19,
    paddingRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 20,
    color: JOB_COLORS.title,
    fontFamily: fonts['Gantari-Bold'],
  },
  timerChip: {
    width: 112,
    height: 38,
    marginTop: 8,
    borderRadius: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: JOB_COLORS.red,
    shadowColor: JOB_COLORS.bannerBottom,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 4,
  },
  timerText: {
    fontSize: 16,
    color: 'white',
    fontFamily: fonts['Gantari-Bold'],
  },
  row: {
    minHeight: 112,
    marginHorizontal: 19,
    paddingVertical: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: JOB_COLORS.divider,
  },
  iconTile: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: JOB_COLORS.iconTile,
  },
  rowText: {
    flex: 1,
    marginLeft: 18,
  },
  rowLabel: {
    fontSize: 13.5,
    color: JOB_COLORS.body,
    fontFamily: fonts['Gantari-Regular'],
  },
  rowValue: {
    marginTop: 4,
    fontSize: 18,
    lineHeight: 25,
    color: JOB_COLORS.title,
    fontFamily: fonts['Gantari-Bold'],
  },
  rowLink: {
    marginTop: 4,
    fontSize: 13.5,
    color: '#0B5BD8',
    fontFamily: fonts['Gantari-Medium'],
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  buttonSlot: {
    flex: 1,
  },
  declineButton: {
    height: 60,
    marginTop: 0,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: JOB_COLORS.declineBorder,
    backgroundColor: JOB_COLORS.declineBackground,
  },
  acceptButton: {
    height: 60,
    marginTop: 0,
    borderRadius: 16,
    backgroundColor: JOB_COLORS.red,
    shadowColor: JOB_COLORS.bannerBottom,
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: {width: 0, height: 6},
    elevation: 6,
  },
  buttonText: {
    fontSize: 17,
    textTransform: 'none',
    fontFamily: fonts['Gantari-Bold'],
  },
  declineText: {
    color: JOB_COLORS.title,
  },
});
