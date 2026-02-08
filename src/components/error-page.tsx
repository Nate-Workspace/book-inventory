import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import NotFound from "./not-found";
import SmtError from "./smt-wrong";

const ErrorPage = () => {
  const error = useRouteError();

  return <>{isRouteErrorResponse(error) ? <NotFound /> : <SmtError />}</>;
};

export default ErrorPage;
