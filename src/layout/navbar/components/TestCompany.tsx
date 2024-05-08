import { AlertCircle } from "react-feather"

const TestCompany = () => {
  return (
    <div className="uat-wrapper">
      <div className="uat-subtitle">
        Sample data is shown here.
        <p>
          See actual data for your business on the <strong>LIVE</strong> company.
        </p>
      </div>
      <h5 className="uat-title" style={{ padding: "5px 3rem 5px 1.6rem" }}>
        <AlertCircle color="white" /> TEST Company
      </h5>
    </div>
  )
}

export default TestCompany
