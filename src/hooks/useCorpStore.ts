import useCorpData, { TCorpData, updateCorpData } from "@src/store/corpData"

function useCorpStore<T extends (state: TCorpData) => any>(v: T): ReturnType<T>
function useCorpStore(): TCorpData

function useCorpStore<T extends (state: TCorpData) => any>(v?: T) {
  const data = v ? useCorpData(v) : useCorpData()
  const updateCorp = updateCorpData

  if (!Object.keys(data ?? {}).length) {
    ;(async () => {
      try {
        await updateCorp()
      } catch (error) {
        console.log(error)
      }
    })()
  }
  return data
}

export default useCorpStore

useCorpStore.getState = () => useCorpData.getState()
useCorpStore.setState = updateCorpData
