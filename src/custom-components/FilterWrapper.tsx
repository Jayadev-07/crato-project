import { PageType } from "@hooks/useFilter"
import { ReactNode } from "react"
import { Button, Card, CardBody } from "reactstrap"

const FilterWrapper = (props: TProps) => {
  const { children, showClear = false, renderExtraContent = <></>, page } = props

  const clearFilterHandler = () => {}

  return (
    <Card>
      <CardBody>
        <div id={page} className="d-flex align-items-center justify-content-between">
          <div className="demo-inline-spacing">
            <div>Filter by : </div>
            {children}
          </div>

          <div>
            {renderExtraContent}
            {showClear && (
              <Button
                onClick={clearFilterHandler}
                size="sm"
                color="danger"
                outline
                className="rounded-pill"
                id="filter-clear-all"
              >
                Clear All Filter
              </Button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default FilterWrapper

type TProps = {
  page: PageType
  children: ReactNode
  showClear?: boolean
  renderExtraContent?: ReactNode
}
