export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '记忆典当行', navigationBarBackgroundColor: '#0a0a0f', navigationBarTextStyle: 'white' })
  : { navigationBarTitleText: '记忆典当行', navigationBarBackgroundColor: '#0a0a0f', navigationBarTextStyle: 'white' }
