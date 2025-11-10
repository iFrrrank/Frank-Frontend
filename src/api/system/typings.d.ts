declare namespace API {
  type approveOrDenyParams = {
    /** 响应类型 */
    response_type: string
    /** 客户端编号 */
    client_id: string
    /** 授权范围 */
    scope?: string
    /** 重定向 URI */
    redirect_uri: string
    /** 用户是否接受 */
    auto_approve: boolean
    state?: string
  }

  type AreaNodeRespVO = {
    /** 编号 */
    id: number
    /** 名字 */
    name: string
  }

  type AuthLoginReqVO = {
    /** 账号 */
    username: string
    /** 密码 */
    password: string
    /** 验证码，验证码开启时，需要传递 */
    captchaVerification: string
    /** 社交平台的类型，参见 SocialTypeEnum 枚举值 */
    socialType: number
    /** 授权码 */
    socialCode: string
    /** state */
    socialState: string
    socialCodeValid?: boolean
  }

  type AuthLoginRespVO = {
    /** 用户编号 */
    userId: number
    /** 访问令牌 */
    accessToken: string
    /** 刷新令牌 */
    refreshToken: string
    /** 过期时间 */
    expiresTime: string
  }

  type authorizeParams = {
    /** 客户端编号 */
    clientId: string
  }

  type AuthPermissionInfoRespVO = {
    user: UserVO
    /** 角色标识数组 */
    roles: string[]
    /** 操作权限数组 */
    permissions: string[]
    /** 菜单树 */
    menus: MenuVO[]
  }

  type AuthSmsLoginReqVO = {
    /** 手机号 */
    mobile: string
    /** 短信验证码 */
    code: string
  }

  type AuthSmsSendReqVO = {
    /** 手机号 */
    mobile: string
    /** 短信场景 */
    scene: number
  }

  type AuthSocialLoginReqVO = {
    /** 社交平台的类型，参见 UserSocialTypeEnum 枚举值 */
    type: number
    /** 授权码 */
    code: string
    /** state */
    state: string
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

  type checkTokenParams = {
    /** 访问令牌 */
    token: string
  }

  type Client = {
    /** 应用名 */
    name: string
    /** 应用图标 */
    logo: string
  }

  type CommonResultAuthLoginRespVO = {
    code?: number
    data?: AuthLoginRespVO
    msg?: string
  }

  type CommonResultAuthPermissionInfoRespVO = {
    code?: number
    data?: AuthPermissionInfoRespVO
    msg?: string
  }

  type CommonResultBoolean = {
    code?: number
    data?: boolean
    msg?: string
  }

  type CommonResultDeptRespVO = {
    code?: number
    data?: DeptRespVO
    msg?: string
  }

  type CommonResultDictDataRespVO = {
    code?: number
    data?: DictDataRespVO
    msg?: string
  }

  type CommonResultDictTypeRespVO = {
    code?: number
    data?: DictTypeRespVO
    msg?: string
  }

  type CommonResultListAreaNodeRespVO = {
    code?: number
    data?: AreaNodeRespVO[]
    msg?: string
  }

  type CommonResultListDeptRespVO = {
    code?: number
    data?: DeptRespVO[]
    msg?: string
  }

  type CommonResultListDeptSimpleRespVO = {
    code?: number
    data?: DeptSimpleRespVO[]
    msg?: string
  }

  type CommonResultListDictDataSimpleRespVO = {
    code?: number
    data?: DictDataSimpleRespVO[]
    msg?: string
  }

  type CommonResultListDictTypeSimpleRespVO = {
    code?: number
    data?: DictTypeSimpleRespVO[]
    msg?: string
  }

  type CommonResultListMailAccountSimpleRespVO = {
    code?: number
    data?: MailAccountSimpleRespVO[]
    msg?: string
  }

  type CommonResultListMailTemplateSimpleRespVO = {
    code?: number
    data?: MailTemplateSimpleRespVO[]
    msg?: string
  }

  type CommonResultListMenuRespVO = {
    code?: number
    data?: MenuRespVO[]
    msg?: string
  }

  type CommonResultListMenuSimpleRespVO = {
    code?: number
    data?: MenuSimpleRespVO[]
    msg?: string
  }

  type CommonResultListNotifyMessageRespVO = {
    code?: number
    data?: NotifyMessageRespVO[]
    msg?: string
  }

  type CommonResultListPostSimpleRespVO = {
    code?: number
    data?: PostSimpleRespVO[]
    msg?: string
  }

  type CommonResultListRoleRespVO = {
    code?: number
    data?: RoleRespVO[]
    msg?: string
  }

  type CommonResultListSmsChannelSimpleRespVO = {
    code?: number
    data?: SmsChannelSimpleRespVO[]
    msg?: string
  }

  type CommonResultListUserSimpleRespVO = {
    code?: number
    data?: UserSimpleRespVO[]
    msg?: string
  }

  type CommonResultLong = {
    code?: number
    data?: number
    msg?: string
  }

  type CommonResultMailAccountRespVO = {
    code?: number
    data?: MailAccountRespVO
    msg?: string
  }

  type CommonResultMailLogRespVO = {
    code?: number
    data?: MailLogRespVO
    msg?: string
  }

  type CommonResultMailTemplateRespVO = {
    code?: number
    data?: MailTemplateRespVO
    msg?: string
  }

  type CommonResultMenuRespVO = {
    code?: number
    data?: MenuRespVO
    msg?: string
  }

  type CommonResultNoticeRespVO = {
    code?: number
    data?: NoticeRespVO
    msg?: string
  }

  type CommonResultNotifyMessageRespVO = {
    code?: number
    data?: NotifyMessageRespVO
    msg?: string
  }

  type CommonResultNotifyTemplateRespVO = {
    code?: number
    data?: NotifyTemplateRespVO
    msg?: string
  }

  type CommonResultOAuth2ClientRespVO = {
    code?: number
    data?: OAuth2ClientRespVO
    msg?: string
  }

  type CommonResultOAuth2OpenAccessTokenRespVO = {
    code?: number
    data?: OAuth2OpenAccessTokenRespVO
    msg?: string
  }

  type CommonResultOAuth2OpenAuthorizeInfoRespVO = {
    code?: number
    data?: OAuth2OpenAuthorizeInfoRespVO
    msg?: string
  }

  type CommonResultOAuth2OpenCheckTokenRespVO = {
    code?: number
    data?: OAuth2OpenCheckTokenRespVO
    msg?: string
  }

  type CommonResultOAuth2UserInfoRespVO = {
    code?: number
    data?: OAuth2UserInfoRespVO
    msg?: string
  }

  type CommonResultPageResultDictDataRespVO = {
    code?: number
    data?: PageResultDictDataRespVO
    msg?: string
  }

  type CommonResultPageResultDictTypeRespVO = {
    code?: number
    data?: PageResultDictTypeRespVO
    msg?: string
  }

  type CommonResultPageResultLoginLogRespVO = {
    code?: number
    data?: PageResultLoginLogRespVO
    msg?: string
  }

  type CommonResultPageResultMailAccountRespVO = {
    code?: number
    data?: PageResultMailAccountRespVO
    msg?: string
  }

  type CommonResultPageResultMailLogRespVO = {
    code?: number
    data?: PageResultMailLogRespVO
    msg?: string
  }

  type CommonResultPageResultMailTemplateRespVO = {
    code?: number
    data?: PageResultMailTemplateRespVO
    msg?: string
  }

  type CommonResultPageResultNoticeRespVO = {
    code?: number
    data?: PageResultNoticeRespVO
    msg?: string
  }

  type CommonResultPageResultNotifyMessageRespVO = {
    code?: number
    data?: PageResultNotifyMessageRespVO
    msg?: string
  }

  type CommonResultPageResultNotifyTemplateRespVO = {
    code?: number
    data?: PageResultNotifyTemplateRespVO
    msg?: string
  }

  type CommonResultPageResultOAuth2AccessTokenRespVO = {
    code?: number
    data?: PageResultOAuth2AccessTokenRespVO
    msg?: string
  }

  type CommonResultPageResultOAuth2ClientRespVO = {
    code?: number
    data?: PageResultOAuth2ClientRespVO
    msg?: string
  }

  type CommonResultPageResultOperateLogRespVO = {
    code?: number
    data?: PageResultOperateLogRespVO
    msg?: string
  }

  type CommonResultPageResultPostRespVO = {
    code?: number
    data?: PageResultPostRespVO
    msg?: string
  }

  type CommonResultPageResultRoleRespVO = {
    code?: number
    data?: PageResultRoleRespVO
    msg?: string
  }

  type CommonResultPageResultSmsChannelRespVO = {
    code?: number
    data?: PageResultSmsChannelRespVO
    msg?: string
  }

  type CommonResultPageResultSmsLogRespVO = {
    code?: number
    data?: PageResultSmsLogRespVO
    msg?: string
  }

  type CommonResultPageResultSmsTemplateRespVO = {
    code?: number
    data?: PageResultSmsTemplateRespVO
    msg?: string
  }

  type CommonResultPageResultSocialClientRespVO = {
    code?: number
    data?: PageResultSocialClientRespVO
    msg?: string
  }

  type CommonResultPageResultSocialUserRespVO = {
    code?: number
    data?: PageResultSocialUserRespVO
    msg?: string
  }

  type CommonResultPageResultUserRespVO = {
    code?: number
    data?: PageResultUserRespVO
    msg?: string
  }

  type CommonResultPostRespVO = {
    code?: number
    data?: PostRespVO
    msg?: string
  }

  type CommonResultRoleRespVO = {
    code?: number
    data?: RoleRespVO
    msg?: string
  }

  type CommonResultSetLong = {
    code?: number
    data?: number[]
    msg?: string
  }

  type CommonResultSmsChannelRespVO = {
    code?: number
    data?: SmsChannelRespVO
    msg?: string
  }

  type CommonResultSmsTemplateRespVO = {
    code?: number
    data?: SmsTemplateRespVO
    msg?: string
  }

  type CommonResultSocialClientRespVO = {
    code?: number
    data?: SocialClientRespVO
    msg?: string
  }

  type CommonResultSocialUserRespVO = {
    code?: number
    data?: SocialUserRespVO
    msg?: string
  }

  type CommonResultString = {
    code?: number
    data?: string
    msg?: string
  }

  type CommonResultUserImportRespVO = {
    code?: number
    data?: UserImportRespVO
    msg?: string
  }

  type CommonResultUserProfileRespVO = {
    code?: number
    data?: UserProfileRespVO
    msg?: string
  }

  type CommonResultUserRespVO = {
    code?: number
    data?: UserRespVO
    msg?: string
  }

  type deleteAccessTokenParams = {
    /** 访问令牌 */
    accessToken: string
  }

  type deleteDeptParams = {
    /** 编号 */
    id: number
  }

  type deleteDictDataParams = {
    /** 编号 */
    id: number
  }

  type deleteDictTypeParams = {
    /** 编号 */
    id: number
  }

  type deleteMailAccountParams = {
    /** 编号 */
    id: number
  }

  type deleteMailTemplateParams = {
    /** 邮件模板 Id */
    id: number
  }

  type deleteMenuParams = {
    /** 菜单编号 */
    id: number
  }

  type deleteNoticeParams = {
    /** 编号 */
    id: number
  }

  type deleteNotifyTemplateParams = {
    /** 编号 */
    id: number
  }

  type deleteOAuth2ClientParams = {
    /** 编号 */
    id: number
  }

  type deletePostParams = {
    id: number
  }

  type deleteRoleParams = {
    /** 角色 Id */
    id: number
  }

  type deleteSmsChannelParams = {
    /** 编号 */
    id: number
  }

  type deleteSmsTemplateParams = {
    /** 编号 */
    id: number
  }

  type deleteSocialClientParams = {
    /** 编号 */
    id: number
  }

  type deleteUserParams = {
    /** 编号 */
    id: number
  }

  type Dept = {
    /** 部门编号 */
    id: number
    /** 部门名称 */
    name: string
  }

  type DeptRespVO = {
    /** 部门编号 */
    id?: number
    /** 部门名称 */
    name: string
    /** 父部门 ID */
    parentId?: number
    /** 显示顺序 */
    sort: number
    /** 负责人的用户编号 */
    leaderUserId?: number
    /** 联系电话 */
    phone?: string
    /** 邮箱 */
    email?: string
    /** 状态,见 CommonStatusEnum 枚举 */
    status: number
    /** 创建时间 */
    createTime: string
  }

  type DeptSaveReqVO = {
    /** 部门编号 */
    id?: number
    /** 部门名称 */
    name: string
    /** 父部门 ID */
    parentId?: number
    /** 显示顺序 */
    sort: number
    /** 负责人的用户编号 */
    leaderUserId?: number
    /** 联系电话 */
    phone?: string
    /** 邮箱 */
    email?: string
    /** 状态,见 CommonStatusEnum 枚举 */
    status: number
  }

  type DeptSimpleRespVO = {
    /** 部门编号 */
    id: number
    /** 部门名称 */
    name: string
    /** 父部门 ID */
    parentId: number
  }

  type DictDataPageReqVO = {
    /** 页码，从 1 开始 */
    pageNo: number
    /** 每页条数，最大值为 100 */
    pageSize: number
    /** 字典标签 */
    label?: string
    /** 字典类型，模糊匹配 */
    dictType?: string
    /** 展示状态，参见 CommonStatusEnum 枚举类 */
    status?: number
  }

  type DictDataRespVO = {
    /** 字典数据编号 */
    id: number
    /** 显示顺序 */
    sort: number
    /** 字典标签 */
    label: string
    /** 字典值 */
    value: string
    /** 字典类型 */
    dictType: string
    /** 状态,见 CommonStatusEnum 枚举 */
    status: number
    /** 颜色类型,default、primary、success、info、warning、danger */
    colorType?: string
    /** css 样式 */
    cssClass?: string
    /** 备注 */
    remark?: string
    /** 创建时间 */
    createTime: string
  }

  type DictDataSaveReqVO = {
    /** 字典数据编号 */
    id?: number
    /** 显示顺序 */
    sort: number
    /** 字典标签 */
    label: string
    /** 字典值 */
    value: string
    /** 字典类型 */
    dictType: string
    /** 状态,见 CommonStatusEnum 枚举 */
    status: number
    /** 颜色类型,default、primary、success、info、warning、danger */
    colorType?: string
    /** css 样式 */
    cssClass?: string
    /** 备注 */
    remark?: string
  }

  type DictDataSimpleRespVO = {
    /** 字典类型 */
    dictType: string
    /** 字典键值 */
    value: string
    /** 字典标签 */
    label: string
    /** 颜色类型，default、primary、success、info、warning、danger */
    colorType?: string
    /** css 样式 */
    cssClass?: string
  }

  type DictTypePageReqVO = {
    /** 页码，从 1 开始 */
    pageNo: number
    /** 每页条数，最大值为 100 */
    pageSize: number
    /** 字典类型名称，模糊匹配 */
    name?: string
    /** 字典类型，模糊匹配 */
    type?: string
    /** 展示状态，参见 CommonStatusEnum 枚举类 */
    status?: number
    /** 创建时间 */
    createTime?: string[]
  }

  type DictTypeRespVO = {
    /** 字典类型编号 */
    id: number
    /** 字典名称 */
    name: string
    /** 字典类型 */
    type: string
    /** 状态，参见 CommonStatusEnum 枚举类 */
    status: number
    /** 备注 */
    remark?: string
    /** 创建时间 */
    createTime: string
  }

  type DictTypeSaveReqVO = {
    /** 字典类型编号 */
    id?: number
    /** 字典名称 */
    name: string
    /** 字典类型 */
    type: string
    /** 状态，参见 CommonStatusEnum 枚举类 */
    status: number
    /** 备注 */
    remark?: string
  }

  type DictTypeSimpleRespVO = {
    /** 字典类型编号 */
    id: number
    /** 字典类型名称 */
    name: string
    /** 字典类型 */
    type: string
  }

  type export1Params = {
    reqVO: PostPageReqVO
  }

  type export2Params = {
    exportReqVO: DictTypePageReqVO
  }

  type export3Params = {
    exportReqVO: DictDataPageReqVO
  }

  type exportLoginLogParams = {
    exportReqVO: LoginLogPageReqVO
  }

  type exportOperateLogParams = {
    exportReqVO: OperateLogPageReqVO
  }

  type exportSmsLogExcelParams = {
    exportReqVO: SmsLogPageReqVO
  }

  type exportSmsTemplateExcelParams = {
    exportReqVO: SmsTemplatePageReqVO
  }

  type exportUserListParams = {
    exportReqVO: UserPageReqVO
  }

  type exportUsingGETParams = {
    exportReqVO: RolePageReqVO
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
    reqVO: OAuth2AccessTokenPageReqVO
  }

  type getAreaByIpParams = {
    /** IP */
    ip: string
  }

  type getDeptListParams = {
    /** 部门名称，模糊匹配 */
    name?: string
    /** 展示状态，参见 CommonStatusEnum 枚举类 */
    status?: string
  }

  type getDeptParams = {
    /** 编号 */
    id: number
  }

  type getDictDataParams = {
    /** 字典数据 Id */
    id: number
  }

  type getDictTypePageParams = {
    pageReqVO: DictDataPageReqVO
  }

  type getDictTypeParams = {
    /** 编号 */
    id: number
  }

  type getLoginLogPageParams = {
    pageReqVO: LoginLogPageReqVO
  }

  type getMailAccountPageParams = {
    pageReqVO: MailAccountPageReqVO
  }

  type getMailAccountParams = {
    /** 编号 */
    id: number
  }

  type getMailLogPageParams = {
    pageVO: MailLogPageReqVO
  }

  type getMailTemplate1Params = {
    /** 编号 */
    id: number
  }

  type getMailTemplatePageParams = {
    pageReqVO: MailTemplatePageReqVO
  }

  type getMailTemplateParams = {
    /** 邮件模板 Id */
    id: number
  }

  type getMenuListParams = {
    /** 菜单名称，模糊匹配 */
    name?: string
    /** 展示状态，参见 CommonStatusEnum 枚举类 */
    status?: string
  }

  type getMenuParams = {
    id: number
  }

  type getMyMyNotifyMessagePageParams = {
    pageVO: NotifyMessageMyPageReqVO
  }

  type getNoticePageParams = {
    pageReqVO: NoticePageReqVO
  }

  type getNoticeParams = {
    /** 编号 */
    id: number
  }

  type getNotifyMessagePageParams = {
    pageVO: NotifyMessagePageReqVO
  }

  type getNotifyMessageParams = {
    /** 站内信 Id */
    id: number
  }

  type getNotifyTemplatePageParams = {
    pageVO: NotifyTemplatePageReqVO
  }

  type getNotifyTemplateParams = {
    /** 编号 */
    id: number
  }

  type getOAuth2ClientPageParams = {
    pageVO: OAuth2ClientPageReqVO
  }

  type getOAuth2ClientParams = {
    /** 编号 */
    id: number
  }

  type getPostPageParams = {
    pageReqVO: PostPageReqVO
  }

  type getPostParams = {
    /** 岗位编号 */
    id: number
  }

  type getRoleMenuListParams = {
    /** 角色 Id */
    roleId: number
  }

  type getRolePageParams = {
    /** 角色名称，模糊匹配 */
    name?: string
    /** 角色标识，模糊匹配 */
    code?: string
    /** 展示状态，参见 CommonStatusEnum 枚举类 */
    status?: string
    /** 创建时间 */
    createTime?: string
    /** 页码，从 1 开始 */
    pageNo: string
    /** 每页条数，最大值为 100 */
    pageSize: string
  }

  type getRoleParams = {
    id: number
  }

  type getSmsChannelPageParams = {
    pageVO: SmsChannelPageReqVO
  }

  type getSmsChannelParams = {
    /** 编号 */
    id: number
  }

  type getSmsLogPageParams = {
    pageReqVO: SmsLogPageReqVO
  }

  type getSmsTemplatePageParams = {
    pageVO: SmsTemplatePageReqVO
  }

  type getSmsTemplateParams = {
    /** 编号 */
    id: number
  }

  type getSocialClientPageParams = {
    pageVO: SocialClientPageReqVO
  }

  type getSocialClientParams = {
    /** 编号 */
    id: number
  }

  type getSocialUserPageParams = {
    pageVO: SocialUserPageReqVO
  }

  type getSocialUserParams = {
    /** 编号 */
    id: number
  }

  type getUnreadNotifyMessageListParams = {
    /** 10 */
    size?: number
  }

  type getUserPageParams = {
    pageReqVO: UserPageReqVO
  }

  type getUserParams = {
    /** 编号 */
    id: number
  }

  type importExcelParams = {
    /** 是否支持更新，默认为 false */
    updateSupport?: boolean
    /** Excel 文件 */
    file: any
  }

  type KeyValueStringBoolean = {
    key?: string
    value?: boolean
  }

  type listAdminRolesParams = {
    /** 用户 Id */
    userId: number
  }

  type LoginLogPageReqVO = {
    /** 页码，从 1 开始 */
    pageNo: number
    /** 每页条数，最大值为 100 */
    pageSize: number
    /** 用户 IP，模拟匹配 */
    userIp?: string
    /** 用户账号，模拟匹配 */
    username?: string
    /** 操作状态 */
    status?: boolean
    /** 登录时间 */
    createTime?: string[]
  }

  type LoginLogRespVO = {
    /** 日志编号 */
    id: number
    /** 日志类型，参见 LoginLogTypeEnum 枚举类 */
    logType: number
    /** 用户编号 */
    userId?: number
    /** 用户类型，参见 UserTypeEnum 枚举 */
    userType: number
    /** 链路追踪编号 */
    traceId?: string
    /** 用户账号 */
    username: string
    /** 登录结果，参见 LoginResultEnum 枚举类 */
    result: number
    /** 用户 IP */
    userIp: string
    /** 浏览器 UserAgent */
    userAgent?: string
    /** 登录时间 */
    createTime: string
  }

  type MailAccountPageReqVO = {
    /** 页码，从 1 开始 */
    pageNo: number
    /** 每页条数，最大值为 100 */
    pageSize: number
    /** 邮箱 */
    mail: string
    /** 用户名 */
    username: string
  }

  type MailAccountRespVO = {
    /** 编号 */
    id: number
    /** 邮箱 */
    mail: string
    /** 用户名 */
    username: string
    /** 密码 */
    password: string
    /** SMTP 服务器域名 */
    host: string
    /** SMTP 服务器端口 */
    port: number
    /** 是否开启 ssl */
    sslEnable: boolean
    /** 是否开启 starttls */
    starttlsEnable: boolean
    /** 创建时间 */
    createTime: string
  }

  type MailAccountSaveReqVO = {
    /** 编号 */
    id?: number
    /** 邮箱 */
    mail: string
    /** 用户名 */
    username: string
    /** 密码 */
    password: string
    /** SMTP 服务器域名 */
    host: string
    /** SMTP 服务器端口 */
    port: number
    /** 是否开启 ssl */
    sslEnable: boolean
    /** 是否开启 starttls */
    starttlsEnable: boolean
  }

  type MailAccountSimpleRespVO = {
    /** 邮箱编号 */
    id: number
    /** 邮箱 */
    mail: string
  }

  type MailLogPageReqVO = {
    /** 页码，从 1 开始 */
    pageNo: number
    /** 每页条数，最大值为 100 */
    pageSize: number
    /** 用户编号 */
    userId?: number
    /** 用户类型，参见 UserTypeEnum 枚举 */
    userType?: number
    /** 接收邮箱地址，模糊匹配 */
    toMail?: string
    /** 邮箱账号编号 */
    accountId?: number
    /** 模板编号 */
    templateId?: number
    /** 发送状态，参见 MailSendStatusEnum 枚举 */
    sendStatus?: number
    /** 发送时间 */
    sendTime?: string[]
  }

  type MailLogRespVO = {
    /** 编号 */
    id: number
    /** 用户编号 */
    userId?: number
    /** 用户类型，参见 UserTypeEnum 枚举 */
    userType?: string
    /** 接收邮箱地址 */
    toMail: string
    /** 邮箱账号编号 */
    accountId: number
    /** 发送邮箱地址 */
    fromMail: string
    /** 模板编号 */
    templateId: number
    /** 模板编码 */
    templateCode: string
    /** 模版发送人名称 */
    templateNickname?: string
    /** 邮件标题 */
    templateTitle: string
    /** 邮件内容 */
    templateContent: string
    /** 邮件参数 */
    templateParams: Record<string, any>
    /** 发送状态，参见 MailSendStatusEnum 枚举 */
    sendStatus: string
    /** 发送时间 */
    sendTime?: string
    /** 发送返回的消息 ID */
    sendMessageId?: string
    /** 发送异常 */
    sendException?: string
    /** 创建时间 */
    createTime: string
  }

  type MailTemplatePageReqVO = {
    /** 页码，从 1 开始 */
    pageNo: number
    /** 每页条数，最大值为 100 */
    pageSize: number
    /** 状态，参见 CommonStatusEnum 枚举 */
    status?: number
    /** 标识，模糊匹配 */
    code?: string
    /** 名称，模糊匹配 */
    name?: string
    /** 账号编号 */
    accountId?: number
    /** 创建时间 */
    createTime?: string[]
  }

  type MailTemplateRespVO = {
    /** 编号 */
    id: number
    /** 模版名称 */
    name: string
    /** 模版编号 */
    code: string
    /** 发送的邮箱账号编号 */
    accountId: number
    /** 发送人名称 */
    nickname?: string
    /** 标题 */
    title: string
    /** 内容 */
    content: string
    /** 参数数组 */
    params?: string[]
    /** 状态，参见 CommonStatusEnum 枚举 */
    status: number
    /** 备注 */
    remark?: string
    /** 创建时间 */
    createTime: string
  }

  type MailTemplateSaveReqVO = {
    /** 编号 */
    id?: number
    /** 模版名称 */
    name: string
    /** 模版编号 */
    code: string
    /** 发送的邮箱账号编号 */
    accountId: number
    /** 发送人名称 */
    nickname?: string
    /** 标题 */
    title: string
    /** 内容 */
    content: string
    /** 状态，参见 CommonStatusEnum 枚举 */
    status: number
    /** 备注 */
    remark?: string
  }

  type MailTemplateSendReqVO = {
    /** 接收邮箱 */
    mail: string
    /** 模板编码 */
    templateCode: string
    /** 模板参数 */
    templateParams?: Record<string, any>
  }

  type MailTemplateSimpleRespVO = {
    /** 模版编号 */
    id: number
    /** 模版名字 */
    name: string
  }

  type MenuRespVO = {
    /** 菜单编号 */
    id: number
    /** 菜单名称 */
    name: string
    /** 权限标识,仅菜单类型为按钮时，才需要传递 */
    permission?: string
    /** 类型，参见 MenuTypeEnum 枚举类 */
    type: number
    /** 显示顺序 */
    sort: number
    /** 父菜单 ID */
    parentId: number
    /** 路由地址,仅菜单类型为菜单或者目录时，才需要传 */
    path?: string
    /** 菜单图标,仅菜单类型为菜单或者目录时，才需要传 */
    icon?: string
    /** 组件路径,仅菜单类型为菜单时，才需要传 */
    component?: string
    /** 组件名 */
    componentName?: string
    /** 状态,见 CommonStatusEnum 枚举 */
    status: number
    /** 是否可见 */
    visible?: boolean
    /** 是否缓存 */
    keepAlive?: boolean
    /** 是否总是显示 */
    alwaysShow?: boolean
    /** 创建时间 */
    createTime: string
  }

  type MenuSaveVO = {
    /** 菜单编号 */
    id?: number
    /** 菜单名称 */
    name: string
    /** 权限标识,仅菜单类型为按钮时，才需要传递 */
    permission?: string
    /** 类型，参见 MenuTypeEnum 枚举类 */
    type: number
    /** 显示顺序 */
    sort: number
    /** 父菜单 ID */
    parentId: number
    /** 路由地址,仅菜单类型为菜单或者目录时，才需要传 */
    path?: string
    /** 菜单图标,仅菜单类型为菜单或者目录时，才需要传 */
    icon?: string
    /** 组件路径,仅菜单类型为菜单时，才需要传 */
    component?: string
    /** 组件名 */
    componentName?: string
    /** 状态,见 CommonStatusEnum 枚举 */
    status: number
    /** 是否可见 */
    visible?: boolean
    /** 是否缓存 */
    keepAlive?: boolean
    /** 是否总是显示 */
    alwaysShow?: boolean
  }

  type MenuSimpleRespVO = {
    /** 菜单编号 */
    id: number
    /** 菜单名称 */
    name: string
    /** 父菜单 ID */
    parentId: number
    /** 类型，参见 MenuTypeEnum 枚举类 */
    type: number
  }

  type MenuVO = {
    /** 菜单名称 */
    id: number
    /** 父菜单 ID */
    parentId: number
    /** 菜单名称 */
    name: string
    /** 路由地址,仅菜单类型为菜单或者目录时，才需要传 */
    path?: string
    /** 组件路径,仅菜单类型为菜单时，才需要传 */
    component?: string
    /** 组件名 */
    componentName?: string
    /** 菜单图标,仅菜单类型为菜单或者目录时，才需要传 */
    icon?: string
    /** 是否可见 */
    visible: boolean
    /** 是否缓存 */
    keepAlive: boolean
    /** 是否总是显示 */
    alwaysShow?: boolean
    children?: MenuVO[]
  }

  type NoticePageReqVO = {
    /** 页码，从 1 开始 */
    pageNo: number
    /** 每页条数，最大值为 100 */
    pageSize: number
    /** 通知公告名称，模糊匹配 */
    title?: string
    /** 展示状态，参见 CommonStatusEnum 枚举类 */
    status?: number
  }

  type NoticeRespVO = {
    /** 通知公告序号 */
    id: number
    /** 公告标题 */
    title: string
    /** 公告类型 */
    type: number
    /** 公告内容 */
    content: string
    /** 状态，参见 CommonStatusEnum 枚举类 */
    status: number
    /** 创建时间 */
    createTime: string
  }

  type NoticeSaveReqVO = {
    /** 岗位公告编号 */
    id?: number
    /** 公告标题 */
    title: string
    /** 公告类型 */
    type: number
    /** 公告内容 */
    content: string
    /** 状态，参见 CommonStatusEnum 枚举类 */
    status: number
  }

  type NotifyMessageMyPageReqVO = {
    /** 页码，从 1 开始 */
    pageNo: number
    /** 每页条数，最大值为 100 */
    pageSize: number
    /** 是否已读 */
    readStatus?: boolean
    /** 创建时间 */
    createTime?: string[]
  }

  type NotifyMessagePageReqVO = {
    /** 页码，从 1 开始 */
    pageNo: number
    /** 每页条数，最大值为 100 */
    pageSize: number
    /** 用户编号 */
    userId?: number
    /** 用户类型 */
    userType?: number
    /** 模板编码 */
    templateCode?: string
    /** 模版类型 */
    templateType?: number
    /** 创建时间 */
    createTime?: string[]
  }

  type NotifyMessageRespVO = {
    /** ID */
    id: number
    /** 用户编号 */
    userId: number
    /** 用户类型，参见 UserTypeEnum 枚举 */
    userType: string
    /** 模版编号 */
    templateId: number
    /** 模板编码 */
    templateCode: string
    /** 模版发送人名称 */
    templateNickname: string
    /** 模版内容 */
    templateContent: string
    /** 模版类型 */
    templateType: number
    /** 模版参数 */
    templateParams: Record<string, any>
    /** 是否已读 */
    readStatus: boolean
    /** 阅读时间 */
    readTime?: string
    /** 创建时间 */
    createTime: string
  }

  type NotifyTemplatePageReqVO = {
    /** 页码，从 1 开始 */
    pageNo: number
    /** 每页条数，最大值为 100 */
    pageSize: number
    /** 模版编码 */
    code?: string
    /** 模版名称 */
    name?: string
    /** 状态，参见 CommonStatusEnum 枚举类 */
    status?: number
    /** 创建时间 */
    createTime?: string[]
  }

  type NotifyTemplateRespVO = {
    /** ID */
    id: number
    /** 模版名称 */
    name: string
    /** 模版编码 */
    code: string
    /** 模版类型，对应 system_notify_template_type 字典 */
    type: number
    /** 发送人名称 */
    nickname: string
    /** 模版内容 */
    content: string
    /** 参数数组 */
    params?: string[]
    /** 状态，参见 CommonStatusEnum 枚举 */
    status: number
    /** 备注 */
    remark?: string
    /** 创建时间 */
    createTime: string
  }

  type NotifyTemplateSaveReqVO = {
    /** ID */
    id?: number
    /** 模版名称 */
    name: string
    /** 模版编码 */
    code: string
    /** 模版类型，对应 system_notify_template_type 字典 */
    type: number
    /** 发送人名称 */
    nickname: string
    /** 模版内容 */
    content: string
    /** 状态，参见 CommonStatusEnum 枚举 */
    status: number
    /** 备注 */
    remark?: string
  }

  type NotifyTemplateSendReqVO = {
    /** 用户id */
    userId: number
    /** 用户类型 */
    userType: number
    /** 模板编码 */
    templateCode: string
    /** 模板参数 */
    templateParams?: Record<string, any>
  }

  type OAuth2AccessTokenPageReqVO = {
    /** 页码，从 1 开始 */
    pageNo: number
    /** 每页条数，最大值为 100 */
    pageSize: number
    /** 用户编号 */
    userId: number
    /** 用户类型，参见 UserTypeEnum 枚举 */
    userType: number
    /** 客户端编号 */
    clientId: string
  }

  type OAuth2AccessTokenRespVO = {
    /** 编号 */
    id: number
    /** 访问令牌 */
    accessToken: string
    /** 刷新令牌 */
    refreshToken: string
    /** 用户编号 */
    userId: number
    /** 用户类型，参见 UserTypeEnum 枚举 */
    userType: number
    /** 客户端编号 */
    clientId: string
    /** 创建时间 */
    createTime: string
    /** 过期时间 */
    expiresTime: string
  }

  type OAuth2ClientPageReqVO = {
    /** 页码，从 1 开始 */
    pageNo: number
    /** 每页条数，最大值为 100 */
    pageSize: number
    /** 应用名，模糊匹配 */
    name?: string
    /** 状态，参见 CommonStatusEnum 枚举 */
    status?: number
  }

  type OAuth2ClientRespVO = {
    /** 编号 */
    id: number
    /** 客户端编号 */
    clientId: string
    /** 客户端密钥 */
    secret: string
    /** 应用名 */
    name: string
    /** 应用图标 */
    logo: string
    /** 应用描述 */
    description?: string
    /** 状态，参见 CommonStatusEnum 枚举 */
    status: number
    /** 访问令牌的有效期 */
    accessTokenValiditySeconds: number
    /** 刷新令牌的有效期 */
    refreshTokenValiditySeconds: number
    /** 可重定向的 URI 地址 */
    redirectUris: string[]
    /** 授权类型，参见 OAuth2GrantTypeEnum 枚举 */
    authorizedGrantTypes: string[]
    /** 授权范围 */
    scopes?: string[]
    /** 自动通过的授权范围 */
    autoApproveScopes?: string[]
    /** 权限 */
    authorities?: string[]
    /** 资源 */
    resourceIds?: string[]
    /** 附加信息 */
    additionalInformation?: string
    /** 创建时间 */
    createTime: string
  }

  type OAuth2ClientSaveReqVO = {
    /** 编号 */
    id?: number
    /** 客户端编号 */
    clientId: string
    /** 客户端密钥 */
    secret: string
    /** 应用名 */
    name: string
    /** 应用图标 */
    logo: string
    /** 应用描述 */
    description?: string
    /** 状态，参见 CommonStatusEnum 枚举 */
    status: number
    /** 访问令牌的有效期 */
    accessTokenValiditySeconds: number
    /** 刷新令牌的有效期 */
    refreshTokenValiditySeconds: number
    /** 可重定向的 URI 地址 */
    redirectUris: string[]
    /** 授权类型，参见 OAuth2GrantTypeEnum 枚举 */
    authorizedGrantTypes: string[]
    /** 授权范围 */
    scopes?: string[]
    /** 自动通过的授权范围 */
    autoApproveScopes?: string[]
    /** 权限 */
    authorities?: string[]
    /** 资源 */
    resourceIds?: string[]
    /** 附加信息 */
    additionalInformation?: string
    additionalInformationJson?: boolean
  }

  type OAuth2OpenAccessTokenRespVO = {
    /** 授权范围,如果多个授权范围，使用空格分隔 */
    scope?: string
    /** 访问令牌 */
    access_token: string
    /** 刷新令牌 */
    refresh_token: string
    /** 令牌类型 */
    token_type: string
    /** 过期时间,单位：秒 */
    expires_in: number
  }

  type OAuth2OpenAuthorizeInfoRespVO = {
    client?: Client
    /** scope 的选中信息,使用 List 保证有序性，Key 是 scope，Value 为是否选中 */
    scopes: KeyValueStringBoolean[]
  }

  type OAuth2OpenCheckTokenRespVO = {
    /** 授权范围 */
    scopes: string[]
    /** 过期时间，时间戳 / 1000，即单位：秒 */
    exp: number
    /** 用户编号 */
    user_id: number
    /** 用户类型，参见 UserTypeEnum 枚举 */
    user_type: number
    /** 租户编号 */
    tenant_id: number
    /** 客户端编号 */
    client_id: string
    /** 访问令牌 */
    access_token: string
  }

  type OAuth2UserInfoRespVO = {
    /** 用户编号 */
    id: number
    /** 用户账号 */
    username: string
    /** 用户昵称 */
    nickname: string
    /** 用户邮箱 */
    email?: string
    /** 手机号码 */
    mobile?: string
    /** 用户性别，参见 SexEnum 枚举类 */
    sex?: number
    /** 用户头像 */
    avatar?: string
    dept?: Dept
    posts?: Post[]
  }

  type OAuth2UserUpdateReqVO = {
    /** 用户昵称 */
    nickname: string
    /** 用户邮箱 */
    email?: string
    /** 手机号码 */
    mobile?: string
    /** 用户性别，参见 SexEnum 枚举类 */
    sex?: number
  }

  type OperateLogPageReqVO = {
    /** 页码，从 1 开始 */
    pageNo: number
    /** 每页条数，最大值为 100 */
    pageSize: number
    /** 用户编号 */
    userId?: number
    /** 操作模块业务编号 */
    bizId?: number
    /** 操作模块，模拟匹配 */
    type?: string
    /** 操作名，模拟匹配 */
    subType?: string
    /** 操作明细，模拟匹配 */
    action?: string
    /** 开始时间 */
    createTime?: string[]
  }

  type OperateLogRespVO = {
    /** 日志编号 */
    id: number
    /** 链路追踪编号 */
    traceId: string
    /** 用户编号 */
    userId: number
    /** 用户昵称 */
    userName: string
    /** 用户类型 */
    userType: string
    /** 操作模块类型 */
    type: string
    /** 操作名 */
    subType: string
    /** 操作模块业务编号 */
    bizId: number
    /** 操作明细 */
    action?: string
    /** 拓展字段 */
    extra?: string
    /** 请求方法名 */
    requestMethod: string
    /** 请求地址 */
    requestUrl: string
    /** 用户 IP */
    userIp: string
    /** 浏览器 UserAgent */
    userAgent: string
    /** 创建时间 */
    createTime: string
    /** 操作类型 */
    operateType: number
    /** Java 请求方法 */
    javaMethod: string
    /** Java 请求参数 */
    javaMethodArgs: string
    /** 执行时长，单位：毫秒 */
    duration: number
    /** 结果码 */
    resultCode: number
    /** 结果提示 */
    resultMsg: string
    transMap?: Record<string, any>
  }

  type pageDictTypesParams = {
    pageReqVO: DictTypePageReqVO
  }

  type pageOperateLogParams = {
    pageReqVO: OperateLogPageReqVO
  }

  type PageResultDictDataRespVO = {
    /** 数据 */
    list: DictDataRespVO[]
    /** 总量 */
    total: number
  }

  type PageResultDictTypeRespVO = {
    /** 数据 */
    list: DictTypeRespVO[]
    /** 总量 */
    total: number
  }

  type PageResultLoginLogRespVO = {
    /** 数据 */
    list: LoginLogRespVO[]
    /** 总量 */
    total: number
  }

  type PageResultMailAccountRespVO = {
    /** 数据 */
    list: MailAccountRespVO[]
    /** 总量 */
    total: number
  }

  type PageResultMailLogRespVO = {
    /** 数据 */
    list: MailLogRespVO[]
    /** 总量 */
    total: number
  }

  type PageResultMailTemplateRespVO = {
    /** 数据 */
    list: MailTemplateRespVO[]
    /** 总量 */
    total: number
  }

  type PageResultNoticeRespVO = {
    /** 数据 */
    list: NoticeRespVO[]
    /** 总量 */
    total: number
  }

  type PageResultNotifyMessageRespVO = {
    /** 数据 */
    list: NotifyMessageRespVO[]
    /** 总量 */
    total: number
  }

  type PageResultNotifyTemplateRespVO = {
    /** 数据 */
    list: NotifyTemplateRespVO[]
    /** 总量 */
    total: number
  }

  type PageResultOAuth2AccessTokenRespVO = {
    /** 数据 */
    list: OAuth2AccessTokenRespVO[]
    /** 总量 */
    total: number
  }

  type PageResultOAuth2ClientRespVO = {
    /** 数据 */
    list: OAuth2ClientRespVO[]
    /** 总量 */
    total: number
  }

  type PageResultOperateLogRespVO = {
    /** 数据 */
    list: OperateLogRespVO[]
    /** 总量 */
    total: number
  }

  type PageResultPostRespVO = {
    /** 数据 */
    list: PostRespVO[]
    /** 总量 */
    total: number
  }

  type PageResultRoleRespVO = {
    /** 数据 */
    list: RoleRespVO[]
    /** 总量 */
    total: number
  }

  type PageResultSmsChannelRespVO = {
    /** 数据 */
    list: SmsChannelRespVO[]
    /** 总量 */
    total: number
  }

  type PageResultSmsLogRespVO = {
    /** 数据 */
    list: SmsLogRespVO[]
    /** 总量 */
    total: number
  }

  type PageResultSmsTemplateRespVO = {
    /** 数据 */
    list: SmsTemplateRespVO[]
    /** 总量 */
    total: number
  }

  type PageResultSocialClientRespVO = {
    /** 数据 */
    list: SocialClientRespVO[]
    /** 总量 */
    total: number
  }

  type PageResultSocialUserRespVO = {
    /** 数据 */
    list: SocialUserRespVO[]
    /** 总量 */
    total: number
  }

  type PageResultUserRespVO = {
    /** 数据 */
    list: UserRespVO[]
    /** 总量 */
    total: number
  }

  type PermissionAssignRoleDataScopeReqVO = {
    /** 角色编号 */
    roleId: number
    /** 数据范围，参见 DataScopeEnum 枚举类 */
    dataScope: number
    /** 部门编号列表，只有范围类型为 DEPT_CUSTOM 时，该字段才需要 */
    dataScopeDeptIds?: number[]
  }

  type PermissionAssignRoleMenuReqVO = {
    /** 角色编号 */
    roleId: number
    /** 菜单编号列表 */
    menuIds?: number[]
  }

  type PermissionAssignUserRoleReqVO = {
    /** 用户编号 */
    userId: number
    /** 角色编号列表 */
    roleIds?: number[]
  }

  type PointVO = {
    secretKey?: string
    x?: number
    y?: number
  }

  type Post = {
    /** 岗位编号 */
    id: number
    /** 岗位名称 */
    name: string
  }

  type postAccessTokenParams = {
    /** 授权类型 */
    grant_type: string
    /** 授权范围 */
    code?: string
    /** 重定向 URI */
    redirect_uri?: string
    /** 状态 */
    state?: string
    username?: string
    password?: string
    scope?: string
    refresh_token?: string
  }

  type PostPageReqVO = {
    /** 页码，从 1 开始 */
    pageNo: number
    /** 每页条数，最大值为 100 */
    pageSize: number
    /** 岗位编码，模糊匹配 */
    code?: string
    /** 岗位名称，模糊匹配 */
    name?: string
    /** 展示状态，参见 CommonStatusEnum 枚举类 */
    status?: number
  }

  type PostRespVO = {
    /** 岗位序号 */
    id: number
    /** 岗位名称 */
    name: string
    /** 岗位编码 */
    code: string
    /** 显示顺序 */
    sort: number
    /** 状态，参见 CommonStatusEnum 枚举类 */
    status: number
    /** 备注 */
    remark?: string
    /** 创建时间 */
    createTime: string
  }

  type PostSaveReqVO = {
    /** 岗位编号 */
    id?: number
    /** 岗位名称 */
    name: string
    /** 岗位编码 */
    code: string
    /** 显示顺序 */
    sort: number
    /** 状态 */
    status: number
    /** 备注 */
    remark?: string
  }

  type PostSimpleRespVO = {
    /** 岗位序号 */
    id: number
    /** 岗位名称 */
    name: string
  }

  type pushParams = {
    /** 编号 */
    id: number
  }

  type refreshTokenParams = {
    /** 刷新令牌 */
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
    /** 访问令牌 */
    token: string
  }

  type RolePageReqVO = {
    /** 页码，从 1 开始 */
    pageNo: number
    /** 每页条数，最大值为 100 */
    pageSize: number
    /** 角色名称，模糊匹配 */
    name?: string
    /** 角色标识，模糊匹配 */
    code?: string
    /** 展示状态，参见 CommonStatusEnum 枚举类 */
    status?: number
    /** 创建时间 */
    createTime?: string[]
  }

  type RoleRespVO = {
    /** 角色编号 */
    id: number
    /** 角色名称 */
    name: string
    /** 角色标志 */
    code: string
    /** 显示顺序 */
    sort: number
    /** 状态，参见 CommonStatusEnum 枚举类 */
    status: number
    /** 角色类型，参见 RoleTypeEnum 枚举类 */
    type: number
    /** 备注 */
    remark?: string
    /** 数据范围，参见 DataScopeEnum 枚举类 */
    dataScope: number
    /** 数据范围(指定部门数组) */
    dataScopeDeptIds?: number[]
    /** 创建时间 */
    createTime: string
  }

  type RoleSaveReqVO = {
    /** 角色编号 */
    id?: number
    /** 角色名称 */
    name: string
    /** 角色编码 */
    code: string
    /** 显示顺序 */
    sort: number
    /** 备注 */
    remark?: string
  }

  type RoleSimpleRespVO = {
    /** 角色编号 */
    id: number
    /** 角色名称 */
    name: string
  }

  type SmsChannelPageReqVO = {
    /** 页码，从 1 开始 */
    pageNo: number
    /** 每页条数，最大值为 100 */
    pageSize: number
    /** 任务状态 */
    status?: number
    /** 短信签名，模糊匹配 */
    signature?: string
    /** 创建时间 */
    createTime?: string[]
  }

  type SmsChannelRespVO = {
    /** 编号 */
    id: number
    /** 短信签名 */
    signature: string
    /** 渠道编码，参见 SmsChannelEnum 枚举类 */
    code: string
    /** 启用状态 */
    status: number
    /** 备注 */
    remark?: string
    /** 短信 API 的账号 */
    apiKey: string
    /** 短信 API 的密钥 */
    apiSecret?: string
    /** 短信发送回调 URL */
    callbackUrl?: string
    /** 创建时间 */
    createTime: string
  }

  type SmsChannelSaveReqVO = {
    /** 编号 */
    id?: number
    /** 短信签名 */
    signature: string
    /** 渠道编码，参见 SmsChannelEnum 枚举类 */
    code: string
    /** 启用状态 */
    status: number
    /** 备注 */
    remark?: string
    /** 短信 API 的账号 */
    apiKey: string
    /** 短信 API 的密钥 */
    apiSecret?: string
    /** 短信发送回调 URL */
    callbackUrl?: string
  }

  type SmsChannelSimpleRespVO = {
    /** 编号 */
    id: number
    /** 短信签名 */
    signature: string
    /** 渠道编码，参见 SmsChannelEnum 枚举类 */
    code: string
  }

  type SmsLogPageReqVO = {
    /** 页码，从 1 开始 */
    pageNo: number
    /** 每页条数，最大值为 100 */
    pageSize: number
    /** 短信渠道编号 */
    channelId?: number
    /** 模板编号 */
    templateId?: number
    /** 手机号 */
    mobile?: string
    /** 发送状态，参见 SmsSendStatusEnum 枚举类 */
    sendStatus?: number
    /** 发送时间 */
    sendTime?: string[]
    /** 接收状态，参见 SmsReceiveStatusEnum 枚举类 */
    receiveStatus?: number
    /** 接收时间 */
    receiveTime?: string[]
  }

  type SmsLogRespVO = {
    /** 编号 */
    id: number
    /** 短信渠道编号 */
    channelId: number
    /** 短信渠道编码 */
    channelCode: string
    /** 模板编号 */
    templateId: number
    /** 模板编码 */
    templateCode: string
    /** 短信类型 */
    templateType: number
    /** 短信内容 */
    templateContent: string
    /** 短信参数 */
    templateParams: Record<string, any>
    /** 短信 API 的模板编号 */
    apiTemplateId: string
    /** 手机号 */
    mobile: string
    /** 用户编号 */
    userId?: number
    /** 用户类型 */
    userType?: number
    /** 发送状态 */
    sendStatus: number
    /** 发送时间 */
    sendTime?: string
    /** 短信 API 发送结果的编码 */
    apiSendCode?: string
    /** 短信 API 发送失败的提示 */
    apiSendMsg?: string
    /** 短信 API 发送返回的唯一请求 ID */
    apiRequestId?: string
    /** 短信 API 发送返回的序号 */
    apiSerialNo?: string
    /** 接收状态 */
    receiveStatus: number
    /** 接收时间 */
    receiveTime?: string
    /** API 接收结果的编码 */
    apiReceiveCode?: string
    /** API 接收结果的说明 */
    apiReceiveMsg?: string
    /** 创建时间 */
    createTime: string
  }

  type SmsTemplatePageReqVO = {
    /** 页码，从 1 开始 */
    pageNo: number
    /** 每页条数，最大值为 100 */
    pageSize: number
    /** 短信签名 */
    type?: number
    /** 开启状态 */
    status?: number
    /** 模板编码，模糊匹配 */
    code?: string
    /** 模板内容，模糊匹配 */
    content?: string
    /** 短信 API 的模板编号，模糊匹配 */
    apiTemplateId?: string
    /** 短信渠道编号 */
    channelId?: number
    /** 创建时间 */
    createTime?: string[]
  }

  type SmsTemplateRespVO = {
    /** 编号 */
    id: number
    /** 短信类型，参见 SmsTemplateTypeEnum 枚举类 */
    type: number
    /** 开启状态，参见 CommonStatusEnum 枚举类 */
    status: number
    /** 模板编码 */
    code: string
    /** 模板名称 */
    name: string
    /** 模板内容 */
    content: string
    /** 参数数组 */
    params?: string[]
    /** 备注 */
    remark?: string
    /** 短信 API 的模板编号 */
    apiTemplateId: string
    /** 短信渠道编号 */
    channelId: number
    /** 短信渠道编码 */
    channelCode: string
    /** 创建时间 */
    createTime: string
  }

  type SmsTemplateSaveReqVO = {
    /** 编号 */
    id?: number
    /** 短信类型，参见 SmsTemplateTypeEnum 枚举类 */
    type: number
    /** 开启状态，参见 CommonStatusEnum 枚举类 */
    status: number
    /** 模板编码 */
    code: string
    /** 模板名称 */
    name: string
    /** 模板内容 */
    content: string
    /** 备注 */
    remark?: string
    /** 短信 API 的模板编号 */
    apiTemplateId: string
    /** 短信渠道编号 */
    channelId: number
  }

  type SmsTemplateSendReqVO = {
    /** 手机号 */
    mobile: string
    /** 模板编码 */
    templateCode: string
    /** 模板参数 */
    templateParams?: Record<string, any>
  }

  type SocialClientPageReqVO = {
    /** 页码，从 1 开始 */
    pageNo: number
    /** 每页条数，最大值为 100 */
    pageSize: number
    /** 应用名 */
    name?: string
    /** 社交平台的类型 */
    socialType?: number
    /** 用户类型 */
    userType?: number
    /** 客户端编号 */
    clientId?: string
    /** 状态 */
    status?: number
  }

  type SocialClientRespVO = {
    /** 编号 */
    id: number
    /** 应用名 */
    name: string
    /** 社交平台的类型 */
    socialType: number
    /** 用户类型 */
    userType: number
    /** 客户端编号 */
    clientId: string
    /** 客户端密钥 */
    clientSecret: string
    /** 授权方的网页应用编号 */
    agentId: string
    /** 状态 */
    status: number
    /** 创建时间 */
    createTime: string
  }

  type SocialClientSaveReqVO = {
    /** 编号 */
    id?: number
    /** 应用名 */
    name: string
    /** 社交平台的类型 */
    socialType: number
    /** 用户类型 */
    userType: number
    /** 客户端编号 */
    clientId: string
    /** 客户端密钥 */
    clientSecret: string
    /** 授权方的网页应用编号 */
    agentId: string
    /** 状态 */
    status: number
  }

  type socialLoginParams = {
    /** 社交类型 */
    type: number
    /** 回调路径 */
    redirectUri: string
  }

  type SocialUser = {
    /** 社交平台的类型，参见 SocialTypeEnum 枚举类 */
    type: number
    /** 社交用户的 openid */
    openid: string
  }

  type SocialUserBindReqVO = {
    /** 社交平台的类型，参见 UserSocialTypeEnum 枚举值 */
    type: number
    /** 授权码 */
    code: string
    /** state */
    state: string
  }

  type SocialUserPageReqVO = {
    /** 页码，从 1 开始 */
    pageNo: number
    /** 每页条数，最大值为 100 */
    pageSize: number
    /** 社交平台的类型 */
    type?: number
    /** 用户昵称 */
    nickname?: string
    /** 社交 openid */
    openid?: string
    /** 创建时间 */
    createTime?: string[]
  }

  type SocialUserRespVO = {
    /** 主键(自增策略) */
    id: number
    /** 社交平台的类型 */
    type: number
    /** 社交 openid */
    openid: string
    /** 社交 token */
    token: string
    /** 原始 Token 数据，一般是 JSON 格式 */
    rawTokenInfo: string
    /** 用户昵称 */
    nickname: string
    /** 用户头像 */
    avatar?: string
    /** 原始用户数据，一般是 JSON 格式 */
    rawUserInfo: string
    /** 最后一次的认证 code */
    code: string
    /** 最后一次的认证 state */
    state: string
    /** 创建时间 */
    createTime: string
    /** 更新时间 */
    updateTime: string
  }

  type SocialUserUnbindReqVO = {
    /** 社交平台的类型，参见 UserSocialTypeEnum 枚举值 */
    type: number
    /** 社交用户的 openid */
    openid: string
  }

  type updateNotifyMessageReadParams = {
    /** 站内信 Ids */
    ids: number[]
  }

  type UserImportRespVO = {
    /** 创建成功的用户名数组 */
    createUsernames: string[]
    /** 更新成功的用户名数组 */
    updateUsernames: string[]
    /** 导入失败的用户集合，key 为用户名，value 为失败原因 */
    failureUsernames: Record<string, any>
  }

  type UserPageReqVO = {
    /** 页码，从 1 开始 */
    pageNo: number
    /** 每页条数，最大值为 100 */
    pageSize: number
    /** 用户账号，模糊匹配 */
    username?: string
    /** 手机号码，模糊匹配 */
    mobile?: string
    /** 展示状态，参见 CommonStatusEnum 枚举类 */
    status?: number
    /** 创建时间 */
    createTime?: string[]
    /** 部门编号，同时筛选子部门 */
    deptId?: number
  }

  type UserProfileRespVO = {
    /** 用户编号 */
    id: number
    /** 用户账号 */
    username: string
    /** 用户昵称 */
    nickname: string
    /** 用户邮箱 */
    email?: string
    /** 手机号码 */
    mobile?: string
    /** 用户性别，参见 SexEnum 枚举类 */
    sex?: number
    /** 用户头像 */
    avatar?: string
    /** 最后登录 IP */
    loginIp: string
    /** 最后登录时间 */
    loginDate: string
    /** 创建时间 */
    createTime: string
    roles?: RoleSimpleRespVO[]
    dept?: DeptSimpleRespVO
    posts?: PostSimpleRespVO[]
    socialUsers?: SocialUser[]
  }

  type UserProfileUpdatePasswordReqVO = {
    /** 旧密码 */
    oldPassword: string
    /** 新密码 */
    newPassword: string
  }

  type UserProfileUpdateReqVO = {
    /** 用户昵称 */
    nickname: string
    /** 用户邮箱 */
    email?: string
    /** 手机号码 */
    mobile?: string
    /** 用户性别，参见 SexEnum 枚举类 */
    sex?: number
  }

  type UserRespVO = {
    /** 用户编号 */
    id: number
    /** 用户账号 */
    username: string
    /** 用户昵称 */
    nickname: string
    /** 备注 */
    remark?: string
    /** 部门ID */
    deptId?: number
    /** 部门名称 */
    deptName?: string
    /** 岗位编号数组 */
    postIds?: number[]
    /** 用户邮箱 */
    email?: string
    /** 手机号码 */
    mobile?: string
    /** 用户性别，参见 SexEnum 枚举类 */
    sex?: number
    /** 用户头像 */
    avatar?: string
    /** 状态，参见 CommonStatusEnum 枚举类 */
    status: number
    /** 最后登录 IP */
    loginIp: string
    /** 最后登录时间 */
    loginDate: string
    /** 创建时间 */
    createTime: string
  }

  type UserSaveReqVO = {
    /** 用户编号 */
    id?: number
    /** 用户账号 */
    username: string
    /** 用户昵称 */
    nickname: string
    /** 备注 */
    remark?: string
    /** 部门编号 */
    deptId?: number
    /** 岗位编号数组 */
    postIds?: number[]
    /** 用户邮箱 */
    email?: string
    /** 手机号码 */
    mobile?: string
    /** 用户性别，参见 SexEnum 枚举类 */
    sex?: number
    /** 用户头像 */
    avatar?: string
    /** 密码 */
    password: string
  }

  type UserSimpleRespVO = {
    /** 用户编号 */
    id: number
    /** 用户昵称 */
    nickname: string
    /** 部门ID */
    deptId?: number
    /** 部门名称 */
    deptName?: string
  }

  type UserUpdatePasswordReqVO = {
    /** 用户编号 */
    id: number
    /** 密码 */
    password: string
  }

  type UserUpdateStatusReqVO = {
    /** 用户编号 */
    id: number
    /** 状态，见 CommonStatusEnum 枚举 */
    status: number
  }

  type UserVO = {
    /** 用户编号 */
    id: number
    /** 用户昵称 */
    nickname: string
    /** 用户头像 */
    avatar: string
    /** 部门编号 */
    deptId: number
  }

  type FakeCaptcha = {
    code?: number
    status?: string
  }

    type LoginResult = {
    status?: string
    type?: string
    currentAuthority?: string
  }

  type CurrentUser = {
    name?: string
    avatar?: string
    userid?: string
    email?: string
    signature?: string
    title?: string
    group?: string
    tags?: { key?: string; label?: string }[]
    notifyCount?: number
    unreadCount?: number
    country?: string
    access?: string
    geographic?: {
      province?: { label?: string; key?: string }
      city?: { label?: string; key?: string }
    }
    address?: string
    phone?: string
  }
}
