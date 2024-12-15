/* eslint-disable react-native/no-raw-text */ // TODO: Remove this
import React, {memo} from 'react';
import {useCurrPageEffect} from '@/common/hooks/useCurrPageEffect';
import {Page} from '@/navigation/types';
import {useNavigate} from '@/common/hooks/useNavigate';
import MarkdownScrollView from '@/common/components/MarkdownScrollView';

/******************************************************************************
 *                                 CONSTANTS                                  *
 ******************************************************************************/

const CURR_PAGE: Page = 'home';

const markdownTestText = `
# h1 Heading 8-)
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading

Some text above
___

Some text in the middle

---

Some text below

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

~~Strikethrough~~

> Blockquotes can also be nested...
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.


  Unordered

+ Create a list by starting a line with \`+\`, \`-\`, or \`*\`
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet. This is a very long list item that will surely wrap onto the next line.
    - Nulla volutpat aliquam velit
+ Very easy!

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit. This is a very long list item that will surely wrap onto the next line.
3. Integer molestie lorem at massa

Start numbering with offset:

57. foo
58. bar

Inline \`code\`

Indented code

    // Some comments
    line 1 of code
    line 2 of code
    line 3 of code


Block code "fences"

\`\`\`
Sample text here ... Sample text here ... d Sample text here... Sample text here... ssw s
\`\`\`

Syntax highlighting

\`\`\` js
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));
\`\`\`

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

Right aligned columns

| Option | Description |
| ------:| -----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

| Option | Description |
|:------:|:-----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |
| hello  | [link text](https://www.google.com) |

[link text](https://www.google.com)
[link text](button://www.google.com)
[link text](//www.google.com)

[link with title](https://www.google.com "title text!")

Autoconverted link https://www.google.com (enable linkify to see)

![Minion](https://octodex.github.com/images/minion.png)
![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")

Like links, Images also have a footnote style syntax

![Alt text][id]

With a reference later in the document defining the URL location:

[id]: https://octodex.github.com/images/dojocat.jpg  "The Dojocat"

Enable typographer option to see result.

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

test.. test... test..... test?..... test!....

!!!!!! ???? ,,  -- ---

"Smartypants, double quotes" and 'single quotes'
  `;

/******************************************************************************
 *                                 COMPONENT                                  *
 ******************************************************************************/

const HomeScreen = () => {
  const navigate = useNavigate();

  useCurrPageEffect(CURR_PAGE);
  return (
    <>
      <MarkdownScrollView>{markdownTestText}</MarkdownScrollView>
    </>
  );
};

/******************************************************************************
 *                                   EXPORT                                   *
 ******************************************************************************/

export default memo(HomeScreen);
