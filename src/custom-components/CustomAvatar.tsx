// ** React Imports
import React, { forwardRef } from "react"

// ** Third Party Components
import classnames from "classnames"

// ** Reactstrap Imports
import { Badge } from "reactstrap"

type AvatarProps = Partial<{
  img: string
  size: "sm" | "lg" | "xl"
  icon: React.ReactNode
  color: string
  status: "online" | "offline" | "away" | "busy"
  badgeUp: boolean
  content: string
  tag: React.ElementType
  initials: boolean
  imgWidth: string | number
  className: string
  badgeText: string
  imgHeight: string | number
  badgeColor: string
  imgClassName: string
  contentStyles: React.CSSProperties
}>

const CustomAvatar = forwardRef<HTMLDivElement, AvatarProps>((props, ref) => {
  // ** Props
  const {
    img,
    size,
    icon,
    color,
    status,
    badgeUp,
    content,
    tag: Tag = "div",
    initials,
    imgWidth,
    className,
    badgeText,
    imgHeight,
    badgeColor,
    imgClassName,
    contentStyles,
    ...rest
  } = props

  // ** Function to extract initials from content
  const getInitials = (str: string) => {
    const results: string[] = []
    const wordArray = str.split(" ")
    wordArray.forEach((e) => {
      results.push(e[0])
    })
    return results.join("")
  }

  return (
    <Tag
      className={classnames("avatar", {
        [className!]: className,
        [`bg-${color}`]: color,
        [`avatar-${size}`]: size
      })}
      ref={ref}
      {...rest}
    >
      {!img ? (
        <span
          className={classnames("avatar-content", {
            "position-relative": badgeUp
          })}
          style={contentStyles}
        >
          {initials && content && getInitials(content!)}

          {icon && icon}
          {badgeUp && (
            <Badge
              color={badgeColor ? badgeColor : "primary"}
              className="badge-sm badge-up"
              pill
            >
              {badgeText && badgeText}
            </Badge>
          )}
        </span>
      ) : (
        <img
          className={imgClassName ?? ""}
          src={img}
          alt="avatarImg"
          height={imgHeight && !size ? imgHeight : 32}
          width={imgWidth && !size ? imgWidth : 32}
        />
      )}
      {status && (
        <span
          className={classnames({
            [`avatar-status-${status}`]: status,
            [`avatar-status-${size}`]: size
          })}
        ></span>
      )}
    </Tag>
  )
})

export default CustomAvatar
