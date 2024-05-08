import { ComponentProps, ReactNode, useEffect, useState } from "react"

const ScrollToTop = (props: Props) => {
  const { children, showOffset } = props

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset >= showOffset) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    })
  }, [])

  const handleScrollToTop = () => {
    window.scroll({ top: 0, behavior: "smooth" })
  }

  if (!visible) return null
  return (
    <div className="scroll-to-top" onClick={handleScrollToTop}>
      {children}
    </div>
  )
}

export default ScrollToTop

interface Props extends ComponentProps<"div"> {
  children: ReactNode
  showOffset: number
}
