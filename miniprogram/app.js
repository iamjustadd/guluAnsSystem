//app.js
//appid
//wx775a38567612a377
//secret
//ff142974e412f8bae7ad58ff5326dab8
App({
  data:{
    str:"",
  },
  onLaunch: function () {
    var that = this
    var d=this.globalData;//这里存储了appid、secret、token串  
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
      const db = wx.cloud.database() //数据库在cloud.init()之后才能使用
      wx.login({
        success:function (res) {
          var l='https://api.weixin.qq.com/sns/jscode2session?appid='+d.appid+'&secret='+d.secret+'&js_code='+res.code+'&grant_type=authorization_code';
          that.getopenid(l)
        },
      })
      }
      
      wx.getUserInfo({
        complete: (res) => {
          this.globalData.userInfo = res.userInfo
          console.log(res)
        },
      })

  },
  getopenid:function(str){
    var that = this
    wx.request({  
      url: str,  
      data: {},  
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      // header: {}, // 设置请求的 header  
      success: function(e){ 
        console.log(e.data.openid)   //获取openid
        wx.setStorageSync('openid', e.data.openid)
        that.checkusrexist(e.data.openid)
        that.globalData.openid=e.data.openid
      },
      fail:function(e){
        console.log("bad request")
      }
    });
  },
  checkusrexist:function(opid){
    const db = wx.cloud.database()
    var that = this
    db.collection('usr').where({
      "_openid":opid
    }).get({
      success:function(e){
        console.log("successful query")
        if(e.data.length==0){
          db.collection('usr').add({
            data:{
              _id:opid,
              nickname:that.data.rawData.nickName,
              numofans:0,
              correntans:0,
              management:[],
              authority:false,
            },
            success:function(e){
              console.log("successful create")
            },
            fail:function(e){
              console.log("create failed")
            }
          })
        }else{
          let usr = e.data[0].authority
          that.globalData.authority=usr
        }
      },
      fail:function(e){
        console.log("fail query")
      }
    })  
  },
  globalData:{
    userInfo:null,
    appid:'wx775a38567612a377',
    secret:'ff142974e412f8bae7ad58ff5326dab8',
    authority:false,
    openid:'',
  }
})
