<template>
  <div class="privacy-pro-wrapper">
    <div class="privacy-pro-header">
      <Logo />
      <div class="privacy-meta">
        <h1 class="privacy-title">Privacy Policy</h1>
        <!-- <span class="privacy-breadcrumb">Home / Privacy Policy</span> -->
        <span class="privacy-updated">Last Updated: 2026-06-05</span>
      </div>
     
    </div>
    <nav class="privacy-toc">
      <ul>
        <li><a href="#collection">1. Collection of Personal Information</a></li>
        <li><a href="#use">2. Use of Information</a></li>
        <li><a href="#nonpersonal">3. Non-Personal Information</a></li>
        <li><a href="#cookies">4. Cookies and Tracking</a></li>
        <li><a href="#disclosure">5. Disclosure to Third Parties</a></li>
        <li><a href="#consent">6. Your Rights & Consent</a></li>
        <li><a href="#security">7. Data Security</a></li>
        <li><a href="#changes">8. Changes to this Policy</a></li>
        <li><a href="#contact">9. Contact</a></li>
      </ul>
    </nav>
    <div class="privacy-content">
      <h2 id="collection">1. Collection of Personal Information</h2>
      <p>EU261Claim collects your email address solely for the purpose of providing service updates and essential communication related to your flight compensation claim. You may choose not to provide your email, but this may prevent us from providing support.</p>

      <h2 id="use">2. Use of Information</h2>
      <ul>
        <li>To send order receipts, confirmations, and product-related notices.</li>
        <li>To provide customer service and respond to your inquiries.</li>
        <li>To comply with legal obligations and resolve disputes.</li>
      </ul>

      <h2 id="nonpersonal">3. Non-Personal Information</h2>
      <p>We do not collect, store, or process any non-personal information (such as device ID, location, usage statistics, or analytics data).</p>

      <h2 id="cookies">4. Cookies and Tracking</h2>
      <p>We do not use cookies, web beacons, or any tracking technologies on our website.</p>

      <h2 id="disclosure">5. Disclosure to Third Parties</h2>
      <p>We do not sell, trade, or otherwise transfer your personal information to outside parties except as required by law, regulation, or valid legal process. Payment information (if any) is handled exclusively by third-party payment processors and is never stored or processed by EU261 Claim.</p>

      <h2 id="consent">6. Your Rights & Consent</h2>
      <p>By using our site and services, you consent to this Privacy Policy and the limited use of your information as described above. You have the right to:</p>
      <ul>
        <li>Request access to or deletion of your personal data by contacting us at <a href="mailto:support@eu261claim.com">support@eu261claim.com</a>.</li>
        <li>Withdraw your consent at any time, which may affect your ability to use our services.</li>
      </ul>

      <h2 id="security">7. Data Security</h2>
      <p>We implement reasonable technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>

      <h2 id="changes">8. Changes to this Policy</h2>
      <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. Your continued use of the site after such changes constitutes your acceptance of the revised policy.</p>

      <h2 id="contact">9. Contact</h2>
      <p>If you have any questions, requests, or concerns regarding this Privacy Policy or your personal data, please contact us:</p>
      <p><strong>Business Name:</strong> EU261Claim</p>
      <p><strong>Address:</strong> 71-75, Shelton Street, Covent Garden, London, WC2H 9JQ, UNITED KINGDOM</p>
      <p><strong>E-mail:</strong> <a href="mailto:support@eu261claim.com">support@eu261claim.com</a></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from '@/components/Logo.vue'
</script>

<style scoped>
.privacy-pro-wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 0 0 0;
  background: var(--bg-page);
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
.privacy-pro-header {
  margin-bottom: 18px;
}
.privacy-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 1.2rem;
  text-align: left;
  letter-spacing: 0.01em;
  color: var(--text-primary);
}
.privacy-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.98rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
  padding: 0 20px;
}
.privacy-breadcrumb {
  color: var(--text-secondary);
}
.privacy-updated {
  color: var(--text-secondary);
}
.privacy-toc {
  margin-bottom: 32px;
  background: var(--bg-row-hover);
  border-radius: 8px;
  padding: 18px 24px;
  box-shadow: 0 1px 4px color-mix(in srgb, var(--bg-page) 70%, transparent);
}
.privacy-toc ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 18px 32px;
}
.privacy-toc li {
  font-size: 1.05rem;
}
.privacy-toc a {
  color: var(--color-cta);
  text-decoration: underline;
  font-weight: 600;
  transition: color 0.2s;
}
.privacy-toc a:hover {
  color: var(--color-cta-hover);
}
.privacy-content {
  background: var(--bg-surface);
  border-radius: 12px;
  padding: 16px 36px 40px 36px;
  margin-bottom: 2.5rem;
  box-shadow: 0 2px 8px color-mix(in srgb, var(--bg-page) 70%, transparent);
  text-align: left;
  color: var(--text-primary);
}
.privacy-content h2 {
  font-size: 1.18rem;
  color: var(--text-primary);
  margin-top: 2em;
  margin-bottom: 10px;
  font-weight: 700;
}
.privacy-content p, .privacy-content ul {
  color: var(--text-primary);
  font-size: 1.08rem;
  line-height: 1.7;
  margin-bottom: 1.1em;
  text-align: left;
}
.privacy-content ul {
  padding-left: 1.5em;
}
a {
  color: var(--color-cta);
  text-decoration: underline;
}
</style> 