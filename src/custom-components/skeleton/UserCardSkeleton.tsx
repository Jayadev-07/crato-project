import { Skeleton } from "antd"

const UserCardSkeleton = () => {
  return (
    <>
      <div className="d-flex justify-content-center mb-1">
        <Skeleton.Button active style={{ height: "120px", width: "120px" }} />
      </div>
      <div className="py-2">
        <Skeleton.Input block className="mb-1" style={{ height: "30px" }} />
        <Skeleton.Input block style={{ width: "90%", height: "30px" }} className="mb-1" />
        <Skeleton.Input block className="mb-1" style={{ height: "30px" }} />
        <Skeleton.Input block className="mb-1" style={{ height: "30px" }} />
        <Skeleton.Input block style={{ width: "90%", height: "30px" }} className="mb-1" />
        <Skeleton.Input block className="mb-1" style={{ height: "30px" }} />
        <Skeleton.Input block style={{ height: "30px" }} />
      </div>
    </>
  )
}

export default UserCardSkeleton
