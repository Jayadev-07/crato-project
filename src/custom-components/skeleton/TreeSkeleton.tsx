import { Skeleton } from "antd"

const TreeSkeleton = () => (
  <>
    <Skeleton.Input active size={"small"} />
    <div style={{ padding: "0.3rem 0 0 0" }} />
    <Skeleton.Input className="mx-1 pe-3" active size={"small"} block />
    <Skeleton.Input className="mx-1 pe-3" active size={"small"} block />
    <Skeleton.Input className="mx-1 pe-3" active size={"small"} block />
    <div style={{ padding: "0.3rem 0 0 0" }} />
    <Skeleton.Input active size={"small"} />
    <div style={{ padding: "0.3rem 0 0 0" }} />
    <Skeleton.Input className="mx-1 pe-3" active size={"small"} block />
    <Skeleton.Input className="mx-1 pe-3" active size={"small"} block />
    <Skeleton.Input className="mx-1 pe-3" active size={"small"} block />
  </>
)

export default TreeSkeleton
