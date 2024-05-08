import { devtools } from "zustand/middleware"
import { shallow } from "zustand/shallow"
import { createWithEqualityFn } from "zustand/traditional"

const initialValue = {} as TCorpData

const useCorpData = createWithEqualityFn<TCorpData>()(
  devtools(() => ({ ...initialValue }), { name: "corpData", store: "corpData" }),
  shallow
)

export default useCorpData

export const updateCorpData = async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 5000))
    useCorpData.setState(() => ({ data: { key: "value" } }))
  } catch (error) {}
}

export type TCorpData = {
  data: {
    key: "value"
  }
}
