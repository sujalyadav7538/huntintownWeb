import { X } from "lucide-react";

interface TermsAndConditionsPageProps {
  onClose: () => void;
  onAccept: () => void;
}

export default function TermsAndConditionsPage({
  onClose,
  onAccept,
}: TermsAndConditionsPageProps) {

  const content = (
    <div className="relative mx-auto max-w-3xl ">
      <header className="mb-8 border-b border-white/10 pb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#FF6B6B]">
          HuntInTown
        </p>

        <h1 id="terms-title" className="mt-2 text-3xl font-bold sm:text-4xl">
          Terms &amp; Conditions
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
          Please review the terms governing your use of HuntInTown and how
          information is handled when you use the platform.
        </p>

        <p className="mt-3 text-xs text-zinc-500">
          Effective date: October 6, 2026
        </p>
      </header>

      <div className="space-y-8 text-sm leading-7 text-zinc-300">
        {/* Terms */}
        <section id="terms">
          <h2 className="mb-3 text-lg font-semibold text-white">
            Terms &amp; Conditions
          </h2>

          <div className="space-y-3">
            <p>
              By creating an account or using HuntInTown, you agree to these
              Terms &amp; Conditions and the Privacy Policy. If you do not agree
              with these terms, please do not use the service.
            </p>

            <p>
              HuntInTown is a platform that helps people discover and connect
              with individuals, professionals, freelancers, and businesses for
              local requirements and opportunities. HuntInTown does not itself
              provide the services listed by users unless explicitly stated
              otherwise.
            </p>

            <p>
              You must provide accurate and up-to-date information when creating
              an account. You are responsible for maintaining the security of
              your account and for all activity performed through your account.
            </p>

            <p>
              You agree to use HuntInTown lawfully and respectfully. You must
              not post deceptive, fraudulent, unlawful, threatening, abusive, or
              misleading content, impersonate another person or business, or
              share another person's private information without authorization.
            </p>
          </div>
        </section>

        {/* User Content */}
        <section id="user-content" className="border-t border-white/10 pt-7">
          <h2 className="mb-3 text-lg font-semibold text-white">
            User Content &amp; Responsibilities
          </h2>

          <div className="space-y-3">
            <p>
              You are responsible for the requirements, offers, profiles,
              messages, images, reviews, and other content you submit to
              HuntInTown. You represent that you have the right to share that
              content and that it does not violate applicable law or another
              person's rights.
            </p>

            <p>
              You retain ownership of content you submit. By submitting content
              to HuntInTown, you grant HuntInTown a non-exclusive, worldwide,
              royalty-free license to host, store, reproduce, display, and
              process that content as reasonably necessary to operate, maintain,
              improve, and promote the service.
            </p>

            <p>
              HuntInTown may remove content or restrict accounts that violate
              these terms, applicable law, or the safety of users.
            </p>
          </div>
        </section>

        {/* User Connections */}
        <section id="connections" className="border-t border-white/10 pt-7">
          <h2 className="mb-3 text-lg font-semibold text-white">
            User Connections &amp; Agreements
          </h2>

          <div className="space-y-3">
            <p>
              HuntInTown facilitates discovery and communication between users.
              We do not guarantee the identity, qualifications, availability,
              reliability, quality, legality, or performance of any user,
              professional, business, product, or service listed on the
              platform.
            </p>

            <p>
              Any agreement, service arrangement, purchase, payment, delivery,
              quotation, or other transaction between users is made directly
              between the parties involved. Users are responsible for
              independently evaluating the person or business they choose to
              work with.
            </p>

            <p>
              HuntInTown does not act as a party to agreements between users and
              does not provide escrow or payment settlement services for
              user-to-user transactions unless a specific feature expressly
              states otherwise.
            </p>

            <p>
              Users should exercise reasonable caution when communicating with
              or meeting other users. Never share passwords, authentication
              codes, banking credentials, card details, or other sensitive
              information with strangers.
            </p>
          </div>
        </section>

        {/* Prohibited Activities */}
        <section id="prohibited" className="border-t border-white/10 pt-7">
          <h2 className="mb-3 text-lg font-semibold text-white">
            Prohibited Activities
          </h2>

          <div className="space-y-3">
            <p>You may not use HuntInTown to:</p>

            <ul className="list-disc space-y-2 pl-5">
              <li>
                Commit or facilitate fraud, scams, or unlawful activities.
              </li>
              <li>
                Post false, misleading, deceptive, or impersonating information.
              </li>
              <li>
                Harass, threaten, abuse, exploit, or discriminate against
                another person.
              </li>
              <li>
                Publish another person's private or sensitive information
                without authorization.
              </li>
              <li>
                Upload malicious software, harmful code, or content intended to
                disrupt the service.
              </li>
              <li>
                Attempt unauthorized access to accounts, systems, APIs, or data.
              </li>
              <li>
                Scrape, copy, or systematically collect platform data without
                authorization.
              </li>
              <li>
                Create accounts or identities for deceptive or abusive purposes.
              </li>
            </ul>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="border-t border-white/10 pt-7">
          <h2 className="mb-3 text-lg font-semibold text-white">
            Reviews &amp; Ratings
          </h2>

          <div className="space-y-3">
            <p>
              Reviews and ratings should reflect genuine experiences. Reviews
              must not contain threats, personal attacks, discriminatory
              content, false claims, or private information.
            </p>

            <p>
              HuntInTown may remove or restrict reviews that appear fraudulent,
              manipulated, abusive, irrelevant, or otherwise inconsistent with
              these terms.
            </p>
          </div>
        </section>

        {/* Privacy */}
        <section id="privacy" className="border-t border-white/10 pt-7">
          <h2 className="mb-3 text-lg font-semibold text-white">
            Privacy Policy
          </h2>

          <div className="space-y-3">
            <p>
              We process information you provide, such as your name, email
              address, profile information, posts, messages, preferences, and
              location information, to provide, maintain, secure, and improve
              HuntInTown.
            </p>

            <p>
              Depending on the features you use, we may process information
              about your interactions with the platform, including activity,
              searches, communications, and technical information such as
              device, browser, and IP-related information.
            </p>

            <p>
              Information included in your public profile, requirements, offers,
              reviews, or other public content may be visible to other users. Do
              not publish passwords, financial credentials, government
              identification numbers, or other sensitive information in public
              areas.
            </p>

            <p>
              We may use third-party service providers and infrastructure
              providers to operate hosting, authentication, databases,
              communications, analytics, security, and other platform
              functionality.
            </p>

            <p>
              We may disclose information when reasonably necessary to comply
              with applicable law, respond to lawful requests, protect users or
              the platform, investigate abuse, or enforce these terms.
            </p>

            <p>
              We take reasonable measures to protect information, but no
              internet service can guarantee absolute security.
            </p>
          </div>
        </section>

        {/* Communications */}
        <section id="communications" className="border-t border-white/10 pt-7">
          <h2 className="mb-3 text-lg font-semibold text-white">
            Communications &amp; Notifications
          </h2>

          <div className="space-y-3">
            <p>
              By creating an account, you may receive service-related
              communications such as account notifications, security alerts,
              messages, and updates necessary to operate HuntInTown.
            </p>

            <p>
              Where applicable, optional notifications may be controlled through
              the settings provided by HuntInTown or your device.
            </p>
          </div>
        </section>

        {/* Intellectual Property */}
        <section
          id="intellectual-property"
          className="border-t border-white/10 pt-7"
        >
          <h2 className="mb-3 text-lg font-semibold text-white">
            Intellectual Property
          </h2>

          <div className="space-y-3">
            <p>
              HuntInTown and its software, branding, logos, design, interface,
              graphics, text, and other original materials are owned by or
              licensed to HuntInTown and are protected by applicable
              intellectual property laws.
            </p>

            <p>
              Except as permitted by law or expressly authorized by HuntInTown,
              you may not copy, modify, distribute, sell, reverse engineer,
              reproduce, or commercially exploit the platform or its proprietary
              materials.
            </p>
          </div>
        </section>

        {/* Third Party */}
        <section id="third-party" className="border-t border-white/10 pt-7">
          <h2 className="mb-3 text-lg font-semibold text-white">
            Third-Party Services
          </h2>

          <div className="space-y-3">
            <p>
              HuntInTown may use or integrate with third-party services,
              websites, authentication providers, communication services,
              analytics providers, or other external platforms.
            </p>

            <p>
              Third-party services are governed by their own terms and privacy
              policies. HuntInTown is not responsible for the availability,
              security, content, or practices of third-party services.
            </p>
          </div>
        </section>

        {/* Disclaimer */}
        <section id="disclaimer" className="border-t border-white/10 pt-7">
          <h2 className="mb-3 text-lg font-semibold text-white">Disclaimer</h2>

          <div className="space-y-3">
            <p>
              HuntInTown is provided on an availability basis. While we aim to
              keep the service reliable and useful, we do not guarantee that the
              service will always be available, uninterrupted, secure, or
              error-free.
            </p>

            <p>
              We do not guarantee the accuracy, completeness, reliability, or
              suitability of information submitted by users. You are responsible
              for verifying information before relying on it or entering into an
              arrangement with another user.
            </p>

            <p>
              To the extent permitted by applicable law, HuntInTown is not
              responsible for disputes, losses, damages, injuries, fraud, or
              other issues arising from interactions or arrangements between
              users.
            </p>
          </div>
        </section>

        {/* Account */}
        <section id="termination" className="border-t border-white/10 pt-7">
          <h2 className="mb-3 text-lg font-semibold text-white">
            Account Suspension &amp; Termination
          </h2>

          <div className="space-y-3">
            <p>
              You may stop using HuntInTown at any time and may request deletion
              of your account, subject to applicable legal and operational
              requirements.
            </p>

            <p>
              We may suspend, restrict, or terminate an account where we
              reasonably believe that the account is being used in violation of
              these terms, applicable law, or the safety and security of the
              platform or its users.
            </p>

            <p>
              Provisions that by their nature should continue after termination,
              including provisions relating to intellectual property, user
              responsibilities, disclaimers, and disputes, will continue to
              apply where permitted by law.
            </p>
          </div>
        </section>

        {/* Changes */}
        <section id="changes" className="border-t border-white/10 pt-7">
          <h2 className="mb-3 text-lg font-semibold text-white">
            Changes to These Terms
          </h2>

          <div className="space-y-3">
            <p>
              We may update these Terms &amp; Conditions or Privacy Policy from
              time to time to reflect changes to the service, legal
              requirements, or operational practices.
            </p>

            <p>
              Updated versions will be made available through HuntInTown. Your
              continued use of the service after an updated version becomes
              effective constitutes acceptance of the updated terms to the
              extent permitted by applicable law.
            </p>
          </div>
        </section>

        {/* Governing Law */}
        <section id="governing-law" className="border-t border-white/10 pt-7">
          <h2 className="mb-3 text-lg font-semibold text-white">
            Governing Law &amp; Disputes
          </h2>

          <div className="space-y-3">
            <p>
              These terms are intended to be governed by the laws applicable to
              the operation of HuntInTown and the jurisdiction in which the
              applicable HuntInTown entity is established, subject to mandatory
              rights provided to users under applicable law.
            </p>

            <p>
              Before pursuing formal proceedings, users are encouraged to
              contact HuntInTown so that concerns can be reviewed and, where
              possible, resolved.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="border-t border-white/10 pt-7">
          <h2 className="mb-3 text-lg font-semibold text-white">Contact Us</h2>

          <p>
            For questions, privacy requests, account concerns, or reports of
            prohibited content or behavior, contact us at{" "}
            <a
              href="mailto:legal@huntintown.com"
              className="text-zinc-100 underline underline-offset-2 hover:text-[#FF6B6B]"
            >
              legal@huntintown.com
            </a>
            .
          </p>
        </section>
      </div>

      {/* Accept */}
      <div className="mt-9 border-t border-white/10 pt-6">
        <button
          type="button"
          onClick={onAccept}
          className="w-full rounded-lg bg-[#FF3F3F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#e53535] sm:ml-auto sm:block sm:w-auto"
        >
          Accept and continue
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/5 px-3 py-4 backdrop-blur-sm sm:px-6 rounded-4xl"
      onClick={onClose}
    >
      <section
        aria-labelledby="terms-title"
        className="relative max-h-full w-full max-w-3xl overflow-y-auto rounded-xl border border-white/10 bg-black px-4 py-6 text-white shadow-2xl sm:px-8 sm:py-8"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close terms and privacy policy"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-md p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
        {content}
      </section>
    </div>
  );
}
