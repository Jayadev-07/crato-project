import { NavigationType } from "@src/types/router"
import { Circle, FileText, Shield, ShoppingBag, Truck, Book } from "react-feather"

const expenses: NavigationType = [
  {
    title: "Expenses",
    icon: ShoppingBag,
    accessId: "Expenses",
    children: [
      {
        title: "Vendors",
        icon: Truck,
        accessId: "Vendor_Management",
        accessRestricted: true,
        navLink: "/expense/vendors"
      },
      {
        title: "Bill Processing",
        icon: FileText,
        accessId: "Bill_Processing",
        children: [
          {
            title: "In Process",
            icon: Circle,
            accessId: "Bill_Processing",
            isHaveGrantParent: true,
            grantParentId: "Expenses",
            navLink: "/ap/invoice/processing"
          },
          {
            title: "All Bills",
            icon: Circle,
            accessId: "Bill_Processing",
            isHaveGrantParent: true,
            grantParentId: "Expenses",
            navLink: "/ap/invoice/allbills"
          }
        ]
      },
      {
        title: "Payments",
        icon: Shield,
        accessId: "Pay_Bills",
        children: [
          {
            title: "Make Payments",
            icon: Circle,
            accessId: "Pay_Bills",
            isHaveGrantParent: true,
            grantParentId: "Expenses",
            navLink: `/ap/cratopay/make-payments`
          },
          {
            title: "Track Payments",
            icon: Circle,
            accessId: "Pay_Bills",
            isHaveGrantParent: true,
            grantParentId: "Expenses",
            navLink: `/ap/cratopay/track-payment`
          },
          {
            title: "Apply Payments",
            icon: Circle,
            accessId: "Pay_Bills",
            isHaveGrantParent: true,
            grantParentId: "Expenses",
            navLink: `/expense/payments/apply-payments`
          }
        ]
      },
      {
        title: "Purchase Order",
        icon: Book,
        accessId: "Purchase_Order",
        accessRestricted: true,
        navLink: `/ap/purchase-order`
      }
    ]
  }
]

export default expenses
