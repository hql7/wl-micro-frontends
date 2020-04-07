/**
 * auth: weilan
 * time: 2020.04.01
 * des: 尝试使用rxjs解决应用间通信问题
 */
// import store from "@/store/pagers";
import { Subject } from "rxjs";
// import { startWith } from "rxjs/operators";
const pager = new Subject();

/* const observable = Observable.create(observer => {
  observer.next(store.state);
})

observable.subscribe({
  next: x => console.log(x)
}) */

/* class Pager {
  constructor() {
    this.msg = '今天天气很好';
    this.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  }

  push(key, value) {
    subject.next(value);
    this.watcher(key)
  }

  watcher(key) {
    subject.subscribe({
      next: v => this[key] = v
    });
  }
}

const pager = new Pager(); */



export default pager;

