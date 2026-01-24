import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/Home.vue')
  },
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
   * Tracker Landing Page (航班理赔信息平台)
   */
  {
    path: '/landing/:shortId?',
    name: 'TrackerLanding',
    component: () => import('@/views/tracker/Landing.vue')
  },
  /**
   * Short Link Redirect (短链接重定向)
   * 注意：这个路由必须在最后，因为它会匹配所有单段路径
   */
  {
    path: '/:shortId',
    name: 'ShortLinkRedirect',
    component: () => import('@/views/tracker/Landing.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  },
]

export default routes