import { Badge } from "reactstrap"
import AddUpdateUnit from "./components/AddUpdateUnit"
import useFetch from "@hooks/useFetch"
import getUrl from "@api/url"
import useFilter from "@hooks/useFilter"
import AddUpdateSegment from "./components/AddUpdateSegment"
import Tick from "@assets/svg/tick.svg?react"
import Cancel from "@assets/svg/cancel.svg?react"
import { Skeleton, Table } from "antd"
import AntPagination from "@custom-components/AntPagination"
import TableHeader from "@custom-components/TableHeader"
import SkeletonWrapper from "@custom-components/skeleton/SkeletonWrapper"
import TableSkeleton from "@custom-components/skeleton/TableSkeleton"
import { getCompanyId } from "@utils/index"
type Props = {
  activeSegment: string
}

const CorpTable = (props: Props) => {
  const { filter } = useFilter("CORP_STRUTURE")
  // console.log(filter)
  const [res, { refetch, loading, isFirstLoad }] = useFetch<Response>(
    getUrl("MASTER_DATA_API", "CORP", "UNIT_FILTER"),
    {
      apiParams: {
        method: "POST",
        data: {
          ...filter,
          companyIds: [getCompanyId() ?? ""],
          segmentId: props.activeSegment
        }
      }
    }
  )
  const renderMark = (b?: boolean) => (b ? <Tick /> : <Cancel />)
  const columns: any["columns"] = res
    ? [
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
          title: "Status",
          dataIndex: "isActive",
          key: "isActive",
          render: (isActive: boolean) => (
            <Badge color={isActive ? "light-primary" : "light-danger"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          )
        },
        {
          title: "Actions",
          key: "Actions",
          render: (_: string, row: CorpUnitItemType) => (
            <AddUpdateUnit
              activeUnit={row}
              segment={res?.corpSegment}
              key={row.unitId}
              refetch={refetch}
            />
          )
        }
      ]
    : []
  return (
    <>
      <SkeletonWrapper
        loading={isFirstLoad}
        skeleton={
          <div className="m-1">
            <div className="d-flex  justify-content-between">
              <Skeleton.Input size="large" active />
              <Skeleton.Input active />
            </div>
            <TableSkeleton />
          </div>
        }
      >
        <div style={headerStyle}>
          <h3>
            {res?.corpSegment.segmentName}
            <span>
              <AddUpdateSegment activeSegment={res?.corpSegment} refetch={refetch} />
            </span>
          </h3>
          <div className="d-flex gap-1">
            <div>
              Header Field {renderMark(res?.corpSegment?.displaysIn?.includes("HEADER"))}
            </div>
            <div>
              Line Items {renderMark(res?.corpSegment?.displaysIn?.includes("LINE_ITEM"))}
            </div>
            <div>Mandatory Field {renderMark(res?.corpSegment?.isMandatory)}</div>
          </div>
        </div>
        <hr style={{ padding: 0, margin: 0 }} />
        <div className="react-dataTable">
          {res?.corpSegment && (
            <div className="m-1">
              <TableHeader currentPage="CORP_STRUTURE">
                <AddUpdateUnit segment={res.corpSegment} refetch={refetch} />
              </TableHeader>
              <Table
                columns={columns}
                id="corp-table"
                onRow={(_: CorpUnitItemType, index) => ({ id: `unit-${index}` })}
                dataSource={res.list ?? []}
                pagination={false}
                loading={loading}
              />
              <AntPagination
                isLoading
                totalCount={res?.totalCount}
                currentPage="CORP_STRUTURE"
              />
            </div>
          )}
        </div>
      </SkeletonWrapper>
    </>
  )
}

export default CorpTable

//create type for below variables

type Response = {
  totalCount: number
  list: CorpUnitItemType[]
  corpSegment: CorpSegment
}

export type CorpSegment = {
  segmentCode: string
  segmentName: string
  companyId: string
  erpId: string
  parentId: string
  parentName: string
  unitFields: string[]
  hasParent: boolean
  segmentId: string
  displaysIn: string[]
  isMandatory: boolean
  isRestricted: boolean
}

export type CorpUnitItemType = {
  unitName: string
  unitCode: string
  unitId: string
  isActive?: boolean
}

const headerStyle: React.CSSProperties = {
  padding: "1rem",
  paddingBottom: ".5rem",
  display: "flex",
  justifyContent: "space-between",
  width: "100%"
}
