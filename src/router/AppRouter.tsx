import React, { Suspense } from "react";
import { useRoutes } from "raviger";

import Loading from "../components/LoadingComponent";
import Container from "../components/Container";

const Login = React.lazy(() => import("../pages/Login"));
const Home = React.lazy(() => import("../pages/Home"));
const About = React.lazy(() => import("../pages/About"));
const Form = React.lazy(() => import("../pages/Form"));
const PreviewForm = React.lazy(() => import("../pages/PreviewForm"));
const FormSubmissions = React.lazy(() => import("../pages/FormSubmissions"));

const routes = {
  "/": () => <Home />,
  "/about": () => <About />,
  "/form/:formId": ({ formId }: { formId: string }) => (
    <Form formId={Number(formId)} />
  ),
  "/preview/:formId": ({ formId }: { formId: string }) => (
    <PreviewForm formId={Number(formId)} />
  ),
  "/preview/:formId/:previewId": ({formId, previewId}: {formId: string, previewId: string}) => (
    <PreviewForm formId={Number(formId)} previewId={Number(previewId)} />
  ),
  "/submissions/:formId": ({formId}: {formId: string}) => (
    <FormSubmissions
      formId={Number(formId)}
    />
  ),
  "/login": () => <Login />,
  "*": () => <div>404</div>
};

export default function AppRouter() {
  const routeResult = useRoutes(routes);
  return <Suspense fallback={<Loading />}><Container>{routeResult}</Container></Suspense>;
}
