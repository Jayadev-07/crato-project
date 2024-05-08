import { Card, Button, Badge } from "reactstrap"
import "@scss/components/connected-banks.scss"
import AddInstution from "./AddInstution"
import data from "./connected-banks.json"
const ConnectedBanks = () => {
  
  return (
    <section>
      <h3>Connect with your Financial Institution</h3>
      <div className="banking-container row">
        <AddInstution />
        {data.map((items, index) => (
          <div className="col-lg-4 col-md-12 bank-details" key={index}>
            <Card className="py-1 px-2 ">
              <div className="d-flex justify-content-between">
                <p>{items.name}</p>
                <Button color="primary" size="sm" className="mb-2 d-block text-center">
                  View
                </Button>
              </div>
              <div className="d-flex justify-content-between">
                <Badge color="light-primary " style={{ height: "20px" }}>
                  {items.status}
                </Badge>
                <p>Linked accounts: {items.linkedAccounts}</p>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ConnectedBanks
