// app/routes/contact.tsx
import { Link } from "@remix-run/react";

import Layout from "~/components/Layout";


export const meta: MetaFunction = () => [
  { title: "Privacy Policy - Dad Routes" },
  { name: "description", content: "Privacy Policy of Dad Routes" },
  { name: "keywords", content: "family, travel, routes, adventures, Dad Routes" },
];

export default function Privacy() {
  return (
    <Layout>

      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
          <p><strong>Effective Date:</strong> [Insert Date]</p>

          <h2>Introduction</h2>
          <p>
            At [Your Company Name], we value your privacy. This Privacy Policy outlines how we collect, use, disclose, and protect your information when you visit our website [your website URL] or use our services.
          </p>

          <h2>Information We Collect</h2>
          <ul>
            <li><strong>Personal Information:</strong> When you register, subscribe, or contact us, you may provide personal information such as your name, email address, phone number, and billing information.</li>
            <li><strong>Usage Data:</strong> We collect information about how you interact with our services, including IP address, browser type, device information, pages visited, and time spent on those pages.</li>
            <li><strong>Cookies:</strong> We use cookies and similar tracking technologies to enhance your experience. You can control cookie settings through your browser.</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use your information for various purposes, including:</p>
          <ul>
            <li>To provide and maintain our services</li>
            <li>To notify you about changes to our services</li>
            <li>To allow you to participate in interactive features</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so we can improve our services</li>
            <li>To monitor the usage of our services</li>
            <li>To detect, prevent, and address technical issues</li>
            <li>To send you newsletters, marketing, or promotional materials (you can opt out at any time)</li>
          </ul>

          <h2>Disclosure of Your Information</h2>
          <p>We may share your information in the following situations:</p>
          <ul>
            <li><strong>With Service Providers:</strong> We may employ third-party companies and individuals to facilitate our services, process payments, or analyze how our services are used.</li>
            <li><strong>For Legal Reasons:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
            <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or asset sale, your personal information may be transferred.</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            The security of your data is important to us, and we strive to implement and maintain reasonable, commercially acceptable security procedures and practices appropriate to the nature of the information we store to protect it from unauthorized access, destruction, use, or alteration.
          </p>

          <h2>Your Rights</h2>
          <p>Depending on your location, you may have the following rights regarding your personal information:</p>
          <ul>
            <li>The right to access your data</li>
            <li>The right to request correction of inaccurate data</li>
            <li>The right to request deletion of your data</li>
            <li>The right to object to processing of your data</li>
            <li>The right to data portability</li>
          </ul>

          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <ul>
            <li>Email: [Your Email Address]</li>
            <li>Phone: [Your Phone Number]</li>
            <li>Address: [Your Company Address]</li>
          </ul>
        </div>

      </div>


    </Layout>
  );
}
