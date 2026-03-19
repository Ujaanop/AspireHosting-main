'use client'

import { motion } from "framer-motion";
import { Handshake, ShieldCheck, FileText } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AcceptableUsagePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f] transition-colors duration-300">
      <Navbar />

      <div className="relative overflow-hidden">
        {/* Background Image and Gradients */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: `url('/vps/vps-hero-4.webp')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-50/40 to-transparent dark:from-[#0a0b0f] dark:via-[#0a0b0f]/60 dark:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/80 to-gray-50/40 dark:from-[#0a0b0f] dark:via-[#0a0b0f]/95 dark:to-[#0a0b0f]/60" />
        </div>

        {/* Content */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center justify-center gap-2 card-primary px-6 py-3 rounded-full mb-6 border border-secondary">
                <Handshake className="w-5 h-5 icon-text-primary" />
                <span className="icon-text-primary text-sm font-medium">Acceptable Use Policy</span>
              </div>

              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 orbitron-font">
                Our Acceptable <span className="icon-text-primary">Use Policy</span>
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4">
                Guidelines for responsible and respectful use of our services.
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: June 2024
              </p>
            </motion.div>

            {/* Key Points Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4"
            >
              {[
                {
                  icon: ShieldCheck,
                  title: "Fair Usage",
                  description: "Ensuring equitable resource distribution and preventing abuse."
                },
                {
                  icon: FileText,
                  title: "Legal Compliance",
                  description: "Adhering to all applicable laws and regulations."
                },
                {
                  icon: Handshake,
                  title: "Community Standards",
                  description: "Promoting a safe and positive environment for all users."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="bg-white dark:bg-gray-950/20 backdrop-blur-xl rounded-md p-6 border border-secondary hover:border-secondary dark:border-secondary dark:hover:border-secondary hover:hover-gradient dark:hover:hover-gradient transition-all duration-300"
                >
                  <div className="w-12 h-12 card-primary rounded-xl flex items-center justify-center mb-4 border border-secondary">
                    <item.icon className="w-6 h-6 icon-text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-950/20 backdrop-blur-xl border border-secondary hover:border-secondary dark:border-secondary rounded-md overflow-hidden dark:hover:border-secondary hover:hover-gradient dark:hover:hover-gradient transition-all duration-300"
            >
              <div className="p-8 border-b border-secondary last:border-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Introduction
                </h2>
                <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  <p className="mb-4">
                    This Acceptable Use Policy (AUP) outlines the prohibited activities and usage guidelines for customers utilizing our services. By using any of our services, you agree to comply with this AUP and to be responsible for all activities conducted through your account.
                  </p>
                </div>
              </div>
              <div className="p-8 border-b border-secondary last:border-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Prohibited Activities
                </h2>
                <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">1. General Provisions</h3>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>Engaging in any activity that is unlawful under local, state, national, or international law.</li>
                    <li>Violating any third-party rights, including intellectual property rights.</li>
                    <li>Using services to promote or facilitate any form of illegal activity or to conceal the origin of such activity.</li>
                    <li>Attempting to circumvent service limitations, monitoring tools, or account restrictions imposed by Aspire Hosting.</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">2. Minecraft Hosting</h3>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>Using the service to host Minecraft servers that distribute or promote unauthorized modifications (mods) that violate Mojang's End User License Agreement (EULA).</li>
                    <li>Distributing or promoting pirated Minecraft game copies or unauthorized server software.</li>
                    <li>Hosting servers that intentionally generate excessive CPU or disk I/O load without approval, including automation-heavy farming bots or stress-testing servers.</li>
                    <li>Running Minecraft servers intended to crash, exploit, or harm other servers or players.</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">3. Discord Bot Hosting</h3>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>Developing or hosting Discord bots that engage in spamming, phishing, or any form of malicious activity.</li>
                    <li>Using bots to violate Discord's Terms of Service or Community Guidelines.</li>
                    <li>Running selfbots or user account automation which is against Discord's policies.</li>
                    <li>Hosting or distributing token grabbers, account crackers, or any tool intended to compromise Discord accounts.</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">4. Web Hosting</h3>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>Hosting websites that distribute illegal content, including pirated software, child pornography, and illegal drugs.</li>
                    <li>Hosting phishing websites or engaging in fraudulent activities through hosted websites.</li>
                    <li>Using shared hosting for bulk email services, mass mailing tools, or email marketing platforms.</li>
                    <li>Deploying unpatched or outdated CMS platforms (e.g., WordPress, Joomla) that pose a security risk to the server or other users.</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">5. Domains</h3>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>You may not use your domain for any activities that violate local, state, national, or international laws or regulations, including but not limited to the distribution of malware, phishing attempts, or any form of illegal activity.</li>
                    <li>Registering domains that impersonate brands, promote scams, or are intended for cybersquatting is prohibited.</li>
                    <li>Use of domains for managing botnets, command-and-control servers, or illicit marketplaces is strictly forbidden.</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">6. VPS Hosting</h3>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>Using VPS services to host, distribute, or facilitate activities that involve spam, phishing, DDoS attacks, botnets, or other forms of network abuse.</li>
                    <li>Running open proxies, open mail relays, or any services that may be exploited to perform malicious or unauthorized activity.</li>
                    <li>Hosting content or services that result in frequent or repeated abuse complaints (e.g., IRC servers, mass mailers, or illegal streaming sites).</li>
                    <li>Using the VPS in a manner that negatively affects the reputation of Aspire Hosting's IP addresses or upstream network providers.</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">7. Reseller Hosting</h3>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>Resellers are fully responsible for the content and activities of their clients and must ensure all downstream users comply with this AUP.</li>
                    <li>Hosting or permitting the distribution of illegal, abusive, or prohibited content by reseller clients is strictly forbidden.</li>
                    <li>Using the reseller service to oversell resources in a way that impacts server stability or performance is prohibited.</li>
                    <li>Failure to act on abuse reports or repeated violations by clients may result in suspension or termination of the reseller account.</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">DirectAdmin Unmetered Plan Restrictions</h3>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>Customers utilizing the DirectAdmin unmetered plan are strictly prohibited from hosting file hosting sites, image hosting sites (e.g., Instagram), or video hosting sites (e.g., YouTube).</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Security and Abuse</h3>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>Attempting to bypass network security measures or gain unauthorized access to data or systems.</li>
                    <li>Engaging in activities that cause harm or disruption to our network or other users' services.</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">VPS-Specific Prohibitions</h3>
                  <p className="mb-2 font-semibold">Illegal Activities</p>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>Engaging in any activity that is unlawful under local, state, national, or international law.</li>
                    <li>Distribution, storage, or transmission of illegal content, including but not limited to pirated software, child pornography, and illegal drugs.</li>
                    <li>Unauthorized access to computers, networks, or data (hacking).</li>
                  </ul>

                  <p className="mb-2 font-semibold">Security Violations</p>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>Attempting to probe, scan, or test the vulnerability of any system, network, or breach security or authentication measures without proper authorization.</li>
                    <li>Engaging in any form of network attack or interference, including but not limited to Denial of Service (DoS) attacks, distributed DoS (DDoS) attacks, and packet flooding.</li>
                  </ul>

                  <p className="mb-2 font-semibold">Spamming and Phishing</p>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>Sending unsolicited bulk messages, including commercial advertising and informational announcements (spam).</li>
                    <li>Engaging in phishing or any activity intended to deceive individuals into disclosing personal or sensitive information.</li>
                  </ul>

                  <p className="mb-2 font-semibold">Malicious Software</p>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>Creating, transmitting, or distributing viruses, worms, malware, ransomware, or any other malicious software.</li>
                    <li>Hosting, promoting, or distributing software or services that are designed to facilitate the spread of malware.</li>
                  </ul>

                  <p className="mb-2 font-semibold">Intellectual Property Infringement</p>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>Using the service to infringe upon the intellectual property rights of others, including but not limited to copyrights, trademarks, patents, and trade secrets.</li>
                    <li>Hosting, distributing, or linking to pirated or unauthorized copies of software, music, videos, or other protected content.</li>
                  </ul>

                  <p className="mb-2 font-semibold">Fraudulent Activities</p>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>Engaging in fraudulent activities, including but not limited to impersonation, forgery, and misrepresentation.</li>
                    <li>Using the service to conduct or promote fraudulent schemes, including but not limited to pyramid schemes and phishing.</li>
                  </ul>

                  <p className="mb-2 font-semibold">Resource Abuse</p>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>Excessive usage of server resources that negatively impacts the performance of the server or the experience of other users.</li>
                    <li>Running resource-intensive applications without proper authorization.</li>
                  </ul>

                  <p className="mb-2 font-semibold">Network Abuse</p>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>Using the service to interfere with or disrupt the operation of the network, servers, or other infrastructure.</li>
                    <li>Engaging in activities that generate excessive network traffic, including but not limited to cryptocurrency mining.</li>
                  </ul>

                  <p className="mb-2 font-semibold">Unethical Activities</p>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>Engaging in activities that are considered unethical or morally objectionable, including but not limited to hate speech, harassment, and promoting violence or discrimination.</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">15. Abuse Reports and Enforcement Policy</h3>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    <li>Aspire Hosting enforces a zero-strike policy for VPS-related abuse (e.g., spam, DDoS, phishing, scanning, blacklisting):</li>
                    <ul className="list-circle pl-5 mb-2 space-y-1">
                      <li>Upon a valid abuse report, the affected VPS will be suspended without prior notice.</li>
                      <li>A $15 handling fee applies to abuse cases involving IP blacklisting. This must be paid within 48 hours, or all active services will be suspended.</li>
                      <li>Any valid abuse report may lead to permanent suspension of the client account. Future services will be denied.</li>
                    </ul>
                    <li>Aspire Hosting reserves the right to deny service at any time. Abuse is not tolerated under any circumstance.</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Enforcement and Consequences</h3>
                  <p className="mb-4">
                    Violations of this AUP may result in immediate suspension or termination of your VPS service, with or without notice. We reserve the right to take any necessary legal action to address violations and to cooperate with law enforcement authorities in investigations of suspected criminal activities.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Reporting Violations</h3>
                  <p className="mb-4">
                    If you become aware of any violations of this AUP, please report them to our support team at here.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Modifications</h3>
                  <p className="mb-4">
                    We reserve the right to modify this AUP at any time. Any changes will be effective immediately upon posting the updated AUP on our website. Your continued use of our VPS services constitutes your acceptance of the modified AUP.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Contact Information</h3>
                  <p className="mb-4">
                    If you have any questions or concerns about this AUP, please contact us at support@aspirehosting.net
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

