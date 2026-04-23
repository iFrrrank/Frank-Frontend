declare namespace API {
  type LoginResult = {
    status?: string
    type?: string
    currentAuthority?: string
  }

  type AdminUserRespDTO = {
    // 用户 ID
    id: number
    // 用户昵称
    nickname: string
    // 帐号状态，参见 CommonStatusEnum 枚举
    status: number
    // 部门 Id
    deptId: number
    // 岗位编号数组
    postIds: number[]
    // 手机号码
    mobile: string
    // 用户头像
    avatar: string
    transMap?: Record<string, any>
  }

  type approveOrDenyParams = {
    // 响应类型
    response_type: string
    // 客户端编号
    client_id: string
    // 授权范围
    scope?: string
    // 重定向 URI
    redirect_uri: string
    // 用户是否接受
    auto_approve: boolean
    state?: string
  }

  type authorizeParams = {
    // 客户端编号
    clientId: string
  }

  type CaptchaVO = {
    captchaId?: string
    projectCode?: string
    captchaType?: string
    captchaOriginalPath?: string
    captchaFontType?: string
    captchaFontSize?: number
    secretKey?: string
    originalImageBase64?: string
    point?: PointVO
    jigsawImageBase64?: string
    wordList?: string[]
    pointList?: { x?: number; y?: number }[]
    pointJson?: string
    token?: string
    result?: boolean
    captchaVerification?: string
    clientUid?: string
    ts?: number
    browserInfo?: string
  }

  type checkAccessTokenParams = {
    // 访问令牌
    accessToken: string
  }

  type checkTokenParams = {
    // 访问令牌
    token: string
  }

  type Client = {
    // 应用名
    name: string
    // 应用图标
    logo: string
  }

  type CommonResultAdminUserRespDTO = {
    code?: number
    data?: AdminUserRespDTO
    msg?: string
  }

  type CommonResultBoolean = {
    code?: number
    data?: boolean
    msg?: string
  }

  type CommonResultByteArray = {
    code?: number
    data?: string[]
    msg?: string
  }

  type CommonResultDeptDataPermissionRespDTO = {
    code?: number
    data?: DeptDataPermissionRespDTO
    msg?: string
  }

  type CommonResultDeptRespDTO = {
    code?: number
    data?: DeptRespDTO
    msg?: string
  }

  type CommonResultListAdminUserRespDTO = {
    code?: number
    data?: AdminUserRespDTO[]
    msg?: string
  }

  type CommonResultListDeptRespDTO = {
    code?: number
    data?: DeptRespDTO[]
    msg?: string
  }

  type CommonResultListDictDataRespDTO = {
    code?: number
    data?: DictDataRespDTO[]
    msg?: string
  }

  type CommonResultListPostRespDTO = {
    code?: number
    data?: PostRespDTO[]
    msg?: string
  }

  type CommonResultListSocialWxaSubscribeTemplateRespDTO = {
    code?: number
    data?: SocialWxaSubscribeTemplateRespDTO[]
    msg?: string
  }

  type CommonResultListSystemAreaNodeRespVO = {
    code?: number
    data?: SystemAreaNodeRespVO[]
    msg?: string
  }

  type CommonResultListSystemDeptRespVO = {
    code?: number
    data?: SystemDeptRespVO[]
    msg?: string
  }

  type CommonResultListSystemDeptSimpleRespVO = {
    code?: number
    data?: SystemDeptSimpleRespVO[]
    msg?: string
  }

  type CommonResultListSystemDictDataSimpleRespVO = {
    code?: number
    data?: SystemDictDataSimpleRespVO[]
    msg?: string
  }

  type CommonResultListSystemDictTypeSimpleRespVO = {
    code?: number
    data?: SystemDictTypeSimpleRespVO[]
    msg?: string
  }

  type CommonResultListSystemMailAccountSimpleRespVO = {
    code?: number
    data?: SystemMailAccountSimpleRespVO[]
    msg?: string
  }

  type CommonResultListSystemMailTemplateSimpleRespVO = {
    code?: number
    data?: SystemMailTemplateSimpleRespVO[]
    msg?: string
  }

  type CommonResultListSystemMenuRespVO = {
    code?: number
    data?: SystemMenuRespVO[]
    msg?: string
  }

  type CommonResultListSystemMenuSimpleRespVO = {
    code?: number
    data?: SystemMenuSimpleRespVO[]
    msg?: string
  }

  type CommonResultListSystemNotifyMessageRespVO = {
    code?: number
    data?: SystemNotifyMessageRespVO[]
    msg?: string
  }

  type CommonResultListSystemPostSimpleRespVO = {
    code?: number
    data?: SystemPostSimpleRespVO[]
    msg?: string
  }

  type CommonResultListSystemRoleRespVO = {
    code?: number
    data?: SystemRoleRespVO[]
    msg?: string
  }

  type CommonResultListSystemSmsChannelSimpleRespVO = {
    code?: number
    data?: SystemSmsChannelSimpleRespVO[]
    msg?: string
  }

  type CommonResultListSystemUserSimpleRespVO = {
    code?: number
    data?: SystemUserSimpleRespVO[]
    msg?: string
  }

  type CommonResultLong = {
    code?: number
    data?: number
    msg?: string
  }

  type CommonResultOAuth2AccessTokenCheckRespDTO = {
    code?: number
    data?: OAuth2AccessTokenCheckRespDTO
    msg?: string
  }

  type CommonResultPageResultRPCfuwuxitongcaozuorizhiResponseDTO = {
    code?: number
    data?: PageResultRPCfuwuxitongcaozuorizhiResponseDTO
    msg?: string
  }

  type CommonResultPageResultSystemDictDataRespVO = {
    code?: number
    data?: PageResultSystemDictDataRespVO
    msg?: string
  }

  type CommonResultPageResultSystemDictTypeRespVO = {
    code?: number
    data?: PageResultSystemDictTypeRespVO
    msg?: string
  }

  type CommonResultPageResultSystemLoginLogRespVO = {
    code?: number
    data?: PageResultSystemLoginLogRespVO
    msg?: string
  }

  type CommonResultPageResultSystemMailAccountRespVO = {
    code?: number
    data?: PageResultSystemMailAccountRespVO
    msg?: string
  }

  type CommonResultPageResultSystemMailLogRespVO = {
    code?: number
    data?: PageResultSystemMailLogRespVO
    msg?: string
  }

  type CommonResultPageResultSystemMailTemplateRespVO = {
    code?: number
    data?: PageResultSystemMailTemplateRespVO
    msg?: string
  }

  type CommonResultPageResultSystemNoticeRespVO = {
    code?: number
    data?: PageResultSystemNoticeRespVO
    msg?: string
  }

  type CommonResultPageResultSystemNotifyMessageRespVO = {
    code?: number
    data?: PageResultSystemNotifyMessageRespVO
    msg?: string
  }

  type CommonResultPageResultSystemNotifyTemplateRespVO = {
    code?: number
    data?: PageResultSystemNotifyTemplateRespVO
    msg?: string
  }

  type CommonResultPageResultSystemOAuth2AccessTokenRespVO = {
    code?: number
    data?: PageResultSystemOAuth2AccessTokenRespVO
    msg?: string
  }

  type CommonResultPageResultSystemOAuth2ClientRespVO = {
    code?: number
    data?: PageResultSystemOAuth2ClientRespVO
    msg?: string
  }

  type CommonResultPageResultSystemOperateLogRespVO = {
    code?: number
    data?: PageResultSystemOperateLogRespVO
    msg?: string
  }

  type CommonResultPageResultSystemPostRespVO = {
    code?: number
    data?: PageResultSystemPostRespVO
    msg?: string
  }

  type CommonResultPageResultSystemRoleRespVO = {
    code?: number
    data?: PageResultSystemRoleRespVO
    msg?: string
  }

  type CommonResultPageResultSystemSmsChannelRespVO = {
    code?: number
    data?: PageResultSystemSmsChannelRespVO
    msg?: string
  }

  type CommonResultPageResultSystemSmsLogRespVO = {
    code?: number
    data?: PageResultSystemSmsLogRespVO
    msg?: string
  }

  type CommonResultPageResultSystemSmsTemplateRespVO = {
    code?: number
    data?: PageResultSystemSmsTemplateRespVO
    msg?: string
  }

  type CommonResultPageResultSystemSocialClientRespVO = {
    code?: number
    data?: PageResultSystemSocialClientRespVO
    msg?: string
  }

  type CommonResultPageResultSystemSocialUserRespVO = {
    code?: number
    data?: PageResultSystemSocialUserRespVO
    msg?: string
  }

  type CommonResultPageResultSystemUserRespVO = {
    code?: number
    data?: PageResultSystemUserRespVO
    msg?: string
  }

  type CommonResultSetLong = {
    code?: number
    data?: number[]
    msg?: string
  }

  type CommonResultSocialWxJsapiSignatureRespDTO = {
    code?: number
    data?: SocialWxJsapiSignatureRespDTO
    msg?: string
  }

  type CommonResultSocialWxPhoneNumberInfoRespDTO = {
    code?: number
    data?: SocialWxPhoneNumberInfoRespDTO
    msg?: string
  }

  type CommonResultString = {
    code?: number
    data?: string
    msg?: string
  }

  type CommonResultSystemAuthLoginRespVO = {
    code?: number
    data?: SystemAuthLoginRespVO
    msg?: string
  }

  type CommonResultSystemAuthPermissionInfoRespVO = {
    code?: number
    data?: SystemAuthPermissionInfoRespVO
    msg?: string
  }

  type CommonResultSystemDeptRespVO = {
    code?: number
    data?: SystemDeptRespVO
    msg?: string
  }

  type CommonResultSystemDictDataRespVO = {
    code?: number
    data?: SystemDictDataRespVO
    msg?: string
  }

  type CommonResultSystemDictTypeRespVO = {
    code?: number
    data?: SystemDictTypeRespVO
    msg?: string
  }

  type CommonResultSystemMailAccountRespVO = {
    code?: number
    data?: SystemMailAccountRespVO
    msg?: string
  }

  type CommonResultSystemMailLogRespVO = {
    code?: number
    data?: SystemMailLogRespVO
    msg?: string
  }

  type CommonResultSystemMailTemplateRespVO = {
    code?: number
    data?: SystemMailTemplateRespVO
    msg?: string
  }

  type CommonResultSystemMenuRespVO = {
    code?: number
    data?: SystemMenuRespVO
    msg?: string
  }

  type CommonResultSystemNoticeRespVO = {
    code?: number
    data?: SystemNoticeRespVO
    msg?: string
  }

  type CommonResultSystemNotifyMessageRespVO = {
    code?: number
    data?: SystemNotifyMessageRespVO
    msg?: string
  }

  type CommonResultSystemNotifyTemplateRespVO = {
    code?: number
    data?: SystemNotifyTemplateRespVO
    msg?: string
  }

  type CommonResultSystemOAuth2ClientRespVO = {
    code?: number
    data?: SystemOAuth2ClientRespVO
    msg?: string
  }

  type CommonResultSystemOAuth2OpenAccessTokenRespVO = {
    code?: number
    data?: SystemOAuth2OpenAccessTokenRespVO
    msg?: string
  }

  type CommonResultSystemOAuth2OpenAuthorizeInfoRespVO = {
    code?: number
    data?: SystemOAuth2OpenAuthorizeInfoRespVO
    msg?: string
  }

  type CommonResultSystemOAuth2OpenCheckTokenRespVO = {
    code?: number
    data?: SystemOAuth2OpenCheckTokenRespVO
    msg?: string
  }

  type CommonResultSystemOAuth2UserInfoRespVO = {
    code?: number
    data?: SystemOAuth2UserInfoRespVO
    msg?: string
  }

  type CommonResultSystemPostRespVO = {
    code?: number
    data?: SystemPostRespVO
    msg?: string
  }

  type CommonResultSystemRoleRespVO = {
    code?: number
    data?: SystemRoleRespVO
    msg?: string
  }

  type CommonResultSystemSmsChannelRespVO = {
    code?: number
    data?: SystemSmsChannelRespVO
    msg?: string
  }

  type CommonResultSystemSmsTemplateRespVO = {
    code?: number
    data?: SystemSmsTemplateRespVO
    msg?: string
  }

  type CommonResultSystemSocialClientRespVO = {
    code?: number
    data?: SystemSocialClientRespVO
    msg?: string
  }

  type CommonResultSystemSocialUserRespVO = {
    code?: number
    data?: SystemSocialUserRespVO
    msg?: string
  }

  type CommonResultSystemUserImportRespVO = {
    code?: number
    data?: SystemUserImportRespVO
    msg?: string
  }

  type CommonResultSystemUserProfileRespVO = {
    code?: number
    data?: SystemUserProfileRespVO
    msg?: string
  }

  type CommonResultSystemUserRespVO = {
    code?: number
    data?: SystemUserRespVO
    msg?: string
  }

  type createWxMpJsapiSignatureParams = {
    // 用户类型
    userType: number
    // 访问 URL
    url: string
  }

  type deleteAccessTokenParams = {
    // 访问令牌
    accessToken: string
  }

  type deleteDeptParams = {
    // 部门 Id
    id: number
  }

  type deleteDictDataParams = {
    // 字典数据 Id
    id: number
  }

  type deleteDictTypeParams = {
    // 编号
    id: number
  }

  type deleteMailAccountParams = {
    // 邮箱账号 Id
    id: number
  }

  type deleteMailTemplateParams = {
    // 邮件模板 Id
    id: number
  }

  type deleteMenuParams = {
    // 菜单 Id
    id: number
  }

  type deleteNoticeParams = {
    // 通知公告 Id
    id: number
  }

  type deleteNotifyTemplateParams = {
    // 站内信模版 Id
    id: number
  }

  type deleteOAuth2ClientParams = {
    // 编号
    id: number
  }

  type deletePostParams = {
    id: number
  }

  type deleteRoleParams = {
    // 角色 Id
    id: number
  }

  type deleteSmsChannelParams = {
    // 短信渠道 Id
    id: number
  }

  type deleteSmsTemplateParams = {
    // 短信模板 Id
    id: number
  }

  type deleteSocialClientParams = {
    // 社交客户端 Id
    id: number
  }

  type deleteUserParams = {
    // 编号
    id: number
  }

  type Dept = {
    // 部门编号
    id: number
    // 部门名称
    name: string
  }

  type DeptDataPermissionRespDTO = {
    // 是否可查看全部数据
    all: boolean
    // 是否可查看自己的数据
    self: boolean
    // 可查看的部门编号数组
    deptIds: number[]
  }

  type DeptRespDTO = {
    // 部门 Id
    id: number
    // 部门名称
    name: string
    // 父部门 Id
    parentId: number
    // 负责人用户 Id
    leaderUserId: number
    // 部门状态，参见 CommonStatusEnum 枚举
    status: number
  }

  type DictDataRespDTO = {
    // 字典标签
    label: string
    // 字典值
    value: string
    // 字典类型
    dictType: string
    // 状态
    status: number
  }

  type export1Params = {
    reqVO: SystemPostPageReqVO
  }

  type export2Params = {
    exportReqVO: SystemDictTypePageReqVO
  }

  type export3Params = {
    exportReqVO: SystemDictDataPageReqVO
  }

  type exportLoginLogParams = {
    exportReqVO: SystemLoginLogPageReqVO
  }

  type exportOperateLogParams = {
    exportReqVO: SystemOperateLogPageReqVO
  }

  type exportSmsLogExcelParams = {
    exportReqVO: SystemSmsLogPageReqVO
  }

  type exportSmsTemplateExcelParams = {
    exportReqVO: SystemSmsTemplatePageReqVO
  }

  type exportUserListParams = {
    exportReqVO: SystemUserPageReqVO
  }

  type exportUsingGETParams = {
    exportReqVO: SystemRolePageReqVO
  }

  type findByIdParams = {
    targetClass: string
    id: string
    uniqueField: string
    targetFields: string
  }

  type findByIdsParams = {
    targetClass: string
  }

  type FindByIdsQueryPayload = {
    ids?: string[]
    uniqueField?: string
    targetFields?: string[]
  }

  type getAccessTokenPageParams = {
    reqVO: SystemOAuth2AccessTokenPageReqVO
  }

  type getAreaByIpParams = {
    // IP
    ip: string
  }

  type getAuthorizeUrlParams = {
    // 社交平台类型
    socialType: number
    // 用户类型
    userType: number
    // 重定向 URL
    redirectUri: string
  }

  type getChildDeptListParams = {
    // 部门 Id
    id: number
  }

  type getDept1Params = {
    // 部门 Id
    id: number
  }

  type getDeptDataPermissionParams = {
    // 用户 Id
    userId: number
  }

  type getDeptList1Params = {
    // 部门 Ids
    ids: number[]
  }

  type getDeptListParams = {
    // 部门名称，模糊匹配
    name?: string
    // 展示状态，参见 CommonStatusEnum 枚举类
    status?: string
  }

  type getDeptParams = {
    // 编号
    id: number
  }

  type getDictDataListParams = {
    // 字典类型
    dictType: string
  }

  type getDictDataParams = {
    // 字典数据 Id
    id: number
  }

  type getDictTypePageParams = {
    pageReqVO: SystemDictDataPageReqVO
  }

  type getDictTypeParams = {
    // 编号
    id: number
  }

  type getLoginLogPageParams = {
    pageReqVO: SystemLoginLogPageReqVO
  }

  type getMailAccountPageParams = {
    pageReqVO: SystemMailAccountPageReqVO
  }

  type getMailAccountParams = {
    // 邮箱账号 Id
    id: number
  }

  type getMailLogPageParams = {
    pageVO: SystemMailLogPageReqVO
  }

  type getMailLogParams = {
    // 邮箱日志 Id
    id: number
  }

  type getMailTemplatePageParams = {
    pageReqVO: SystemMailTemplatePageReqVO
  }

  type getMailTemplateParams = {
    // 邮件模板 Id
    id: number
  }

  type getMenuListParams = {
    // 菜单名称，模糊匹配
    name?: string
    // 展示状态，参见 CommonStatusEnum 枚举类
    status?: string
  }

  type getMenuParams = {
    id: number
  }

  type getMyMyNotifyMessagePageParams = {
    pageVO: SystemNotifyMessageMyPageReqVO
  }

  type getNoticePageParams = {
    pageReqVO: SystemNoticePageReqVO
  }

  type getNoticeParams = {
    // 通知公告 Id
    id: number
  }

  type getNotifyMessagePageParams = {
    pageVO: SystemNotifyMessagePageReqVO
  }

  type getNotifyMessageParams = {
    // 站内信 Id
    id: number
  }

  type getNotifyTemplatePageParams = {
    pageVO: SystemNotifyTemplatePageReqVO
  }

  type getNotifyTemplateParams = {
    // 编号
    id: number
  }

  type getOAuth2ClientPageParams = {
    pageVO: SystemOAuth2ClientPageReqVO
  }

  type getOAuth2ClientParams = {
    // 编号
    id: number
  }

  type getPostListParams = {
    // 岗位 Id 数组
    ids: number[]
  }

  type getPostPageParams = {
    pageReqVO: SystemPostPageReqVO
  }

  type getPostParams = {
    // 岗位编号
    id: number
  }

  type getRoleMenuListParams = {
    // 角色 Id
    roleId: number
  }

  type getRolePageParams = {
    // 角色名称，模糊匹配
    name?: string
    // 角色标识，模糊匹配
    code?: string
    // 展示状态，参见 CommonStatusEnum 枚举类
    status?: string
    // 创建时间
    createTime?: string
    // 页码，从 1 开始
    pageNo: string
    // 每页条数，最大值为 100
    pageSize: string
  }

  type getRoleParams = {
    id: number
  }

  type getSmsChannelPageParams = {
    pageVO: SystemSmsChannelPageReqVO
  }

  type getSmsChannelParams = {
    // 短信渠道 Id
    id: number
  }

  type getSmsLogPageParams = {
    pageReqVO: SystemSmsLogPageReqVO
  }

  type getSmsTemplatePageParams = {
    pageVO: SystemSmsTemplatePageReqVO
  }

  type getSmsTemplateParams = {
    // 编号
    id: number
  }

  type getSocialClientPageParams = {
    pageVO: SystemSocialClientPageReqVO
  }

  type getSocialClientParams = {
    // 社交客户端 Id
    id: number
  }

  type getSocialUserPageParams = {
    pageVO: SystemSocialUserPageReqVO
  }

  type getSocialUserParams = {
    // 社交用户 Id
    id: number
  }

  type getUnreadNotifyMessageListParams = {
    // 10
    size?: number
  }

  type getUser1Params = {
    // 用户 Id
    id: number
  }

  type getUserListByDeptIdsParams = {
    // 部门 Ids
    deptIds: number[]
  }

  type getUserListByPostIdsParams = {
    // 岗位 Ids
    postIds: number[]
  }

  type getUserListBySubordinateParams = {
    // 用户 Id
    id: number
  }

  type getUserListParams = {
    // 部门 Ids
    ids: number[]
  }

  type getUserPageParams = {
    pageReqVO: SystemUserPageReqVO
  }

  type getUserParams = {
    // 用户 Id
    id: number
  }

  type getUserRoleIdListByRoleIdsParams = {
    // 角色 Id 集合
    roleIds: number[]
  }

  type getWxaQrcodeParams = {
    reqVO: SocialWxQrcodeReqDTO
  }

  type getWxaSubscribeTemplateListParams = {
    userType: number
  }

  type getWxMaPhoneNumberInfoParams = {
    // 用户类型
    userType: number
    // 手机授权码
    phoneCode: string
  }

  type hasAnyPermissionsParams = {
    // 用户 Id
    userId: number
    // 权限
    permissions: string[]
  }

  type hasAnyRolesParams = {
    // 用户 Id
    userId: number
    // 角色数组
    roles: string[]
  }

  type importExcelParams = {
    // 是否支持更新，默认为 false
    updateSupport?: boolean
    // Excel 文件
    file: any
  }

  type KeyValueStringBoolean = {
    key?: string
    value?: boolean
  }

  type listAdminRolesParams = {
    // 用户 Id
    userId: number
  }

  type notifyWxaOrderConfirmReceiveParams = {
    userType: number
  }

  type OAuth2AccessTokenCheckRespDTO = {
    // 用户 Id
    userId: number
    // 用户类型，参见 UserTypeEnum 枚举
    userType: number
    // 用户信息
    userInfo?: Record<string, any>
    // 授权范围的数组
    scopes?: string[]
    // 过期时间
    expiresTime: string
  }

  type pageDictTypesParams = {
    pageReqVO: SystemDictTypePageReqVO
  }

  type pageOperateLogParams = {
    pageReqVO: SystemOperateLogPageReqVO
  }

  type PageResultRPCfuwuxitongcaozuorizhiResponseDTO = {
    // 数据
    list: RPCfuwuxitongcaozuorizhiResponseDTO[]
    // 总量
    total: number
  }

  type PageResultSystemDictDataRespVO = {
    // 数据
    list: SystemDictDataRespVO[]
    // 总量
    total: number
  }

  type PageResultSystemDictTypeRespVO = {
    // 数据
    list: SystemDictTypeRespVO[]
    // 总量
    total: number
  }

  type PageResultSystemLoginLogRespVO = {
    // 数据
    list: SystemLoginLogRespVO[]
    // 总量
    total: number
  }

  type PageResultSystemMailAccountRespVO = {
    // 数据
    list: SystemMailAccountRespVO[]
    // 总量
    total: number
  }

  type PageResultSystemMailLogRespVO = {
    // 数据
    list: SystemMailLogRespVO[]
    // 总量
    total: number
  }

  type PageResultSystemMailTemplateRespVO = {
    // 数据
    list: SystemMailTemplateRespVO[]
    // 总量
    total: number
  }

  type PageResultSystemNoticeRespVO = {
    // 数据
    list: SystemNoticeRespVO[]
    // 总量
    total: number
  }

  type PageResultSystemNotifyMessageRespVO = {
    // 数据
    list: SystemNotifyMessageRespVO[]
    // 总量
    total: number
  }

  type PageResultSystemNotifyTemplateRespVO = {
    // 数据
    list: SystemNotifyTemplateRespVO[]
    // 总量
    total: number
  }

  type PageResultSystemOAuth2AccessTokenRespVO = {
    // 数据
    list: SystemOAuth2AccessTokenRespVO[]
    // 总量
    total: number
  }

  type PageResultSystemOAuth2ClientRespVO = {
    // 数据
    list: SystemOAuth2ClientRespVO[]
    // 总量
    total: number
  }

  type PageResultSystemOperateLogRespVO = {
    // 数据
    list: SystemOperateLogRespVO[]
    // 总量
    total: number
  }

  type PageResultSystemPostRespVO = {
    // 数据
    list: SystemPostRespVO[]
    // 总量
    total: number
  }

  type PageResultSystemRoleRespVO = {
    // 数据
    list: SystemRoleRespVO[]
    // 总量
    total: number
  }

  type PageResultSystemSmsChannelRespVO = {
    // 数据
    list: SystemSmsChannelRespVO[]
    // 总量
    total: number
  }

  type PageResultSystemSmsLogRespVO = {
    // 数据
    list: SystemSmsLogRespVO[]
    // 总量
    total: number
  }

  type PageResultSystemSmsTemplateRespVO = {
    // 数据
    list: SystemSmsTemplateRespVO[]
    // 总量
    total: number
  }

  type PageResultSystemSocialClientRespVO = {
    // 数据
    list: SystemSocialClientRespVO[]
    // 总量
    total: number
  }

  type PageResultSystemSocialUserRespVO = {
    // 数据
    list: SystemSocialUserRespVO[]
    // 总量
    total: number
  }

  type PageResultSystemUserRespVO = {
    // 数据
    list: SystemUserRespVO[]
    // 总量
    total: number
  }

  type PointVO = {
    secretKey?: string
    x?: number
    y?: number
  }

  type Post = {
    // 岗位编号
    id: number
    // 岗位名称
    name: string
  }

  type postAccessTokenParams = {
    // 授权类型
    grant_type: string
    // 授权范围
    code?: string
    // 重定向 URI
    redirect_uri?: string
    // 状态
    state?: string
    username?: string
    password?: string
    scope?: string
    refresh_token?: string
  }

  type PostRespDTO = {
    // 岗位 Id
    id: number
    // 岗位名称
    name: string
    // 岗位编码
    code: string
    // 岗位排序
    sort: number
    // 状态，参见 CommonStatusEnum 枚举
    status: number
  }

  type pushParams = {
    // 通知公告 Id
    id: number
  }

  type refreshTokenParams = {
    // 刷新令牌
    refreshToken: string
  }

  type ResponseModel = {
    repCode?: string
    repMsg?: string
    repData?: Record<string, any>
    success?: boolean
    repCodeEnum?:
      | 'SUCCESS'
      | 'ERROR'
      | 'EXCEPTION'
      | 'BLANK_ERROR'
      | 'NULL_ERROR'
      | 'NOT_NULL_ERROR'
      | 'NOT_EXIST_ERROR'
      | 'EXIST_ERROR'
      | 'PARAM_TYPE_ERROR'
      | 'PARAM_FORMAT_ERROR'
      | 'API_CAPTCHA_INVALID'
      | 'API_CAPTCHA_COORDINATE_ERROR'
      | 'API_CAPTCHA_ERROR'
      | 'API_CAPTCHA_BASEMAP_NULL'
      | 'API_REQ_LIMIT_GET_ERROR'
      | 'API_REQ_INVALID'
      | 'API_REQ_LOCK_GET_ERROR'
      | 'API_REQ_LIMIT_CHECK_ERROR'
      | 'API_REQ_LIMIT_VERIFY_ERROR'
  }

  type revokeTokenParams = {
    // 访问令牌
    token: string
  }

  type RPCfuwucaozuorizhifenyeRequestDTO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 模块类型
    type: string
    // 模块数据编号
    bizId: number
    // 用户编号
    userId: number
  }

  type RPCfuwuxitongcaozuorizhiCreateRequestDTO = {
    // 链路追踪编号
    traceId: string
    // 用户编号
    userId: number
    // 用户类型，参见 UserTypeEnum 枚举
    userType: number
    // 操作模块类型
    type: string
    // 操作名
    subType: string
    // 操作模块业务编号
    bizId: number
    // 操作内容
    action: string
    // 拓展字段
    extra?: string
    // 请求方法名
    requestMethod: string
    // 请求地址
    requestUrl: string
    // 用户 IP
    userIp: string
    // 浏览器 UserAgent
    userAgent: string
    // 结果码
    resultCode: number
    // 结果提示
    resultMsg?: string
    // 操作类型
    operateType: number
    // 执行时长，单位：毫秒
    duration: number
    // Java 请求方法
    javaMethod: string
    // Java 请求参数
    javaMethodArgs: string
  }

  type RPCfuwuxitongcaozuorizhiResponseDTO = {
    // 日志编号
    id: number
    // 链路追踪编号
    traceId: string
    // 用户编号
    userId: number
    // 用户名称
    userName: string
    // 用户类型，参见 UserTypeEnum 枚举
    userType: number
    // 操作模块类型
    type: string
    // 操作名
    subType: string
    // 操作模块业务编号
    bizId: number
    // 操作内容
    action: string
    // 拓展字段
    extra?: string
    // 请求方法名
    requestMethod: string
    // 请求地址
    requestUrl: string
    // 用户 IP
    userIp: string
    // 浏览器 UserAgent
    userAgent: string
    // 创建时间
    createTime: string
    transMap?: Record<string, any>
  }

  type selectByIdParams = {
    id: Record<string, any>
  }

  type selectByIdsParams = {
    ids: Record<string, any>[]
  }

  type SmsCodeSendReqDTO = {
    // 手机号
    mobile: string
    // 发送场景
    scene: number
    // 发送 IP
    createIp: string
  }

  type SmsCodeUseReqDTO = {
    // 手机号
    mobile: string
    // 发送场景
    scene: number
    // 验证码
    code: string
    // 发送 IP
    usedIp: string
  }

  type SmsCodeValidateReqDTO = {
    // 手机号
    mobile: string
    // 发送场景
    scene: number
    // 验证码
    code: string
  }

  type socialLoginParams = {
    // 社交类型
    type: number
    // 回调路径
    redirectUri: string
  }

  type SocialUser = {
    // 社交平台的类型，参见 SocialTypeEnum 枚举类
    type: number
    // 社交用户的 openid
    openid: string
  }

  type SocialWxaOrderNotifyConfirmReceiveReqDTO = {
    transactionId: string
    receivedTime: string
  }

  type SocialWxaOrderUploadShippingInfoReqDTO = {
    openid: string
    transactionId: string
    logisticsType: number
    logisticsNo?: string
    expressCompany?: string
    itemDesc: string
    receiverContact: string
  }

  type SocialWxaSubscribeMessageSendReqDTO = {
    // 用户 Id
    userId: number
    // 用户类型
    userType: number
    // 消息模版标题
    templateTitle: string
    // 点击模板卡片后的跳转页面，仅限本小程序内的页面
    page?: string
    // 模板内容的参数
    messages?: Record<string, any>
  }

  type SocialWxaSubscribeTemplateRespDTO = {
    // 模版 Id
    id: string
    // 模版标题
    title: string
    // 模版内容
    content: string
    // 模板内容示例
    example: string
    // 模版类型，2：为一次性订阅；3：为长期订阅
    type: number
  }

  type SocialWxJsapiSignatureRespDTO = {
    // 微信公众号的 appId
    appId: string
    // 匿名串
    nonceStr: string
    // 时间戳
    timestamp: number
    // URL
    url: string
    // 签名
    signature: string
  }

  type SocialWxPhoneNumberInfoRespDTO = {
    // 用户绑定的手机号（国外手机号会有区号）
    phoneNumber: string
    // 没有区号的手机号
    purePhoneNumber: string
    // 区号
    countryCode: string
  }

  type SocialWxQrcodeReqDTO = {
    // 场景
    scene: string
    // 页面路径
    path: string
    // 二维码宽度
    width?: number
    // 是否需要透明底色
    autoColor?: boolean
    // 是否检查 page 是否存在
    checkPath?: boolean
    // 是否需要透明底色
    hyaline?: boolean
  }

  type SystemAreaNodeRespVO = {
    // 地区节点 Id
    id: number
    // 名字
    name: string
  }

  type SystemAuthLoginReqVO = {
    // 账号
    username: string
    // 密码
    password: string
    // 验证码，验证码开启时，需要传递
    captchaVerification: string
    // 社交平台的类型，参见 SocialTypeEnum 枚举值
    socialType: number
    // 授权码
    socialCode: string
    // state
    socialState: string
    socialCodeValid?: boolean
  }

  type SystemAuthLoginRespVO = {
    // 用户 Id
    userId: number
    // 访问令牌
    accessToken: string
    // 刷新令牌
    refreshToken: string
    // 过期时间
    expiresTime: string
  }

  type SystemAuthPermissionInfoRespVO = {
    user: SystemUserVO
    // 角色标识数组
    roles: string[]
    // 操作权限数组
    permissions: string[]
    // 菜单树
    menus: SystemMenuVO[]
  }

  type SystemAuthSmsLoginReqVO = {
    // 手机号
    mobile: string
    // 短信验证码
    code: string
  }

  type SystemAuthSocialLoginReqVO = {
    // 社交平台的类型，参见 UserSocialTypeEnum 枚举值
    type: number
    // 授权码
    code: string
    // state
    state: string
  }

  type SystemDeptRespVO = {
    // 部门 Id
    id?: number
    // 部门名称
    name: string
    // 父部门 Id
    parentId?: number
    // 显示顺序
    sort: number
    // 负责人的用户 Id
    leaderUserId?: number
    // 联系电话
    phone?: string
    // 邮箱
    email?: string
    // 状态，参见 CommonStatusEnum 枚举
    status: number
    // 创建时间
    createTime: string
  }

  type SystemDeptSaveReqVO = {
    // 部门编号
    id?: number
    // 部门名称
    name: string
    // 父部门 ID
    parentId?: number
    // 显示顺序
    sort: number
    // 负责人的用户编号
    leaderUserId?: number
    // 联系电话
    phone?: string
    // 邮箱
    email?: string
    // 状态，参见 CommonStatusEnum 枚举
    status: number
  }

  type SystemDeptSimpleRespVO = {
    // 部门编号
    id: number
    // 部门名称
    name: string
    // 父部门 ID
    parentId: number
  }

  type SystemDictDataPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 字典标签
    label?: string
    // 字典类型，模糊匹配
    dictType?: string
    // 展示状态，参见 CommonStatusEnum 枚举类
    status?: number
  }

  type SystemDictDataRespVO = {
    // 字典数据 Id
    id: number
    // 显示顺序
    sort: number
    // 字典标签
    label: string
    // 字典值
    value: string
    // 字典类型
    dictType: string
    // 状态，见 CommonStatusEnum 枚举
    status: number
    // 颜色类型，default、primary、success、info、warning、danger
    colorType?: string
    // css 样式
    cssClass?: string
    // 备注
    remark?: string
    // 创建时间
    createTime: string
  }

  type SystemDictDataSaveReqVO = {
    // 字典数据 Id
    id?: number
    // 显示顺序
    sort: number
    // 字典标签
    label: string
    // 字典值
    value: string
    // 字典类型
    dictType: string
    // 状态，见 CommonStatusEnum 枚举
    status: number
    // 颜色类型，default、primary、success、info、warning、danger
    colorType?: string
    // css 样式
    cssClass?: string
    // 备注
    remark?: string
  }

  type SystemDictDataSimpleRespVO = {
    // 字典类型
    dictType: string
    // 字典键值
    value: string
    // 字典标签
    label: string
    // 颜色类型，default、primary、success、info、warning、danger
    colorType?: string
    // css 样式
    cssClass?: string
  }

  type SystemDictTypePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 字典类型名称，模糊匹配
    name?: string
    // 字典类型，模糊匹配
    type?: string
    // 展示状态，参见 CommonStatusEnum 枚举类
    status?: number
    // 创建时间
    createTime?: string[]
  }

  type SystemDictTypeRespVO = {
    // 字典类型 Id
    id: number
    // 字典名称
    name: string
    // 字典类型
    type: string
    // 状态，参见 CommonStatusEnum 枚举类
    status: number
    // 备注
    remark?: string
    // 创建时间
    createTime: string
  }

  type SystemDictTypeSaveReqVO = {
    // 字典类型 Id
    id?: number
    // 字典名称
    name: string
    // 字典类型
    type: string
    // 状态，参见 CommonStatusEnum 枚举类
    status: number
    // 备注
    remark?: string
  }

  type SystemDictTypeSimpleRespVO = {
    // 字典类型 Id
    id: number
    // 字典类型名称
    name: string
    // 字典类型
    type: string
  }

  type SystemLoginLogPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 用户 IP，模拟匹配
    userIp?: string
    // 用户账号，模拟匹配
    username?: string
    // 操作状态
    status?: boolean
    // 登录时间
    createTime?: string[]
  }

  type SystemLoginLogRespVO = {
    // 日志 Id
    id: number
    // 日志类型，参见 LoginLogTypeEnum 枚举类
    logType: number
    // 用户 Id
    userId?: number
    // 用户类型，参见 UserTypeEnum 枚举
    userType: number
    // 链路追踪编号
    traceId?: string
    // 用户账号
    username: string
    // 登录结果，参见 LoginResultEnum 枚举类
    result: number
    // 用户 IP
    userIp: string
    // 浏览器 UserAgent
    userAgent?: string
    // 登录时间
    createTime: string
  }

  type SystemMailAccountPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 邮箱
    mail: string
    // 用户名
    username: string
  }

  type SystemMailAccountRespVO = {
    // 邮箱账号 Id
    id: number
    // 邮箱
    mail: string
    // 用户名
    username: string
    // 密码
    password: string
    // SMTP 服务器域名
    host: string
    // SMTP 服务器端口
    port: number
    // 是否开启 ssl
    sslEnable: boolean
    // 是否开启 starttls
    starttlsEnable: boolean
    // 创建时间
    createTime: string
  }

  type SystemMailAccountSaveReqVO = {
    // 邮箱账号 Id
    id?: number
    // 邮箱
    mail: string
    // 用户名
    username: string
    // 密码
    password: string
    // SMTP 服务器域名
    host: string
    // SMTP 服务器端口
    port: number
    // 是否开启 ssl
    sslEnable: boolean
    // 是否开启 starttls
    starttlsEnable: boolean
  }

  type SystemMailAccountSimpleRespVO = {
    // 邮箱账号 Id
    id: number
    // 邮箱
    mail: string
  }

  type SystemMailLogPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 用户 Id
    userId?: number
    // 用户类型，参见 UserTypeEnum 枚举
    userType?: number
    // 接收邮箱地址，模糊匹配
    toMail?: string
    // 邮箱账号 Id
    accountId?: number
    // 邮箱模板 Id
    templateId?: number
    // 发送状态，参见 MailSendStatusEnum 枚举
    sendStatus?: number
    // 发送时间
    sendTime?: string[]
  }

  type SystemMailLogRespVO = {
    // 邮件日志 Id
    id: number
    // 用户 Id
    userId?: number
    // 用户类型，参见 UserTypeEnum 枚举
    userType?: string
    // 接收邮箱地址
    toMail: string
    // 邮箱账号 Id
    accountId: number
    // 发送邮箱地址
    fromMail: string
    // 邮件模板 Id
    templateId: number
    // 邮件模板编码
    templateCode: string
    // 邮件模版发送人名称
    templateNickname?: string
    // 邮件标题
    templateTitle: string
    // 邮件内容
    templateContent: string
    // 邮件参数
    templateParams: Record<string, any>
    // 发送状态，参见 MailSendStatusEnum 枚举
    sendStatus: string
    // 发送时间
    sendTime?: string
    // 发送返回的消息 ID
    sendMessageId?: string
    // 发送异常
    sendException?: string
    // 创建时间
    createTime: string
  }

  type SystemMailTemplatePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 状态，参见 CommonStatusEnum 枚举
    status?: number
    // 邮件模板编码，模糊匹配
    code?: string
    // 邮件模板名称，模糊匹配
    name?: string
    // 邮件账号 Id
    accountId?: number
    // 创建时间
    createTime?: string[]
  }

  type SystemMailTemplateRespVO = {
    // 邮件模板 Id
    id: number
    // 邮件模版名称
    name: string
    // 邮件模版编码
    code: string
    // 发送的邮箱账号编号
    accountId: number
    // 发送人名称
    nickname?: string
    // 标题
    title: string
    // 内容
    content: string
    // 参数数组
    params?: string[]
    // 状态，参见 CommonStatusEnum 枚举
    status: number
    // 备注
    remark?: string
    // 创建时间
    createTime: string
  }

  type SystemMailTemplateSaveReqVO = {
    // 邮件模板 Id
    id?: number
    // 邮件模版名称
    name: string
    // 邮件模版 Id
    code: string
    // 发送的邮箱账号 Id
    accountId: number
    // 发送人名称
    nickname?: string
    // 标题
    title: string
    // 内容
    content: string
    // 状态，参见 CommonStatusEnum 枚举
    status: number
    // 备注
    remark?: string
  }

  type SystemMailTemplateSendReqVO = {
    // 接收邮箱
    mail: string
    // 邮件模板编码
    templateCode: string
    // 邮件模板参数
    templateParams?: Record<string, any>
  }

  type SystemMailTemplateSimpleRespVO = {
    // 邮件模版 Id
    id: number
    // 邮件模版名称
    name: string
  }

  type SystemMenuRespVO = {
    // 菜单 Id
    id: number
    // 菜单名称
    name: string
    // 权限标识，仅菜单类型为按钮时，才需要传递
    permission?: string
    // 类型，参见 MenuTypeEnum 枚举类
    type: number
    // 显示顺序
    sort: number
    // 父菜单 ID
    parentId: number
    // 路由地址，仅菜单类型为菜单或者目录时，才需要传
    path?: string
    // 菜单图标，仅菜单类型为菜单或者目录时，才需要传
    icon?: string
    // 组件路径，仅菜单类型为菜单时，才需要传
    component?: string
    // 组件名
    componentName?: string
    // 状态，见 CommonStatusEnum 枚举
    status: number
    // 是否可见
    visible?: boolean
    // 是否缓存
    keepAlive?: boolean
    // 是否总是显示
    alwaysShow?: boolean
    // 创建时间
    createTime: string
  }

  type SystemMenuSaveVO = {
    // 菜单 Id
    id?: number
    // 菜单名称
    name: string
    // 权限标识，仅菜单类型为按钮时，才需要传递
    permission?: string
    // 类型，参见 MenuTypeEnum 枚举类
    type: number
    // 显示顺序
    sort: number
    // 父菜单 ID
    parentId: number
    // 路由地址，仅菜单类型为菜单或者目录时，才需要传
    path?: string
    // 菜单图标，仅菜单类型为菜单或者目录时，才需要传
    icon?: string
    // 组件路径，仅菜单类型为菜单时，才需要传
    component?: string
    // 组件名
    componentName?: string
    // 状态，见 CommonStatusEnum 枚举
    status: number
    // 是否可见
    visible?: boolean
    // 是否缓存
    keepAlive?: boolean
    // 是否总是显示
    alwaysShow?: boolean
  }

  type SystemMenuSimpleRespVO = {
    // 菜单 Id
    id: number
    // 菜单名称
    name: string
    // 父菜单 ID
    parentId: number
    // 类型，参见 MenuTypeEnum 枚举类
    type: number
  }

  type SystemMenuVO = {
    // 菜单 Id
    id: number
    // 父菜单 Id
    parentId: number
    // 菜单名称
    name: string
    // 路由地址，仅菜单类型为菜单或者目录时，才需要传
    path?: string
    // 组件路径，仅菜单类型为菜单时，才需要传
    component?: string
    // 组件名
    componentName?: string
    // 菜单图标，仅菜单类型为菜单或者目录时，才需要传
    icon?: string
    // 是否可见
    visible: boolean
    // 是否缓存
    keepAlive: boolean
    // 是否总是显示
    alwaysShow?: boolean
    children?: SystemMenuVO[]
  }

  type SystemNoticePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 通知公告名称，模糊匹配
    title?: string
    // 展示状态，参见 CommonStatusEnum 枚举类
    status?: number
  }

  type SystemNoticeRespVO = {
    // 通知公告 Id
    id: number
    // 公告标题
    title: string
    // 公告类型
    type: number
    // 公告内容
    content: string
    // 状态，参见 CommonStatusEnum 枚举类
    status: number
    // 创建时间
    createTime: string
  }

  type SystemNoticeSaveReqVO = {
    // 公告 Id
    id?: number
    // 公告标题
    title: string
    // 公告类型
    type: number
    // 公告内容
    content: string
    // 状态，参见 CommonStatusEnum 枚举类
    status: number
  }

  type SystemNotifyMessageMyPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 是否已读
    readStatus?: boolean
    // 创建时间
    createTime?: string[]
  }

  type SystemNotifyMessagePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 用户 Id
    userId?: number
    // 用户类型
    userType?: number
    // 模板编码
    templateCode?: string
    // 模版类型
    templateType?: number
    // 创建时间
    createTime?: string[]
  }

  type SystemNotifyMessageRespVO = {
    // 站内信 Id
    id: number
    // 用户 Id
    userId: number
    // 用户类型，参见 UserTypeEnum 枚举
    userType: string
    // 模版编号
    templateId: number
    // 模板编码
    templateCode: string
    // 模版发送人名称
    templateNickname: string
    // 模版内容
    templateContent: string
    // 模版类型
    templateType: number
    // 模版参数
    templateParams: Record<string, any>
    // 是否已读
    readStatus: boolean
    // 阅读时间
    readTime?: string
    // 创建时间
    createTime: string
  }

  type SystemNotifyTemplatePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 站内信模版编码
    code?: string
    // 站内信模版名称
    name?: string
    // 状态，参见 CommonStatusEnum 枚举类
    status?: number
    // 创建时间
    createTime?: string[]
  }

  type SystemNotifyTemplateRespVO = {
    // 站内信模版 Id
    id: number
    // 站内信模版名称
    name: string
    // 站内信模版编码
    code: string
    // 站内信模版类型，对应 system_notify_template_type 字典
    type: number
    // 发送人名称
    nickname: string
    // 站内信模版内容
    content: string
    // 参数数组
    params?: string[]
    // 状态，参见 CommonStatusEnum 枚举
    status: number
    // 备注
    remark?: string
    // 创建时间
    createTime: string
  }

  type SystemNotifyTemplateSaveReqVO = {
    // 站内信模版 Id
    id?: number
    // 站内信模版名称
    name: string
    // 站内信模版编码
    code: string
    // 站内信模版类型，对应 system_notify_template_type 字典
    type: number
    // 发送人名称
    nickname: string
    // 站内信模版内容
    content: string
    // 站内信状态，参见 CommonStatusEnum 枚举
    status: number
    // 备注
    remark?: string
  }

  type SystemNotifyTemplateSendReqVO = {
    // 用户 Id
    userId: number
    // 用户类型
    userType: number
    // 站内信模板编码
    templateCode: string
    // 站内信模板参数
    templateParams?: Record<string, any>
  }

  type SystemOAuth2AccessTokenPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 用户编号
    userId: number
    // 用户类型，参见 UserTypeEnum 枚举
    userType: number
    // 客户端编号
    clientId: string
  }

  type SystemOAuth2AccessTokenRespVO = {
    // 编号
    id: number
    // 访问令牌
    accessToken: string
    // 刷新令牌
    refreshToken: string
    // 用户编号
    userId: number
    // 用户类型，参见 UserTypeEnum 枚举
    userType: number
    // 客户端编号
    clientId: string
    // 创建时间
    createTime: string
    // 过期时间
    expiresTime: string
  }

  type SystemOAuth2ClientPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 应用名，模糊匹配
    name?: string
    // 状态，参见 CommonStatusEnum 枚举
    status?: number
  }

  type SystemOAuth2ClientRespVO = {
    // 编号
    id: number
    // 客户端编号
    clientId: string
    // 客户端密钥
    secret: string
    // 应用名
    name: string
    // 应用图标
    logo: string
    // 应用描述
    description?: string
    // 状态，参见 CommonStatusEnum 枚举
    status: number
    // 访问令牌的有效期
    accessTokenValiditySeconds: number
    // 刷新令牌的有效期
    refreshTokenValiditySeconds: number
    // 可重定向的 URI 地址
    redirectUris: string[]
    // 授权类型，参见 OAuth2GrantTypeEnum 枚举
    authorizedGrantTypes: string[]
    // 授权范围
    scopes?: string[]
    // 自动通过的授权范围
    autoApproveScopes?: string[]
    // 权限
    authorities?: string[]
    // 资源
    resourceIds?: string[]
    // 附加信息
    additionalInformation?: string
    // 创建时间
    createTime: string
  }

  type SystemOAuth2ClientSaveReqVO = {
    // 编号
    id?: number
    // 客户端编号
    clientId: string
    // 客户端密钥
    secret: string
    // 应用名
    name: string
    // 应用图标
    logo: string
    // 应用描述
    description?: string
    // 状态，参见 CommonStatusEnum 枚举
    status: number
    // 访问令牌的有效期
    accessTokenValiditySeconds: number
    // 刷新令牌的有效期
    refreshTokenValiditySeconds: number
    // 可重定向的 URI 地址
    redirectUris: string[]
    // 授权类型，参见 OAuth2GrantTypeEnum 枚举
    authorizedGrantTypes: string[]
    // 授权范围
    scopes?: string[]
    // 自动通过的授权范围
    autoApproveScopes?: string[]
    // 权限
    authorities?: string[]
    // 资源
    resourceIds?: string[]
    // 附加信息
    additionalInformation?: string
    additionalInformationJson?: boolean
  }

  type SystemOAuth2OpenAccessTokenRespVO = {
    // 授权范围，如果多个授权范围，使用空格分隔
    scope?: string
    // 访问令牌
    access_token: string
    // 刷新令牌
    refresh_token: string
    // 令牌类型
    token_type: string
    // 过期时间，单位：秒
    expires_in: number
  }

  type SystemOAuth2OpenAuthorizeInfoRespVO = {
    client?: Client
    // scope 的选中信息，使用 List 保证有序性，Key 是 scope，Value 为是否选中
    scopes: KeyValueStringBoolean[]
  }

  type SystemOAuth2OpenCheckTokenRespVO = {
    // 授权范围
    scopes: string[]
    // 过期时间，时间戳 / 1000，单位：秒
    exp: number
    // 用户编号
    user_id: number
    // 用户类型，参见 UserTypeEnum 枚举
    user_type: number
    // 客户端编号
    client_id: string
    // 访问令牌
    access_token: string
  }

  type SystemOAuth2UserInfoRespVO = {
    // 用户编号
    id: number
    // 用户账号
    username: string
    // 用户昵称
    nickname: string
    // 用户邮箱
    email?: string
    // 手机号码
    mobile?: string
    // 用户性别，参见 SexEnum 枚举类
    sex?: number
    // 用户头像
    avatar?: string
    dept?: Dept
    posts?: Post[]
  }

  type SystemOAuth2UserUpdateReqVO = {
    // 用户昵称
    nickname: string
    // 用户邮箱
    email?: string
    // 手机号码
    mobile?: string
    // 用户性别，参见 SexEnum 枚举类
    sex?: number
  }

  type SystemOperateLogPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 用户 Id
    userId?: number
    // 操作模块业务编号
    bizId?: number
    // 操作模块，模拟匹配
    type?: string
    // 操作名，模拟匹配
    subType?: string
    // 操作明细，模拟匹配
    action?: string
    // 开始时间
    createTime?: string[]
  }

  type SystemOperateLogRespVO = {
    // 日志 Id
    id: number
    // 链路追踪编号
    traceId: string
    // 用户编号
    userId: number
    // 用户昵称
    userName: string
    // 用户类型
    userType: string
    // 操作模块类型
    type: string
    // 操作名
    subType: string
    // 操作模块业务编号
    bizId: number
    // 操作明细
    action?: string
    // 拓展字段
    extra?: string
    // 请求方法名
    requestMethod: string
    // 请求地址
    requestUrl: string
    // 用户 IP
    userIp: string
    // 浏览器 UserAgent
    userAgent: string
    // 创建时间
    createTime: string
    // 操作类型，参见 OperateTypeEnum 枚举
    operateType: number
    // Java 请求方法
    javaMethod: string
    // Java 请求参数
    javaMethodArgs: string
    // 执行时长，单位：毫秒
    duration: number
    // 结果码
    resultCode: number
    // 结果提示
    resultMsg: string
    transMap?: Record<string, any>
  }

  type SystemPermissionAssignRoleDataScopeReqVO = {
    // 角色编号
    roleId: number
    // 数据范围，参见 DataScopeEnum 枚举类
    dataScope: number
    // 部门编号列表，只有范围类型为 DEPT_CUSTOM 时，该字段才需要
    dataScopeDeptIds?: number[]
  }

  type SystemPermissionAssignRoleMenuReqVO = {
    // 角色编号
    roleId: number
    // 菜单编号列表
    menuIds?: number[]
  }

  type SystemPermissionAssignUserRoleReqVO = {
    // 用户编号
    userId: number
    // 角色编号列表
    roleIds?: number[]
  }

  type SystemPostPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 岗位编码，模糊匹配
    code?: string
    // 岗位名称，模糊匹配
    name?: string
    // 展示状态，参见 CommonStatusEnum 枚举类
    status?: number
  }

  type SystemPostRespVO = {
    // 岗位序号
    id: number
    // 岗位名称
    name: string
    // 岗位编码
    code: string
    // 显示顺序
    sort: number
    // 状态，参见 CommonStatusEnum 枚举类
    status: number
    // 备注
    remark?: string
    // 创建时间
    createTime: string
  }

  type SystemPostSaveReqVO = {
    // 岗位编号
    id?: number
    // 岗位名称
    name: string
    // 岗位编码
    code: string
    // 显示顺序
    sort: number
    // 状态
    status: number
    // 备注
    remark?: string
  }

  type SystemPostSimpleRespVO = {
    // 岗位序号
    id: number
    // 岗位名称
    name: string
  }

  type SystemRolePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 角色名称，模糊匹配
    name?: string
    // 角色标识，模糊匹配
    code?: string
    // 展示状态，参见 CommonStatusEnum 枚举类
    status?: number
    // 创建时间
    createTime?: string[]
  }

  type SystemRoleRespVO = {
    // 角色编号
    id: number
    // 角色名称
    name: string
    // 角色标志
    code: string
    // 显示顺序
    sort: number
    // 状态，参见 CommonStatusEnum 枚举类
    status: number
    // 角色类型，参见 RoleTypeEnum 枚举类
    type: number
    // 备注
    remark?: string
    // 数据范围，参见 DataScopeEnum 枚举类
    dataScope: number
    // 数据范围（指定部门数组）
    dataScopeDeptIds?: number[]
    // 创建时间
    createTime: string
  }

  type SystemRoleSaveReqVO = {
    // 角色编号
    id?: number
    // 角色名称
    name: string
    // 角色编码
    code: string
    // 显示顺序
    sort: number
    // 备注
    remark?: string
  }

  type SystemRoleSimpleRespVO = {
    // 角色 Id
    id: number
    // 角色名称
    name: string
  }

  type SystemSmsChannelPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 任务状态
    status?: number
    // 短信签名，模糊匹配
    signature?: string
    // 创建时间
    createTime?: string[]
  }

  type SystemSmsChannelRespVO = {
    // 短信渠道 Id
    id: number
    // 短信签名
    signature: string
    // 短信渠道编码，参见 SystemSmsChannelEnum 枚举类
    code: string
    // 启用状态
    status: number
    // 备注
    remark?: string
    // 短信 API 的账号
    apiKey: string
    // 短信 API 的密钥
    apiSecret?: string
    // 短信发送回调 URL
    callbackUrl?: string
    // 创建时间
    createTime: string
  }

  type SystemSmsChannelSaveReqVO = {
    // 短信渠道 Id
    id?: number
    // 短信签名
    signature: string
    // 短信渠道编码，参见 SystemSmsChannelEnum 枚举类
    code: string
    // 启用状态
    status: number
    // 备注
    remark?: string
    // 短信 API 的账号
    apiKey: string
    // 短信 API 的密钥
    apiSecret?: string
    // 短信发送回调 URL
    callbackUrl?: string
  }

  type SystemSmsChannelSimpleRespVO = {
    // 短信渠道 Id
    id: number
    // 短信签名
    signature: string
    // 短信渠道编码，参见 SystemSmsChannelEnum 枚举类
    code: string
  }

  type SystemSmsLogPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 短信渠道 Id
    channelId?: number
    // 短信模板 Id
    templateId?: number
    // 手机号
    mobile?: string
    // 发送状态，参见 SmsSendStatusEnum 枚举类
    sendStatus?: number
    // 发送时间
    sendTime?: string[]
    // 接收状态，参见 SmsReceiveStatusEnum 枚举类
    receiveStatus?: number
    // 接收时间
    receiveTime?: string[]
  }

  type SystemSmsLogRespVO = {
    // 短信日志 Id
    id: number
    // 短信渠道 Id
    channelId: number
    // 短信渠道编码
    channelCode: string
    // 短信模板 Id
    templateId: number
    // 短信模板编码
    templateCode: string
    // 短信类型
    templateType: number
    // 短信内容
    templateContent: string
    // 短信参数
    templateParams: Record<string, any>
    // 短信 API 的模板 Id
    apiTemplateId: string
    // 手机号
    mobile: string
    // 用户 Id
    userId?: number
    // 用户类型
    userType?: number
    // 发送状态
    sendStatus: number
    // 发送时间
    sendTime?: string
    // 短信 API 发送结果的编码
    apiSendCode?: string
    // 短信 API 发送失败的提示
    apiSendMsg?: string
    // 短信 API 发送返回的唯一请求 ID
    apiRequestId?: string
    // 短信 API 发送返回的序号
    apiSerialNo?: string
    // 接收状态
    receiveStatus: number
    // 接收时间
    receiveTime?: string
    // API 接收结果的编码
    apiReceiveCode?: string
    // API 接收结果的说明
    apiReceiveMsg?: string
    // 创建时间
    createTime: string
  }

  type SystemSmsTemplatePageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 短信签名
    type?: number
    // 开启状态
    status?: number
    // 短信模板编码，模糊匹配
    code?: string
    // 短信模板内容，模糊匹配
    content?: string
    // 短信 API 的模板 Id，模糊匹配
    apiTemplateId?: string
    // 短信渠道 Id
    channelId?: number
    // 创建时间
    createTime?: string[]
  }

  type SystemSmsTemplateRespVO = {
    // 短信模板 Id
    id: number
    // 短信类型，参见 SmsTemplateTypeEnum 枚举类
    type: number
    // 开启状态，参见 CommonStatusEnum 枚举类
    status: number
    // 短信模板编码
    code: string
    // 短信模板名称
    name: string
    // 短信模板内容
    content: string
    // 参数数组
    params?: string[]
    // 备注
    remark?: string
    // 短信 API 的模板 Id
    apiTemplateId: string
    // 短信渠道 Id
    channelId: number
    // 短信渠道编码
    channelCode: string
    // 创建时间
    createTime: string
  }

  type SystemSmsTemplateSaveReqVO = {
    // 短信模板 Id
    id?: number
    // 短信类型，参见 SmsTemplateTypeEnum 枚举类
    type: number
    // 开启状态，参见 CommonStatusEnum 枚举类
    status: number
    // 短信模板编码
    code: string
    // 短信模板名称
    name: string
    // 短信模板内容
    content: string
    // 备注
    remark?: string
    // 短信 API 的模板编号
    apiTemplateId: string
    // 短信渠道编号
    channelId: number
  }

  type SystemSmsTemplateSendReqVO = {
    // 手机号
    mobile: string
    // 短信模板编码
    templateCode: string
    // 短信模板参数
    templateParams?: Record<string, any>
  }

  type SystemSocialClientPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 应用名
    name?: string
    // 社交平台的类型
    socialType?: number
    // 用户类型
    userType?: number
    // 客户端 Id
    clientId?: string
    // 状态
    status?: number
  }

  type SystemSocialClientRespVO = {
    // Id
    id: number
    // 应用名
    name: string
    // 社交平台的类型
    socialType: number
    // 用户类型
    userType: number
    // 客户端 Id
    clientId: string
    // 客户端密钥
    clientSecret: string
    // 授权方的网页应用编号
    agentId: string
    // 状态
    status: number
    // 创建时间
    createTime: string
  }

  type SystemSocialClientSaveReqVO = {
    // Id
    id?: number
    // 应用名
    name: string
    // 社交平台的类型
    socialType: number
    // 用户类型
    userType: number
    // 客户端 Id
    clientId: string
    // 客户端密钥
    clientSecret: string
    // 授权方的网页应用 Id
    agentId: string
    // 状态
    status: number
  }

  type SystemSocialUserBindReqVO = {
    // 社交平台的类型，参见 UserSocialTypeEnum 枚举值
    type: number
    // 授权码
    code: string
    // state
    state: string
  }

  type SystemSocialUserPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 社交平台的类型
    type?: number
    // 用户昵称
    nickname?: string
    // 社交 openid
    openid?: string
    // 创建时间
    createTime?: string[]
  }

  type SystemSocialUserRespVO = {
    // 用户 Id
    id: number
    // 社交平台的类型
    type: number
    // 社交 openid
    openid: string
    // 社交 token
    token: string
    // 原始 Token 数据，一般是 JSON 格式
    rawTokenInfo: string
    // 用户昵称
    nickname: string
    // 用户头像
    avatar?: string
    // 原始用户数据，一般是 JSON 格式
    rawUserInfo: string
    // 最后一次的认证 code
    code: string
    // 最后一次的认证 state
    state: string
    // 创建时间
    createTime: string
    // 更新时间
    updateTime: string
  }

  type SystemSocialUserUnbindReqVO = {
    // 社交平台的类型，参见 UserSocialTypeEnum 枚举值
    type: number
    // 社交用户的 openid
    openid: string
  }

  type SystemUserImportRespVO = {
    // 创建成功的用户名数组
    createUsernames: string[]
    // 更新成功的用户名数组
    updateUsernames: string[]
    // 导入失败的用户集合，key 为用户名，value 为失败原因
    failureUsernames: Record<string, any>
  }

  type SystemUserPageReqVO = {
    // 页码，从 1 开始
    pageNo: number
    // 每页条数，最大值为 100
    pageSize: number
    // 用户账号，模糊匹配
    username?: string
    // 手机号码，模糊匹配
    mobile?: string
    // 展示状态，参见 CommonStatusEnum 枚举类
    status?: number
    // 创建时间
    createTime?: string[]
    // 部门编号，同时筛选子部门
    deptId?: number
  }

  type SystemUserProfileRespVO = {
    // 用户 Id
    id: number
    // 用户账号
    username: string
    // 用户昵称
    nickname: string
    // 用户邮箱
    email?: string
    // 手机号码
    mobile?: string
    // 用户性别，参见 SexEnum 枚举类
    sex?: number
    // 用户头像
    avatar?: string
    // 最后登录 IP
    loginIp: string
    // 最后登录时间
    loginDate: string
    // 创建时间
    createTime: string
    roles?: SystemRoleSimpleRespVO[]
    dept?: SystemDeptSimpleRespVO
    posts?: SystemPostSimpleRespVO[]
    socialUsers?: SocialUser[]
  }

  type SystemUserProfileUpdatePasswordReqVO = {
    // 旧密码
    oldPassword: string
    // 新密码
    newPassword: string
  }

  type SystemUserProfileUpdateReqVO = {
    // 用户昵称
    nickname: string
    // 用户邮箱
    email?: string
    // 手机号码
    mobile?: string
    // 用户性别，参见 SexEnum 枚举类
    sex?: number
  }

  type SystemUserRespVO = {
    // 用户编号
    id: number
    // 用户账号
    username: string
    // 用户昵称
    nickname: string
    // 备注
    remark?: string
    // 部门 Id
    deptId?: number
    // 部门名称
    deptName?: string
    // 岗位编号数组
    postIds?: number[]
    // 用户邮箱
    email?: string
    // 手机号码
    mobile?: string
    // 用户性别，参见 SexEnum 枚举类
    sex?: number
    // 用户头像
    avatar?: string
    // 状态，参见 CommonStatusEnum 枚举类
    status: number
    // 最后登录 IP
    loginIp: string
    // 最后登录时间
    loginDate: string
    // 创建时间
    createTime: string
  }

  type SystemUserSaveReqVO = {
    // 用户编号
    id?: number
    // 用户账号
    username: string
    // 用户昵称
    nickname: string
    // 备注
    remark?: string
    // 部门编号
    deptId?: number
    // 岗位编号数组
    postIds?: number[]
    // 用户邮箱
    email?: string
    // 手机号码
    mobile?: string
    // 用户性别，参见 SexEnum 枚举类
    sex?: number
    // 用户头像
    avatar?: string
    // 密码
    password: string
  }

  type SystemUserSimpleRespVO = {
    // 用户编号
    id: number
    // 用户昵称
    nickname: string
    // 部门 ID
    deptId?: number
    // 部门名称
    deptName?: string
  }

  type SystemUserUpdatePasswordReqVO = {
    // 用户编号
    id: number
    // 密码
    password: string
  }

  type SystemUserUpdateStatusReqVO = {
    // 用户编号
    id: number
    // 状态，参见 CommonStatusEnum 枚举
    status: number
  }

  type SystemUserVO = {
    // 用户编号
    id: number
    // 用户昵称
    nickname: string
    // 用户头像
    avatar: string
    // 部门编号
    deptId: number
  }

  type updateNotifyMessageReadParams = {
    // 站内信 Ids
    ids: number[]
  }

  type uploadWxaOrderShippingInfoParams = {
    userType: number
  }

  type validateDeptListParams = {
    // 部门 Ids
    ids: number[]
  }

  type validateSmsCodeParams = {
    reqDTO: SmsCodeValidateReqDTO
  }

  type validateUserListParams = {
    // 用户 Ids
    ids: number[]
  }

  type validPostListParams = {
    // 岗位 Id 数组
    ids: number[]
  }
}
