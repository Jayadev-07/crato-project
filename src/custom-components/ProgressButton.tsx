import { Button, Spinner, ButtonProps } from "reactstrap"

const ProgressButton = (props: Props) => {
  const { loading = false, children, ...rest } = props
  return (
    <Button color="primary" disabled={loading} {...rest}>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner size="sm" />
          <span className="align-middle ms-25">{children}</span>
        </div>
      ) : (
        children
      )}
    </Button>
  )
}

export default ProgressButton

interface Props extends ButtonProps {
  loading?: boolean
}
