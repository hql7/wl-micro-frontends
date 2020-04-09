import Axios from "axios";
import { Message/* , MessageBox  */} from "element-ui";
import { localGet/* , localDel, sessionDel, sessionGet, sessionSet */ } from "@/library/js/storage"; // 导入存储函数
// import router, { resetRouter } from "@/router"
// import store from "@/store";
// sessionDel("t-o"); // 清除timeout

// 定义axios配置 
const http = Axios.create({
  baseURL: '', // api的base_url
  withCredentials: true, // 开启跨域身份凭证
  method: "post",
  headers: {
    "Content-Type": "application/json;charset=UTF-8"
  },
  timeout: 5000, // request timeout
  retry: 2
});

// 设置全局的请求次数，请求的间隙，用于自动再次请求
http.defaults.retry = 2;
http.defaults.retryDelay = 1000;

// 请求拦截器
http.interceptors.request.use(
  function (config) {
    let token = localGet('token');
    if (token) config.headers.Authorization = token;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  function (res) {
    if (res.data.code == 300) {
      Message({
        showClose: true,
        message: res.data.message || "操作失败",
        type: "error"
      });
    }
    return res;
  },
  function (err) {
    let config = err.config;
    let errres = err.response;
    let err_type = errres ? errres.status : 0;
    // 收集错误信息
    switch (err_type) {
      case 400:
        err.message = "请求无效";
        break;

      case 401:
        err.message = "由于长时间未操作，登录已超时，请重新登录";
        break;

      case 403:
        err.message = "拒绝访问";
        break;

      case 404:
        err.message = `请求地址出错: ${errres.config.url}`;
        break;

      case 405:
        err.message = `未授权`;
        break;

      case 408:
        err.message = "请求超时";
        break;

      case 500:
        err.message = "服务器内部错误";
        break;

      case 501:
        err.message = "服务未实现";
        break;

      case 502:
        err.message = "网关错误";
        break;

      case 503:
        err.message = "服务不可用";
        break;

      case 504:
        err.message = "网关超时";
        break;

      case 505:
        err.message = "HTTP版本不受支持";
        break;

      default:
        err.message = "网络波动，请重试";
    }
    // 非401错误直接返回错误
    if (errres && err_type != 401) {
      Message({ showClose: true, message: err.message, type: "error" });
      return Promise.reject(err);
    }

    // If config does not exist or the retry option is not set, reject
    if (!config || !config.retry) return Promise.reject(err);

    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0;
    // Check if we've maxed out the total number of retries
    if (config.__retryCount >= config.retry) {
      /* if (!sessionGet("t-o")) {
        sessionSet("t-o", 't-o'); // timeout
        MessageBox.confirm(err.message, "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          showClose: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          customClass: "auth401box"
        })
          .then(() => {
            localDel('token');
            store.dispatch('app/setToken', '');
            store.dispatch('page/setKeepPage', []);
            store.dispatch('page/setCurrentPage', '');
            router.push('/login');
            resetRouter();
          })
          .catch(() => {
            localDel('token');
            store.dispatch('app/setToken', '');
            store.dispatch('page/setKeepPage', []);
            store.dispatch('page/setCurrentPage', '');
            router.push('/login');
            resetRouter();
          });
      } */
      // Reject with the error
      return Promise.reject(err);
    }

    // Increase the retry count
    config.__retryCount += 1;

    // Create new promise to handle exponential backoff
    let backoff = new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, config.retryDelay || 1);
    });

    // Return the promise in which recalls axios to retry the request
    return backoff.then(function () {
      return http(config);
    });
  }
);

export default http;