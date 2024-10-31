import { Link } from "@remix-run/react";
import Layout from "./Layout";

export default function InvalidUser() {
  return (
    <Layout>

      <div className="error-page">
        <h1>User Not Found</h1>
        <p>The user you are looking for does not exist or is inactive.</p>
        <Link to="/search" className="btn btn-primary">Go to Search</Link>
      </div>
    </Layout>
  );
}
