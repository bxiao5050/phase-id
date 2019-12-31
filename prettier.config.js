// prettier.config.js or .prettierrc.js
// https://prettier.io/docs/en/options.html
module.exports = {
  // trailingComma: "es5",
  // 行宽
  printWidth: 100,
  // tab对应空格
  tabWidth: 2,
  // 使用tab
  useTabs: false,
  // 分号,true为每个语句都有分号
  semi: true,
  // 使用单引号
  singleQuote: true,
  /*
  "as-needed" -仅在需要时在对象属性周围添加引号。
  "consistent" -如果对象中至少有一个属性需要用引号引起来，请用所有属性引起来。
  "preserve" -尊重对象属性中引号的输入使用。
 */
  quoteProps: "as-needed",
  // 在JSX中使用单引号而不是双引号。
  jsxSingleQuote: true,
  // 多行时尽可能打印尾随逗号。
  trailingComma: "none",
  /*
    在对象文字中的括号之间打印空格。
    true-示例：{ foo: bar }。
    false-示例：{foo: bar}。
  */
  bracketSpacing: false,
  // 将 > 多行JSX元素的放在最后一行的末尾，而不是一个人放在下一行（不适用于自闭元素）。
  jsxBracketSameLine: false,
  /*
  "avoid"-如果可能的话，省略括号。例：x => x
  "always"-始终包含括号。例：(x) => x
  */
  arrowParens: "avoid",
  // 指定HTML文件的全局空格敏感度 css|strict|ignore
  htmlWhitespaceSensitivity: "css",
  // always|never|preserve
  proseWrap: "preserve",
  /* 是否缩进Vue文件中的代码<script>和<style>标记。有些人（例如Vue的创建者）不缩进以保存缩进级别，但这可能会破坏编辑器中的代码折叠 */
  vueIndentScriptAndStyle: false,
  // auto|lf|crlf|cr
  endOfLine: "auto"
};
