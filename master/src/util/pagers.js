/**
 * auth: weilan
 * time: 2020.04.01
 * des: 尝试使用rxjs解决应用间通信问题
 */

import { Subject, Observable } from "rxjs"
const pagers = new Subject();

// 消息推送
function pagersPush(data) {
  pagers.next(data);
}

function pagersWatcher() {
  pagers.subscribe({
    next: (v) => console.log('pagers:', v)
  });
}


export {
  pagersPush,
  pagersWatcher
}

export default pagers;

