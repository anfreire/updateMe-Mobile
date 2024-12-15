import React, {memo, useMemo} from 'react';
import {
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Linking,
  ViewStyle,
  Pressable,
} from 'react-native';
import FitImage from 'react-native-fit-image';
import {Icon, Text} from 'react-native-paper';
import {ASTNode, RenderFunction} from 'react-native-markdown-display';
import Clipboard from '@react-native-clipboard/clipboard';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const TEXT_STYLE_PROPS = [
  'textShadowOffset',
  'color',
  'fontSize',
  'fontStyle',
  'fontWeight',
  'lineHeight',
  'textAlign',
  'textDecorationLine',
  'textShadowColor',
  'fontFamily',
  'textShadowRadius',
  'includeFontPadding',
  'textAlignVertical',
  'fontVariant',
  'letterSpacing',
  'textDecorationColor',
  'textDecorationStyle',
  'textTransform',
  'writingDirection',
];

/******************************************************************************
 *                                 FUNCTIONS                                  *
 ******************************************************************************/

function openUrl(
  url: string,
  customCallback?: (url?: string) => boolean | void,
) {
  if (customCallback) {
    const result = customCallback(url);
    if (url && result && typeof result === 'boolean') {
      Linking.openURL(url);
    }
  } else if (url) {
    Linking.openURL(url);
  }
}

function hasParents(parents: {type: string}[], type: string) {
  return parents.findIndex(el => el.type === type) > -1;
}

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const copiableCodeBlockStyles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    width: '100%',
    padding: 0,
  },
  iconWrapper: {
    position: 'absolute',
    width: 26,
    height: 26,
    top: 6,
    right: 6,
    paddingLeft: 10,
    paddingBottom: 8,
  },
});

const IconWrapper = Animated.createAnimatedComponent(Pressable);

const CopiableCodeBlock = memo(
  ({styles, content}: {styles: ViewStyle[]; content: string}) => {
    const opacity = useSharedValue(0.25);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
      };
    });
    return (
      <View style={copiableCodeBlockStyles.wrapper}>
        <Text style={styles}>{content}</Text>
        <IconWrapper
          style={[copiableCodeBlockStyles.iconWrapper, animatedStyle]}
          onPress={() => {
            Clipboard.setString(content);
          }}
          onTouchStart={() => {
            opacity.value = withTiming(1, {duration: 100});
          }}
          onTouchEnd={() => {
            opacity.value = withTiming(0.25, {duration: 250});
          }}>
          <Icon size={18} source="content-copy" />
        </IconWrapper>
      </View>
    );
  },
);

const Link = memo(
  ({
    node,
    children,
    styles,
    onLinkPress,
  }: {
    node: ASTNode;
    children: React.ReactNode;
    styles: {link: ViewStyle};
    onLinkPress?: (url?: string) => boolean | void;
  }) => {
    const title = useMemo(() => {
      const childContents = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return child.props.children;
        }
        return null;
      });

      if (!childContents) {
        return null;
      }
      return childContents.join('');
    }, [children]);

    const prefix = useMemo(() => {
      return node.attributes?.href.includes(':')
        ? node.attributes.href.split(':')[0]
        : null;
    }, [node.attributes?.href]);

    switch (prefix) {
      case 'http':
      case 'https':
        return (
          <Text
            key={node.key}
            style={styles.link}
            onPress={() => openUrl(node.attributes.href, onLinkPress)}
            onLongPress={() => Clipboard.setString(node.attributes.href)}>
            {children}
          </Text>
        );
      case 'button':
      // TODO: Implement button link
      case 'setting':
      // TODO: Implement setting link
      default:
        return <Text key={node.key}>{title}</Text>;
    }
  },
);

/******************************************************************************
 *                                   RULES                                    *
 ******************************************************************************/

export const renderRules: Record<string, RenderFunction> = {
  // when unknown elements are introduced, so it wont break
  unknown: (_node, _children, _parent, _styles) => null,

  // The main container
  body: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_body}>
      {children}
    </View>
  ),

  // Headings
  heading1: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_heading1}>
      {children}
    </View>
  ),
  heading2: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_heading2}>
      {children}
    </View>
  ),
  heading3: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_heading3}>
      {children}
    </View>
  ),
  heading4: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_heading4}>
      {children}
    </View>
  ),
  heading5: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_heading5}>
      {children}
    </View>
  ),
  heading6: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_heading6}>
      {children}
    </View>
  ),

  // Horizontal Rule
  hr: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_hr} />
  ),

  // Emphasis
  strong: (node, children, parent, styles) => (
    <Text key={node.key} style={styles.strong}>
      {children}
    </Text>
  ),
  em: (node, children, parent, styles) => (
    <Text key={node.key} style={styles.em}>
      {children}
    </Text>
  ),
  s: (node, children, parent, styles) => (
    <Text key={node.key} style={styles.s}>
      {children}
    </Text>
  ),

  // Blockquotes
  blockquote: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_blockquote}>
      {children}
    </View>
  ),

  // Lists
  bullet_list: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_bullet_list}>
      {children}
    </View>
  ),
  ordered_list: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_ordered_list}>
      {children}
    </View>
  ),
  // this is a unique and quite annoying render rule because it has
  // child items that can be styled (the list icon and the list content)
  // outside of the AST tree so there are some work arounds in the
  // AST renderer specifically to get the styling right here
  list_item: (node, children, parent, styles, inheritedStyles = {}) => {
    // we need to grab any text specific stuff here that is applied on the list_item style
    // and apply it onto bullet_list_icon. the AST renderer has some workaround code to make
    // the content classes apply correctly to the child AST tree items as well
    // as code that forces the creation of the inheritedStyles object for list_items
    const refStyle = {
      ...inheritedStyles,
      ...StyleSheet.flatten(styles.list_item),
    };

    const arr: string[] = Object.keys(refStyle);

    const modifiedInheritedStylesObj: Record<string, unknown> = {};

    for (let b = 0; b < arr.length; b++) {
      if (TEXT_STYLE_PROPS.includes(arr[b])) {
        modifiedInheritedStylesObj[arr[b]] = refStyle[arr[b]];
      }
    }

    if (hasParents(parent, 'bullet_list')) {
      return (
        <View key={node.key} style={styles._VIEW_SAFE_list_item}>
          <Text
            style={[modifiedInheritedStylesObj, styles.bullet_list_icon]}
            accessible={false}>
            {'\u2022'}
          </Text>
          <View style={styles._VIEW_SAFE_bullet_list_content}>{children}</View>
        </View>
      );
    }

    if (hasParents(parent, 'ordered_list')) {
      const orderedListIndex = parent.findIndex(
        el => el.type === 'ordered_list',
      );

      const orderedList = parent[orderedListIndex];
      let listItemNumber;

      if (orderedList.attributes && orderedList.attributes.start) {
        listItemNumber = orderedList.attributes.start + node.index;
      } else {
        listItemNumber = node.index + 1;
      }

      return (
        <View key={node.key} style={styles._VIEW_SAFE_list_item}>
          <Text style={[modifiedInheritedStylesObj, styles.ordered_list_icon]}>
            {listItemNumber}
            {node.markup}
          </Text>
          <View style={styles._VIEW_SAFE_ordered_list_content}>{children}</View>
        </View>
      );
    }

    // we should not need this, but just in case
    return (
      <View key={node.key} style={styles._VIEW_SAFE_list_item}>
        {children}
      </View>
    );
  },

  // Code
  code_inline: (node, children, parent, styles, inheritedStyles = {}) => (
    <Text key={node.key} style={[inheritedStyles, styles.code_inline]}>
      {node.content}
    </Text>
  ),
  code_block: (node, children, parent, styles, inheritedStyles = {}) => {
    // we trim new lines off the end of code blocks because the parser sends an extra one.
    let {content} = node;

    if (
      typeof node.content === 'string' &&
      node.content.charAt(node.content.length - 1) === '\n'
    ) {
      content = node.content.substring(0, node.content.length - 1);
    }

    return (
      <Text key={node.key} style={[inheritedStyles, styles.code_block]}>
        {content}
      </Text>
    );
  },
  fence: (node, children, parent, styles, inheritedStyles = {}) => {
    // we trim new lines off the end of code blocks because the parser sends an extra one.
    let {content} = node;

    if (
      typeof node.content === 'string' &&
      node.content.charAt(node.content.length - 1) === '\n'
    ) {
      content = node.content.substring(0, node.content.length - 1);
    }

    return (
      <CopiableCodeBlock
        content={content}
        key={node.key}
        styles={[inheritedStyles, styles.fence]}
      />
    );
  },

  // Tables
  table: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_table}>
      {children}
    </View>
  ),
  thead: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_thead}>
      {children}
    </View>
  ),
  tbody: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_tbody}>
      {children}
    </View>
  ),
  th: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_th}>
      {children}
    </View>
  ),
  tr: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_tr}>
      {children}
    </View>
  ),
  td: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_td}>
      {children}
    </View>
  ),

  // Links
  link: (node, children, parent, styles, onLinkPress) => (
    <Link key={node.key} node={node} styles={styles} onLinkPress={onLinkPress}>
      {children}
    </Link>
  ),
  blocklink: (node, children, parent, styles, onLinkPress) => (
    <TouchableWithoutFeedback
      key={node.key}
      onPress={() => openUrl(node.attributes.href, onLinkPress)}
      onLongPress={() => Clipboard.setString(node.attributes.href)}
      style={styles.blocklink}>
      <View style={styles.image}>{children}</View>
    </TouchableWithoutFeedback>
  ),

  // Images
  image: (
    node,
    children,
    parent,
    styles,
    allowedImageHandlers,
    defaultImageHandler,
  ) => {
    const {src, alt} = node.attributes;

    // we check that the source starts with at least one of the elements in allowedImageHandlers
    const show =
      (allowedImageHandlers as string[]).filter(value => {
        return src.toLowerCase().startsWith(value.toLowerCase());
      }).length > 0;

    if (show === false && defaultImageHandler === null) {
      return null;
    }

    const imageProps = {
      indicator: false,
      style: styles._VIEW_SAFE_image,
      source: {
        uri: show === true ? src : `${defaultImageHandler}${src}`,
      },
    } as Record<string, unknown>;

    if (alt) {
      imageProps.accessible = true;
      imageProps.accessibilityLabel = alt;
    }

    return <FitImage key={node.key} {...imageProps} />;
  },

  // Text Output
  text: (node, children, parent, styles, inheritedStyles = {}) => (
    <Text key={node.key} style={[inheritedStyles, styles.text]}>
      {node.content}
    </Text>
  ),
  textgroup: (node, children, parent, styles) => (
    <Text key={node.key} style={styles.textgroup}>
      {children}
    </Text>
  ),
  paragraph: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_paragraph}>
      {children}
    </View>
  ),
  hardbreak: (node, children, parent, styles) => (
    <Text key={node.key} style={styles.hardbreak}>
      {'\n'}
    </Text>
  ),
  softbreak: (node, children, parent, styles) => (
    <Text key={node.key} style={styles.softbreak}>
      {'\n'}
    </Text>
  ),

  // Believe these are never used but retained for completeness
  pre: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_pre}>
      {children}
    </View>
  ),
  inline: (node, children, parent, styles) => (
    <Text key={node.key} style={styles.inline}>
      {children}
    </Text>
  ),
  span: (node, children, parent, styles) => (
    <Text key={node.key} style={styles.span}>
      {children}
    </Text>
  ),
};
