import * as React from 'react';
import {TextInput, StyleSheet, View} from 'react-native';
import {IconButton} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import {useHomeSearch, CLOSED_WIDTH} from './useHomeSearch';

interface HomeSearchProps {
  search: string;
  setSearch: (search: string) => void;
}

const HomeSearch = ({search, setSearch}: HomeSearchProps) => {
  const textInputRef = React.useRef<TextInput>(null);
  const {handleOnPress, animatedStyle, themedStyles} = useHomeSearch(
    search,
    setSearch,
    textInputRef,
  );

  return (
    <Animated.View style={[styles.outterView, animatedStyle, themedStyles]}>
      <View style={styles.innerView}>
        <IconButton
          iconColor={themedStyles.color}
          icon="magnify"
          onPress={handleOnPress}
        />
      </View>
      <TextInput
        ref={textInputRef}
        value={search}
        onChangeText={setSearch}
        selectionColor={themedStyles.color}
        underlineColorAndroid="transparent"
        style={[styles.textInput, themedStyles]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outterView: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 16,
    height: CLOSED_WIDTH,
    borderRadius: 10,
    elevation: 2,
    overflow: 'hidden',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
  },
  innerView: {
    width: CLOSED_WIDTH,
    height: CLOSED_WIDTH,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 12,
    height: CLOSED_WIDTH,
    width: 200,
    borderColor: 'transparent',
    fontSize: 16,
    paddingLeft: 16,
    textAlignVertical: 'center',
  },
});

export default React.memo(HomeSearch);
