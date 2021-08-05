/**
 * Created by sen.lv on 2021/6/24 at 15:23.
 */
const socket = require('')


const list = [{isEnable: 1, verifyType: 1}];

function verifyPush (verifyType) {
  if (verifyType === 1) return this.$router.push('.....')
  if (verifyType === 2) return this.$router.push('....')
  // 省略
}

const verifyList = list.filter(item => item.isEnable === 1);

if (verifyList.length > 0) {
  const verify = verifyList.shift()
  localStorage.setItem('verifyList', JSON.stringify(verifyList))
  verifyPush(verify.verifyType)
}
