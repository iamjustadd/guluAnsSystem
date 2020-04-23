// pages/newindex/newindex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tks:[],
    ratelist:[],
    authority:false,
    curpage:0,
    tk:{},
    correctrate:0,
    bsearch:'',
    avatarUrl: './user-unlogin.png',
    userInfo:{},
    hidewindow:true,
    notices:[],
    content:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp()
    const db = wx.cloud.database()
    var that = this
    var opid = wx.getStorageSync('openid')
    db.collection('tk').where({
      "needkey":false
    }).get({
      success:function(res){
        let doublelist=[]
        for(var i=0;i<res.data.length;i++){
          let correctrate =0;
          if( res.data[i].answeramount!=0){
            correctrate=res.data[i].correct/res.data[i].answeramount
            correctrate/=res.data[i].tms.length
            correctrate*=100
          }
          doublelist.push(parseFloat(correctrate))
        }
        that.setData({
          tks:res.data,
          ratelist:doublelist,
        })
      }
    })
    db.collection('notice').get({
      success:function(e){
        if(e.data.length>0){
          that.setData({
            notices:e.data
          })
        }
      }
    })
    db.collection('usr').where({
      "_id":opid
    }).get({
      success:function(e){
        that.setData({
          authority:e.data[0].authority
        })
      }
    })
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
  previewnotice:function(e){
    let cid = e.currentTarget.id
    this.setData({
      content:this.data.notices[cid].content,
      hidewindow:false
    })
  },
  closewindow:function(e){
    this.setData({
      hidewindow:true
    })
  },
  gotoupload:function(e){
    wx.navigateTo({
      url: '../Home/Home',
    })
  },
  gototm:function(e){
    wx.navigateTo({
      url: '../tminfo/tminfo',
    })
  },
  changepage:function(e){
    this.setData({
      curpage:e.target.id
    })
  },
  search:function(){
    const db = wx.cloud.database()
    var that = this
    console.log("start")
    db.collection('tk').where({
      _id:this.data.bsearch
    }).get({
      success:function(e){
        if(e.data.length<=0){
          wx.showToast({
            title: '请输入正确的id，或检查该题库是否真实存在',
            icon:'none',
            duration: 3000,
          })
        }else{
          console.log(e)
          let dt = e.data[0]
          let crate=0
          if( e.data[0].answeramount!=0){
            crate=e.data[0].correct/e.data[0].answeramount
            crate/=e.data[0].tms.length
            crate*=100
          }
          that.setData({
            tk:dt,
            correctrate:crate,
            curpage:3
          })
          console.log(that.data.tk)
        }
      }
    })
  },
  changebeingsearch:function(e){
    let beingsearch = e.detail.value
    this.setData({
      bsearch:beingsearch
    })
  },
  beginans:function(){
    if(!this.data.tk._id){
      wx.showToast({
        title: '选择合法的题库开始刷题',
        icon:'none',
        duration:2000
      })
      return false;
    }
    wx.clearStorage({
      complete: (res) => {wx.redirectTo({
        url: '../answer/answer?id='+this.data.tk._id,
      })},
    })
  },
  jumptotk:function(e){
    let cid = e.currentTarget.id
    let tkid = this.data.tks[cid]._id
    console.log(tkid)
    var that= this
    this.setData({
      bsearch:tkid,
    },()=>{
      that.search()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})