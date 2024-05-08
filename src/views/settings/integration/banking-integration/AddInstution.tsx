import { Button, Modal } from "antd"
import { useState } from "react"
import { Card, CardBody } from "reactstrap"

const AddInstution = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  return (
    <div className="col-lg-4 col-md-12 bank-details">
      <Card className="py-2">
        <CardBody>
          <Button type="primary" onClick={showModal}>
            Open Modal
          </Button>
          <Modal open={isModalOpen} onCancel={handleCancel} width={"65vw"} footer={null}>
            <div className="d-flex flex-column align-items-center">
              <h3 className="mt-2 text-center">Add Financial Instituion</h3>
              <div className="d-lg-flex gap-1 md">
                <Card className="w-100  mb-sm-1">
                  <CardBody>
                    <div>
                      <img src="" alt="" />
                    </div>
                    <h4>Integration with financial instituions</h4>
                    <p>
                      Cratoflow uses Plaid, an esteemed and secured banking tool, to
                      integrate your financial institutions
                    </p>
                  </CardBody>
                </Card>
                <Card className="w-100 mb-sm-1">
                  <CardBody>
                    <div>
                      <img src="" alt="" />
                    </div>
                    <h4>Manual upload of financial txns</h4>
                    <p>
                      Use this option for any financial institution that is not connected
                      through Plaid
                    </p>
                  </CardBody>
                </Card>
              </div>
            </div>
          </Modal>
        </CardBody>
      </Card>
    </div>
  )
}

export default AddInstution
