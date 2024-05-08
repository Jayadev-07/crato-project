import { Spinner } from "reactstrap"

type Props = { size?: string }

const CustomSpinner = ({ size = "md" }: Props) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        gap: "1rem",
        paddingBottom: ".5rem"
      }}
    >
      <Spinner className="text-primary" size={size} />
      {size == "md" ? (
        <h4 className="text-primary" style={{ margin: "0" }}>
          Loading
        </h4>
      ) : (
        <div className="text-primary" style={{ margin: "0" }}>
          Loading
        </div>
      )}
    </div>
  )
}

export default CustomSpinner
