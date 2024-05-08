import getUrl from "@api/url"
import usePost from "@hooks/usePost"
import { TCorpUnitDetails, TList, TUserCorpTree, genUserCorpTree } from "../corp-tree"
import { Checkbox, Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import useFilter from "@hooks/useFilter"

type Props = {
  record: TList
  setData: React.Dispatch<React.SetStateAction<TCorpUnitDetails | undefined>>
  setTree: React.Dispatch<React.SetStateAction<TUserCorpTree[]>>
  companyId: string
}

const UserCorpCheckBox = ({ record, setData, setTree, companyId }: Props) => {
  const { makeRequest, isLoading } = usePost(
    getUrl("MASTER_DATA_API", "USER_CORP", "DELTA_SAVE"),
    "post"
  )
  const { filter, setFilter } = useFilter("USER_CORP_FILTER")
  const onCheck = async (item: TList) => {
    const res = await makeRequest({
      params: { isChecked: !item.isChecked },
      data: {
        companyId,
        ...(filter.deltaId ? { deltaId: filter.deltaId } : {}),
        unitDetails: [
          { unitId: item.unitId, parentId: item.parentId, segmentId: item.segmentId }
        ]
      }
    })
    setTree(res.segmentTree.map(genUserCorpTree))

    if (!filter.deltaId) {
      setFilter({ deltaId: res.deltaId })
    } else {
      setData((s) => ({
        totalCount: s?.totalCount ?? 0,
        list: (s?.list ?? []).map((x) =>
          x.unitId == item.unitId ? { ...x, isChecked: !x.isChecked } : x
        )
      }))
    }
  }
  return isLoading ? (
    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
  ) : (
    <Checkbox onChange={() => onCheck(record)} checked={record.isChecked} />
  )
}

export default UserCorpCheckBox
