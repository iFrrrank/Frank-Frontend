declare namespace API {
  type ApiAccessLogCreateReqDTO = {
    /** 链路追踪编号 */
    traceId?: string
    /** 用户编号 */
    userId: number
    /** 用户类型 */
    userType: number
    /** 应用名 */
    applicationName: string
    /** 请求方法名 */
    requestMethod: string
    /** 请求地址 */
    requestUrl: string
    /** 请求参数 */
    requestParams?: string
    /** 响应结果 */
    responseBody?: string
    /** 用户 IP */
    userIp: string
    /** 浏览器 UserAgent */
    userAgent: string
    /** 操作模块 */
    operateModule: string
    /** 操作名 */
    operateName: string
    /** 操作类型 */
    operateType: number
    /** 开始时间 */
    beginTime: string
    /** 结束时间 */
    endTime: string
    /** 执行时长，单位：毫秒 */
    duration: number
    /** 结果码 */
    resultCode: number
    /** 结果提示 */
    resultMsg?: string
  }

  type ApiErrorLogCreateReqDTO = {
    /** 链路追踪编号 */
    traceId?: string
    /** 用户编号 */
    userId: number
    /** 用户类型 */
    userType: number
    /** 应用名 */
    applicationName: string
    /** 请求方法名 */
    requestMethod: string
    /** 请求地址 */
    requestUrl: string
    /** 请求参数 */
    requestParams: string
    /** 用户 IP */
    userIp: string
    /** 浏览器 UserAgent */
    userAgent: string
    /** 异常时间 */
    exceptionTime: string
    /** 异常名 */
    exceptionName: string
    /** 异常发生的类全名 */
    exceptionClassName: string
    /** 异常发生的类文件 */
    exceptionFileName: string
    /** 异常发生的方法名 */
    exceptionMethodName: string
    /** 异常发生的方法所在行 */
    exceptionLineNumber: number
    /** 异常的栈轨迹异常的栈轨迹 */
    exceptionStackTrace: string
    /** 异常导致的根消息 */
    exceptionRootCauseMessage: string
    /** 异常导致的消息 */
    exceptionMessage: string
  }

  type CommandStat = {
    /** Redis 命令 */
    command: string
    /** 调用次数 */
    calls: number
    /** 消耗 CPU 秒数 */
    usec: number
  }

  type CommonResultBoolean = {
    code?: number
    data?: boolean
    msg?: string
  }

  type CommonResultInfraConfigRespVO = {
    code?: number
    data?: InfraConfigRespVO
    msg?: string
  }

  type CommonResultInfraDataSourceConfigRespVO = {
    code?: number
    data?: InfraDataSourceConfigRespVO
    msg?: string
  }

  type CommonResultInfraFileConfigRespVO = {
    code?: number
    data?: InfraFileConfigRespVO
    msg?: string
  }

  type CommonResultInfraFilePresignedUrlRespVO = {
    code?: number
    data?: InfraFilePresignedUrlRespVO
    msg?: string
  }

  type CommonResultInfraRedisMonitorRespVO = {
    code?: number
    data?: InfraRedisMonitorRespVO
    msg?: string
  }

  type CommonResultListInfraDataSourceConfigRespVO = {
    code?: number
    data?: InfraDataSourceConfigRespVO[]
    msg?: string
  }

  type CommonResultLong = {
    code?: number
    data?: number
    msg?: string
  }

  type CommonResultPageResultInfraApiAccessLogRespVO = {
    code?: number
    data?: PageResultInfraApiAccessLogRespVO
    msg?: string
  }

  type CommonResultPageResultInfraApiErrorLogRespVO = {
    code?: number
    data?: PageResultInfraApiErrorLogRespVO
    msg?: string
  }

  type CommonResultPageResultInfraConfigRespVO = {
    code?: number
    data?: PageResultInfraConfigRespVO
    msg?: string
  }

  type CommonResultPageResultInfraFileConfigRespVO = {
    code?: number
    data?: PageResultInfraFileConfigRespVO
    msg?: string
  }

  type CommonResultPageResultInfraFileRespVO = {
    code?: number
    data?: PageResultInfraFileRespVO
    msg?: string
  }

  type CommonResultString = {
    code?: number
    data?: string
    msg?: string
  }

  type deleteConfigListParams = {
    /** 参数配置列表 */
    ids: number[]
  }

  type deleteConfigParams = {
    /** 参数配置 Id */
    id: number
  }

  type deleteDataSourceConfigListParams = {
    /** 数据源配置 Id 列表 */
    ids: number[]
  }

  type deleteDataSourceConfigParams = {
    /** 数据源配置 Id */
    id: number
  }

  type deleteFileConfigListParams = {
    /** 文件配置 Ids 列表 */
    ids: number[]
  }

  type deleteFileConfigParams = {
    /** 文件配置 Id */
    id: number
  }

  type deleteFileListParams = {
    /** 文件 Id 列表 */
    ids: number[]
  }

  type deleteFileParams = {
    /** 文件 Id */
    id: number
  }

  type exportApiAccessLogExcelParams = {
    exportReqVO: InfraApiAccessLogPageReqVO
  }

  type exportApiErrorLogExcelParams = {
    exportReqVO: InfraApiErrorLogPageReqVO
  }

  type exportConfigParams = {
    /** 数据源名称，模糊匹配 */
    name?: string
    /** 参数键名，模糊匹配 */
    key?: string
    /** 参数类型，参见 SysConfigTypeEnum 枚举 */
    type?: string
    /** 创建时间 */
    createTime?: string
    /** 页码，从 1 开始 */
    pageNo: string
    /** 每页条数，最大值为 100 */
    pageSize: string
  }

  type FileClientConfig = true

  type FileCreateReqDTO = {
    /** 原文件名称 */
    name?: string
    /** 文件目录 */
    directory?: string
    /** 文件 MIME 类型 */
    type?: string
    /** 文件内容 */
    content: string[]
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

  type getApiAccessLogPageParams = {
    pageReqVO: InfraApiAccessLogPageReqVO
  }

  type getApiErrorLogPageParams = {
    pageReqVO: InfraApiErrorLogPageReqVO
  }

  type getConfigKeyParams = {
    /** 参数键 */
    key: string
  }

  type getConfigPageParams = {
    pageReqVO: InfraConfigPageReqVO
  }

  type getConfigParams = {
    /** 参数配置 Id */
    id: number
  }

  type getDataSourceConfigParams = {
    /** 数据源配置 Id */
    id: number
  }

  type getFileConfigPageParams = {
    pageReqVO: InfraFileConfigPageReqVO
  }

  type getFileConfigParams = {
    /** 文件配置 Id */
    id: number
  }

  type getFileContentParams = {
    /** 文件配置 Id */
    configId: number
  }

  type getFilePageParams = {
    pageVO: InfraFilePageReqVO
  }

  type getFilePresignedUrlParams = {
    /** 文件名 */
    name: string
    /** 文件目录 */
    directory?: string
  }

  type InfraApiAccessLogPageReqVO = {
    /** 页码，从 1 开始 */
    pageNo: number
    /** 每页条数，最大值为 100 */
    pageSize: number
    /** 用户 Id */
    userId?: number
    /** 用户类型 */
    userType?: number
    /** 应用名 */
    applicationName?: string
    /** 请求地址，模糊匹配 */
    requestUrl?: string
    /** 开始时间 */
    beginTime?: string[]
    /** 执行时长，大于等于，单位：毫秒 */
    duration?: number
    /** 结果码 */
    resultCode?: number
  }

  type InfraApiAccessLogRespVO = {
    /** 日志 Id */
    id: number
    /** 链路追踪编号 */
    traceId: string
    /** 用户 Id */
    userId: number
    /** 用户类型，参见 UserTypeEnum 枚举 */
    userType: number
    /** 应用名 */
    applicationName: string
    /** 请求方法名 */
    requestMethod: string
    /** 请求地址 */
    requestUrl: string
    /** 请求参数 */
    requestParams?: string
    /** 响应结果 */
    responseBody?: string
    /** 用户 IP */
    userIp: string
    /** 浏览器 UA */
    userAgent: string
    /** 操作模块 */
    operateModule: string
    /** 操作名 */
    operateName: string
    /** 操作分类 */
    operateType: number
    /** 开始请求时间 */
    beginTime: string
    /** 结束请求时间 */
    endTime: string
    /** 执行时长 */
    duration: number
    /** 结果码 */
    resultCode: number
    /** 结果提示 */
    resultMsg?: string
    /** 创建时间 */
    createTime: string
  }

  type InfraApiErrorLogPageReqVO = {
    /** 页码，从 1 开始 */
    pageNo: number
    /** 每页条数，最大值为 100 */
    pageSize: number
    /** 用户 Id */
    userId?: number
    /** 用户类型 */
    userType?: number
    /** 应用名 */
    applicationName?: string
    /** 请求地址 */
    requestUrl?: string
    /** 异常发生时间 */
    exceptionTime?: string[]
    /** 处理状态 */
    processStatus?: number
  }

  type InfraApiErrorLogRespVO = {
    /** API 错误日志 Id */
    id: number
    /** 链路追踪编号 */
    traceId: string
    /** 用户 Id */
    userId: number
    /** 用户类型 */
    userType: number
    /** 应用名 */
    applicationName: string
    /** 请求方法名 */
    requestMethod: string
    /** 请求地址 */
    requestUrl: string
    /** 请求参数 */
    requestParams: string
    /** 用户 IP */
    userIp: string
    /** 浏览器 UA */
    userAgent: string
    /** 异常发生时间 */
    exceptionTime: string
    /** 异常名 */
    exceptionName: string
    /** 异常导致的消息 */
    exceptionMessage: string
    /** 异常导致的根消息 */
    exceptionRootCauseMessage: string
    /** 异常的栈轨迹 */
    exceptionStackTrace: string
    /** 异常发生的类全名 */
    exceptionClassName: string
    /** 异常发生的类文件 */
    exceptionFileName: string
    /** 异常发生的方法名 */
    exceptionMethodName: string
    /** 异常发生的方法所在行 */
    exceptionLineNumber: number
    /** 处理状态 */
    processStatus: number
    /** 处理时间 */
    processTime: string
    /** 处理用户 Id */
    processUserId?: number
    /** 创建时间 */
    createTime: string
  }

  type InfraConfigPageReqVO = {
    /** 页码，从 1 开始 */
    pageNo: number
    /** 每页条数，最大值为 100 */
    pageSize: number
    /** 数据源名称，模糊匹配 */
    name?: string
    /** 参数键名，模糊匹配 */
    key?: string
    /** 参数类型，参见 SysConfigTypeEnum 枚举 */
    type?: number
    /** 创建时间 */
    createTime?: string[]
  }

  type InfraConfigRespVO = {
    /** 参数配置 Id */
    id: number
    /** 参数分类 */
    category: string
    /** 参数名称 */
    name: string
    /** 参数键名 */
    key: string
    /** 参数键值 */
    value: string
    /** 参数类型，参见 SysConfigTypeEnum 枚举 */
    type: number
    /** 是否可见 */
    visible: boolean
    /** 备注 */
    remark?: string
    /** 创建时间 */
    createTime: string
  }

  type InfraConfigSaveReqVO = {
    /** 参数配置 Id */
    id?: number
    /** 参数分组 */
    category: string
    /** 参数名称 */
    name: string
    /** 参数键名 */
    key: string
    /** 参数键值 */
    value: string
    /** 是否可见 */
    visible: boolean
    /** 备注 */
    remark?: string
  }

  type InfraDataSourceConfigRespVO = {
    /** 主键 Id */
    id: number
    /** 数据源名称 */
    name: string
    /** 数据源连接 */
    url: string
    /** 用户名 */
    username: string
    /** 创建时间 */
    createTime: string
  }

  type InfraDataSourceConfigSaveReqVO = {
    /** 主键 Id */
    id?: number
    /** 数据源名称 */
    name: string
    /** 数据源连接 */
    url: string
    /** 用户名 */
    username: string
    /** 密码 */
    password: string
  }

  type InfraFileConfigPageReqVO = {
    /** 页码，从 1 开始 */
    pageNo: number
    /** 每页条数，最大值为 100 */
    pageSize: number
    /** 配置名 */
    name?: string
    /** 存储器 */
    storage?: number
    /** 创建时间 */
    createTime?: string[]
  }

  type InfraFileConfigRespVO = {
    /** 文件配置 Id */
    id: number
    /** 配置名 */
    name: string
    /** 存储器，参见 FileStorageEnum 枚举类 */
    storage: number
    /** 是否为主配置 */
    master: boolean
    config: FileClientConfig
    /** 备注 */
    remark?: string
    /** 创建时间 */
    createTime: string
  }

  type InfraFileConfigSaveReqVO = {
    /** 文件配置 Id */
    id?: number
    /** 配置名 */
    name: string
    /** 存储器，参见 FileStorageEnum 枚举类 */
    storage: number
    /** 存储配置，配置是动态参数，所以使用 Map 接收 */
    config: Record<string, any>
    /** 备注 */
    remark?: string
  }

  type InfraFileCreateReqVO = {
    /** 文件配置 Id */
    configId: number
    /** 文件路径 */
    path: string
    /** 原文件名 */
    name: string
    /** 文件 URL */
    url: string
    /** 文件 MIME 类型 */
    type?: string
    /** 文件大小 */
    size: number
  }

  type InfraFilePageReqVO = {
    /** 页码，从 1 开始 */
    pageNo: number
    /** 每页条数，最大值为 100 */
    pageSize: number
    /** 文件路径，模糊匹配 */
    path?: string
    /** 文件类型，模糊匹配 */
    type?: string
    /** 创建时间 */
    createTime?: string[]
  }

  type InfraFilePresignedUrlRespVO = {
    /** 配置 Id */
    configId: number
    /** 文件上传 URL */
    uploadUrl: string
    /** 文件访问 URL */
    url: string
    /** 文件路径 */
    path: string
  }

  type InfraFileRespVO = {
    /** 文件 Id */
    id: number
    /** 文件配置 Id */
    configId: number
    /** 文件路径 */
    path: string
    /** 原文件名 */
    name: string
    /** 文件 URL */
    url: string
    /** 文件 MIME 类型 */
    type?: string
    /** 文件大小 */
    size: number
    /** 创建时间 */
    createTime: string
  }

  type InfraFileUploadReqVO = {
    file: string
    /** 文件目录 */
    directory?: string
  }

  type InfraRedisMonitorRespVO = {
    /** Redis info 指令结果，具体字段，查看 Redis 文档 */
    info: Record<string, any>
    /** Redis key 数量 */
    dbSize: number
    /** CommandStat 数组 */
    commandStats: CommandStat[]
  }

  type PageResultInfraApiAccessLogRespVO = {
    /** 数据 */
    list: InfraApiAccessLogRespVO[]
    /** 总量 */
    total: number
  }

  type PageResultInfraApiErrorLogRespVO = {
    /** 数据 */
    list: InfraApiErrorLogRespVO[]
    /** 总量 */
    total: number
  }

  type PageResultInfraConfigRespVO = {
    /** 数据 */
    list: InfraConfigRespVO[]
    /** 总量 */
    total: number
  }

  type PageResultInfraFileConfigRespVO = {
    /** 数据 */
    list: InfraFileConfigRespVO[]
    /** 总量 */
    total: number
  }

  type PageResultInfraFileRespVO = {
    /** 数据 */
    list: InfraFileRespVO[]
    /** 总量 */
    total: number
  }

  type testFileConfigParams = {
    id: number
  }

  type updateApiErrorLogProcessParams = {
    /** API 错误日志 Id */
    id: number
    /** 处理状态 */
    processStatus: number
  }

  type updateFileConfigMasterParams = {
    id: number
  }

  type WebSocketSendReqDTO = {
    /** Session 编号 */
    sessionId?: string
    /** 用户 Id */
    userId?: number
    /** 用户类型 */
    userType?: number
    /** 消息类型 */
    messageType: string
    /** 消息内容 */
    messageContent: string
  }
}
