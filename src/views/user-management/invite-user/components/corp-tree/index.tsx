import { DownOutlined } from "@ant-design/icons"
import getUrl from "@api/url"
import useFetch from "@hooks/useFetch"
import { Tree, TreeDataNode, TreeProps } from "antd"
import React, { ReactNode } from "react"
import UserCorpTable from "../user-corp-table"
import useFilter from "@hooks/useFilter"
import UserCorpTreeNode from "./UserCorpTreeNode"
import SkeletonWrapper from "@custom-components/skeleton/SkeletonWrapper"
import TreeSkeleton from "@custom-components/skeleton/TreeSkeleton"
import { getEmailId } from "@utils/index"
import { useParams } from "react-router-dom"

type Props = {
  // record: TSelectedCompany
  companyId: string
  children?: ReactNode
  viewMode?: boolean
  // setTree: React.Dispatch<React.SetStateAction<TUserCorpTree[]>>
}
const UserCorpTree = ({ companyId, children, viewMode = false }: Props) => {
  const userId = useParams()?.email ?? getEmailId()

  // const [activeSegment, setActiveSegment] = useState("businessunit")
  const { filter, setFilter } = useFilter("USER_CORP_FILTER")
  const [tree, { setData, loading }] = useFetch<TUserCorpTree[]>(
    `${getUrl("MASTER_DATA_API", "USER_CORP", viewMode ? "TREE" : "DELTA_TREE")}`,
    {
      apiParams: {
        method: "get",
        params: { companyId, ...(viewMode ? { userId } : { deltaId: filter.deltaId }) }
      },
      callback: (s) => s.map(genUserCorpTree)
    }
  )

  const onSelect: TreeProps["onSelect"] = (selectedKeys) => {
    if (selectedKeys.includes("COMPANY") || !selectedKeys.length) return
    console.log(selectedKeys)
    setFilter({
      list: filter.list.map((s) =>
        s.companyId == companyId ? { ...s, segmentId: selectedKeys[0] as string } : s
      )
    })
  }

  return (
    <div>
      {children}

      <div
        style={{
          display: "flex",
          minHeight: "32rem",
          overflow: "hidden",
          background: "white"
        }}
      >
        <div
          style={{
            padding: "1rem",
            width: "25rem",
            borderRight: "solid 1px #cecece",
            minHeight: "100%",
            scrollBehavior: "smooth",
            overflowX: "auto"
          }}
        >
          <SkeletonWrapper loading={loading} skeleton={<TreeSkeleton />}>
            <div
              style={{
                minHeight: "32rem"
              }}
            >
              <div>
                <h3 className="mb-1 d-flex justify-content-between align-items-center">
                  Corp Levels
                </h3>
                <Tree
                  showLine
                  switcherIcon={<DownOutlined />}
                  defaultExpandedKeys={["COMPANY"]}
                  onSelect={onSelect}
                  treeData={tree}
                  defaultExpandAll
                />
              </div>
            </div>
          </SkeletonWrapper>
        </div>
        <div style={{ width: "100%" }}>
          <UserCorpTable
            companyId={companyId}
            viewMode={viewMode}
            userId={userId}
            setTree={setData as React.Dispatch<React.SetStateAction<TUserCorpTree[]>>}
          />
        </div>
      </div>
    </div>
  )
}

export default UserCorpTree

export type TResponse = {
  userCorpTree: TUserCorpTree[]
  corpUnitDetails: TCorpUnitDetails
  userCorpDetails: TUserCorpDetails
}

export type TCorpUnitDetails = {
  totalCount: number
  list: TList[]
}

export type TList = {
  unitId: string
  unitName: string
  unitCode: string
  parentName: null
  parentId: string
  segmentId: null
  isChecked: boolean
}

export type TUserCorpDetails = {
  companyId: string
  userCorpId: string
  deltaId: string
  unitDetails: null
  loggedInUser: null
}

export type TUserCorpTree = {
  key: string
  title: string
  parentId: string
  parentName: string
  isRestricted: boolean
  isEnabled: boolean
  children: TUserCorpTree[]
}

export type TChild = {
  key: string
  title: string
  parentId: string
  isRestricted: boolean
  isEnabled: boolean
  children: TChild[] | null
}

export const genUserCorpTree = (data: TUserCorpTree): TreeDataNode => ({
  ...data,
  title: <UserCorpTreeNode {...data} />,
  disabled: !data.isEnabled || !data.isRestricted,
  ...(data.children ? { children: data.children.map(genUserCorpTree) } : {})
})
