import * as React from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import PageNotFound from './modules/errors/PageNotFound';
import AppRoot from "./root/AppRoot";
import HomePage from "./modules/homePage/landingPage";
import ProductList from './modules/productPage/productList';
import CartAddList from './modules/cartPage/cartAddList';
import OrderPage from './modules/orderPage/orderPage';
import OrderTracking from './modules/orderTracking/orderTracking';
import BranchList from './modules/branchPage/branchList';
import Privacy from './modules/commonToast/privacy';
import TermsAndCondition from './modules/commonToast/termsAndCondition';

const AppRoutes: React.FC<any> = () => {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppRoot />,
      // errorElement: <PageNotFound />,
      children: [
        {
          index: true,
          element: <Navigate to="/homepage" replace={true} />,
        },
        {
          path: '/homepage',
          element: <HomePage />
        },
        {
          path: '/category-merchant/list',
          element: <BranchList />
        },
        {
          path: '/merchant-product/list',
          element: <ProductList />
        },
        {
          path: '/product-cart/list',
          element: <CartAddList/>
        },
        {
          path: '/orderPage',
          element: <OrderPage/>
        },
        {
          path: '/orderTracking',
          element: <OrderTracking/>
        },
        {
          path: '/privacy',
          element: <Privacy/>
        },
        {
          path: '/Driverprivacy',
          element: <Privacy/>
        },
        {
          path: '/termsAndCondition',
          element: <TermsAndCondition/>
        },
        {
          path: '/notserviceable',
          element: <PageNotFound/>
        }
      ]
    }
  ]);
  return <RouterProvider router={router} />
}

export default AppRoutes;