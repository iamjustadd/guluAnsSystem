// pages/tminfo/tminfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    hashmap:[-1,-1,0,-1,-1,1,2,3,4,5],
    cht:[],
    selectedlist:[],
    showsublist:[true,true,true,true,true,true],
    needheight:[0,0,0,0,0,0],
    nowheight:[50,50,50,50,50,50],
  },

  /**
   * 生命周期函数--监听页面加载
   * 在加载时，从数据库读来所有拥有者是本openid的题目信息，打印出来
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    var that = this
    this.data.openid=wx.getStorageSync('openid')
    console.log(this.data.openid)
    db.collection('tm').where({
      _openid:this.data.openid,
    }).get({
      success:function(res){
        console.log("query success and get question "+res.data.length)
        if(res.data.length>0){
          let nhei=[]
          for(var i=0;i<6;i++){
            let count=0;
            for(var ii=0;ii<res.data.length;ii++){
              if(res.data[ii].chapt==i){
                count++;
              }
            }
            nhei[i]=(count+1)*50
          }
          that.setData({
            cht:res.data,
            needheight:nhei,
          })
        }
        console.log(cht)
      },
      fail:function(res){
        console.log("query error.")
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
  opensublist:function(e){
    let curtid = e.target.id.match(/[0-9]+$/)[0]
    let changedop = this.data.showsublist
    changedop[curtid] = !this.data.showsublist[curtid]
    let changedheight = this.data.nowheight
    if(changedheight[curtid]==50){
      changedheight[curtid]=this.data.needheight[curtid]
    }else{
      changedheight[curtid]=50
    }
    this.setData({
      showsublist:changedop,
      nowheight:changedheight,
    })
    console.log(this.data.showsublist)
  },
  showinfo:function(e){
    var tmindex = e.currentTarget.id.match(/[0-9]+$/)
    console.log(tmindex)
    var _id = this.data.cht[tmindex]._id
    wx.navigateTo({
      url: '../showtm/showtm?id='+_id,
    })
  },
  selectchange:function(e){
    let tmid = e.target.id
    console.log(this.data.cht[tmid]._id)
    let slist = this.data.selectedlist
    let found = false
    let index = -1
    var i=0
    for(;i<slist.length;i++){
      if(slist[i]==tmid){
        found = true
        index = i
        break;
      }
    }
    if(found){
      slist.splice(i,1)
    }else{
      if(slist.length<=9) slist = slist.concat(tmid)
      else wx.showToast({
        title: '题库拥有最多不超过十道题',
        duration: '1000',
        icon:'none'
      })
    }
    this.setData({
      selectedlist:slist
    })
  },
  submittk:function(res){
    if(this.data.selectedlist.length<=0){
      wx.showToast({
        title: '请选择至少一道题',
        duration: 1000,
        icon: 'none',
      })
      return 0
    }
    const db=wx.cloud.database()
    let selected=[]
    let rdkey=this.getrandomkey()
    var that = this
    let needkey = false
    wx.showModal({
      title:'是否设置密码',
      success:function(res){
        if(res.confirm){
          needkey=true
          for(var i=0;i<that.data.selectedlist.length;i++){
            let tind = that.data.selectedlist[i]
            selected.push(that.data.cht[tind]._id)
            console.log(selected)
          }
          console.log(selected)
          db.collection('tk').add({
            data:{
              "tms":selected,
              "correct":0,
              "answeramount":0,
              "needkey":needkey,
              "keycode":needkey?rdkey:'',
            },
            success:function(res){
              console.log("create question base success.")
              wx.redirectTo({
                url: '../tkinfo/tkinfo?tkid='+res._id,
              })
            }
          })
        }
        else if(res.cancel){
          for(var i=0;i<that.data.selectedlist.length;i++){
            let tind = parseInt(that.data.selectedlist[i])
            selected.push(that.data.cht[tind]._id)
          }
          db.collection('tk').add({
            data:{
              "tms":selected,
              "correct":0,
              "answeramount":0,
              "needkey":needkey,
              "keycode":needkey?rdkey:'',
            },
            success:function(res){
              console.log("create question base success.")
              wx.redirectTo({
                url: '../tkinfo/tkinfo?tkid='+res._id,
              })
            }
          })
        }
      }
    })
    
  },
  getrandomkey:function(){
    var key=''
    for(var i=0;i<6;i++){
      let rd=0
      do{
        rd= Math.random()*255
      }while(!((rd>=65&&rd<=90)||(rd>=97&&rd<=122)||(rd>=48&&rd<=57)));
      key+=String.fromCharCode(rd)
    }
    return key
  }
})