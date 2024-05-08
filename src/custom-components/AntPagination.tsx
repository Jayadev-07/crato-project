import useFilter from "@hooks/useFilter"
import { TPaginationComponents } from "@src/types/common.type"
import { Pagination } from "antd"

type Props = {
  totalCount: number
  currentPage: TPaginationComponents
  isLoading?: boolean
}

const AntPagination = ({ currentPage, totalCount }: Props) => {
  const { filter, setFilter } = useFilter(currentPage)

  return (
    <div className="w-100 d-flex justify-content-end mt-1">
      <Pagination
        current={filter.page}
        onChange={(selected: number) => setFilter({ page: selected })}
        total={totalCount}
        pageSize={filter.count}
        showTotal={(total, range) =>
          range[1] ? `${range[0]}-${range[1]} of ${total} records` : "No records"
        }
      />
    </div>
  )
}

export default AntPagination
