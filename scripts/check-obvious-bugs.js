const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8')

const failures = []
const assert = (condition, message) => {
  if (!condition) failures.push(message)
}

const i18n = read('src/lib/i18n.tsx')
for (const [key, text] of [
  ['signin', 'Sign in'],
  ['continue_with_google', 'Continue with Google'],
  ['continue_with_github', 'Continue with GitHub'],
  ['create_account', 'Create account'],
]) {
  const pattern = new RegExp(`${key}:\\s*["']${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`)
  assert(pattern.test(i18n), `Missing English i18n mapping ${key}: ${text}`)
}

const signInDialog = read('src/components/sign-in-dialog.tsx')
assert(!signInDialog.includes('t("signin")'), 'SignInDialog should use sign_in key or fallback, not missing signin key')
assert(!signInDialog.includes('t("continue_with_google")'), 'SignInDialog should not render raw continue_with_google key')
assert(!signInDialog.includes('t("continue_with_github")'), 'SignInDialog should not render raw continue_with_github key')

const pdfEditor = read('src/components/tools/image-to-pdf/editor.tsx')
const forbiddenChinese = ['纵向', '横向', '张/页', '适应', '填充', '居中', '无', '最多只能上传', '不支持的格式', '文件过大', '请先上传', '生成 PDF 失败', '多图合并']
for (const text of forbiddenChinese) {
  assert(!pdfEditor.includes(text), `Image to PDF editor contains Chinese copy: ${text}`)
}
for (const text of ['Portrait', 'Landscape', '1 image / page', 'Fit (show full image)', 'Fill (crop to cover)', 'Center (keep margins)', 'None']) {
  assert(pdfEditor.includes(text), `Image to PDF editor missing English label: ${text}`)
}

const homePage = read('src/app/page.tsx')
assert(!homePage.includes('<Showcase />'), 'Homepage should not render empty placeholder Showcase gallery')

if (failures.length) {
  console.error('Obvious bug check failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('Obvious bug check passed')
