<template>
  <div class="privacy-page">
    <div class="privacy-container">
      <h1 class="page-title">Privacy Policy</h1>
      <p class="last-updated">Last Updated: January 2026</p>

      <div class="privacy-content">
        <h2>1. Information We Collect</h2>
        <p>EU261 Claim collects minimal information necessary to provide our service, including:</p>
        <ul>
          <li>Email addresses for communication purposes</li>
          <li>Flight search queries</li>
          <li>Click tracking data for analytics</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use collected information to:</p>
        <ul>
          <li>Provide flight compensation information</li>
          <li>Improve our service</li>
          <li>Send service-related communications</li>
        </ul>

        <h2>3. Data Sharing</h2>
        <p>We share information with our partner AirHelp only when you choose to check your compensation eligibility. We do not sell your personal information to third parties.</p>

        <h2>4. Data Security</h2>
        <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>

        <h2>5. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Request deletion of your data</li>
          <li>Opt-out of marketing communications</li>
        </ul>

        <h2>6. Contact Us</h2>
        <p>For privacy-related questions, contact us at:</p>
        <p><strong>Email:</strong> <a href="mailto:privacy@eu261claim.com">privacy@eu261claim.com</a></p>

        <div class="placeholder-notice">
          <p><strong>Note:</strong> This is a simplified version. Full privacy policy will be added later.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Privacy Policy page
</script>

<style scoped>
.privacy-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 60px 20px;
}

.privacy-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 8px 0;
}

.last-updated {
  font-size: 14px;
  color: #86868b;
  margin: 0 0 32px 0;
}

.privacy-content h2 {
  font-size: 22px;
  font-weight: 600;
  color: #003399;
  margin: 32px 0 16px 0;
}

.privacy-content h2:first-child {
  margin-top: 0;
}

.privacy-content p {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin: 0 0 16px 0;
}

.privacy-content ul {
  margin: 0 0 16px 0;
  padding-left: 24px;
}

.privacy-content li {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 8px;
}

.privacy-content a {
  color: #007aff;
  text-decoration: none;
}

.privacy-content a:hover {
  text-decoration: underline;
}

.placeholder-notice {
  margin-top: 40px;
  padding: 20px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
}

.placeholder-notice p {
  margin: 0;
  color: #856404;
  font-weight: 500;
}

@media (max-width: 768px) {
  .privacy-page {
    padding: 40px 16px;
  }

  .privacy-container {
    padding: 24px;
  }

  .page-title {
    font-size: 28px;
  }

  .privacy-content h2 {
    font-size: 20px;
  }
}
</style>
