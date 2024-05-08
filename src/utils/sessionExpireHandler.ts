import useCombineStore from "@hooks/useCombineStore"

const onSessionExpire = () => {
  setTimeout(() => useCombineStore.getState().onLogout(), 10)
  location.replace(`${location.origin}/login?mode=session-expired`)
}
export default onSessionExpire
