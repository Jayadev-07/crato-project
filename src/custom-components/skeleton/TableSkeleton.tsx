import { Skeleton } from "antd"

// type Props = {}

const TableSkeleton = () => {
  return (
    <>
      <div className="d-flex  justify-content-between mt-4 mb-2 px-1">
        <Skeleton.Button active />
        <div>
          <Skeleton.Input className=" pe-1" active />
          <Skeleton.Button active />
        </div>
      </div>
      {new Array(7)
        .fill(<Skeleton.Input block active className="mb-50" />)
        .map((d, id) => (
          <div id={"" + id}>{d}</div>
        ))}
    </>
  )
}

export default TableSkeleton
