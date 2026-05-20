import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — Queuera',
  description: 'How Queuera collects, uses, stores, and protects your data.',
};

const sectionClass = 'mt-10';
const headingClass = 'text-xl font-semibold text-indigo-600 mt-0 mb-4';
const paragraphClass = 'text-slate-700 leading-relaxed mb-4 last:mb-0';
const listClass = 'list-disc pl-6 text-slate-700 leading-relaxed space-y-2 mb-4';

export default function PrivacyPolicyPage() {
  return (
    <article>
      <header className="mb-10 pb-8 border-b border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Privacy Policy</h1>
        <p className="mt-3 text-slate-500 text-sm">Last updated: May 16, 2026</p>
      </header>

      <section className={sectionClass}>
        <h2 className={headingClass}>Introduction</h2>
        <p className={paragraphClass}>
          Queuera is a social media scheduling application that helps you compose content once and
          publish it to your connected Facebook Pages, Instagram Business accounts, and LinkedIn
          profiles at times you choose. The service is operated by Wania Mateen, a computer science
          student at the National University of Sciences and Technology (NUST), School of Electrical
          Engineering and Computer Science (SEECS), Islamabad, Pakistan, as an independent student
          project.
        </p>
        <p className={paragraphClass}>
          This Privacy Policy explains what information we collect when you use Queuera, how we use
          and protect that information, and what choices you have regarding your data. By creating an
          account or using the service, you agree to the practices described in this policy.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>Information We Collect</h2>
        <p className={paragraphClass}>
          We collect only the information necessary to provide scheduling and publishing features:
        </p>
        <ul className={listClass}>
          <li>
            <strong className="text-slate-900">Account credentials:</strong> When you register, we
            store your email address and a securely hashed password. We never store your password in
            plain text.
          </li>
          <li>
            <strong className="text-slate-900">OAuth tokens:</strong> When you connect Facebook,
            Instagram, or LinkedIn, we receive access tokens from those platforms. These tokens are
            encrypted using AES-256 before being stored in our database. We use them solely to
            publish posts and manage connections on your behalf.
          </li>
          <li>
            <strong className="text-slate-900">Post content and schedule data:</strong> We store the
            text and media URLs you submit for scheduling, along with the date and time you choose
            for each post and its publication status (queued, published, or failed).
          </li>
          <li>
            <strong className="text-slate-900">Connected account metadata:</strong> We store
            platform identifiers and display names for accounts you connect so you can select them
            when composing posts.
          </li>
        </ul>
        <p className={paragraphClass}>
          We do not collect analytics profiles, advertising identifiers, location tracking, or other
          usage data beyond what is required to operate the scheduling service described above.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>How We Use Your Information</h2>
        <p className={paragraphClass}>
          We use your information exclusively to operate Queuera for you:
        </p>
        <ul className={listClass}>
          <li>
            To authenticate you via JSON Web Token (JWT) sessions stored in httpOnly cookies, so your
            session remains secure and is not accessible to client-side JavaScript.
          </li>
          <li>
            To publish or schedule posts to the social accounts you have explicitly connected and
            authorized.
          </li>
          <li>
            To display your scheduled, published, and failed posts within the application dashboard.
          </li>
          <li>
            To maintain and revoke platform connections when you disconnect an account or delete your
            Queuera account.
          </li>
        </ul>
        <p className={paragraphClass}>
          We do not sell, rent, or trade your personal information to third parties. We do not use
          your data for advertising or unrelated marketing purposes.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>Third-Party Platforms</h2>
        <p className={paragraphClass}>
          Queuera integrates with external social networks. When you connect an account, you are
          subject to that platform&apos;s own terms and privacy policies in addition to this one.
        </p>

        <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Facebook and Instagram (Meta)</h3>
        <p className={paragraphClass}>
          To schedule and publish to Facebook Pages and Instagram Business accounts, Queuera requests
          the following permissions from Meta:
        </p>
        <ul className={listClass}>
          <li>
            <strong className="text-slate-900">pages_show_list</strong> — Allows us to list the
            Facebook Pages you manage so you can choose which Page to connect and post to.
          </li>
          <li>
            <strong className="text-slate-900">pages_read_engagement</strong> — Allows us to read
            basic Page information needed to verify the connection and display your Page identity in
            the app.
          </li>
          <li>
            <strong className="text-slate-900">pages_manage_posts</strong> — Allows us to create and
            publish scheduled posts to your connected Facebook Page on your behalf.
          </li>
          <li>
            <strong className="text-slate-900">instagram_basic</strong> — Allows us to identify your
            linked Instagram Business account associated with a Facebook Page.
          </li>
          <li>
            <strong className="text-slate-900">instagram_content_publish</strong> — Allows us to
            publish scheduled content to your Instagram Business account.
          </li>
        </ul>
        <p className={paragraphClass}>
          We use these permissions only for the features you initiate inside Queuera. We do not post
          without your explicit action, and we do not access private messages or unrelated personal
          data beyond what Meta provides for Page and Business publishing.
        </p>

        <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">LinkedIn</h3>
        <p className={paragraphClass}>
          To publish posts on your behalf to LinkedIn, Queuera requests the following permissions:
        </p>
        <ul className={listClass}>
          <li>
            <strong className="text-slate-900">openid</strong> — Enables secure sign-in and account
            identification through LinkedIn&apos;s OpenID Connect flow.
          </li>
          <li>
            <strong className="text-slate-900">profile</strong> — Allows us to display your name and
            profile identifier so you can confirm which LinkedIn account is connected.
          </li>
          <li>
            <strong className="text-slate-900">email</strong> — Allows us to associate your LinkedIn
            identity with your Queuera account during the connection process.
          </li>
          <li>
            <strong className="text-slate-900">w_member_social</strong> — Allows us to create and
            publish posts to your LinkedIn profile when you schedule content through Queuera.
          </li>
        </ul>
        <p className={paragraphClass}>
          LinkedIn data is used only to authenticate your connection and publish content you
          explicitly schedule. We do not access your connections, messages, or other LinkedIn features
          outside of posting.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>Data Storage and Security</h2>
        <p className={paragraphClass}>
          Your data is stored in MongoDB Atlas, a managed cloud database. OAuth access tokens are
          encrypted at rest using AES-256 before being written to the database. Application sessions
          are issued as JWTs and delivered to your browser in httpOnly cookies, which helps prevent
          cross-site scripting attacks from reading your session token.
        </p>
        <p className={paragraphClass}>
          The Queuera backend API is hosted on Koyeb, and the web application frontend is also
          deployed on Koyeb. All communication between your browser and our servers uses HTTPS.
          While we apply industry-standard safeguards, no method of transmission or storage is
          completely secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>Data Deletion</h2>
        <p className={paragraphClass}>
          You can disconnect any connected social account at any time from the Accounts page inside
          Queuera. Disconnecting removes the stored OAuth tokens for that platform from our database
          and prevents further publishing to that account.
        </p>
        <p className={paragraphClass}>
          To request deletion of your entire Queuera account and all associated data (including your
          email, hashed password, posts, and encrypted tokens), email{' '}
          <a href="mailto:wania.mateen@example.com" className="text-indigo-600 hover:text-indigo-700 underline">
            wania.mateen@example.com
          </a>
          . We will process verified deletion requests within 30 days.
        </p>
        <p className={paragraphClass}>
          If you connected Queuera through Facebook Login and wish to remove data that Meta shared
          with us, you may also submit a data deletion request to the same email address. We will
          delete the relevant tokens and account records in accordance with Meta&apos;s platform
          requirements.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>Contact</h2>
        <p className={paragraphClass}>
          For privacy-related questions, data access requests, or deletion requests, contact:
        </p>
        <p className={paragraphClass}>
          <strong className="text-slate-900">Wania Mateen</strong>
          <br />
          Email:{' '}
          <a href="mailto:wania.mateen@example.com" className="text-indigo-600 hover:text-indigo-700 underline">
            wania.mateen@example.com
          </a>
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>Changes to This Policy</h2>
        <p className={paragraphClass}>
          We may update this Privacy Policy from time to time to reflect changes in the service or
          legal requirements. When we make material changes, we will update the &quot;Last updated&quot;
          date at the top of this page. Your continued use of Queuera after changes are posted
          constitutes your acceptance of the revised policy. If you do not agree with an update, you
          should stop using the service and request account deletion.
        </p>
      </section>

      <p className="mt-12 text-sm text-slate-500">
        See also our{' '}
        <Link href="/legal/terms" className="text-indigo-600 hover:text-indigo-700 underline">
          Terms of Service
        </Link>
        .
      </p>
    </article>
  );
}
