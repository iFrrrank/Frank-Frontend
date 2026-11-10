/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: API.SystemUserRespVO } | undefined) {
  const { currentUser } = initialState ?? {}
  return {
    canAdmin: !!currentUser
  }
}
