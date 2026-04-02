import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message, notification } from 'antd';
import { ApiEncrypt } from '@/utils/encrypt'; // Added encrypt module

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      const { success, data, errorCode, errorMessage, showType } =
        res as unknown as ResponseStructure;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError'
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo;
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.warning(errorMessage);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage);
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: errorMessage,
                message: errorCode,
              });
              break;
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break;
            default:
              message.error(errorMessage);
          }
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        message.error(`Response status:${error.response.status}`);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理
      const url = config?.url;
      // 从 localStorage 中获取 accessToken，并添加到请求头中
      const accessToken = localStorage.getItem('accessToken');

      const configHeaders: Record<string, any> = { ...config.headers };

      if (accessToken) {
        configHeaders.Authorization = `Bearer ${accessToken}`;
      }

      const method = config.method?.toUpperCase();
      // 防止 GET 请求缓存
      if (method === 'GET') {
        configHeaders['Cache-Control'] = 'no-cache';
        configHeaders['Pragma'] = 'no-cache';
      }
      // 处理 x-www-form-urlencoded
      else if (method === 'POST') {
        const contentType = configHeaders['Content-Type'] || configHeaders['content-type'];
        if (contentType === 'application/x-www-form-urlencoded') {
          if (config.data && typeof config.data !== 'string') {
            config.data = new URLSearchParams(config.data as Record<string, string>).toString();
          }
        }
      }

      // 是否 API 加密
      if (configHeaders.isEncrypt) {
        try {
          if (config.data) {
            config.data = ApiEncrypt.encryptRequest(config.data);
            configHeaders[ApiEncrypt.getEncryptHeader()] = 'true';
          }
        } catch (error) {
          console.error('请求数据加密失败:', error);
          throw error;
        }
      }

      // 重新赋给 config.headers
      config.headers = configHeaders as any;
      return { ...config, url };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      let data = (response as any).data;

      // 检查是否需要解密响应数据
      const headers = (response as any).headers || {};
      const encryptHeader = ApiEncrypt.getEncryptHeader();
      const isEncryptResponse =
        headers[encryptHeader] === 'true' ||
        headers[encryptHeader.toLowerCase()] === 'true';

      if (isEncryptResponse && typeof data === 'string') {
        try {
          // 解密响应数据
          data = ApiEncrypt.decryptResponse(data);
          (response as any).data = data;
        } catch (error) {
          console.error('响应数据解密失败:', error);
          throw new Error('响应数据解密失败: ' + (error as Error).message);
        }
      }

      if (data?.success === false) {
        message.error('请求失败！');
      }
      return response;
    },
  ],
};
