import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import NavHome from '@assets/svg/home/NavHome.svg';
import NavWheel from '@assets/svg/home/NavWheel.svg';
import NavUser from '@assets/svg/home/NavUser.svg';
import NavMenu from '@assets/svg/home/NavMenu.svg';
import {fonts} from '@constant/fontfamily';
import {showToast} from '@utils/general';

// Bottom nav from the Figma Home frames. Only Home is built; the rest are placeholders.
const ITEMS = [
  {key: 'HomeTab', label: 'Home', Icon: NavHome},
  {key: 'Trips', label: 'Trips', Icon: NavWheel},
  {key: 'Profile', label: 'Profile', Icon: NavUser},
  {key: 'More', label: 'More', Icon: NavMenu},
];

const BottomTabBar = ({state, navigation}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const activeRoute = state.routes[state.index]?.name;

  return (
    <View style={[styles.bar, {paddingBottom: insets.bottom}]}>
      {ITEMS.map(({key, label, Icon}) => {
        const isActive = key === activeRoute;
        const route = state.routes.find(item => item.name === key);
        const onPress = () =>
          route
            ? navigation.navigate(route.name)
            : showToast(`${label} is coming soon`);
        return (
          <Pressable
            key={key}
            style={styles.item}
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityState={{selected: isActive}}>
            <View style={[styles.iconWrap, isActive && styles.activePill]}>
              <Icon width={24} height={24} />
            </View>
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default BottomTabBar;

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    shadowColor: 'rgb(11,42,102)',
    shadowOpacity: 0.08,
    shadowRadius: 7,
    shadowOffset: {width: 0, height: -2},
    elevation: 10,
  },
  item: {
    flex: 1,
    height: 78,
    paddingTop: 10,
    alignItems: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    borderRadius: 22,
    backgroundColor: '#E3EEFE',
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    color: '#7A869A',
    fontFamily: fonts['Gantari-Medium'],
  },
  activeLabel: {
    color: '#0B5BD8',
    fontFamily: fonts['Gantari-SemiBold'],
  },
});
