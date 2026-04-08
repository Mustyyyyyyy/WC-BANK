import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay,
      ease: "easeOut",
    },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: (delay = 0) => ({
    opacity: 1,
    transition: {
      duration: 0.8,
      delay,
      ease: "easeOut",
    },
  }),
};

export default function Home() {
  return (
    <main className="landing-page">
      <section className="hero-section">
        <div className="hero-overlay" />

        <div className="landing-container hero-grid">
          <motion.div
            className="hero-content"
            initial="hidden"
            animate="show"
            variants={fadeIn}
            custom={0.1}
          >
            <motion.p className="eyebrow" variants={fadeUp} custom={0.1}>
              WC BANK
            </motion.p>

            <motion.h1 className="hero-title" variants={fadeUp} custom={0.2}>
              Simple, secure digital banking built for everyday people.
            </motion.h1>

            <motion.p className="hero-text" variants={fadeUp} custom={0.35}>
              WC Bank is a modern digital-first banking platform designed to
              help you move money easily, manage your balance confidently, and
              keep track of your transactions in one clean experience.
            </motion.p>

            <motion.div className="hero-actions" variants={fadeUp} custom={0.5}>
              <Link to="/register" className="btn btn-dark">
                Open an Account
              </Link>
              <Link to="/login" className="btn">
                Login
              </Link>
            </motion.div>

            <motion.div className="hero-note" variants={fadeUp} custom={0.65}>
              <strong>Digital-first service:</strong> we currently operate
              without a physical branch, so all banking activities are handled
              online for speed, simplicity, and convenience.
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-card floating-card"
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
          >
            <div className="mini-badge">Trusted Digital Banking</div>
            <h3>Why choose WC Bank?</h3>
            <ul className="feature-list">
              <li>Fast internal transfers</li>
              <li>Clean account and balance management</li>
              <li>Real-time transaction records</li>
              <li>Secure login and transaction PIN protection</li>
              <li>Accessible anytime from anywhere</li>
            </ul>
          </motion.div>
        </div>
      </section>

      <section className="info-section">
        <div className="landing-container">
          <motion.div
            className="section-head"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
          >
            <p className="eyebrow">ABOUT US</p>
            <h2 className="section-main-title">
              A bank experience designed for the digital age
            </h2>
            <p className="section-main-text">
              WC Bank focuses on convenience, clarity, and control. We are
              building a simple financial platform where users can register,
              manage funds, transfer within the bank, and monitor transactions
              without the stress of traditional banking processes.
            </p>
          </motion.div>

          <div className="offer-grid">
            {[
              {
                title: "What we offer",
                text: "We offer digital account creation, secure login, same-bank transfers, deposits, withdrawals, and transaction history in one straightforward platform.",
              },
              {
                title: "How we operate",
                text: "WC Bank is currently an online-only banking platform. We do not have a physical branch yet, which allows us to focus on a faster and more convenient digital experience for our users.",
              },
              {
                title: "Our promise",
                text: "We aim to provide a banking interface that feels modern, understandable, and reliable, helping users handle their money with confidence and ease.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="offer-card card-hover"
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="services-section">
        <div className="landing-container">
          <motion.div
            className="section-head center-head"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
          >
            <p className="eyebrow">SERVICES</p>
            <h2 className="section-main-title">Banking features that matter</h2>
          </motion.div>

          <div className="services-grid">
            {[
              {
                title: "Account Creation",
                text: "Open an account online in a few steps and receive your account details instantly.",
              },
              {
                title: "Internal Transfers",
                text: "Send money to other WC Bank users quickly using account number verification.",
              },
              {
                title: "Balance Management",
                text: "View your balance, monitor changes, and stay in control of your money.",
              },
              {
                title: "Transaction Records",
                text: "Keep track of deposits, transfers, and withdrawals from your transaction history page.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="service-box card-hover"
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
              >
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="landing-container">
          <motion.div
            className="cta-card"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <div>
              <p className="eyebrow">GET STARTED</p>
              <h2 className="section-main-title">Bank smarter with WC Bank</h2>
              <p className="section-main-text">
                Join a digital banking experience built around ease, speed, and
                simplicity.
              </p>
            </div>

            <div className="cta-actions">
              <Link to="/register" className="btn btn-dark">
                Create Account
              </Link>
              <Link to="/login" className="btn">
                Access Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}