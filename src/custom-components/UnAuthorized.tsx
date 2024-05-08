import { Result } from "antd"
import { Link } from "react-router-dom"
import { Button } from "reactstrap"

const UnAuthorized = () => {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not logged in, Please login to continue."
      extra={
        <Link to={"/login"}>
          <Button color="primary">Login</Button>
        </Link>
      }
    />
  )
}

export default UnAuthorized
