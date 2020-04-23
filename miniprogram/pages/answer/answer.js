// pages/showtm/showtm.js
Page({
  // 1583134484434_0.49271051595285154_33612092
  // 1583294696155_0.5127055497097215_33605164
  // 1583318084372_0.4957084304305517_33597123
  /**
   * 页面的初始数据
   */    
  data: {
    tm:{},
    disabled:true,
    imglist:[],
    id:'',
    curid:-1,
    quetype:-1,
    tmlist:[],
    tmnavi:[],
    optionstat:[],
    options:[],
    ansoffill:'',
    ansjudge:false,
    ansofjudge:true,
    curans:'',
    openid:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    var that = this
    let tkid = options.id
    let opid = wx.getStorageSync('openid')
    this.setData({
      id:tkid,
      openid:opid
    })
    db.collection('tk').where({
      _id:tkid
    }).get({
      success:function(res){
        let tmnavi=[]
        for(var i=0;i<res.data[0].tms.length;i++){
          tmnavi.push(false)
        }
        that.setData({
          tmlist:res.data[0].tms,
          curid:0,
          tmnavi:tmnavi
        })
        //由于异步性，一定要把更新页面的函数放在回调函数里，否则会出现运行结果无法预期
        that.updatepage()
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

  updatepage:function(){
    console.log("function start")
    const db = wx.cloud.database()
    let tmid= this.data.tmlist[this.data.curid]
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
        let type = -1
        let optionstat=[]
        let options=['A','B','C','D','E','F']
        if(res.data[0].type=="选择题"){
          type=0
          let len = res.data[0].info.anscount
          for(var i=0;i<len;i++){
            optionstat.push(false)
          }
          options.splice(len,6-len)
        }else if(res.data[0].type=="填空题"){
          type=1
        }else{
          type=2
        }
        that.setData({
          tm:res.data[0],
          quetype:type,
          options:options,
          optionstat:optionstat,
        },()=>{
          that.setpreviousans()
          let key = 'correctans'+that.data.curid
          switch(that.data.quetype){
            case 0:
              wx.setStorageSync(key, {"type":that.data.quetype,"answer":that.data.tm.info.selectedoption})
              break;
            case 1:
              wx.setStorageSync(key, {"type":that.data.quetype,"answer":that.data.tm.info.answer})
              break;
            case 2:
              wx.setStorageSync(key, {"type":that.data.quetype,"answer":that.data.tm.info.answer})
              break;
          }
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
          console.log(this.data.imglist)
        }
      }
    })
  },
  setpreviousans:function(){
    var that = this
    let key = 'tm'+this.data.curid
    console.log(key)
    if(this.data.quetype==0){
      let rs = wx.getStorageSync(key)
      if(rs){
        that.setData({
          optionstat:rs
        })
      }
    }else if(this.data.quetype==1){
      let rs = wx.getStorageSync(key)
      if(rs){
        that.setData({
          ansoffill:rs
        })
      }
    }else{
      let rs = wx.getStorageSync(key)
      if(rs){
        that.setData({
          ansofjudge:rs[1],
          ansjudge:rs[0]
        })
      }
    }
  },
  getcurrentans:function(){
    let key = "tm"+this.data.curid
    var that=this
    if(this.data.quetype==0){
      wx.setStorageSync(key, that.data.optionstat)
    }else if(this.data.quetype==1){
      wx.setStorageSync(key, that.data.ansoffill)
    }else{
      wx.setStorageSync(key, [that.data.ansjudge,that.data.ansofjudge])
    }
  },
  previoustm:function(){
    if(this.data.curid>0){
      this.getcurrentans()
      let curnavi = this.data.tmnavi
      curnavi[this.data.curid]=false 
      curnavi[this.data.curid-1] = true
      this.setData({
        curid:this.data.curid-1,
        tmnavi:curnavi
      })
      this.updatepage();
    }
  },
  nexttm:function(){
    if(this.data.curid<this.data.tmlist.length-1){
      this.getcurrentans()
      let curnavi = this.data.tmnavi
      curnavi[this.data.curid]=false
      curnavi[this.data.curid+1] = true
      this.setData({
        curid:this.data.curid+1,
        tmnavi:curnavi
      })
      this.updatepage();
    }
  },
  //问题：出现curid+1打印出curid的值与1的组合数而非和，原因是e.target.id是string类型参数，需转化为int型才不会打印错误
  movetotm:function(e){
    let id = parseInt(e.target.id)
    this.getcurrentans()
    this.setData({
      curid:id
    })
    this.updatepage();
  },
  // 该方法由于异步性，通常在执行时产生错误，需优化解决方案
  //已解决 由于点击text标签不执行本函数，因此产生错误，删除text标签后问题解决
  //注意：移除无意义的标签，否则会影响组件的交互
  selection:function(e){
    let cid = e.target.id
    console.log(this.data.optionstat)
    let curstat = this.data.optionstat
    if(!this.data.tm.info.typeofselect){  //单选题
      for(var i=0;i<curstat.length;i++){
        if(i==cid) curstat[i]=true
        else curstat[i] = false
      }
    }else{
      curstat[cid]=!curstat[cid]
    }
    this.setData({
      optionstat:curstat
    })
  },
  inputchange:function(e){
    this.setData({
      ansoffill:e.detail.value
    })
    console.log(this.data.ansoffill)
  },
  judgechange:function(e){
    this.setData({
      ansjudge:true,
      ansofjudge:e.target.id==0?true:false
    })
  },
  submit:function(){ 
    var that = this
    that.getcurrentans()
    wx.showModal({
      cancelColor: 'black',
      cancelText: '取消',
      confirmColor:'red',
      confirmText:'确认',
      content: '交卷后无法再修改，确定吗?',
      showCancel: true,
      success: (result) => {
        if(result.confirm){
          that.calculateandnavigate()
        }else if(result.cancel){

        }
      },
      title: '注意！',
    })
  },
  calculateandnavigate:function(){
    let tmamout = this.data.tmlist.length
    let options=['A','B','C','D','E','F']
    let wrongans=[]
    for(var i=0;i<tmamout;i++){
      let key1 = 'correctans'+i
      let key2 = 'tm'+i
      let rs1 = wx.getStorageSync(key1)
      let rs2 = wx.getStorageSync(key2)
      if(rs1&&rs2){ //如果这道题压根都没看过，那么rs1是没有值的
        if(rs1.type==0){
          let count=0
          for(var jj=0;jj<rs2.length;jj++){
            if(rs2[jj]) count++;
          }
          if(rs1.answer.length!=count){
            wrongans.push(this.data.tmlist[i])
            continue;
          }
          let start = 65;
          let iscorrect=true;
          for(var j=0;j<rs1.answer.length;j++){
            let index = rs1.answer[j].charCodeAt(0)-start;
            if(rs2[index]==false){
              wrongans.push(this.data.tmlist[i])
              break;
            }
          }
        }else if(rs1.type==1){
          if(rs2!=rs1.answer){
            wrongans.push(this.data.tmlist[i])
          }
        }else{
          if(!rs2[0]){
            wrongans.push(this.data.tmlist[i])
          }else{
            if(rs2[1]!=rs1.answer){
              wrongans.push(this.data.tmlist[i])
            }
          }
        }
      }else{
        wrongans.push(this.data.tmlist[i])
      }
    }
    console.log(wrongans)
    let correctamount = wrongans.length
    const db = wx.cloud.database()
    const _ =db.command
    db.collection('answersituation').add({
      stuid:this.data.openid,
      tkid:this.data.id,
      correct:correctamount,
    })
    // db.collection('tk').where({
    //   "_id":this.data.id
    // }).update({
    //   data:{
    //     'correct':_.inc(correctamount),
    //     'answeramount':_.inc(1)
    //   },
    //   success:function(e){
    //     console.log("更新成功")
    //   }
    // })
    wx.setStorageSync('wrongtm', wrongans)
    wx.redirectTo({
      url: '../ansresult/ansresult?wrongamount='+wrongans.length,
    })
  }
})

// 在题目切换时应该把当前答案暂存起来，方便在切换回来时有记录可查询
// 解决方案1:用同步存储wx.set/getStorageSync在每次切换时存当前题目，打印页面后取待切换题目答案
// 每次点击开始答题后，清空Storage缓存


// 数据库update操作只能使用云函数完成

//在提交页面时，要将当前页面的答案进行缓存