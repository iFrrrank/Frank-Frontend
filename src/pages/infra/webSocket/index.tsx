import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Input, List, Space, Tag, message } from 'antd'
import { getAccessToken } from '@/utils/auth'
import dayjs from 'dayjs'

interface ChatMessage {
  time: string
  text: string
  mine?: boolean
}

// WebSocket 示例：连接后端 /infra/ws，发送 demo-message-send 并展示收到的消息
const WebSocketDemo: React.FC = () => {
  const socketRef = useRef<WebSocket>()
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [sendText, setSendText] = useState('')
  const [toUserId, setToUserId] = useState('')

  const append = (msg: ChatMessage) => setMessages((prev) => [...prev, msg])

  const connect = () => {
    const socket = new WebSocket(
      `ws://localhost:9001/admin-api/infra/ws?token=${getAccessToken()}`
    )
    socketRef.current = socket
    socket.onopen = () => {
      setConnected(true)
      append({ time: dayjs().format('HH:mm:ss'), text: '连接成功' })
    }
    socket.onmessage = (event) => {
      try {
        const jsonMessage = JSON.parse(event.data)
        const type = jsonMessage.type
        let text = event.data
        if (type === 'demo-message-receive') {
          const content = JSON.parse(jsonMessage.content)
          text = `收到消息：${content.text}（来自用户 ${content.fromUserId}）`
        } else if (type === 'notice-push') {
          const content = JSON.parse(jsonMessage.content)
          text = `收到通知：${content.title || ''} ${content.content || ''}`
        }
        append({ time: dayjs().format('HH:mm:ss'), text })
      } catch {
        append({ time: dayjs().format('HH:mm:ss'), text: String(event.data) })
      }
    }
    socket.onclose = () => {
      setConnected(false)
      append({ time: dayjs().format('HH:mm:ss'), text: '连接断开' })
    }
    socket.onerror = () => message.error('WebSocket 连接异常')
  }

  const disconnect = () => {
    socketRef.current?.close()
    socketRef.current = undefined
  }

  useEffect(() => {
    return () => {
      socketRef.current?.close()
    }
  }, [])

  const handleSend = () => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      message.warning('请先建立连接')
      return
    }
    if (!sendText) {
      message.warning('请输入发送内容')
      return
    }
    // 消息体：外层 type + content（内容再 JSON 化，含 text 与 toUserId）
    const messageContent = JSON.stringify({ text: sendText, toUserId: toUserId || undefined })
    socketRef.current.send(JSON.stringify({ type: 'demo-message-send', content: messageContent }))
    append({
      time: dayjs().format('HH:mm:ss'),
      text: `发送消息：${sendText}${toUserId ? `（给用户 ${toUserId}）` : ''}`,
      mine: true
    })
    setSendText('')
  }

  return (
    <Card
      title={
        <Space>
          WebSocket 示例
          <Tag color={connected ? 'green' : 'red'}>{connected ? '已连接' : '未连接'}</Tag>
        </Space>
      }
      extra={
        <Button type="primary" danger={connected} onClick={connected ? disconnect : connect}>
          {connected ? '断开连接' : '建立连接'}
        </Button>
      }
    >
      <Space style={{ marginBottom: 12 }} wrap>
        <Input
          style={{ width: 200 }}
          placeholder="接收人用户编号（可空）"
          value={toUserId}
          onChange={(e) => setToUserId(e.target.value)}
        />
        <Input
          style={{ width: 360 }}
          placeholder="请输入发送内容"
          value={sendText}
          onChange={(e) => setSendText(e.target.value)}
          onPressEnter={handleSend}
        />
        <Button type="primary" disabled={!connected} onClick={handleSend}>
          发送消息
        </Button>
      </Space>
      <List
        bordered
        size="small"
        style={{ height: 420, overflow: 'auto' }}
        dataSource={messages}
        locale={{ emptyText: '暂无消息' }}
        renderItem={(item) => (
          <List.Item>
            <span style={{ color: '#8c8c8c', marginRight: 8 }}>{item.time}</span>
            <span style={item.mine ? { color: '#1677ff' } : undefined}>{item.text}</span>
          </List.Item>
        )}
      />
    </Card>
  )
}

export default WebSocketDemo
