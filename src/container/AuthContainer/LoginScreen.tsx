import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import Svg, {Defs, LinearGradient, Rect, Stop} from 'react-native-svg';
import {Controller, useForm} from 'react-hook-form';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import CustomButtonWithLoader from '@components/CustomButtons/CustomButtonWithLoader';
import {EyeShowIcon} from '@assets/svg/AuthFlowIcons';
import Ambulance from '@assets/svg/login/Ambulance.svg';
import IconPhone from '@assets/svg/login/IconPhone.svg';
import IconLock from '@assets/svg/login/IconLock.svg';
import IconEyeOff from '@assets/svg/login/IconEyeOff.svg';
import IconArrow from '@assets/svg/login/IconArrow.svg';
import {fonts} from '@constant/fontfamily';
import {LoginScreenProps} from '@navigation/screens';

// Values from the Figma "01 Login" frame (node 41:3), which is 390 wide.
const DESIGN_WIDTH = 390;
const HERO_HEIGHT = 470;
const SHEET_OVERLAP = 18;

const LOGIN_COLORS = {
  heroTop: '#0A47A8',
  heroBottom: '#3A8EEA',
  primary: '#0B5BD8',
  title: '#0F1B33',
  body: '#5B6577',
  inputBorder: '#D5DCE8',
  road: 'rgba(10,47,115,0.55)',
};

const BUILDINGS = [
  {left: 18, top: 300, width: 64, height: 170, opacity: 0.1},
  {left: 92, top: 346, width: 48, height: 124, opacity: 0.08},
  {left: 150, top: 382, width: 40, height: 90, opacity: 0.07},
  {left: 318, top: 340, width: 70, height: 130, opacity: 0.08},
];

const WINDOW_COLUMNS = [14, 52, 90];
const WINDOW_ROWS = [70, 98, 126, 154, 182];

const LoginScreen = ({navigation}: LoginScreenProps) => {
  const {width} = useWindowDimensions();
  const scale = width / DESIGN_WIDTH;
  const s = (value: number) => value * scale;

  const [isSecure, setIsSecure] = useState(true);
  const onEyePress = () => setIsSecure(prev => !prev);

  const {control, handleSubmit} = useForm<ILoginFormReq>({
    defaultValues: {
      driverId: '',
      password: '',
    },
  });

  const handleLoginSubmit = (data: ILoginFormReq) => {
    const _payload = {
      driverId: data?.driverId,
      password: data?.password,
    };
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAwareScrollView
        bottomOffset={24}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={[styles.hero, {height: s(HERO_HEIGHT)}]}>
          <Svg style={StyleSheet.absoluteFill}>
            <Defs>
              <LinearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={LOGIN_COLORS.heroTop} />
                <Stop offset="1" stopColor={LOGIN_COLORS.heroBottom} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#heroGradient)" />
          </Svg>

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
                  backgroundColor: `rgba(255,255,255,${building.opacity})`,
                },
              ]}
            />
          ))}

          <View
            style={[
              styles.hospital,
              {left: s(240), top: s(262), width: s(128), height: s(208)},
            ]}>
            {WINDOW_ROWS.map(top =>
              WINDOW_COLUMNS.map(left => (
                <View
                  key={`${top}-${left}`}
                  style={[
                    styles.window,
                    {left: s(left), top: s(top), width: s(24), height: s(16)},
                  ]}
                />
              )),
            )}
            <View
              style={[
                styles.hBadge,
                {left: s(44), top: s(12), width: s(40), height: s(40)},
              ]}>
              <Text style={[styles.hText, {fontSize: s(26)}]}>H</Text>
            </View>
          </View>

          <View style={[styles.road, {top: s(434), height: s(36)}]} />

          <Image
            source={require('@assets/images/goAmbulanceLogo.png')}
            resizeMode="stretch"
            style={[
              styles.absolute,
              {left: s(73), top: s(59), width: s(235), height: s(106)},
            ]}
          />
          <Text style={[styles.heroSubtitle, {top: s(171)}]}>
            Ambulance Driver App
          </Text>
          <Ambulance
            width={s(270)}
            height={s(152)}
            style={[styles.absolute, {left: s(36), top: s(288)}]}
          />
        </View>

        <View style={[styles.sheet, {marginTop: -s(SHEET_OVERLAP)}]}>
          <Text style={styles.title}>Driver Login</Text>
          <Text style={styles.subtitle}>
            Access your ambulance assignments and stay on duty.
          </Text>

          <Controller
            control={control}
            rules={{
              required: 'Driver ID or mobile number is required',
            }}
            name={'driverId'}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <TextInputWithLabels
                value={value}
                isLabelRequired={false}
                placeholder="Driver ID / Mobile Number"
                placeholderTextColor={LOGIN_COLORS.body}
                onChangeText={onChange}
                error={error?.message}
                icon={<IconPhone width={20} height={20} />}
                iconStyle={styles.inputIcon}
                btnStyle={styles.inputBox}
                style={styles.inputText}
                mainContainerProps={styles.inputContainer}
              />
            )}
          />
          <Controller
            control={control}
            name={'password'}
            rules={{required: 'Password is required'}}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <TextInputWithLabels
                value={value}
                isLabelRequired={false}
                placeholder="Password"
                placeholderTextColor={LOGIN_COLORS.body}
                isSecure={isSecure}
                onPress={onEyePress}
                secureTextEntry={isSecure}
                onChangeText={onChange}
                error={error?.message}
                icon={<IconLock width={20} height={20} />}
                iconStyle={styles.inputIcon}
                eyeHiddenIcon={<IconEyeOff width={20} height={20} />}
                eyeShownIcon={
                  <EyeShowIcon
                    width={20}
                    height={20}
                    fill={LOGIN_COLORS.body}
                  />
                }
                eyeStyle={styles.eyeIcon}
                btnStyle={styles.inputBox}
                style={styles.inputText}
                mainContainerProps={styles.inputContainer}
              />
            )}
          />

          <Text onPress={() => {}} style={styles.forgotTextStyle}>
            Forgot Password?
          </Text>

          <CustomButtonWithLoader
            text="Login"
            onPress={handleSubmit(handleLoginSubmit)}
            btnStyle={styles.loginButton}
            textStyle={styles.loginButtonText}
            leftIcon={<IconArrow width={20} height={20} />}
            isLoading={false}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default LoginScreen;

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
  hero: {
    overflow: 'hidden',
  },
  building: {
    position: 'absolute',
    borderRadius: 4,
  },
  hospital: {
    position: 'absolute',
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  window: {
    position: 'absolute',
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  hBadge: {
    position: 'absolute',
    borderRadius: 8,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hText: {
    color: LOGIN_COLORS.primary,
    fontFamily: fonts['Gantari-Bold'],
  },
  road: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: LOGIN_COLORS.road,
  },
  heroSubtitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 15,
    color: 'white',
    fontFamily: fonts['Gantari-Regular'],
  },
  sheet: {
    flexGrow: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 46,
    shadowColor: 'rgb(6,40,95)',
    shadowOpacity: 0.18,
    shadowRadius: 9,
    shadowOffset: {width: 0, height: -4},
    elevation: 12,
  },
  title: {
    fontSize: 27,
    color: LOGIN_COLORS.title,
    fontFamily: fonts['Gantari-Bold'],
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 10,
    color: LOGIN_COLORS.body,
    fontFamily: fonts['Gantari-Regular'],
  },
  inputContainer: {
    marginTop: 0,
    marginBottom: 12,
  },
  inputBox: {
    height: 54,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: LOGIN_COLORS.inputBorder,
    backgroundColor: 'white',
    shadowOpacity: 0,
  },
  inputIcon: {
    paddingLeft: 14,
    paddingTop: 0,
  },
  inputText: {
    height: 52,
    paddingHorizontal: 14,
    fontSize: 15,
    color: LOGIN_COLORS.title,
  },
  eyeIcon: {
    paddingLeft: 8,
    paddingRight: 16,
  },
  forgotTextStyle: {
    fontSize: 13,
    color: LOGIN_COLORS.primary,
    alignSelf: 'flex-end',
    fontFamily: fonts['Gantari-Medium'],
  },
  loginButton: {
    height: 56,
    borderRadius: 14,
    marginTop: 26,
    backgroundColor: LOGIN_COLORS.primary,
    shadowColor: LOGIN_COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: {width: 0, height: 6},
    elevation: 6,
  },
  loginButtonText: {
    fontSize: 17,
    textTransform: 'none',
    marginRight: 8,
    fontFamily: fonts['Gantari-Bold'],
  },
});
