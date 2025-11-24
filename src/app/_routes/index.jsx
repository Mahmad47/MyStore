import Login1 from "@app/pages/auth/login1";
import Signup1 from "@app/pages/auth/signup1";
import { createBrowserRouter } from "react-router-dom";
import LandingPage from "@app/pages";
import ProductDetails from "@app/pages/admin/products/[id]";
import ProfilePage from "@app/pages/profile/profile";
import CategoriesPage from "@app/pages/admin/product-categories/categories";
import SubcategoriesPage from "@app/pages/admin/product-categories/subcategories";
import ProductsPage from "@app/pages/admin/products";
import MiscPage from "@app/pages/order-history";
import SimpleTask from "@app/pages/simple-task";
import { StretchedLayout } from "@app/_layouts/StretchedLayout";
import LandingLayout from "@app/_layouts/LandingLayout/LandingLayout";
import { SoloLayout } from "@app/_layouts/SoloLayout"; 
import withAuth from "@app/_hoc/withAuth";
import withAdminAuth from "@app/_hoc/withAdminAuth";
import { Page, NotFound404 } from "@app/_components/_core";
import AddProductsPage from "@app/pages/admin/products/add";
import CheckoutPage from "@app/pages/checkout";
import OrderHistoryPage from "@app/pages/order-history";
import OrderSuccessPage from "@app/pages/OrderSuccessPage/OrderSuccessPage";
import UserProfilePage from "@app/pages/user-profile";
import DashboardPage from "@app/pages/admin/dashboard";
import UserDashboardPage from "@app/pages/dashboard";
import AdminOrdersPage from "@app/pages/admin/AdminOrders";
import ShopPage from "@app/pages/shop";

const routes = [
  {
    path: "/",
    element: <LandingLayout />,
    children: [
      {
        path: "/",
        element: <Page Component={LandingPage} />,
      },
      {
        path: "/products/:id" ,
        element: <Page Component={ProductDetails} />,
      },
      {
        path: "/checkout" ,
        element: <Page Component={CheckoutPage} hoc={withAuth}/>,
      },
      {
        path: "/shop" ,
        element: <Page Component={ShopPage}/>,
      },
      {
        path: "/order-success",
        element: <Page Component={OrderSuccessPage} hoc={withAuth}/>,
      },
    ],
  },
  {
    path: "user",
    element: <StretchedLayout />,
    children: [
      {
        path: "profile",
        element: <Page Component={ProfilePage} hoc={withAuth}/>,
      },
      {
        path: "orders",
        element: <Page Component={OrderHistoryPage} hoc={withAuth}/>,
      },
      {
        path: "dashboard",
        element: <Page Component={UserDashboardPage} hoc={withAuth} />,
      },
    ],
  },
  {
    path: "/auth",
    element: <SoloLayout/>,
    children: [
      {
        path: "login-1",
        element: <Login1 />,
      },
      {
        path: "signup-1",
        element: <Signup1  />,
      },
    ],
  },
  {
    path: "/admin",
    element: <StretchedLayout />,
    children: [
      {
        path: "dashboard",
        element: <Page Component={DashboardPage} hoc={withAdminAuth} />,
      },
      {
        path: "categories",
        element: <Page Component={CategoriesPage} hoc={withAdminAuth} />,
      },
      {
        path: "subcategories",
        element: <Page Component={SubcategoriesPage} hoc={withAdminAuth} />,
      },
      {
        path: "products",
        element: <Page Component={ProductsPage} hoc={withAdminAuth} />,
      },
      {
        path: "add-products",
        element: <Page Component={AddProductsPage} hoc={withAdminAuth} />,
      },
      {
        path: "orders",
        element: <Page Component={AdminOrdersPage} hoc={withAdminAuth} />,
      },
      {
        path: "profile",
        element: <Page Component={ProfilePage} hoc={withAdminAuth} />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound404 />,
  },
];

export const router = createBrowserRouter(routes);
