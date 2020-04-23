// pages/tkinfo/tkinfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tkid:'',
    keycode:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.tkid
    const db=wx.cloud.database()
    var that =this
    db.collection('tk').where({
      _id:id
    }).get({
      success:function(res){
        that.setData({
          tkid:id,
          keycode:res.data[0].keycode
        })
      }
    })
  },

  copy:function(e){
    var datatoclip = 'id: '+this.data.tkid+'\n'
    if(this.data.keycode) datatoclip+='keycode: '+this.data.keycode
    wx.setClipboardData({
      data: datatoclip,
      success:function(e){
        wx.showToast({
          title: '复制成功！',
          icon:'success',
          duration:1000
        })
      }
    })
  }
})