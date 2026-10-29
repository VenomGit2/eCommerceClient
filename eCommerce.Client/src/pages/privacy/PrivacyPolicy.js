import React from "react";
import "./privacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <main className="privacy-page">
      <section className="privacy-hero">
        {/* <img
          src="/favicon.svg"
          alt="Circuit & Grain logo"
          className="brand__mark"
        /> */}

        <h4>Privacy Policy</h4>

        <p className="privacy-subtitle">
          Your privacy matters to us. Learn how Circuit & Grain
          collects, uses, and protects your information.
        </p>

        <p className="privacy-updated">
          Last updated: October 29, 2026
        </p>
      </section>

      <div className="privacy-layout">
        <aside className="privacy-sidebar">
          <p className="privacy-sidebar-title">On this page</p>
          <nav aria-label="Privacy policy sections">
            <a href="#introduction">Introduction</a>
            <a href="#information">Information We Collect</a>
            <a href="#google-sign-in">Google Sign-In</a>
            <a href="#usage">How We Use Information</a>
            <a href="#sharing">Information Sharing</a>
            <a href="#security">Data Security</a>
            <a href="#retention">Data Retention</a>
            <a href="#rights">Your Privacy Rights</a>
            <a href="#cookies">Cookies</a>
            <a href="#children">Children's Privacy</a>
            <a href="#changes">Policy Changes</a>
            <a href="#contact">Contact Us</a>
          </nav>
        </aside>

        <article className="privacy-content">
          <section className="privacy-card" id="introduction">
            <span className="privacy-section-number">01</span>
            <h2>Introduction</h2>
            <p>
              Welcome to Circuit & Grain. This Privacy Policy explains
              how we collect, use, store, and protect information when
              you visit our website, create an account, or use our
              services.
            </p>
            <p>
              By using our website, you acknowledge that you have read
              this policy. We aim to handle your information responsibly
              and transparently.
            </p>
          </section>

          <section className="privacy-card" id="information">
            <span className="privacy-section-number">02</span>
            <h2>Information We Collect</h2>

            <h3>Information you provide</h3>
            <ul>
              <li>Name and email address.</li>
              <li>Account registration and profile information.</li>
              <li>
                Information you provide when contacting our support team.
              </li>
              <li>
                Order and delivery information, when applicable.
              </li>
            </ul>

            <h3>Information collected automatically</h3>
            <p>
              When you use our website, technical information such as
              browser type, device information, IP address, and basic
              usage data may be collected to operate, maintain, and
              improve our services.
            </p>
          </section>

          <section className="privacy-card" id="google-sign-in">
            <span className="privacy-section-number">03</span>
            <h2>Google Sign-In</h2>

            <div className="privacy-google-panel">
              <div className="privacy-google-mark" aria-hidden="true">
                G
              </div>
              <div>
                <h3>Sign in securely with Google</h3>
                <p>
                  If you choose to sign in using Google, we receive the
                  information permitted by the Google authentication
                  process and the permissions you grant.
                </p>
              </div>
            </div>

            <p>Depending on the permissions requested, this may include:</p>
            <ul>
              <li>Your name.</li>
              <li>Your email address.</li>
              <li>Your Google profile picture, if available and permitted.</li>
              <li>
                Authentication information necessary to sign you in.
              </li>
            </ul>

            <p>
              We use this information to authenticate your identity,
              create an account when appropriate, and provide access to
              your Circuit & Grain account.
            </p>

            <p>
              We do not receive your Google password through Google
              Sign-In. We do not sell Google user data or use it for
              purposes unrelated to providing and maintaining our
              services.
            </p>

            <p>
              We access and use Google user data only as permitted by
              the applicable Google authorization permissions and
              policies. We do not disclose this data to third parties
              except as necessary to provide the service, comply with
              law, or as otherwise permitted by applicable policies
              and your authorization.
            </p>

            <p>
              You can manage third-party account access through your
              Google Account settings.
            </p>
          </section>

          <section className="privacy-card" id="usage">
            <span className="privacy-section-number">04</span>
            <h2>How We Use Your Information</h2>
            <p>We may use collected information to:</p>
            <ul>
              <li>Create and manage your account.</li>
              <li>Authenticate your sign-in requests.</li>
              <li>Process orders and provide requested services.</li>
              <li>Respond to questions and support requests.</li>
              <li>Maintain website functionality and security.</li>
              <li>Improve our products, features, and user experience.</li>
              <li>Meet legal and regulatory obligations.</li>
            </ul>
          </section>

          <section className="privacy-card" id="sharing">
            <span className="privacy-section-number">05</span>
            <h2>Information Sharing</h2>
            <p>
              We do not sell your personal information. We may share
              information only when reasonably necessary for purposes
              such as:
            </p>
            <ul>
              <li>
                Service providers that help operate our website,
                authentication, hosting, or order processing.
              </li>
              <li>Complying with applicable laws or valid legal requests.</li>
              <li>Protecting our users, services, and legal rights.</li>
              <li>
                Completing a transaction or service you have requested.
              </li>
            </ul>
            <p>
              Where appropriate, service providers are expected to handle
              information consistently with their contractual obligations
              and applicable privacy requirements.
            </p>
          </section>

          <section className="privacy-card" id="security">
            <span className="privacy-section-number">06</span>
            <h2>Data Security</h2>
            <p>
              We use reasonable technical and organizational safeguards
              designed to protect personal information against
              unauthorized access, loss, misuse, or alteration.
            </p>
            <p>
              No online service or electronic storage method can be
              guaranteed to be completely secure. We therefore cannot
              guarantee absolute security.
            </p>
          </section>

          <section className="privacy-card" id="retention">
            <span className="privacy-section-number">07</span>
            <h2>Data Retention</h2>
            <p>
              We retain personal information for as long as reasonably
              necessary to provide our services, maintain your account,
              meet legal obligations, resolve disputes, and enforce
              applicable agreements.
            </p>
            <p>
              When information is no longer required, we take reasonable
              steps to delete it or otherwise handle it in accordance
              with applicable requirements.
            </p>
          </section>

          <section className="privacy-card" id="rights">
            <span className="privacy-section-number">08</span>
            <h2>Your Privacy Rights</h2>
            <p>
              Depending on your location and applicable law, you may be
              able to request access to, correction of, or deletion of
              your personal information.
            </p>
            <p>
              You can contact us to ask questions about your information
              or request assistance with your account. We may need to
              verify your identity before processing certain requests.
            </p>
          </section>

          <section className="privacy-card" id="cookies">
            <span className="privacy-section-number">09</span>
            <h2>Cookies and Similar Technologies</h2>
            <p>
              Our website or its service providers may use cookies or
              similar technologies to maintain sessions, support
              authentication, remember preferences, and improve website
              functionality.
            </p>
            <p>
              You can manage cookies through your browser settings.
              Disabling certain cookies may affect features that require
              authentication or saved preferences.
            </p>
          </section>

          <section className="privacy-card" id="children">
            <span className="privacy-section-number">10</span>
            <h2>Children's Privacy</h2>
            <p>
              Our services are not intended to collect personal
              information from children in violation of applicable law.
              If you believe a child has provided us with personal
              information inappropriately, please contact us so we can
              review the situation and take appropriate action.
            </p>
          </section>

          <section className="privacy-card" id="changes">
            <span className="privacy-section-number">11</span>
            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time.
              Changes will be reflected on this page along with the
              revised update date. We encourage you to review this page
              periodically.
            </p>
          </section>

          <section className="privacy-card privacy-contact-card" id="contact">
            <span className="privacy-section-number">12</span>
            <h2>Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or how
              your information is handled, contact us:
            </p>

            <div className="privacy-contact-details">
              <div>
                <span className="privacy-contact-label">Website</span>
                <a
                  href="https://circuitgrain.shop/"
                  target="_blank"
                  rel="noreferrer"
                >
                  circuitgrain.shop
                </a>
              </div>

              <div>
                <span className="privacy-contact-label">Email</span>
                <a href="mailto:dnyaneshwar@circuitgrain.shop">
                  dnyaneshwar@circuitgrain.shop
                </a>
              </div>
            </div>

            <p className="privacy-contact-note">
              Replace the contact email above if you use a different
              support or privacy email address.
            </p>
          </section>

          <footer className="privacy-footer">
            {/* <span className="privacy-footer-mark" aria-hidden="true">
              C&G
            </span> */}
            <p>
              © {new Date().getFullYear()} Circuit & Grain. All rights
              reserved.
            </p>
          </footer>
        </article>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
