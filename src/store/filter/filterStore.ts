import { shallow } from "zustand/shallow"
import { createWithEqualityFn } from "zustand/traditional"
import { INITIAL_VALUES } from "./constants"
import { TFilterStore } from "@src/types/store/filtersStore.type"
import storeCreationWrapper from "../helper/storeCreationWrapper"

const initialValue = INITIAL_VALUES as TFilterStore

const useFilterStore = createWithEqualityFn<TFilterStore>()(
  storeCreationWrapper(() => ({ ...initialValue }), {
    devtools: { name: "filter", store: "useFilter" },
    loggerName: "filter",
    persistName: "filter"
  }),
  shallow
)

export default useFilterStore
export const updateFilterStore = async (data: any) => {
  useFilterStore.setState((s) => ({ ...s, ...data }))
}
export const resetFilterStore = () => {
  useFilterStore.setState(initialValue, false, "reset-filter")
}
