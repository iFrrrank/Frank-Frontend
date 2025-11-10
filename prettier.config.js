module.exports = {
  printWidth: 100, // 每行代码长度（默认80）
  tabWidth: 2, // 每个tab相当于多少个空格（默认2）进行缩进
  useTabs: false, // 是否使用tab
  semi: false, // 声明结尾使用分号（默认true）
  singleQuote: true, // 使用单引号（默认false）
  quoteProps: 'as-needed', // 对象属性的引号处理，可选 as-needed | consistent | preserve
  bracketSpacing: true, // 对象字面量的大括号间使用空格（默认true）
  trailingComma: 'none', // 末尾是否加上逗号，可选 none | es5 | all
  jsxSingleQuote: false, // jsx中是否使用单引号替代双引号
  arrowParens: 'always', // 当箭头函数只有一个参数是否加括号，可选 always | avoid
  insertPragma: false, // 不需要自动在文件开头插入 @prettier
  requirePragma: false, // 指定要使用的解析器，不需要写文件开头的 @prettier
  proseWrap: 'never', // 使用默认的折行标准，可选 always | never | preserve
  htmlWhitespaceSensitivity: 'strict', // 指定HTML文件的全局空格敏感度，可选 css | strict | ignore
  vueIndentScriptAndStyle: false, // 是否缩进 Vue 文件中的<script>和<style>标记内的代码
  rangeStart: 0, // 这两个选项可用于格式化以给定字符偏移量（分别包括和不包括）开始和结束的代码
  rangeEnd: 'Infinity',
  useEditorConfig: false, // 是否使用 editorconfig 中的配置
  endOfLine: 'crlf' // 文件结束符，可选 lf | crlf | cr | auto
}
