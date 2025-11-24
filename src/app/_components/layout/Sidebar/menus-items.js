import { useTranslation } from "react-i18next";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";

export function getMenus() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const menus = [
    {
      label: t("Home"),
      children: [
        {
          path: user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard",
          label: "Dashboard",
          icon: "",
        },
        {
          path: user?.role === "admin" ? "/admin/orders" : "/user/orders",
          label: "Orders",
          icon: "",
        },
        {
          path: "/",
          label: "Visit Site",
          icon: "",
        },
      ],
    },
    // {
    //   label: t("Products"),
    //   children: [
    //     {
    //       path: "/admin/add-products",
    //       label: "Add Product",
    //       icon: "",
    //     },
    //     {
    //       path: "/admin/products",
    //       label: "Manage Product",
    //       icon: "",
    //     },
    
    //   ],
    // },
    // {
    //   label: t("Product Categories"),
    //   children: [

    //     {
    //       path: "/admin/categories",
    //       label: "Categories",
    //       icon: "",
    //     },
    //     {
    //       path: "/admin/subcategories",
    //       label: "Sub-Categories",
    //       icon: "",
    //     },
    
    //   ],
    // },
  ];
  if (user?.role === "admin") {
    menus.push(
      {
      label: t("Admin"),
      children: [
        {
          label: t("Products"),
          collapsible: true,
          icon: "",
          children: [
            {
              path: "/admin/add-products",
              label: "Add Product",
            },
            {
              path: "/admin/products",
              label: "Manage Product",
            },
          ],
        },
        {
          label: t("Product Categories"),
          collapsible: true,
          icon: "",
          children: [
            {
              path: "/admin/categories",
              label: "Categories",
            },
            {
              path: "/admin/subcategories",
              label: "Sub-Categories",
            },
          ],
        },
    
      ],
    },
    )
  };
  return menus;
};
