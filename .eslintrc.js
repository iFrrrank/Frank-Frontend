module.exports = {
  root: true, // 指定此配置文件为根配置，ESLint 将不会查找父目录中的配置文件
  env: {
    browser: true, // 启用浏览器环境
    node: true, // 启用 Node.js 环境
    es2021: true // 启用 ES2021 的全新语法
  },
  parser: '@typescript-eslint/parser', // 专门用于解析 TypeScript 代码，同时也支持 JSX 语法。
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2021, // 支持 ECMAScript 2021 的语法
    sourceType: 'module' // 使用 ES 模块的语法
  },
  extends: [
    'eslint:recommended', // 继承 ESLint 的推荐规则
    'plugin:react/recommended', // 引入 eslint-plugin-react 的推荐规则
    'plugin:react-hooks/recommended', // 确保 React Hooks 的使用符合规范
    'plugin:@typescript-eslint/recommended' // 继承 TypeScript 的推荐规则集，确保 TypeScript 代码的基本规范
  ],
  plugins: ['react', 'react-hooks', '@typescript-eslint'], // extends继承规则
  rules: {
    semi: [2, 'never'], // 不使用分号
    indent: [2, 4, { SwitchCase: 1 }], // switch 语句中的 case 分支使用 1 个空格缩进
    'no-multi-spaces': 2, // 不允许多个连续的空格
    'space-unary-ops': [2, { words: true, nonwords: false }], // 一元运算符后必须有空格
    'space-infix-ops': 2, // 中缀操作符周围必须有空格
    'space-before-blocks': [2, 'always'], // 代码块前必须有空格
    'no-mixed-spaces-and-tabs': 2, // 不允许混合使用空格和制表符
    'no-multiple-empty-lines': [2, { max: 1 }], // 连续空行不超过 1 行
    'no-trailing-spaces': 2, // 行尾不允许有空格
    'no-whitespace-before-property': 2, // 属性名和点运算符之间不能有空格
    'no-irregular-whitespace': 2, // 不允许出现不规则的空白字符
    'space-in-parens': [2, 'never'], // 圆括号内不能有空格
    'comma-dangle': [2, 'never'], // 逗号不允许有拖尾
    'array-bracket-spacing': [2, 'never'], // 数组括号内不允许有空格
    'object-curly-spacing': [2, 'never'], // 对象括号内不允许有空格
    'max-len': ['error', { code: 100 }], // 行宽最大为 100 字符
    'operator-linebreak': [2, 'before'], // 运算符换行时，运算符在行首
    'comma-style': [2, 'last'], // 逗号风格：换行时在行尾
    'no-extra-semi': 2, // 不允许出现多余的分号
    curly: [2, 'all'], // 使用大括号包裹所有控制结构
    'key-spacing': [2, { beforeColon: false, afterColon: true }], // 属性名与冒号之间不能有空格，冒号后必须有空格
    'comma-spacing': [2, { before: false, after: true }], // 逗号后必须有空格
    'semi-spacing': [2, { before: false, after: true }], // 分号后必须有空格
    camelcase: [1, { properties: 'always' }], // 强制使用驼峰命名法
    'new-cap': ['error', { newIsCap: true, capIsNew: false }], // 构造函数首字母必须大写
    'spaced-comment': [2, 'always'], // 注释后必须有空格
    'no-inline-comments': 2, // 不允许行内注释
    eqeqeq: [2, 'always', { null: 'ignore' }], // 强制使用全等 (===) 运算符
    'no-else-return': [1, { allowElseIf: false }], // 禁止 else 语句，如果 if 语句中已返回值
    'no-loop-func': 2, // 禁止在循环中定义函数
    'no-restricted-syntax': [
      1,
      {
        selector: "BinaryExpression[operator='instanceof']",
        message: "Use 'instanceof' for object type detection." // 不建议使用 instanceof 来检测对象类型
      },
      {
        selector: "BinaryExpression[operator='typeof']",
        message: "Use 'typeof' for type detection." // 不建议使用 typeof 来检测类型
      },
      {
        selector: "CallExpression[callee.name='parseInt']",
        message:
          'Use Math.floor, Math.round, or Math.ceil instead of parseInt to remove decimal points.' // 不建议使用 parseInt 来移除小数点
      }
    ],
    'no-implicit-coercion': [1, { allow: ['!!'] }], // 禁止隐式类型转换
    radix: [2, 'always'], // parseInt 函数必须指定进制
    quotes: [2, 'single'], // 强制使用单引号
    'no-array-constructor': 2, // 不允许使用 Array 构造函数
    'max-lines-per-function': [
      1,
      {
        max: 50, // 函数最大行数为 50 行
        skipComments: true, // 跳过注释行
        skipBlankLines: true, // 跳过空行
        IIFEs: true // 对立即调用的函数表达式 (IIFE) 应用规则
      }
    ],
    'max-params': [1, 6], // 函数参数最大数量为 6
    'no-eval': 2, // 禁止使用 eval
    'prefer-const': 1, // 建议使用 const 声明不变的变量
    'no-var': 1, // 建议使用 let/const 替代 var
    'prefer-destructuring': [
      1,
      { object: true, array: false } // 建议使用解构赋值
    ],
    'prefer-template': 1, // 建议使用模板字符串
    'template-curly-spacing': [2, 'never'], // 模板字符串中的花括号内不允许有空格
    'no-duplicate-imports': 2, // 禁止重复导入
    '@typescript-eslint/no-unused-vars': 'error', // 禁止未使用的变量
    '@typescript-eslint/explicit-module-boundary-types': 'off', // 允许省略函数的返回类型
    'react/no-array-index-key': 'warn', // 禁止将数组索引（index）用作 React 列表渲染中元素的 key 属性
    'react/no-danger': 'error', // 限制使用 React 的 dangerouslySetInnerHTML 属性（用于直接插入 HTML）
    'react/no-deprecated': 'error', // 禁止使用 React 中已废弃（deprecated）的 API 或特性
    'react/no-direct-mutation-state': 'error', // 禁止直接修改 React 组件的 this.state（应使用 this.setState 方法）
    'react/no-find-dom-node': 'error', // 禁止使用 ReactDOM.findDOMNode() 方法（用于获取组件对应的 DOM 节点）
    'react/no-is-mounted': 'error', // 禁止使用已废弃的 isMounted() 方法（用于判断组件是否已挂载）
    'react/no-render-return-value': 'error', // 禁止使用 ReactDOM.render() 的返回值（在 React 18 前返回组件实例，18 后返回 null）
    'react/no-string-refs': 'error', // 禁止使用字符串形式的 ref（如 ref="myRef"），必须使用回调 ref 或 createRef/useRef
    'react/no-unescaped-entities': 'error', // 禁止在 JSX 中使用未转义的特殊字符（如 &、<、>、"、' 等）
    'react/no-unknown-property': 'error', // 禁止在 JSX 中使用未知的 HTML 属性或 React 特殊属性
    'react/prefer-es6-class': 'warn', // 推荐使用 ES6 类组件（class extends React.Component），而非 React.createClass 创建组件
    'react/require-render-return': 'error', // 要求类组件的 render 方法必须返回一个 JSX 元素（或 null）
    'react/sort-comp': 'warn', // 要求类组件的方法按指定顺序排列（如静态方法、生命周期方法、自定义方法等）
    'react/state-in-constructor': ['warn', 'never'], // 控制类组件的状态（state）是否应在构造函数（constructor）中初始化
    'react/static-property-placement': ['warn', 'static public field'] // 规定类组件的静态属性（如 defaultProps、propTypes）的声明位置
  }
}
