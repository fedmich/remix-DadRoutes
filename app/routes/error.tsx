// app/routes/error.tsx
import React from 'react';
import Layout from '~/components/Layout';

export default function ErrorPage() {
  return (
    <Layout>
      <h1>Oops! Something went wrong.</h1>
      <p>We couldn't find the page you're looking for.</p>
    </Layout>
  );
}
