import { ReactNode, createContext } from "react"

export const PageContext = createContext<null | string>(null)
const PageWrapper = (prop: TProp) => {
  const { pageId, children } = prop

  return (
    <PageContext.Provider value={pageId}>
      <div id={pageId}>{children}</div>
    </PageContext.Provider>
  )
}

export default PageWrapper

type TProp = {
  pageId: string
  children: ReactNode
}
