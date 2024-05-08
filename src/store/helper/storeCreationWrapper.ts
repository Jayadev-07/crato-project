import { DevtoolsOptions, createJSONStorage, devtools, persist } from "zustand/middleware"
import { logger } from "./logger"
import storage from "./customStoreEngine"
import { StateCreator } from "zustand"

const storeCreationWrapper = <T>(
  store: StateCreator<T, [["zustand/devtools", never]], []>,
  options: TOptions
) => {
  const { loggerName, persistName = "store", devtools: devtoolsOptions } = options

  return devtools(
    persist(logger(store, loggerName), {
      name: persistName,
      storage: createJSONStorage(() => storage)
    }),
    devtoolsOptions
  )
}

export default storeCreationWrapper

type TOptions = {
  loggerName: string
  persistName: string
  devtools: DevtoolsOptions
}
