import { login } from '@/api/system/auth'
import { Footer } from '@/components'
import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined
} from '@ant-design/icons'
import { LoginForm, ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-components'
import { Helmet, useModel } from '@umijs/max'
import { Alert, App, Tabs } from 'antd'
import { createStyles } from 'antd-style'
import React, { useState } from 'react'
import { flushSync } from 'react-dom'
import Settings from '../../../../config/defaultSettings'
import { textConst } from '@/locales/zh-CN'

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive
      }
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover
      }
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%'
    }
  }
})
const ActionIcons = () => {
  const { styles } = useStyles()
  return (
    <>
      <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.action} />
      <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.action} />
      <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.action} />
    </>
  )
}
const Lang = () => {
  const { styles } = useStyles()
  return <div className={styles.lang}>{/* Add language selector or icon here if needed */}</div>
}
const LoginMessage: React.FC<{
  content: string
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24
      }}
      message={content}
      type="error"
      showIcon
    />
  )
}

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({})
  const [type, setType] = useState<string>('account')
  const { initialState, setInitialState } = useModel('@@initialState')
  const { styles } = useStyles()
  const { message } = App.useApp()
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.()
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo
        }))
      })
    }
  }
  const handleSubmit = async (values: API.SystemAuthLoginReqVO) => {
    try {
      const resp = await login({ ...values })
      if (resp.code === 0) {
        // 登录成功，将 accessToken 和 refreshToken 存储到 localStorage
        const { accessToken, refreshToken } = resp.data || {}
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken)
        }
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken)
        }
        message.success(textConst.login.loginSuccess)
        await fetchUserInfo()
        const urlParams = new URL(window.location.href).searchParams
        window.location.href = urlParams.get('redirect') || '/'
        return
      } else {
        setUserLoginState({ type })
      }
    } catch (error) {
      message.error(textConst.login.loginError)
    }
  }
  const { status, type: loginType } = userLoginState
  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {textConst.login.login}
          {Settings.title && ` - ${Settings.title}`}
        </title>
      </Helmet>
      <Lang />
      <div
        style={{
          flex: '1',
          padding: '32px 0'
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw'
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="Frank Design Pro"
          subTitle={'Frank Design 是西湖区最具影响力的 Web 设计规范'}
          initialValues={{
            autoLogin: true
          }}
          actions={[textConst.login.otherLogin, <ActionIcons key="icons" />]}
          onFinish={async (values) => {
            await handleSubmit(values as API.SystemAuthLoginReqVO)
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: textConst.login.accountLogin
              },
              {
                key: 'mobile',
                label: textConst.login.mobileLogin
              }
            ]}
          />

          {status === 'error' && loginType === 'account' && (
            <LoginMessage content={textConst.login.usernameOrPasswordError} />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />
                }}
                placeholder={textConst.login.username}
                rules={[
                  {
                    required: true,
                    message: textConst.rules.usernameRequired
                  }
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />
                }}
                placeholder={textConst.login.password}
                rules={[
                  {
                    required: true,
                    message: textConst.rules.passwordRequired
                  }
                ]}
              />
            </>
          )}

          {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />}
          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined />
                }}
                name="mobile"
                placeholder={'请输入手机号！'}
                rules={[
                  {
                    required: true,
                    message: '手机号是必填项！'
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: '不合法的手机号！'
                  }
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />
                }}
                captchaProps={{
                  size: 'large'
                }}
                placeholder={'请输入验证码！'}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${textConst.login.getAfterSec}`
                  }
                  return textConst.login.getSmsCode
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: '验证码是必填项！'
                  }
                ]}
                onGetCaptcha={async (phone) => {
                  const result = '1234'
                  if (!result) {
                    return
                  }
                  message.success('获取验证码成功')
                }}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <a
              style={{
                float: 'right'
              }}
            >
              忘记密码 ?
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  )
}

export default Login
