import { Input, Pagination, Table } from "antd"
import { TCorpUnitDetails, TList, TUserCorpTree } from "../corp-tree"
import useFetch from "@hooks/useFetch"
import getUrl from "@api/url"
import useFilter from "@hooks/useFilter"
import UserCorpCheckBox from "./UserCorpCheckBox"
import { TableColumnType } from "@src/types/common.type"
import SkeletonWrapper from "@custom-components/skeleton/SkeletonWrapper"
import TableSkeleton from "@custom-components/skeleton/TableSkeleton"
import SearchableSelect from "@custom-components/SearchableSelect"

type Props = {
  //   corpUnitDetails: TCorpUnitDetails  //   userCorpDetails: TUserCorpDetails
  companyId: string
  setTree: React.Dispatch<React.SetStateAction<TUserCorpTree[]>>
  viewMode: boolean
  userId?: string | null
}

const UserCorpTable = ({ setTree, companyId, viewMode, userId }: Props) => {
  const { filter, setFilter } = useFilter("USER_CORP_FILTER")
  const params = filter.list.find((s) => s.companyId == companyId)

  console.log(filter.list, params)

  const [data, { setData, loading }] = useFetch<TCorpUnitDetails>(
    `${getUrl(
      "MASTER_DATA_API",
      "USER_CORP",
      viewMode ? "GET_UNITS" : "DELTA_GET_UNITS"
    )}`,
    {
      apiParams: {
        ...(userId ? { params: { userId } } : {}),
        data: {
          ...params,
          companyIds: [companyId],
          ...(viewMode ? { userId } : { deltaId: filter.deltaId })
        },
        method: "post"
      }
    }
  )

  const columns: TableColumnType<TList> = [
    {
      title: "",
      dataIndex: "unitId",
      render: (_: any, record: TList) => (
        <UserCorpCheckBox
          record={record}
          setData={setData}
          setTree={setTree}
          companyId={companyId}
        />
      )
    },
    {
      title: "Code",
      dataIndex: "unitCode",
      key: "unitCode"
    },
    {
      title: "Name",
      dataIndex: "unitName",
      key: "unitName"
    },
    {
      title: "Parent Name",
      dataIndex: "parentName",
      key: "parentName"
    }
  ].filter((_, i) => !(!i && viewMode))
  const setDataFilter = (data: any) =>
    setFilter({
      list: filter.list.map((s) => (s.companyId == companyId ? { ...s, ...data } : s))
    })
  return (
    <div className="m-1">
      <SkeletonWrapper loading={loading} skeleton={<TableSkeleton />}>
        <div className="d-flex align-items-center justify-content-between  mb-1">
          <div className="d-flex align-items-center ">
            <label htmlFor="rows-per-page">Show</label>
            <SearchableSelect
              id="count-dropdown"
              options={[25, 50, 100].map((label) => ({ label, value: label }))}
              value={params?.count}
              className="ms-1"
              onChange={(count) => setDataFilter({ count, page: 1 })}
              style={{ width: "4rem" }}
            />
          </div>
          <div className="d-flex align-items-center gap-1">
            <Input.Search
              placeholder="Search"
              allowClear
              id="search-box"
              onSearch={(searchTerm) => setDataFilter({ searchTerm, page: 1 })}
              style={{ width: 200 }}
              defaultValue={params?.searchTerm ?? ""}
            />
          </div>
        </div>
        <Table
          columns={columns}
          id="user-corp-table"
          dataSource={data?.list.map((s) => ({ ...s, key: s.unitId })) ?? []}
          pagination={false}
        />
        <div className="w-100 d-flex justify-content-end mt-1">
          <Pagination
            current={params?.page}
            onChange={(page: number) => setDataFilter({ page })}
            total={data?.totalCount}
            pageSize={params?.count}
            showTotal={(total, range) =>
              range[1] ? `${range[0]}-${range[1]} of ${total} records` : "No records"
            }
          />
        </div>
      </SkeletonWrapper>
    </div>
  )
}

export default UserCorpTable
