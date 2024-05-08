import * as CONTROLLER from "./controllers"
import * as END_API from "./endApi"
import { SERVICE } from "./service"

function getUrl<T extends TService, K extends TController<T>, Z extends TEndApi<T, K>>(
  service: T,
  controller: K,
  endApi?: Z
) {
  // @ts-ignore
  if (!endApi) return `${SERVICE[service]}/${CONTROLLER[service][controller]}`
  // @ts-ignore
  return `${SERVICE[service]}/${CONTROLLER[service]?.[controller]}/${END_API[controller]?.[endApi]}`
}

export default getUrl

type TService = keyof typeof SERVICE

// @ts-ignore
type TController<T extends TService> = keyof (typeof CONTROLLER)[T]

// @ts-ignore
type TEndApi<T extends TService, K extends TController<T>> = keyof (typeof END_API)[K]
