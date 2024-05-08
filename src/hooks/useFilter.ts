import { INITIAL_VALUES } from "@src/store/filter/constants"
import useFilterStore, { updateFilterStore } from "@src/store/filter/filterStore"

const useFilter = <T extends PageType>(
  page: T
): {
  filter: InitialValueType[T]
  setFilter: (data: Partial<InitialValueType[T]>) => void
  resetFilter: () => void
} => {
  const filter = useFilterStore((store) => store[page])
  const setFilter = (data: Partial<InitialValueType[T]>) => {
    updateFilterStore({ [page]: { ...filter, ...data } })
  }
  const resetFilter = () => updateFilterStore({ [page]: { ...INITIAL_VALUES[page] } })

  return { filter, setFilter, resetFilter }
}

export default useFilter
export type InitialValueType = typeof INITIAL_VALUES
export type InitialValueKeyType = keyof InitialValueType
export type PageType = Exclude<InitialValueKeyType, "ACTIVE_FILTERS">
export type FilterPageType = Exclude<PageType, "USER_INTERACTION" | "MORE_FILTER">
export type TUseFilter = PageType
