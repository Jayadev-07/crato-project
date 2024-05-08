import { DatePicker, Drawer, Select, Tooltip } from "antd"
import { TBankDetail } from "."
import dayjs from "dayjs"
import { Badge } from "reactstrap"
import { QuestionCircleOutlined } from "@ant-design/icons"

const EditAcctData = ({ open, setOpen, dataValue, setDataValue }: TState) => {
  const dateFormat = "YYYY-MM-DD"
  const onClose = () => {
    setOpen(false)
    setDataValue({} as TBankDetail)
  }

  return (
    <>
      <Drawer title="Edit Connected Accounts" onClose={onClose} open={open}>
        <form>
          <div className="row" style={{ color: "#414a4c", fontSize: "13px" }}>
            <div className="col-6 mt-1">Institution Name</div>
            <div className="col-6  mt-1">: {dataValue.institution}</div>
            <div className="col-6  mt-1">Account Nature</div>
            <div className="col-6  mt-1">: {dataValue.acctNature}</div>
            <div className="col-6  mt-1">Account Type</div>
            <div className="col-6  mt-1">: {dataValue.acctType}</div>
            <div className="col-6  mt-1">Account Number</div>
            <div className="col-6  mt-1">: {dataValue.acctNumber}</div>
            <div className="col-6  mt-1">Status</div>
            <div className="col-6  mt-1">
              :&nbsp;
              <Badge
                color={dataValue.status === "active" ? "light-primary" : "light-danger"}
              >
                {dataValue.status === "active" ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="col-6 mt-1">Currency</div>
            <div className="col-6 mt-1">: USD</div>
            <div className="col-6 mt-1">
              Start Date
              <span className="text-danger" style={{ fontSize: "16px" }}>
                *
              </span>
              &nbsp;&nbsp;
              <span style={{ cursor: "pointer" }}>
                <Tooltip title="prompt text">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
              <div>
                {"("}From which date transaction are synced{")"}
              </div>
            </div>
            <div className="col-6 mt-1">
              &nbsp;
              <DatePicker defaultValue={dayjs("2024-01-01", dateFormat)} />
            </div>
            <div className="col-6 mt-1">
              GL Account Number&nbsp;
              <span className="text-danger" style={{ fontSize: "16px" }}>
                *
              </span>
            </div>
            <div className="col-6 mt-1">
              &nbsp;<Select></Select>
            </div>
          </div>
        </form>
      </Drawer>
    </>
  )
}

export default EditAcctData

type TState = {
  open: boolean
  setOpen: (value: boolean) => void
  dataValue: TBankDetail
  setDataValue: (value: TBankDetail) => void
}
