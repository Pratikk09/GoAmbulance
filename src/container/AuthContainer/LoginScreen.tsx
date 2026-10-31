import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import AuthHeader from '@components/CustomHeaders/AuthHeader';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import CustomButtonWithLoader from '@components/CustomButtons/CustomButtonWithLoader';
import {fonts} from '@constant/fontfamily';
import {LoginScreenProps} from '@navigation/screens';

const LoginScreen = ({navigation}: LoginScreenProps) => {
  const [isSecure, setIsSecure] = useState(true);
  const onEyePress = () => setIsSecure(prev => !prev);

  const {control, handleSubmit} = useForm<ILoginFormReq>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLoginSubmit = (data: ILoginFormReq) => {
    const _payload = {
      email: data?.email,
      password: data?.password,
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <AuthHeader
        title={`Don't have an account? `}
        subtitle={'Sign up'}
        onBackPress={() => {}}
        onTextPress={() => {}}
      />
      <View style={{padding: 14}}>
        <Text style={styles.titlestyle}>Welcome back, we've missed you!</Text>
        <Text style={styles.substyle}>
          We kept everything exactly where you left it... even the chaos!
        </Text>
        <Controller
          control={control}
          rules={{
            required: 'Email or Username field is required',
          }}
          name={'email'}
          render={({field: {onChange, value}, fieldState: {error}}) => (
            <TextInputWithLabels
              value={value}
              label="Email or Username"
              placeholder="Enter your email or username"
              onChangeText={(text: any) => {
                onChange(text?.toLowerCase());
              }}
              error={error?.message}
              keyboardType="email-address"
              mainContainerProps={{marginTop: 30}}
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
              label="Password"
              placeholder="Enter Your Password"
              isSecure={isSecure}
              onPress={onEyePress}
              secureTextEntry={isSecure}
              onChangeText={onChange}
              error={error?.message}
              mainContainerProps={{marginTop: 0}}
            />
          )}
        />
        <Text onPress={() => {}} style={styles.forgotTextStyle}>
          Forgot Password?
        </Text>
        <CustomButtonWithLoader
          text="Continue"
          onPress={handleSubmit(handleLoginSubmit)}
          textStyle={{textTransform: 'capitalize'}}
          isLoading={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titlestyle: {
    fontSize: 20,
    color: 'black',
    fontFamily: fonts['Gantari-Medium'],
  },
  substyle: {
    fontSize: 15,
    lineHeight: 20,
    marginTop: 10,
    fontFamily: fonts['Gantari-Regular'],
  },
  forgotTextStyle: {
    fontSize: 14,
    color: 'black',
    alignSelf: 'flex-end',
    fontFamily: fonts['Gantari-Regular'],
  },
});
