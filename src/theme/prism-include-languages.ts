import siteConfig from '@generated/docusaurus.config';
import type * as PrismNamespace from 'prismjs';
import type {Optional} from 'utility-types';

export default function prismIncludeLanguages(PrismObject: typeof PrismNamespace): void {
  const {themeConfig: {prism}} = siteConfig;
  const {additionalLanguages} = prism as {additionalLanguages: string[]};
  const previousPrism = globalThis.Prism;

  globalThis.Prism = PrismObject;
  additionalLanguages.forEach(language => {
    if (language === 'php') {
      require('prismjs/components/prism-markup-templating.js');
    }
    require(`prismjs/components/prism-${language}`);
  });

  PrismObject.languages.white = {
    comment: [
      {pattern: /\/\*[\s\S]*?(?:\*\/|$)/, greedy: true},
      {pattern: /\/\/.*$/, greedy: true},
    ],
    string: {pattern: /"(?:\\[\s\S]|[^"\\\r\n])*"/, greedy: true},
    char: {pattern: /'(?:\\[\s\S]|[^'\\\r\n])'/, greedy: true},
    annotation: {pattern: /@[A-Za-z_]\w*/, alias: 'atrule'},
    keyword: /\b(?:as|break|catch|class|const|continue|deref|else|enum|error|extern|for|from|func|if|import|in|interface|is|let|method|ptr|ref|return|self|struct|super|this|throw|type|while|with)\b/,
    boolean: /\b(?:false|true)\b/,
    null: {pattern: /\b(?:null|nullptr)\b/, alias: 'keyword'},
    builtin: /\b(?:AnyPtr|Array|Auto|Bool|Byte|Char|Dict|Float|Function|Int|Int8|Int16|Int32|Int64|Int128|IntSize|Long|Method|String|Struct|UInt8|UInt16|UInt32|UInt64|UInt128|UIntSize|Variant|Vector|Void)\b/,
    'class-name': [
      {pattern: /(\b(?:class|enum|error|interface|struct|with)\s+)[A-Za-z_]\w*/, lookbehind: true},
      /\b[A-Z][A-Za-z0-9_]*\b/,
    ],
    function: /\b[A-Za-z_]\w*(?=\s*\()/,
    number: /\b(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)(?:ULL|LL|UL|U|L)?\b/,
    operator: /\.\.\.|->|\*\*=|<<=|>>=|\+\+|--|==|!=|>=|<=|&&|\|\||\+=|-=|\*=|\/=|%=|&=|\|=|\^=|\*\*|<<|>>|[+\-*\/%=&|^!<>~?]/,
    punctuation: /[{}[\]();,.:]/,
  };
  PrismObject.languages.wl = PrismObject.languages.white;

  delete (globalThis as Optional<typeof globalThis, 'Prism'>).Prism;
  if (typeof previousPrism !== 'undefined') {
    globalThis.Prism = previousPrism;
  }
}
