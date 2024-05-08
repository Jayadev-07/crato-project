import { NavLink } from "react-router-dom"
import classnames from "classnames"

// import useFilter from "@hooks/useFilter"

const HorizontalNavMenuLink = ({ item, isChild, setMenuOpen }: any) => {
  // const { clearAllFiter } = useFilter()[3]

  const handleClick = () => {
    // clearAllFiter()
    if (setMenuOpen) {
      setMenuOpen(false)
    }
  }
  const Icon = item.icon
  return (
    <li
      onClick={handleClick}
      className={classnames("nav-item", {
        disabled: item.disabled
      })}
      style={{ padding: ".5rem", fontSize: ".9rem" }}
    >
      <NavLink
        style={{ padding: ".5rem", margin: "0" }}
        target={item.newTab ? "_blank" : undefined}
        to={item.navLink}
        className={({ isActive }) => {
          const commonClass = "d-flex align-items-center"
          if (isActive && !item.disabled && item.navLink !== "#") {
            if (isChild) return `${commonClass} dropdown-item active`
            return `${commonClass} nav-link active`
          } else {
            if (isChild) return `${commonClass} dropdown-item`
            return `${commonClass} nav-link`
          }
        }}
      >
        <Icon style={{ width: "16px", aspectRatio: "1/1" }} />
        <span id={item.id}>{item.title}</span>
      </NavLink>
    </li>
  )
}

export default HorizontalNavMenuLink
