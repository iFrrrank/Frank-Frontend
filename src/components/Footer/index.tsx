import { GithubOutlined } from '@ant-design/icons'
import { DefaultFooter } from '@ant-design/pro-components'
import React from 'react'

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none'
      }}
      copyright="Powered by Frank Desgin"
      links={[
        {
          key: 'Frank Design Pro',
          title: 'Frank Design Pro',
          href: 'https://github.com/ypclove/Frank-Frontend.git',
          blankTarget: true
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/ypclove/Frank-Frontend.git',
          blankTarget: true
        },
        {
          key: 'Frank Design',
          title: 'Frank Design',
          href: 'https://github.com/ypclove/Frank-Frontend.git',
          blankTarget: true
        }
      ]}
    />
  )
}

export default Footer
