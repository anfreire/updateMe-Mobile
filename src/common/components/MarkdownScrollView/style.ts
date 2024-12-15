import {UseThemeProps} from '@/theme';
import {StyleSheet} from 'react-native';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const BORDER_RADIUS = 4;

/******************************************************************************
 *                                   UTILS                                    *
 ******************************************************************************/

export const buildStyleSheet = (schemedTheme: UseThemeProps['schemedTheme']) =>
  StyleSheet.create({
    // The main container
    body: {
      gap: 8,
      backgroundColor: schemedTheme.surfaceContainerLow,
      marginBottom: 24,
    },

    // Headings
    heading1: {
      flexDirection: 'row',
      fontSize: 32,
    },
    heading2: {
      flexDirection: 'row',
      fontSize: 24,
    },
    heading3: {
      flexDirection: 'row',
      fontSize: 18,
    },
    heading4: {
      flexDirection: 'row',
      fontSize: 16,
    },
    heading5: {
      flexDirection: 'row',
      fontSize: 13,
    },
    heading6: {
      flexDirection: 'row',
      fontSize: 11,
    },

    // Horizontal Rule
    hr: {
      backgroundColor: schemedTheme.surfaceContainerHighest,
      height: 1,
      borderRadius: BORDER_RADIUS,
    },

    // Emphasis
    strong: {
      fontWeight: 'bold',
    },
    em: {
      fontStyle: 'italic',
    },
    s: {
      textDecorationLine: 'line-through',
    },

    // Blockquotes
    blockquote: {
      backgroundColor: schemedTheme.surfaceContainer,
      borderLeftWidth: 4,
      marginLeft: 5,
      paddingHorizontal: 5,
      borderRadius: BORDER_RADIUS,
    },

    // Lists
    bullet_list: {},
    ordered_list: {},
    list_item: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    // @pseudo class, does not have a unique render rule
    bullet_list_icon: {
      marginLeft: 8,
      marginRight: 8,
    },
    // @pseudo class, does not have a unique render rule
    bullet_list_content: {
      flex: 1,
    },
    // @pseudo class, does not have a unique render rule
    ordered_list_icon: {
      marginLeft: 8,
      marginRight: 8,
    },
    // @pseudo class, does not have a unique render rule
    ordered_list_content: {
      flex: 1,
    },

    // Code
    code_inline: {
      borderWidth: 0,
      backgroundColor: schemedTheme.surfaceContainerHighest,
      borderRadius: BORDER_RADIUS,
      fontFamily: 'monospace',
    },
    code_block: {
      borderWidth: 0,
      backgroundColor: schemedTheme.surfaceContainerHighest,
      padding: 10,
      borderRadius: BORDER_RADIUS,
      fontFamily: 'monospace',
    },
    fence: {
      borderWidth: 0,
      backgroundColor: schemedTheme.surfaceContainerHighest,
      padding: 10,
      borderRadius: BORDER_RADIUS,
    },

    tbody: {
      margin: 0,
      borderBottomWidth: 0,
    },
    thead: {
      margin: 0,
    },

    // Tables
    table: {
      borderWidth: 0,
      borderBottomWidth: 0,
      borderColor: schemedTheme.surfaceContainer,
      backgroundColor: schemedTheme.surfaceContainerHigh,
      borderRadius: BORDER_RADIUS,
      alignItems: 'stretch',
    },
    th: {
      flex: 1,
      padding: 5,
      borderWidth: 1,
      borderColor: schemedTheme.surfaceContainer,
      backgroundColor: schemedTheme.surfaceContainerHighest,
    },
    tr: {
      borderWidth: 0,
      borderBottomWidth: 0,
      flexDirection: 'row',
    },
    td: {
      borderWidth: 1,
      borderColor: schemedTheme.surfaceContainer,
      flex: 1,
      padding: 5,
      justifyContent: 'center',
    },

    // Links
    link: {
      textDecorationLine: 'underline',
      color: schemedTheme.primary,
    },
    blocklink: {
      flex: 1,
    },

    // Images
    image: {
      flex: 1,
    },

    // Text Output
    text: {},
    textgroup: {},
    paragraph: {
      marginTop: 10,
      marginBottom: 10,
      flexWrap: 'wrap',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      width: '100%',
    },
    hardbreak: {
      width: '100%',
      height: 1,
    },
    softbreak: {},

    // Believe these are never used but retained for completeness
    pre: {},
    inline: {},
    span: {},
  });
