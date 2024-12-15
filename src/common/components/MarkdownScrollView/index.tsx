import React, {forwardRef, memo, useMemo} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import Markdown from 'react-native-markdown-display';
import {renderRules} from './renderRules';
import {buildStyleSheet} from './style';
import {useTheme} from '@/theme';

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const MarkdownScrollView = forwardRef<ScrollView, {children?: string}>(
  ({children}, ref) => {
    const {schemedTheme} = useTheme();

    const style = useMemo(() => buildStyleSheet(schemedTheme), [schemedTheme]);

    return (
      <ScrollView ref={ref} style={styles.scrollView} removeClippedSubviews>
        <Markdown rules={renderRules} style={style}>
          {children}
        </Markdown>
      </ScrollView>
    );
  },
);

/******************************************************************************
 *                                   STYLES                                   *
 ******************************************************************************/

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 12,
  },
});

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(MarkdownScrollView);
