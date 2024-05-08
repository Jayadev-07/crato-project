import { Tree, TreeProps } from "antd"
import { DownOutlined } from "@ant-design/icons"
import Breadcrumbs from "@custom-components/Breadcrumbs"
import { Card } from "reactstrap"
import { CSSProperties, useState } from "react"
import CorpTable from "./CorpTable"
import useFetch from "@hooks/useFetch"
import getUrl from "@api/url"
import AddUpdateSegment from "./components/AddUpdateSegment"
import { getCompanyId } from "@utils/index"
import SkeletonWrapper from "@custom-components/skeleton/SkeletonWrapper"
import TreeSkeleton from "@custom-components/skeleton/TreeSkeleton"

const CorporateStructure = () => {
  const onSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info)
    if (selectedKeys.includes("COMPANY") || !selectedKeys.length) return
    setActiveSegment(selectedKeys[0] as string)
  }
  const [activeSegment, setActiveSegment] = useState("")
  const [data, { refetch, loading }] = useFetch<any>(
    `${getUrl("MASTER_DATA_API", "CORP", "SEGEMENT_TREE")}/${getCompanyId()}`,
    {
      callback: (s) => s.map(genTree)
    }
  )

  return (
    <section id="corporate-structure">
      <Breadcrumbs withGoBack title="Corporate Structure" data={breadCrumb} />
      <Card style={{ position: "relative" }} id="corporate-structure">
        <div style={{ display: "flex", minHeight: "32rem", overflow: "hidden" }}>
          <div style={style}>
            <SkeletonWrapper loading={loading} skeleton={<TreeSkeleton />}>
              <div
                style={{
                  // display: "flex",
                  // flexDirection: "column",
                  // justifyContent: "space-between",
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
                    treeData={data}
                    defaultExpandAll
                  />
                </div>
                <div style={{ position: "absolute", bottom: "20px", width: "14rem" }}>
                  <AddUpdateSegment refetch={refetch} />
                </div>
              </div>
            </SkeletonWrapper>
          </div>
          <div style={{ width: "100%" }}>
            <CorpTable activeSegment={activeSegment} key={activeSegment} />
          </div>
        </div>
      </Card>
    </section>
  )
}

export default CorporateStructure

const breadCrumb = [
  { title: "Settings", link: "/settings" },
  { title: "Master Data", link: "" },
  { title: "Corporate Structure", link: "" }
]

const style: CSSProperties = {
  padding: "1rem",
  width: "20rem",
  borderRight: "solid 1px #cecece",
  minHeight: "100%",
  height: "m",
  scrollBehavior: "smooth",
  overflowX: "auto"
}

// const getTreeId = (arr: TreeDataNode) =>
//   arr.reduce((p: string[], c: TreeDataNode) => [...p, c.key, genTreeId(c.children)], [])

// function* generateId() {
//   let id = 1

//   while (true) {
//     yield id
//     id++
//   }
// }
// const gen = generateId()

export const genTree = (data: any, index: any): any => ({
  ...data,
  title: <div className={`corp-item-${index}`}>{data.title}</div>,
  ...(data.children ? { children: data.children.map(genTree) } : {})
})
