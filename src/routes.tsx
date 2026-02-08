import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./components/error-page";
import FormLayout from "./components/form-layout";
import Layout from "./components/layout";
import ProtectedRoutes from "./components/ProtectedRoutes";
import AddBookPage from "./pages/Book/AddBookPage";
import BookPage from "./pages/Book/BookPage";
import BooksPage from "./pages/Book/BooksPage";
import UpdateBookPage from "./pages/Book/UpdateBookPage";
import CheckoutsPage from "./pages/checkouts/CheckoutsPage";
import Dashboard from "./pages/Dashboard";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage";
import AddMemberPage from "./pages/Member/AddMemberPage";
import MembersPage from "./pages/Member/MembersPage";
import CategoriesPage from "./pages/categories/CategoriesPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import EditMemberPage from "./pages/Member/EditMemberPage";

const routes = createBrowserRouter([
  {
    element: <ProtectedRoutes />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: "/",
            element: <Dashboard />,
          },
          // books
          {
            path: "/books",
            element: <BooksPage />,
          },
          {
            path: "/books/add",
            element: <AddBookPage />,
          },
          {
            path: "/books/:id",
            element: <BookPage />,
          },
          {
            path: "/books/:id/edit",
            element: <UpdateBookPage />,
          },
          // membership
          {
            path: "/members",
            element: <MembersPage />,
          },
          {
            path: "/members/add",
            element: <AddMemberPage />,
          },
          {
            path: "/members/:id/edit",
            element: <EditMemberPage />,
          },
          {
            path: "/checkouts",
            element: <CheckoutsPage />,
          },
          {
            path: "/categories",
            element: <CategoriesPage />,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
          },
          {
            path: "/settings",
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
  {
    element: <FormLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
    ],
  },
]);

export default routes;
