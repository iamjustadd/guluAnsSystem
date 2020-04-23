// pages/Home/Home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    height: 20,
    focus: false,
    imglist:[],
    quetype:"选择题",
    quetypes:["选择题","填空题","判断题"],
    showpicker:true,
    showpicker2:true,
    value: 0,
    transparentrate: 1.0,
    slidervalue:4,
    typeofselect:false,
    selectedoption:[],
    answeroftiankong:"",
    answerofjudge:true,
    chapt:0,
    hashmap:['2','5','6','7','8','9'],
    chapts:["第二章","第五章","第六章","第七章","第八章","第九章"],
    tags:[""],
  },
  changechap:function(e){
    this.setData({
      chapt:e.detail.value
    })
  },
  keywordchange:function(e){
    console.log(e)
    var index = e.target.id
    var newword = e.detail.value
    this.data.answerofjianda.splice(index,1,newword)
  },
  weightchange:function(e){    //未解决问题：删除控件选择最底下 控件删除，相应的数据删除时是删除对应的index
    var index = e.target.id    //若找不到更好的解决方案，可以改为，与控件删除匹配weightofjianda.pop()
    var newword = e.detail.value
    this.data.weightofjianda.splice(index,1,newword)
  },
  bindButtonTap: function() {
    this.setData({
      focus: true
    })
  },
  checkoption:function(e){
    var this_option = e.target.id
    var flag = e.detail.value
    if(flag){
      this.data.selectedoption.push(this_option);
      this.data.selectedoption.sort();
    }else{
      for(var index=0;index<this.data.selectedoption.length;index++){
        if(this.data.selectedoption[index]==this_option){
          this.data.selectedoption.splice(index,1);
          console.log(this.data.selectedoption)
        }
      }
    }
  },
  changetypeofselect:function(){
    this.setData({
      typeofselect:!this.data.typeofselect,
      selectedoption:[],
    })
  },
  radiochange:function(e){
    var this_option = e.detail.value
    this.data.selectedoption.shift();
    this.data.selectedoption.push(this_option)
    console.log(this.data.selectedoption)
  },
  sliderchange:function(e){
    this.setData({
      slidervalue:e.detail.value
    })
    console.log("slider change to"+e.detail.value)
  },
  inputofans:function(e){
    this.setData({
      answeroftiankong:e.detail.value
    })
    console.log(this.data.answeroftiankong)
  },
  bindTextAreaBlur: function(e) {
    console.log(e.detail.value)
  },

  // 这里这里，提交函数在这里
  bindFormSubmit: function(e) {
    const db = wx.cloud.database()
    var type = this.data.quetype
    var description = e.detail.value.textarea
    var otherinfo;
    var that =this
    var func=function(length){
      if (length > 0) {
          var data = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
          var nums = "";
          for (var i = 0; i < length; i++) {
            var r = parseInt(Math.random() * 61);
            nums += data[r];
          }
          return nums
      } 
    }
    switch(type){
      case "选择题":
        otherinfo={
          "typeofselect":this.data.typeofselect,
          "anscount":this.data.slidervalue,
          "selectedoption":this.data.selectedoption,
        }
      break;
      case "填空题":
        otherinfo={
          "answer":this.data.answeroftiankong
        }
      break;
      case "判断题":
        otherinfo={
          "answer":this.data.answerofjudge
        }
      break;
    }
    let tmid=func(32)
    console.log(tmid)
    var cloudPath = [];
    for(var ind = 0;ind<this.data.imglist.length;ind++){
      var cpath = 'tmh'+tmid+ind+ this.data.imglist[ind].match(/\.[^.]+?$/)[0];
      var tpath = this.data.imglist[ind];
      cloudPath.push(cpath) ;
      wx.cloud.uploadFile({
        cloudPath:cpath,
        filePath:tpath,
        success:function(e){
          console.log("upload picture "+cpath+" success")
        },
        fail:function(e){
          console.log("upload picture "+cpath+" failed!!!!!!!!!!")
        }
      })
    }
    db.collection('tm').add({
      data: {
        "_id":tmid,
        "type":this.data.quetype,
        "description":description,
        "chapt":this.data.chapt,
        "info": otherinfo,
        "picinfo":cloudPath,
        "biaoqian":this.data.tags,
      },
      success: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      },
      fail:function(res){
        console.log('insert error')
      }
    })
    
    console.log(this.data.userInfo)
    wx.redirectTo({
      url: '../index/index',
    })
  },
  
  

  addextraimg:function(){  //添加照片
    var that = this;
    wx.showActionSheet({
      itemList: ['拍照','从手机相册选择'],
      success:function(e){
        if(e.tapIndex == 0){
          wx.chooseImage({
            count : 1,
            sizeType:['compressed'],
            sourceType:['camera'],
            complete: (res) => {
              wx.showToast({
                title: '正在上传',
                icon: 'loading',
                mask: true,
                duration: 1000
              })
              that.setData({
                imglist:that.data.imglist.concat(res.tempFilePaths)
              })
            },
          })
        }
        else if(e.tapIndex==1){
            wx.chooseImage({
              count : 9,
              sizeType:['compressed'],
              sourceType:['album'],
              complete: (res) => {
                wx.showToast({
                  title: '正在上传',
                  icon: 'loading',
                  mask: true,
                  duration: 1000
                })
                that.setData({
                  imglist:that.data.imglist.concat(res.tempFilePaths)
                })
              },
          })
        }
      },
      fail:function(e){
        console.log(e.errMsg)
      }
    })
  },
  changetype:function(){  //更换题目类型
    var that = this
    that.setData({
      showpicker : !this.data.showpicker,
      transparentrate:0.05
    })
  },
  changetype2:function(){  //更换题目类型
    this.setData({
      showpicker2 : !this.data.showpicker2,
      transparentrate:0.05
    })
  },
  closepicker:function(){  //更换题目类型
    var that = this
    that.setData({
      showpicker : this.data.showpicker?this.data.showpicker:!this.data.showpicker,
      showpicker2 : this.data.showpicker2?this.data.showpicker2:!this.data.showpicker2,
      transparentrate:1.0
    })
  },
  bindChange:function(e){
    var val = e.detail.value
    this.setData({
      quetype:this.data.quetypes[val],
      value:val,
    })
  },
  bindChange2:function(e){
    var val = e.detail.value
    this.setData({
      chapt:val,
    })
  },
  judgechange:function(e){
    this.setData({
      answerofjudge:!this.data.answerofjudge
    })
  },
  remove_img:function(e){
    var that = this
    var imglist = that.data.imglist
    console.log(imglist)
    if(imglist!=null){
      imglist.splice(e.currentTarget.id,1)
    }
    console.log(imglist)
    that.setData({
      imglist:imglist
    })
  },
  updatetag:function(e){
    let curtid=e.target.id
    let taglist = this.data.tags
    let curval = e.detail.value
    taglist[curtid] = curval
    this.setData({
      tags:taglist
    })
  },
  addnewtag:function(e){
    let curtid=e.target.id
    let taglist = this.data.tags
    taglist.push("")
    this.setData({
      tags:taglist
    })
    console.log(this.data.tags)
  },
  deletecurtag:function(e){
    let curtid=e.target.id
    let taglist = this.data.tags
    taglist.splice(curtid,1)
    this.setData({
      tags:taglist
    })
    
    console.log(this.data.tags)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp()
    this.setData({
      userInfo:app.globalData.userInfo
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