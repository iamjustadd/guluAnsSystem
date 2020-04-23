// pages/showtm/showtm.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tm:{},
    disabled:true,
    imglist:[],
    id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    var that = this
    let tmid = options.id
    this.setData({
      id:tmid
    })
    db.collection('tm').where({
      _id:tmid,
    }).get({
      success:function(res){
        console.log(res)
        that.setData({
          tm:res.data[0]
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
          that.setData({
            imglist:newlist
          })
        }
      }
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

  },
  preview:function(e){
    let curtid = e.target.id
    let addr = this.data.imglist[curtid]
    wx.previewImage({
      current:addr,
      urls: this.data.imglist,
    })
  },
  checkdelete:function(e){
    var tid = this.data.id
    var that = this
    wx.showModal({
      title:'确认删除',
      content:'确认要删除题目'+this.data.id+'吗？',
      success:function(res){
        if(res.confirm){
          wx.cloud.database().collection('tm').where({
            _id:that.data.id
          }).remove({
            success:function(e){
              console.log("删除成功"+e)
            }
          })
        }else if(res.cancel){

        }
      }
    })
  }
})