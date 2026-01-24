import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  /**
   * Home Page - 航班理赔信息平台主页
   */
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/tracker/Landing.vue')
  },
  /**
   * Other Pages
   */
  {
    path: '/claims',
    name: 'ClaimList',
    component: () => import('@/views/claims/ClaimList.vue')
  },
  {
    path: '/claims/new',
    name: 'ClaimNew',
    component: () => import('@/views/claims/ClaimNew.vue')
  },
  {
    path: '/claims/:id',
    name: 'ClaimDetail',
    component: () => import('@/views/claims/ClaimDetail.vue')
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: () => import('@/views/faq/FAQ.vue'),
  },
  {
    path: '/faq/checkout',
    name: 'CheckoutHelp',
    component: () => import('@/views/faq/CheckoutHelp.vue')
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/Contact.vue')
  },
  {
    path: '/terms-and-conditions',
    name: 'TermsAndConditions',
    component: () => import('@/views/TermsAndConditions.vue')
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: () => import('@/views/PrivacyPolicy.vue')
  },
  /**
   * Email Settings
   */
  {
    path: '/email/preferences',
    name: 'EmailPreferences',
    component: () => import('@/views/email/EmailPreferences.vue')
  },
  {
    path: '/unsubscribe',
    name: 'Unsubscribe',
    component: () => import('@/views/email/Unsubscribe.vue')
  },
  {
    path: '/preferences/success',
    name: 'PreferencesSuccess',
    component: () => import('@/views/email/PreferencesSuccess.vue')
  },
  /**
   * Short Link Redirect (短链接追踪)
   * 邮件中的链接格式：https://yourdomain.com/{shortId}
   * 例如：/abc123, /test456, /demo
   * 
   * 注意：这个路由必须在最后，因为它会匹配所有单段路径
   * 需要排除已定义的路由路径（claims, faq, contact 等）
   */
  {
    path: '/:shortId',
    name: 'ShortLinkRedirect',
    component: () => import('@/views/tracker/Landing.vue'),
    beforeEnter: (to, _from, next) => {
      // 排除已定义的路由路径
      const excludedPaths = ['claims', 'faq', 'contact', 'terms-and-conditions', 
                            'privacy-policy', 'email', 'unsubscribe', 'preferences'];
      const shortId = to.params.shortId as string;
      
      if (excludedPaths.includes(shortId)) {
        next({ name: 'NotFound' });
      } else {
        next();
      }
    }
  },
  /**
   * 404 Not Found
   */
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  },
]

export default routes