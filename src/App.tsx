import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { Navbar } from "./components/layout/Navbar";
import { CustomCursor } from "./components/ui/CustomCursor";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { PageTransition } from "./components/ui/PageTransition";
import { TopFade } from "./components/ui/TopFade";
import { useLanguage } from "./i18n/LanguageContext";

const HomePage = lazy(() => import("./pages/HomePage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const AdminPortalPage = lazy(() => import("./pages/AdminPortalPage"));

const Loader = styled.div`
  display: grid;
  min-height: 50vh;
  place-items: center;
  color: rgba(245, 245, 240, 0.5);
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

function App() {
  const { t } = useLanguage();

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <CustomCursor />
        <Navbar />
        <TopFade />
        <SiteContent>
          <MainStack>
            <PageTransition>
          <Suspense
            fallback={
              <Loader aria-live="polite" role="status">
                {t.common.loading}
              </Loader>
            }
          >
            <Routes>
              <Route element={<HomePage />} path="/" />
              <Route element={<BlogPage />} path="/blog" />
              <Route element={<BlogPostPage />} path="/blog/:slug" />
              <Route element={<AdminPortalPage />} path="/admin/*" />
            </Routes>
          </Suspense>
            </PageTransition>
          </MainStack>
        </SiteContent>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
