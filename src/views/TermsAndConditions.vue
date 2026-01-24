<template>
  <div class="terms-page">
    <div class="terms-container">
      <h1 class="page-title">Terms and Conditions</h1>
      <p class="last-updated">Last Updated: January 2026</p>

      <div class="terms-content">
        <h2>1. About This Service</h2>
        <p>EU261 Claim is an independent flight compensation information platform. We provide information about eligible flights under EU Regulation 261/2004. All compensation services are provided by our partner AirHelp.</p>

        <h2>2. Service Description</h2>
        <p>Our platform displays information about flights that may be eligible for compensation under EU261 regulations. We do not directly process compensation claims.</p>

        <h2>3. User Responsibilities</h2>
        <p>By using this platform, you agree to provide accurate information and use the service in accordance with applicable laws.</p>

        <h2>4. Limitation of Liability</h2>
        <p>The information provided on this platform is for informational purposes only. We make no guarantees regarding compensation eligibility or amounts.</p>

        <h2>5. Contact Information</h2>
        <p><strong>Email:</strong> <a href="mailto:support@eu261claim.com">support@eu261claim.com</a></p>

        <div class="placeholder-notice">
          <p><strong>Note:</strong> This is a simplified version. Full terms and conditions will be added later.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Terms and Conditions page
</script>

<style scoped>
.terms-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 60px 20px;
}

.terms-container {
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

.terms-content h2 {
  font-size: 22px;
  font-weight: 600;
  color: #003399;
  margin: 32px 0 16px 0;
}

.terms-content h2:first-child {
  margin-top: 0;
}

.terms-content p {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin: 0 0 16px 0;
}

.terms-content a {
  color: #007aff;
  text-decoration: none;
}

.terms-content a:hover {
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
  .terms-page {
    padding: 40px 16px;
  }

  .terms-container {
    padding: 24px;
  }

  .page-title {
    font-size: 28px;
  }

  .terms-content h2 {
    font-size: 20px;
  }
}
</style>
