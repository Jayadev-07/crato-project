import { ReactNode } from "react"

type Props = {
  loading: boolean
  children: ReactNode
  skeleton: ReactNode
}

const SkeletonWrapper = ({ loading, children, skeleton }: Props) => {
  if (loading) return skeleton
  return children
}

export default SkeletonWrapper
