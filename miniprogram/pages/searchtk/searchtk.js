// pages/searchtk/searchtk.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tk:{}, 
    bsearch:'',
    correctrate:'',
  },
  search:function(){
    const db = wx.cloud.database()
    var that = this
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
          let dt = e.data[0]
          let crate = e.data[0].correct
          let answer = e.data[0].tms.length*e.data[0].answeramount
          crate = answer==0?0:(crate/answer)*100
          that.setData({
            tk:dt,
            correctrate:crate
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
    var openid=wx.getStorageSync('openid')
    wx.clearStorage({
      complete: (res) => {
        wx.setStorageSync('openid', openid)
        wx.redirectTo({
          url: '../answer/answer?id='+this.data.tk._id,
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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