import { useRoutes } from "raviger";
import About from "../pages/About";
import Container from "../components/Container";
import Home from "../pages/Home";
import Form from "../pages/Form";
import PreviewForm from "../pages/PreviewForm";
import Login from "../pages/Login";

const routes = {
  "/": () => <Home />,
  "/about": () => <About />,
  "/form/:formId": ({ formId }: { formId: string }) => (
    <Form formId={Number(formId)} />
  ),
  "/preview/:formId": ({ formId }: { formId: string }) => (
    <PreviewForm formId={Number(formId)} />
  ),
  "/login": () => <Login />,
  "*": () => <div>404</div>
};

export default function AppRouter() {
  const routeResult = useRoutes(routes);
  return <Container>{routeResult}</Container>;
}
