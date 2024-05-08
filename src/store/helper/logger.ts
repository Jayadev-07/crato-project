import { StateCreator, StoreMutatorIdentifier } from "zustand"

/* For reference : 
create-slice=> https://gist.github.com/kyle-mccarthy/cae2df1089c71b9d6f5eb55992a15474 
logger=> https://docs.pmnd.rs/zustand/guides/typescript
*/
const isProdEnv = import.meta.env.VITE_ENVIRONMENT == "production"

type TLogger = <
  T extends unknown,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  f: StateCreator<T, Mps, Mcs>,
  name?: string
) => StateCreator<T, Mps, Mcs>

type LoggerImpl = <T extends unknown>(
  f: StateCreator<T, [], []>,
  name?: string
) => StateCreator<T, [], []>

const loggerImpl: LoggerImpl =
  (f, name = "store") =>
  (set, get, store) => {
    const loggedSet: typeof set = (...a) => {
      const prevState = get()
      set(...a)
      console.groupCollapsed(
        `%c${name} @ ${new Date().toLocaleTimeString()}`,
        "color: #ffff; font-weight: bold;"
      )
      console.log("%cprev state", "color: #9E9E9E; font-weight: bold;", prevState)
      // @ts-ignore
      console.log(`%caction ${name}/${a[2]}`, "color: #03A9F4; font-weight: bold;")
      set(...a)
      const nextState = get()
      console.log("%cnext state", "color: #4CAF50; font-weight: bold;", nextState)
      console.groupEnd()
    }
    store.setState = isProdEnv ? () => {} : loggedSet
    return f(isProdEnv ? () => {} : loggedSet, get, store)
  }

export const logger = loggerImpl as unknown as TLogger
