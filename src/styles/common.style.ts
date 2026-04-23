import type { CardProps } from 'antd'

export const tableActionStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 8
}

export const deleteTextStyle = {
  color: '#ff4d4f'
}

export const layoutStyle = {
  backgroundColor: 'transparent',
  border: 'none'
}

export const siderStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  marginRight: 10
}

export const emptyTextStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  padding: '2px 0',
  color: '#999'
}

export const correlativeOrder = {
  cursor: 'pointer',
  color: '#1890ff',
  display: 'flex',
  alignItems: 'center',
  gap: 4
}

export const rootStyle: React.CSSProperties = {
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  borderRadius: 8
}

export const innerStyles: CardProps['styles'] = {
  header: {
    fontSize: 16,
    fontWeight: 500,
    borderBottom: '1px solid #f0f0f0'
  },
  body: {
    padding: '20px 24px'
  }
}

export const iconBaseStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  borderRadius: 8,
  fontSize: 24,
  marginRight: 16
}

export const combinateRecordNumber = {
  fontSize: 36,
  fontWeight: 'bold',
  lineHeight: 1
}

export const enablePayApp = {
  color: '#52c41a',
  fontSize: 18
}

export const disablePayApp = {
  color: '#ff4d4f',
  fontSize: 18
}
