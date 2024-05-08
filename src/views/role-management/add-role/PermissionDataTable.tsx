import { Empty } from "antd"
import { Input, Table } from "reactstrap"
import { TPermission } from "./Permissions"
import { TBUPrevileges, TModule, payloadSignal } from "."
import type { TOptions } from "@src/types/common.type"
import SearchableSelect from "@custom-components/SearchableSelect"
import "@scss/components/role-permission-table.scss"

const PermissionDataTable = (props: TProps) => {
  const { data, type, baseRole, isDisabled } = props
  const isModuleType = type == "MODULE"
  const isITManager = baseRole == "IT_MANAGER"
  const field = isModuleType ? "modulePermissions" : "businessUserPrivileges"

  const getData = (id: number) => {
    return payloadSignal.value[field]?.find((d) => d.pageId == id)
  }

  const getAccessValue = (id: number, access: TAccess) => {
    return (getData(id) as TModule)?.access == access
  }

  const updatedValue = (
    id: number,
    fieldName: string,
    value: TAccess | boolean | string[]
  ) => {
    return payloadSignal.value[field].map((d) => {
      if (d.pageId != id) return d
      return { ...d, [fieldName]: value }
    })
  }

  const accessChangeHandler = (id: number, access: TAccess) => {
    payloadSignal.value = {
      ...payloadSignal.value,
      [field]: updatedValue(id, "access", access)
    }
  }

  const getBUAccessValue = (id: number, access: TBUAccess) => {
    return (getData(id) as TBUPrevileges)?.[access] ?? false
  }

  const buAccessChangeHandler = (id: number, fieldName: TBUAccess, value: boolean) => {
    payloadSignal.value = {
      ...payloadSignal.value,
      [field]: updatedValue(id, fieldName, value)
    }
  }

  const getActionValue = (id: number, options: TOptions) => {
    const hasValue = (value: string) => getData(id)?.actions.some((d) => d == value)
    return options.filter((d) => hasValue(d.value))
  }

  const actionChangeHandler = (id: number, value: any[]) => {
    payloadSignal.value = {
      ...payloadSignal.value,
      [field]: updatedValue(id, "actions", value)
    }
  }

  return (
    <>
      <Table responsive>
        <thead>
          <tr>
            <th>Menu</th>
            <th>Screen</th>
            {isModuleType ? (
              <>
                {!isITManager && <th className="show-minimal">Hide</th>}
                <th className="show-minimal">Read</th>
                <th className="show-minimal">Write</th>
              </>
            ) : (
              <>
                <th>Approval Access</th>
                <th>Resolution Access</th>
              </>
            )}
            <th className="end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.menu}</td>
              <td>{d.screen}</td>
              {isModuleType ? (
                <>
                  {!isITManager && (
                    <td className="show-minimal">
                      <Input
                        disabled={isDisabled}
                        className="cursor-pointer"
                        type="radio"
                        checked={getAccessValue(d.pageId, "HIDE")}
                        name={`VISIBILITY${i}`}
                        id={`HIDE-VISIBILITY${i}`}
                        onChange={() => accessChangeHandler(d.pageId, "HIDE")}
                      />
                    </td>
                  )}
                  <td className="show-minimal">
                    <Input
                      className="cursor-pointer ms-50"
                      type="radio"
                      name={`VISIBILITY${i}`}
                      id={`READ-VISIBILITY${i}`}
                      disabled={isDisabled}
                      checked={getAccessValue(d.pageId, "READ")}
                      onChange={() => accessChangeHandler(d.pageId, "READ")}
                    />
                  </td>
                  <td className="show-minimal">
                    <Input
                      className="cursor-pointer ms-50"
                      type="radio"
                      disabled={isDisabled}
                      checked={getAccessValue(d.pageId, "WRITE")}
                      onChange={() => accessChangeHandler(d.pageId, "WRITE")}
                      name={`VISIBILITY${i}`}
                      id={`WRITE-VISIBILITY${i}`}
                    />
                  </td>
                </>
              ) : (
                <>
                  <td>
                    <Input
                      id={`approval-ACSESS${i}`}
                      className="cursor-pointer"
                      type="checkbox"
                      disabled={isDisabled}
                      checked={getBUAccessValue(d.pageId, "approval")}
                      name={`ACSESS${i}`}
                      onChange={({ target }) =>
                        buAccessChangeHandler(d.pageId, "approval", target.checked)
                      }
                    />
                  </td>
                  <td>
                    <Input
                      className="cursor-pointer"
                      type="checkbox"
                      disabled={isDisabled}
                      checked={getBUAccessValue(d.pageId, "resolution")}
                      name={`ACSESS${i}`}
                      id={`resolution-ACSESS${i}`}
                      onChange={({ target }) =>
                        buAccessChangeHandler(d.pageId, "resolution", target.checked)
                      }
                    />
                  </td>
                </>
              )}
              <td className="end">
                <SearchableSelect
                  id={`options-${i}`}
                  style={{ width: "15rem" }}
                  maxTagCount={"responsive"}
                  options={d.actions}
                  disabled={isDisabled}
                  mode="multiple"
                  value={getActionValue(d.pageId, d.actions)}
                  onChange={(v) => actionChangeHandler(d.pageId, v)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {!data.length && <Empty />}
    </>
  )
}

export default PermissionDataTable

type TProps = {
  type: "MODULE" | "BUSINESS_PREVILAGE"
  data: TPermission[]
  baseRole: string
  isDisabled: boolean
}
type TAccess = "WRITE" | "READ" | "HIDE"
type TBUAccess = "approval" | "resolution"
