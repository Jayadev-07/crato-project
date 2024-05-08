import { WarningFilled } from "@ant-design/icons"
import { Button, Modal } from "antd"

type TStatusConfirmModal = {
  isOpen: boolean
  handleStatusUpdate: () => void
  onClose: () => void
  loading: boolean
}

const StatusConfirmModal: React.FC<TStatusConfirmModal> = ({
  isOpen,
  handleStatusUpdate,
  onClose,
  loading
}) => {
  return (
    <Modal
      title={
        <div className="d-flex align-items-center gap-1">
          <WarningFilled
            style={{
              fontSize: "24px",
              color: "#faad14"
            }}
          />
          <div>Deactivating chart of accounts</div>
        </div>
      }
      open={isOpen}
      footer={[
        <Button type="primary" key="cancel" id="cancel-inactivate" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          id="inactive-gl"
          key="submit"
          onClick={handleStatusUpdate}
          loading={loading}
        >
          Deactivate
        </Button>
      ]}
    >
      <p className="pt-1">
        <strong className="m-0">Are you sure to deactivate this GL account?</strong> Once
        saved, this GL account cannot be used in any accounting entries
      </p>
    </Modal>
  )
}

export default StatusConfirmModal
