import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import { Navbar } from './components/layout/Navbar';
import { CustomCursor } from './components/ui/CustomCursor';
import { GrainOverlay } from './components/ui/GrainOverlay';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { PageTransition } from './components/ui/PageTransition';
import { TopFade } from './components/ui/TopFade';

const HomePage = lazy(() => import('./pages/HomePage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));

const Loader = styled.div`
  display: grid;
  min-height: 50vh;
  place-items: center;
  color: rgba(245, 245, 240, 0.5);
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
`;

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <GrainOverlay />
        <CustomCursor />
        <Navbar />
        <TopFade />
        <PageTransition>
          <Suspense
            fallback={
              <Loader aria-live="polite" role="status">
                Loading
              </Loader>
            }
          >
            <Routes>
              <Route element={<HomePage />} path="/" />
              <Route element={<BlogPage />} path="/blog" />
              <Route element={<BlogPostPage />} path="/blog/:slug" />
            </Routes>
          </Suspense>
        </PageTransition>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
