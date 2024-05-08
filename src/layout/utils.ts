export const resolveVerticalNavMenuItemComponent = (item: any) => {
  if (item.header) return "VerticalNavMenuSectionHeader"
  if (item.children) return "VerticalNavMenuGroup"
  return "VerticalNavMenuLink"
}

export const resolveHorizontalNavMenuItemComponent = (item: any) => {
  if (item.children) return "HorizontalNavMenuGroup"
  return "HorizontalNavMenuLink"
}

export const hasActiveChild = (item: any, currentUrl: any) => {
  const { children } = item
  if (!children) return false

  for (const child of children) {
    if (child.children) {
      if (hasActiveChild(child, currentUrl)) {
        return true
      }
    }

    // Check if the child has a link and is active
    if (
      child &&
      child.navLink &&
      currentUrl &&
      (child.navLink === currentUrl || currentUrl.includes(child.navLink))
    )
      return true
  }

  return false
}

const validate = ({ id, children }: any, user: any) => {
  const roleAccess = user?.currentRoleAccess?.accessRestriction || Object.assign({}, {})
  return children?.length
    ? children.some((s: any) => validate(s, user))
    : roleAccess[id]?.access != "HIDE"
  // roleAccess[id]?.access != "HIDE"
}

export const canViewMenuGroup = (item: any, user: any) => {
  if (!user.tenantAccess) return false
  const recursiveCheck = (i: any) => {
    return i.children
      ? i.children.every(recursiveCheck)
      : getModuleRestrictedPages(user?.tenantAccess?.tenantAccessObjects).includes(i.id)
  }
  const isModuleRestricted = item.children.every(recursiveCheck)
  if (isModuleRestricted) return false
  return item.children && item.children.some((s: any) => validate(s, user))
}

export const canViewMenuItem = (item: any, user: any) => {
  const roleAccess = user?.currentRoleAccess?.accessRestriction || Object.assign({}, {})
  if (getModuleRestrictedPages(user?.tenantAccess?.tenantAccessObjects).includes(item.id))
    return false

  // const ability = useContext(AbilityContext)
  return roleAccess[item.id]?.access != "HIDE"
}

export const getModuleRestrictedPages = (arr: any = tenantAccessModel) => {
  const modMap = arr.reduce(
    (p: any, c: any) => ({
      ...p,
      ...c.subModules.reduce((q: any, w: any) => ({ ...q, [w.name]: w.active }), {})
    }),
    {}
  ) as any
  const pageCheck = tenantModuleMap.pages
    .filter((r) => r.modules.every((s) => modMap[s] == false))
    .map(({ page }) => page)
  return [
    ...arr?.reduce(
      (p: any, c: any) => [
        ...p,
        ...c.subModules.reduce((p1: any, c1: any) => {
          if (c1.active) return p1

          const data =
            tenantModuleMap?.modules[c1?.name as keyof typeof tenantModuleMap.modules]
          return [...p1, ...data]
        }, [])
      ],
      []
    ),
    ...pageCheck
  ]
}

export const removeChildren = (
  children: any,
  openGroup: any,
  currentActiveGroup: any
) => {
  children.forEach((child: any) => {
    if (!currentActiveGroup.includes(child.id)) {
      const index = openGroup.indexOf(child.id)
      if (index > -1) openGroup.splice(index, 1)
      if (child.children) removeChildren(child.children, openGroup, currentActiveGroup)
    }
  })
}

const tenantAccessModel = [
  {
    module: "Expense",
    subModules: [
      { name: "Vendors", active: true },
      { name: "Bill_Processing", active: true },
      { name: "Payments", active: true },
      {
        name: "Purchase_Order",
        active: true
      }
    ]
  },
  {
    module: "Revenue",
    subModules: [
      { name: "Customers", active: true },
      { name: "Invoicing", active: true },
      { name: "Sales", active: true },
      { name: "Cash_Application", active: true },
      { name: "Sales_Order", active: true }
    ]
  },
  {
    module: "Banking",
    subModules: [
      { name: "Bank_Posting", active: true },
      { name: "Bank_Reconciliation", active: true },
      { name: "Upload_Bank_Transaction", active: true }
    ]
  },
  {
    module: "Crato_Ledge",
    subModules: [{ name: "General_Ledger", active: true }]
  }
]

export const tenantModuleMap = {
  modules: {
    Vendors: ["Exp_Vendor_Management", "Con_Exp_VS"],
    Bill_Processing: [
      "Exp_BP_AB",
      "Exp_BP_IP",
      "Con_Exp_BP",
      "Con_CratoBot_BPR",
      "Con_CratoBot_CR"
    ],
    Payments: ["Exp_Payments_Mk", "Exp_Payments_Tk", "Exp_Payments_AP", "Con_Exp_CP"],
    Purchase_Order: ["Exp_PO", "Con_Exp_PO"],
    Customers: ["Rev_Customers", "Con_Rev_CC"],
    Invoicing: ["Rev_Invoicing", "Con_Rev_Inv"],
    Sales: [
      "Rev_Sales_Sales_Entries",
      "Rev_Sales_Sales_Input",
      "Con_Int_POS",
      "Con_Rev_Sales"
    ],
    Cash_Application: [
      "Rev_CA_AD",
      "Rev_CA_Remittance",
      "Rev_CA_Deductions",
      "Con_Rev_CA"
    ],
    Sales_Order: ["Rev_Sales_Order"],
    Bank_Posting: ["Bank_Unbooked_Transactions", "Bank_Booked_Transactions"],
    Bank_Reconciliation: ["Bank_Bank_Reconciliation", "Con_CratoBot_Recon_Rule"],
    Upload_Bank_Transaction: ["Bank_Upload_Bank_Transaction"],
    General_Ledger: ["CL_General_Ledger", "Con_CL_GL"]
  },
  pages: [
    {
      page: "Con_Int_Bank",
      modules: ["Cash_Application", "Bank_Posting", "Bank_Reconciliation"]
    },
    {
      page: "Con_CratoBot_Post_Rule",
      modules: ["Cash_Application", "Bank_Posting", "Bank_Reconciliation"]
    }
  ]
}
