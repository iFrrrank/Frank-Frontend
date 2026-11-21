import React, { useEffect, useState } from 'react'
import { Descriptions, Tag } from 'antd'
import { useSearchParams } from '@umijs/max'
import { getProduct } from '@/api/crm/product'
import DetailShell from '../../components/DetailShell'
import FollowUpPanel, { CRM_BIZ_TYPE } from '../../components/FollowUpPanel'

// 产品状态：1 上架，0 下架
// 产品详情：基本信息与跟进记录
const ProductDetail: React.FC = () => {
  const [searchParams] = useSearchParams()
  const id = Number(searchParams.get('id'))
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<any>()

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setLoading(false)
        return
      }
      const resp = await getProduct({ id } as any)
      if (resp.code === 0) {
        setProduct(resp.data)
      }
      setLoading(false)
    }
    load()
  }, [id])

  const info = (
    <Descriptions column={2} bordered size="small">
      <Descriptions.Item label="产品名称">{product?.name || '-'}</Descriptions.Item>
      <Descriptions.Item label="产品编码">{product?.no || '-'}</Descriptions.Item>
      <Descriptions.Item label="产品分类">{product?.categoryName || '-'}</Descriptions.Item>
      <Descriptions.Item label="负责人">{product?.ownerUserName || '-'}</Descriptions.Item>
      <Descriptions.Item label="单位">{product?.unitName || product?.unit || '-'}</Descriptions.Item>
      <Descriptions.Item label="状态">
        {product?.status === 1 ? (
          <Tag color="green">上架</Tag>
        ) : product?.status === 0 ? (
          <Tag>下架</Tag>
        ) : (
          '-'
        )}
      </Descriptions.Item>
      <Descriptions.Item label="价格">￥{(product?.price || 0).toFixed(2)}</Descriptions.Item>
      <Descriptions.Item label="描述" span={2}>
        {product?.description || '-'}
      </Descriptions.Item>
      <Descriptions.Item label="创建时间">{product?.createTime || '-'}</Descriptions.Item>
    </Descriptions>
  )

  return (
    <DetailShell
      title={product?.name || '产品详情'}
      loading={loading}
      tabItems={[
        { key: 'info', label: '详细信息', children: info },
        {
          key: 'followup',
          label: '跟进记录',
          children: <FollowUpPanel bizType={CRM_BIZ_TYPE.PRODUCT} bizId={id} />
        }
      ]}
    />
  )
}

export default ProductDetail
