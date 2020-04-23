// pages/ansresult/ansresult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wrongamount:0,
    wronglist:[],
    curid:-1,
    tm:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options){
      this.setData({
        wrongamount:options.wrongamount
      })
      let wrongtm=wx.getStorageSync('wrongtm')
      this.setData({
        wronglist:wrongtm,
      })
    }
  },
  movetotm:function(e){
    let cid = parseInt(e.target.id)
    this.setData({
      curid:cid
    })
    this.updatepage()
  },
  updatepage:function(){
    const db = wx.cloud.database()
    let tmid= this.data.wronglist[this.data.curid]
    var that =this
    wx.showToast({
      icon:'loading',
      duration:1500
    })
    that.setData({
      imglist:[],
    })
    db.collection('tm').where({
      _id:tmid,
    }).get({
      success:function(res){
        that.setData({
          tm:res.data[0],
        })
        if(res.data[0].picinfo.length>0){
          let imglist = res.data[0].picinfo
          for(var i=0;i<imglist.length;i++){
            let src = imglist[i]
            wx.cloud.downloadFile({
              fileID: "cloud://guludati-ryidk.6775-guludati-ryidk-1301113436/"+src,
              success:function(e){
                that.setData({
                  imglist:that.data.imglist.concat(e.tempFilePath)
                })
              },
              fail:console.error
            })
          }
        }
      }
    })
  },
  preview:function(e){
    let curtid = e.target.id
    let addr = this.data.imglist[curtid]
    wx.previewImage({
      current:addr,
      urls: this.data.imglist,
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