import { lazy } from "react"

const UserManagement = lazy(() => import("@views/user-management"))
const InviteUser = lazy(() => import("@views/user-management/invite-user"))
const ViewIndividualUser = lazy(() => import("@views/user-management/[email]"))
const baseRoute = `user-management`

export const UserManagementRoutes = [
  {
    element: <UserManagement />,
    meta: {
      restricted: true,
      menuHidden: true
    }
  },
  {
    path: "/invite-user",
    element: <InviteUser />,
    meta: {
      restricted: true,
      menuHidden: true
    }
  },
  {
    path: "/:email",
    element: <ViewIndividualUser />,
    meta: {
      restricted: true,
      menuHidden: true
    }
  }
].map((u) => ({ ...u, path: `${baseRoute}${u.path ?? ""}` }))
