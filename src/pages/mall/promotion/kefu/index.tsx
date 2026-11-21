import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Avatar, Badge, Button, Card, Image, Input, List, message, Modal, Upload } from 'antd'
import { DeleteOutlined, PictureOutlined, PushpinFilled, PushpinOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import {
  deleteKeFuConversation,
  getKeFuConversationList,
  updateKeFuConversationPinned
} from '@/api/mall/promotion/kefu/conversation'
import {
  getKeFuMessageList,
  sendKeFuMessage,
  updateKeFuMessageReadStatus
} from '@/api/mall/promotion/kefu/message'
import { getAccessToken } from '@/utils/auth'

// 消息类型：1 文本，2 图片，5 商品，6 订单
const CONTENT_TYPE_TEXT = 1
const CONTENT_TYPE_IMAGE = 2
// 发送人类型：2 为管理员（客服自己）
const SENDER_TYPE_ADMIN = 2

// 与 app.tsx 的请求基地址保持一致（本地后端），WebSocket 走 /admin-api/infra/ws
const WS_BASE = 'ws://localhost:9001/admin-api/infra/ws'
const UPLOAD_URL = 'http://localhost:9001/admin-api/infra/file/upload'

// 解析 JSON 类型的消息内容（图片/商品/订单）
const parseContent = (content: string) => {
  try {
    return JSON.parse(content)
  } catch {
    return {}
  }
}

// 单条消息气泡：按消息类型渲染文本/图片/商品卡片/订单卡片
const MessageBubble: React.FC<{ item: API.KeFuMessageRespVO }> = ({ item }) => {
  const isAdmin = item.senderType === SENDER_TYPE_ADMIN
  let body: React.ReactNode = item.content
  if (item.contentType === CONTENT_TYPE_IMAGE) {
    const data = parseContent(item.content)
    body = <Image src={data.picUrl || item.content} width={160} />
  } else if (item.contentType === 5) {
    const data = parseContent(item.content)
    body = (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Image src={data.picUrl} width={48} height={48} preview={false} />
        <div>
          <div>{data.spuName}</div>
          <div style={{ color: '#f5222d' }}>￥{((data.price || 0) / 100).toFixed(2)}</div>
        </div>
      </div>
    )
  } else if (item.contentType === 6) {
    const data = parseContent(item.content)
    body = (
      <div>
        <div>订单号：{data.no || data.orderNo}</div>
        <div>
          {data.spuName}，实付 ￥{((data.payPrice || 0) / 100).toFixed(2)}
        </div>
      </div>
    )
  }
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isAdmin ? 'row-reverse' : 'row',
        gap: 8,
        marginBottom: 16
      }}
    >
      <Avatar src={item.senderAvatar} />
      <div
        style={{
          maxWidth: '65%',
          background: isAdmin ? '#95ec69' : '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: 8,
          padding: '8px 12px'
        }}
      >
        {body}
        <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>{item.createTime as any}</div>
      </div>
    </div>
  )
}

// 客服工作台：左侧会话列表，右侧消息区（历史加载、WebSocket 实时推送、发送文本/图片）
const KeFu: React.FC = () => {
  const [conversations, setConversations] = useState<API.KeFuConversationRespVO[]>([])
  const [activeId, setActiveId] = useState<number>()
  const [messages, setMessages] = useState<API.KeFuMessageRespVO[]>([])
  const [inputValue, setInputValue] = useState('')
  const [hasMore, setHasMore] = useState(false)
  const messageBoxRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocket>()
  const activeIdRef = useRef<number>()
  activeIdRef.current = activeId

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (messageBoxRef.current) {
        messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight
      }
    })
  }

  // 加载会话列表（置顶在前，其余按最后消息时间倒序，后端已排序）
  const loadConversations = useCallback(async () => {
    const resp = await getKeFuConversationList()
    if (resp.code === 0) {
      setConversations(resp.data || [])
    }
  }, [])

  // 加载某个会话的消息（maxId 为空取最新一批；传入则加载更早消息并前插）
  const loadMessages = useCallback(async (conversationId: number, maxId?: number) => {
    const resp = await getKeFuMessageList({ conversationId, maxId })
    if (resp.code !== 0) {
      return
    }
    const list = (resp.data || []).slice().sort((a, b) => a.id - b.id)
    setHasMore((resp.data || []).length >= 20)
    if (maxId) {
      setMessages((prev) => [...list, ...prev])
    } else {
      setMessages(list)
      scrollToBottom()
    }
  }, [])

  // 打开会话：加载消息并标记已读
  const openConversation = async (conversation: API.KeFuConversationRespVO) => {
    setActiveId(conversation.id)
    await loadMessages(conversation.id)
    await updateKeFuMessageReadStatus({ conversationId: conversation.id })
    setConversations((prev) =>
      prev.map((c) => (c.id === conversation.id ? { ...c, adminUnreadMessageCount: 0 } : c))
    )
  }

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  // WebSocket：接收新消息推送，当前会话直接追加，其他会话刷新列表（未读数）
  useEffect(() => {
    let closed = false
    let retryTimer: any
    const connect = () => {
      const ws = new WebSocket(`${WS_BASE}?token=${getAccessToken()}`)
      wsRef.current = ws
      ws.onmessage = (event) => {
        try {
          const frame = JSON.parse(event.data)
          if (frame.type !== 'kefu-message') {
            return
          }
          const msg: API.KeFuMessageRespVO = JSON.parse(frame.content)
          if (msg.conversationId === activeIdRef.current) {
            setMessages((prev) => [...prev, msg])
            scrollToBottom()
            updateKeFuMessageReadStatus({ conversationId: msg.conversationId })
          }
          loadConversations()
        } catch {
          // 忽略无法解析的推送帧
        }
      }
      ws.onclose = () => {
        if (!closed) {
          retryTimer = setTimeout(connect, 5000)
        }
      }
    }
    connect()
    return () => {
      closed = true
      clearTimeout(retryTimer)
      wsRef.current?.close()
    }
  }, [loadConversations])

  // 发送文本消息
  const handleSendText = async () => {
    if (!activeId || !inputValue.trim()) {
      return
    }
    const resp = await sendKeFuMessage({
      conversationId: activeId,
      contentType: CONTENT_TYPE_TEXT,
      content: inputValue.trim()
    })
    if (resp.code === 0) {
      setInputValue('')
      await loadMessages(activeId)
      loadConversations()
    } else {
      message.error(resp.msg || '发送失败')
    }
  }

  // 发送图片消息：先上传文件，再以图片类型发送（内容为 { picUrl } 的 JSON）
  const handleSendImage = async (file: File) => {
    if (!activeId) {
      return false
    }
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getAccessToken()}` },
        body: formData
      })
      const json = await res.json()
      if (json.code !== 0 || !json.data) {
        message.error('图片上传失败')
        return false
      }
      const resp = await sendKeFuMessage({
        conversationId: activeId,
        contentType: CONTENT_TYPE_IMAGE,
        content: JSON.stringify({ picUrl: json.data })
      })
      if (resp.code === 0) {
        await loadMessages(activeId)
        loadConversations()
      }
    } catch {
      message.error('图片上传失败')
    }
    return false
  }

  // 置顶/取消置顶
  const handlePinned = async (conversation: API.KeFuConversationRespVO) => {
    const resp = await updateKeFuConversationPinned({
      id: conversation.id,
      pinned: !conversation.adminPinned
    })
    if (resp.code === 0) {
      loadConversations()
    }
  }

  // 删除会话
  const handleDelete = (conversation: API.KeFuConversationRespVO) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除与「${conversation.userNickname}」的会话吗？`,
      okText: '删除',
      cancelText: '取消',
      onOk: async () => {
        const resp = await deleteKeFuConversation({ id: conversation.id })
        if (resp.code === 0) {
          if (activeId === conversation.id) {
            setActiveId(undefined)
            setMessages([])
          }
          loadConversations()
        }
      }
    })
  }

  const activeConversation = conversations.find((c) => c.id === activeId)

  return (
    <PageContainer header={{ title: false }}>
      <div style={{ display: 'flex', gap: 16, height: 'calc(100vh - 180px)' }}>
        {/* 会话列表 */}
        <Card style={{ width: 320, overflow: 'auto' }} styles={{ body: { padding: 0 } }}>
          <List
            dataSource={conversations}
            renderItem={(item) => (
              <List.Item
                onClick={() => openConversation(item)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  background: item.id === activeId ? '#e6f4ff' : item.adminPinned ? '#fafafa' : undefined
                }}
                actions={[
                  <a
                    key="pin"
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePinned(item)
                    }}
                  >
                    {item.adminPinned ? <PushpinFilled /> : <PushpinOutlined />}
                  </a>,
                  <a
                    key="del"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(item)
                    }}
                  >
                    <DeleteOutlined />
                  </a>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Badge count={item.adminUnreadMessageCount} size="small">
                      <Avatar src={item.userAvatar} />
                    </Badge>
                  }
                  title={item.userNickname}
                  description={
                    <span
                      style={{
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 170
                      }}
                    >
                      {item.lastMessageContentType === CONTENT_TYPE_IMAGE
                        ? '[图片]'
                        : item.lastMessageContent}
                    </span>
                  }
                />
              </List.Item>
            )}
          />
        </Card>

        {/* 消息区 */}
        <Card
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          styles={{ body: { display: 'flex', flexDirection: 'column', height: '100%', padding: 16 } }}
          title={activeConversation ? `与 ${activeConversation.userNickname} 的会话` : '请选择会话'}
        >
          <div ref={messageBoxRef} style={{ flex: 1, overflow: 'auto', paddingRight: 8 }}>
            {hasMore && activeId && (
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <Button
                  size="small"
                  onClick={() => messages.length > 0 && loadMessages(activeId, messages[0].id)}
                >
                  加载更早消息
                </Button>
              </div>
            )}
            {messages.map((item) => (
              <MessageBubble key={item.id} item={item} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <Upload
              showUploadList={false}
              beforeUpload={(file) => handleSendImage(file as File)}
              accept="image/*"
              disabled={!activeId}
            >
              <Button icon={<PictureOutlined />} disabled={!activeId} />
            </Upload>
            <Input.TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={activeId ? '请输入消息，Enter 发送' : '请先选择会话'}
              autoSize={{ minRows: 1, maxRows: 4 }}
              disabled={!activeId}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault()
                  handleSendText()
                }
              }}
            />
            <Button type="primary" onClick={handleSendText} disabled={!activeId}>
              发送
            </Button>
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}

export default KeFu
