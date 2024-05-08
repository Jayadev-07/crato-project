import { Form } from "antd"
import { ArrowLeft } from "react-feather"
import { Button, Label } from "reactstrap"
import Mandatory from "@custom-components/Mandatory"
import { TTenantId } from "."
import { Button as AntButton } from "antd"
import SearchableSelect from "@custom-components/SearchableSelect"

const TenantInfo = (props: TProp) => {
  const { onSubmit, tenantIdList, isLoading, handleOnGoBack, name } = props

  return (
    <>
      <h4 className="mt-50">Welcome {name}</h4>
      <Form
        layout="vertical"
        size="large"
        name="tenant"
        onFinish={onSubmit}
        requiredMark={false}
      >
        <Form.Item
          name="tenantId"
          label={<ChooseTenant onClick={handleOnGoBack} />}
          rules={[{ required: true }]}
        >
          <SearchableSelect
            options={tenantIdList}
            id="tenant-list"
            optionRender={(d) => <span id={d.value as string}>{d.label}</span>}
          />
        </Form.Item>

        <AntButton
          id="login-tenant-proceed"
          htmlType="submit"
          type="primary"
          block
          loading={isLoading}
          className="mt-75"
        >
          Continue
        </AntButton>
      </Form>
    </>
  )
}

export default TenantInfo

type TProp = {
  onSubmit: (values: any) => void
  tenantIdList: TTenantId[]
  isLoading: boolean
  handleOnGoBack: () => void
  name: string | undefined
}

const ChooseTenant = ({
  onClick
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>
}) => (
  <>
    <div
      style={{
        display: "flex",
        gap: ".2rem",
        alignItems: "center",
        margin: ".7rem 0"
      }}
    >
      <Button
        id="previous-btn"
        className="btn-icon rounded-circle"
        style={{ padding: "1px", marginRight: "1px" }}
        color="flat-secondary"
        onClick={onClick}
      >
        <ArrowLeft size={20} />
      </Button>
      <Label className="form-label mt-50" for="login-email">
        <Mandatory /> Choose Tenant
      </Label>
    </div>
  </>
)
