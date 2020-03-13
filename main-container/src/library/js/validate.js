/**
 * auth: weilan
 * time: 2020-03-11
 * des: el自定义表单验证及正则验证
 * rule：el校验以va开头 vaPhone；正则验证以reg开头 
 */

// el手机格式校验
function vaPhone(rule, value, callback) {
  if (!value || regPhone(value)) { callback(); } else { callback(new Error('请输入正确的手机号!')); }
}

// 正则手机格式校验
function regPhone(value) {
  return /^1[3-9][0-9]{9}/.test(value)
}

export {
  vaPhone, // el手机格式校验
  regPhone // 正则手机格式校验
}