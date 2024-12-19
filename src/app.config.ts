export default defineAppConfig({
  pages: [
    'pages/index/index'
  ],
  permission: {
    "camera": {
      "desc": "你的应用程序需要摄像头"
    }
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
