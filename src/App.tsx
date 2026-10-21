import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { PageTransition } from "./components/ui/PageTransition";
import { TopFade } from "./components/ui/TopFade";
import { useLanguage } from "./i18n/LanguageContext";

const HomePage = lazy(() => import("./pages/HomePage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage"));
const SalePage = lazy(() => import("./pages/SalePage"));
const SaleDetailPage = lazy(() => import("./pages/SaleDetailPage"));
const RentPage = lazy(() => import("./pages/RentPage"));
const RentDetailPage = lazy(() => import("./pages/RentDetailPage"));
const WeBuyPage = lazy(() => import("./pages/WeBuyPage"));

const Loader = styled.div<{ $bright?: boolean }>`
  display: grid;
  min-height: 50vh;
  place-items: center;
  color: ${({ $bright }) =>
    $bright ? 'rgba(5, 6, 15, 0.45)' : 'rgba(245, 245, 240, 0.5)'};
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
`;

const SiteContent = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.content};
`;

const MainStack = styled.div`
  position: relative;
  z-index: 2;
`;

const BRIGHT_PREFIXES = ['/projekty', '/projects', '/prodej', '/pronajem', '/kupujeme'];

function isBrightPath(pathname: string) {
  return BRIGHT_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function LegacyProjectRedirect() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate replace to={slug ? `/projekty/${slug}` : '/projekty'} />;
}

function AppShell() {
  const { t } = useLanguage();
  const location = useLocation();
  const isBright = isBrightPath(location.pathname);

  return (
    <ErrorBoundary>
      <Navbar tone={isBright ? "light" : "dark"} />
      {!isBright ? <TopFade /> : null}
      <SiteContent>
        <MainStack>
          <PageTransition>
            <Suspense
              fallback={
                <Loader $bright={isBright} aria-live="polite" role="status">
                  {t.common.loading}
                </Loader>
              }
            >
              <Routes>
                <Route element={<HomePage />} path="/" />
                <Route element={<SalePage />} path="/prodej" />
                <Route element={<SaleDetailPage />} path="/prodej/:slug" />
                <Route element={<RentPage />} path="/pronajem" />
                <Route element={<RentDetailPage />} path="/pronajem/:slug" />
                <Route element={<WeBuyPage />} path="/kupujeme" />
                <Route element={<ProjectsPage />} path="/projekty" />
                <Route element={<ProjectDetailPage />} path="/projekty/:slug" />
                <Route element={<Navigate replace to="/projekty" />} path="/projects" />
                <Route element={<LegacyProjectRedirect />} path="/projects/:slug" />
                <Route element={<BlogPage />} path="/blog" />
                <Route element={<BlogPostPage />} path="/blog/:slug" />
              </Routes>
            </Suspense>
          </PageTransition>
        </MainStack>
        <Footer />
      </SiteContent>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
