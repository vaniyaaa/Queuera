import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service — Queuera',
  description: 'Terms and conditions for using the Queuera social media scheduling service.',
};

const sectionClass = 'mt-10';
const headingClass = 'text-xl font-semibold text-indigo-600 mt-0 mb-4';
const paragraphClass = 'text-slate-700 leading-relaxed mb-4 last:mb-0';
const listClass = 'list-disc pl-6 text-slate-700 leading-relaxed space-y-2 mb-4';

export default function TermsOfServicePage() {
  return (
    <article>
      <header className="mb-10 pb-8 border-b border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Terms of Service</h1>
        <p className="mt-3 text-slate-500 text-sm">Last updated: May 16, 2026</p>
      </header>

      <section className={sectionClass}>
        <h2 className={headingClass}>Acceptance of Terms</h2>
        <p className={paragraphClass}>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of Queuera, a social
          media scheduling application operated by Wania Mateen as a student project at NUST SEECS,
          Islamabad. By creating an account, connecting a social platform, or otherwise using
          Queuera, you agree to be bound by these Terms and our{' '}
          <Link href="/legal/privacy" className="text-indigo-600 hover:text-indigo-700 underline">
            Privacy Policy
          </Link>
          . If you do not agree, you must not use the service.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>What Queuera Does</h2>
        <p className={paragraphClass}>
          Queuera allows you to compose social media posts and schedule them for publication to
          Facebook Pages, Instagram Business accounts, and LinkedIn profiles that you have explicitly
          authorized through each platform&apos;s OAuth connection flow. You choose which accounts to
          connect, what content to publish, and when posts should go live. Queuera stores your
          scheduled content and uses platform APIs to publish on your behalf at the times you
          specify.
        </p>
        <p className={paragraphClass}>
          Queuera is provided as a scheduling tool. We do not create content for you, manage your
          social media strategy, or guarantee reach, engagement, or compliance with any platform&apos;s
          internal policies beyond delivering posts according to your instructions.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>Your Responsibilities</h2>
        <p className={paragraphClass}>
          When you use Queuera, you agree to the following responsibilities:
        </p>
        <ul className={listClass}>
          <li>
            You own or have the necessary rights to all content you schedule through Queuera,
            including text, images, and links. You are solely responsible for ensuring you have
            permission to publish that content.
          </li>
          <li>
            You must comply with the terms of service, community guidelines, and developer policies of
            each platform you connect, including Meta&apos;s terms for Facebook and Instagram and
            LinkedIn&apos;s User Agreement and API terms.
          </li>
          <li>
            You must not use Queuera to publish spam, misleading content, hate speech, harassment,
            illegal material, or content that infringes intellectual property or privacy rights.
          </li>
          <li>
            You are responsible for maintaining the security of your Queuera login credentials and for
            any activity that occurs under your account.
          </li>
        </ul>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>Prohibited Use</h2>
        <p className={paragraphClass}>
          You may not use Queuera to:
        </p>
        <ul className={listClass}>
          <li>
            Send bulk unsolicited messages, repetitive promotional spam, or automated engagement
            designed to manipulate platform algorithms.
          </li>
          <li>
            Publish content that is unlawful, fraudulent, defamatory, or that violates applicable
            local, national, or international law.
          </li>
          <li>
            Attempt to circumvent rate limits, abuse platform APIs, scrape data, or interfere with
            the normal operation of Queuera or connected third-party services.
          </li>
          <li>
            Access another user&apos;s account or connected platforms without authorization.
          </li>
        </ul>
        <p className={paragraphClass}>
          Violation of these rules may result in immediate suspension or termination of your account
          without prior notice.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>Service Availability</h2>
        <p className={paragraphClass}>
          Queuera is provided on a best-effort basis. We do not guarantee uninterrupted uptime,
          error-free operation, or that scheduled posts will always publish at the exact time
          requested. Posts may fail due to platform API outages, token expiration, rate limiting,
          content policy rejections, or network issues outside our control.
        </p>
        <p className={paragraphClass}>
          We may modify, suspend, or discontinue features at any time as the student project evolves.
          We will make reasonable efforts to notify users of significant changes when practical, but
          we are not obligated to maintain any specific feature indefinitely.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>Account Termination</h2>
        <p className={paragraphClass}>
          You may stop using Queuera at any time by disconnecting your social accounts and requesting
          account deletion as described in our Privacy Policy. We reserve the right to suspend or
          terminate your access immediately if we believe you have violated these Terms, abused the
          service, or created legal or security risk for Queuera or connected platforms.
        </p>
        <p className={paragraphClass}>
          Upon termination, your right to use the service ends. We may delete or retain your data as
          described in the Privacy Policy and as required by law or platform obligations.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>Limitation of Liability</h2>
        <p className={paragraphClass}>
          To the fullest extent permitted by applicable law, Queuera and its operator are not liable
          for any indirect, incidental, special, consequential, or punitive damages arising from your
          use of the service. This includes, without limitation, damages for lost profits, lost data,
          failed or delayed posts, API errors, account restrictions imposed by third-party platforms,
          or any content you publish through Queuera.
        </p>
        <p className={paragraphClass}>
          You acknowledge that third-party platforms may reject, remove, or restrict content after
          publication, and that Queuera has no control over those decisions. Your sole remedy for
          dissatisfaction with the service is to stop using Queuera and disconnect your accounts.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>Governing Law</h2>
        <p className={paragraphClass}>
          These Terms are governed by and construed in accordance with the laws of the Islamic
          Republic of Pakistan, without regard to conflict-of-law principles. Any disputes arising
          from these Terms or your use of Queuera shall be subject to the exclusive jurisdiction of
          the courts located in Islamabad, Pakistan, unless otherwise required by mandatory applicable
          law.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>Contact</h2>
        <p className={paragraphClass}>
          Questions about these Terms may be directed to{' '}
          <a href="mailto:wania.mateen@example.com" className="text-indigo-600 hover:text-indigo-700 underline">
            wania.mateen@example.com
          </a>
          .
        </p>
      </section>

      <p className="mt-12 text-sm text-slate-500">
        See also our{' '}
        <Link href="/legal/privacy" className="text-indigo-600 hover:text-indigo-700 underline">
          Privacy Policy
        </Link>
        .
      </p>
    </article>
  );
}
