import { AlertCircle } from "react-feather"

const SandBoxEnv = () => {
  if (import.meta.env.VITE_ENVIRONMENT !== "Sandbox") return <></>
  return (
    <div className="uat-wrapper">
      <div className="uat-subtitle">
        Sample data is shown here.
        <p>
          See actual data for your business on the <strong>LIVE</strong> site.
        </p>
      </div>
      <h5 className="uat-title">
        <AlertCircle color="white" /> TEST SITE
      </h5>
    </div>
  )
}

export default SandBoxEnv
