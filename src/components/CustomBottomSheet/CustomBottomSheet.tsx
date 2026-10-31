import React, {useMemo, useCallback, forwardRef, memo} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Keyboard,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

const CustomBottomSheet = forwardRef<BottomSheet, CustomBottomSheetProps>(
  (
    {
      index = 0,
      onClose,
      renderView,
      label,
      submitLabel = 'Submit',
      onSubmit,
      paddingHorizontal = 10,
      RenderFooter,
      forComments = false,
      containerStyle = {},
    },
    ref,
  ) => {
    const snapPoints = useMemo(
      () => ['20%', '30%', '40%', '50%', '70%', '95%'],
      [],
    );

    const handleSheetChanges = useCallback(
      (sheetIndex: number) => {
        if (sheetIndex === -1 && onClose) {
          onClose();
        }
      },
      [onClose],
    );

    const renderBackdrop = useCallback(
      (backdropProps: any) => (
        <BottomSheetBackdrop
          {...backdropProps}
          appearsOnIndex={1}
          disappearsOnIndex={-1}
        />
      ),
      [],
    );

    const BottomSheetContainer = !forComments ? BottomSheetScrollView : View;

    return (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        index={index}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        handleComponent={() => {
          return <></>;
        }}
        backgroundStyle={{backgroundColor: '#181620'}}
        onChange={handleSheetChanges}>
        <KeyboardAvoidingView
          behavior={'padding'}
          style={[{flex: 1}, containerStyle]}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
          <BottomSheetContainer
            nestedScrollEnabled={true}
            onScrollBeginDrag={() => Keyboard.dismiss()}
            onScrollEndDrag={() => Keyboard.dismiss()}
            style={{flex: 1}}>
            <View style={styles.container}>
              {label && (
                <View style={styles.headerViewStyle}>
                  <Text style={styles.titleStyle}>{label}</Text>
                  {onSubmit && (
                    <Pressable onPress={onSubmit}>
                      <Text style={styles.submitButtonText}>{submitLabel}</Text>
                    </Pressable>
                  )}
                </View>
              )}
              <View
                style={[
                  styles.contentContainer,
                  {paddingHorizontal: paddingHorizontal},
                ]}>
                {renderView && renderView()}
              </View>
            </View>
          </BottomSheetContainer>
          {Boolean(RenderFooter) ? <RenderFooter /> : null}
        </KeyboardAvoidingView>
      </BottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    zIndex: 99999,
  },
  headerViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.4,
    borderBottomColor: '#22212A',
    width: '100%',
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  titleStyle: {
    fontSize: 17,
    color: 'black',
    paddingLeft: 12,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
  },
  indicator: {
    marginTop: 15,
    height: 4,
    width: 40,
    alignSelf: 'center',
    marginVertical: 8,
    borderRadius: 2,
  },
  submitButtonText: {
    fontSize: 17,
    color: '#FE2C55',
    paddingRight: 10,
  },
});

export default memo(CustomBottomSheet);
