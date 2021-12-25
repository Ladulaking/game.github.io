//console.log("宇宙战舰大战")
	alert("宇宙战舰大战开始！");//弹框

$(function(){ //使用jquery库
	//这里的代码，可以控制所有的HTML节点
	//定义方向的变量数组，依次表示上、右、下、左、空格用1表示按下用零表示未按下
	var pdirection = [0,0,0,0,0];
	//游戏状态
	var gamestaus = false;
	//得分
	var playerscore = 0;
	//DOM
	var stage = document.getElementById("stage"); //获取舞台的节点
	var bg1 = stage.getElementsByClassName("bg1")[0];//获取背景图片
	var bg2 = stage.getElementsByClassName("bg2")[0];//获取背景图片
	//console.log(stage.getElementsByClassName("bg1")) 调试作用
	//console.log(document.getElementById("stage").outHTML)是文本不是对象
	//console.log(stage);
	//玩家飞机对象
	var plane = stage.getElementsByClassName("plane")[0];
	//获取敌机所有对象
	var enemys=document.getElementsByClassName("enemy");
	//规定子弹宽高+速度
	var bulletW=30;
	var bulletH=50;
	var bulletSpeed=100;
	//功能切换
	var funcswitch = 1; //1表示打开键盘,关闭鼠标， 2表示关闭键盘打开鼠标
	var bgxx1 = -200;
	var bgxx2 = -864;
	var k = 0
	var t1 = setInterval(function(){
		k++;
		if(k == 664){//&&--and ||--or
			bgxx1 = -864;
		}else if(k == 664*2){
			bgxx2 = -864;
			k = 0;
		}
		
		bgxx1++;
		bgxx2++;
		 
		$(bg1).css({"top":bgxx1});//{字典类型}--对象   数字格式
		$(bg2).css({"top": bgxx2});
	},10);
	//执行初始化游戏
	initGame();

	//键盘的监控
	document.onkeydown = function(e){
		if(e.key == "w"){
			pdirection[0] = 1;
		}else if(e.key == "s"){
			pdirection[2] = 1;
		}else if(e.key == "a"){
			pdirection[3] = 1;
		}else if(e.key == "d"){
			pdirection[1] = 1;
		}
	}
	document.onkeypress=function(e){
		if(e.key==" "){
			fire();
		}
		// console.log(pdirection);
	}
	document.onkeyup = function(e){
		if(e.key == "w"){
			pdirection[0] = 0;
		}else if(e.key == "s"){
			pdirection[2] = 0;
		}else if(e.key == "a"){
			pdirection[3] = 0;
		}else if(e.key == "d"){
			pdirection[1] = 0;
		}else if(e.key==" "){
			pdirection[4] = 0;
		}
	}
	//鼠标确定飞机坐标
	stage.onmousemove = function(e){
		if(funcswitch==1) return; //关闭鼠标功能
		var planeX = e.clientX-parseFloat($(stage).css("margin-left"));
		var planeY = e.clientY;
		$(plane).css({"left":planeX-$(plane).width()/2,"top":planeY-$(plane).height()/2});
	}
	//绑定功能切换键
	$(".func").click(function(e){
		alert($(this).html());
		if($(this).html() == "功能切换"){
			if(funcswitch==1){
				funcswitch = 2;//关闭键盘，打开鼠标
				clearInterval(timerkey);
				timerfire = setInterval(fire,1000);//默认空格发射，功能切换后为每隔一秒自动发射一次
			}else{
				funcswitch = 1;
				timerkey=monitorKey();//打开键盘，关闭鼠标
				clearInterval(timerfire);
			}
		} 
	});
	// $("#btnStartGame").bind("click",aabbcc);//"事件"aabbcc()函数"
	// function aabbcc(){
	// 	alert("ok");
	// }
	//开始游戏按钮
	$("#btnStartGame").click(function(){
		//存储玩家姓名(最大容量5兆)，采用本地浏览器长期保存
		localStorage.setItem("player"+(localStorage.length+1),$("#player").val()+",0");
		//分数清零
		playerscore = 0;
		startGame();
		
	});
	//绑定再玩一次按钮
	$("#btnreplay").click(function(){
		//隐藏排行榜
		$(".gamesort").hide();
		startGame();
		//打开自动发射子弹
		timerfire = setInterval(fire,1000);
	})
	//敌机的时钟控件
	
	setInterval(function(){
		for(var i=0;i<enemys.length;i++){
			if($(enemys[i]).attr("class")=="enemy enemy1")
				$(enemys[i]).css("top",parseFloat($(enemys[i]).css("top"))+6);
			else if($(enemys[i]).attr("class")=="enemy enemy2")
				$(enemys[i]).css("top",parseFloat($(enemys[i]).css("top"))+4);
			else if($(enemys[i]).attr("class")=="enemy enemy3")
				$(enemys[i]).css("top",parseFloat($(enemys[i]).css("top"))+5);
			else if($(enemys[i]).attr("class")=="enemy enemy4")
				$(enemys[i]).css("top",parseFloat($(enemys[i]).css("top"))+7);
		}
	},100)
	//产生敌机
	setInterval(function(){
		var num=parseInt(Math.random()*4)+1;
		var enemyWs = [85,95];
		var rndleft = parseInt(Math.random()*$(stage).width()-enemyWs[num-1]);
		rndleft = rndleft<0?0:rndleft;
		$("<div class=\"enemy enemy"+num+"\"></div>").css({"left":rndleft}).appendTo($("#stage"));
	},5500);
	//离开舞台的飞机移除DOM节点
	setInterval(function(){
		for(var i=0; i<enemys.length;i++){
			var tmp_enemy=parseFloat($(enemys[i]).css("top"));
			var tmp_stage = $(stage).height();
			if(tmp_enemy>tmp_stage){
				$(enemys[i]).remove();
			}
		}
	},500);
	//控制子弹的动画时钟控件 $(this)是这个子弹本身
	setInterval(function(){
		if($(".bullet").length == 0) return;
		//设置好子弹溢出屏幕后移除子弹节点
		var bullets = $(".bullet");
		for(var i=0; i<bullets.length;i++){
			var bulletT = parseFloat($(bullets[i]).css("top"));
			$(bullets[i]).css({"top":(bulletT-10) +"px"});
		}
	},bulletSpeed)
	// // 子弹的监控
	// setInterval(function(){
	// 	var bullets = $(".bullet");
	// 	for(var i=0; i<bullets.length; i++){
	// 		// console.log(parseInt($(bullets[i]).css("top")));
	// 		if(parseInt($(bullets[i]).css("top")) < -$(bullet[i]).height()){
	// 			$(bullets[i]).remove();
	// 		}
	// 	}
	// },10);
	// //t.clearInterval();时间停止了
	
	//监控数组pdirection为键盘的按下情况
	var timerkey = monitorKey();
	//时钟控件表示每隔多少时间发子弹(采取调用函数的方法，把发射的代码封装到fire函数)
	// setInterval(function(){
	// 	// var e = jQuery.Event("keypress");
	// 	// e.key = " "
	// 	// $(document).trigger(e);
	// },1000);
	// var timerfire =setInterval(fire,1000);
	
	//定义变量存储子弹发射的动画，默认在开始游戏界面的开火发射子弹状态
	var timerfire = setInterval(fire,1000);
	
	
	//时时刻刻碰撞检测
	var timerkiss = monitorkiss();
	//碰撞模型
	function kissAB(A,B){
		var iskiss = false;
		var a = $(A).height()/2 + parseFloat($(A).css("top")) - parseFloat($(B).css("top"))-$(B).height()/2;//垂直距离
		var b = parseFloat($(A).css("left")) + $(A).width()/2 - parseFloat($(B).css("left")) - $(B).width()/2;//水平距离
		var c = $(A).width()/2 + $(B).width()/2-10;
		if(a*a + b*b <= c*c){ //碰撞后移除敌机和本机
			iskiss = true;
		}
		return iskiss;
	}
	//时钟控件，监控子弹与敌机+玩家与敌机的碰撞
	function monitorkiss(){
		return setInterval(function(){
		//检测子弹与敌机是否碰撞
		var bullets = $(".bullet");//获取了所有子弹
		for(var i=0; i<bullets.length; i++){
			for(var j=0;j<enemys.length;j++){ //遍历所有的敌机
				if(kissAB(bullets[i],enemys[j])){
						$("#mp3de")[0].play();
						$(enemys[j]).remove();
						$(bullets[i]).remove();
						playerscore++;
						break;
				}
			}
		}
		//检测玩家与敌机是否碰撞
		for(var i=0;i<enemys.length;i++){
			if(kissAB(plane,enemys[i])){
				$("#mp3dy")[0].play();
				// alert("游戏结束");
				if(gamestaus)
				gameover();
				break;
			}
		}
	},1);
	}
	//时钟控件，监控飞机的方向
	function monitorKey(){
		return setInterval(function(){
			if(pdirection[0] == 1){
				if(parseFloat($(plane).css("top"))>=5){
					$(plane).css({"top":parseFloat($(plane).css("top"))-5});
				}else
					$(plane).css({"top":0});
			}else if(pdirection[2] == 1){
				if(parseFloat($(plane).css("top"))<$(stage).height()-$(plane).height()-5)
					$(plane).css({"top":parseFloat($(plane).css("top"))+5});
				else
					$(plane).css({"top":$(stage).height() - $(plane).height()});
			}else if(pdirection[3] == 1){
				if(parseFloat($(plane).css("left"))>=5)
					$(plane).css({"left":parseFloat($(plane).css("left"))-5});
				else 
					$(plane).css({"left":0});
			}else if(pdirection[1] == 1){
				console.log($(plane).css("right"));
				if(parseFloat($(plane).css("right"))>=5)//右边往左是正的
					$(plane).css({"left":parseFloat($(plane).css("left"))+5});
				else
					$(plane).css({"left":$(stage).width() - $(plane).width()});
			}
		},10);
	}
	//开火，发射一颗子弹
	function fire(){
		$("#mp3sh")[0].currentTime = 0;
		$("#mp3sh")[0].play();
		pdirection[4] = 1;
		var bulletX=parseFloat($(plane).css("left"))+$(plane).width()/2-bulletW/2;
		var bulletY=parseFloat($(plane).css("top"))-bulletH;
		$("<div class='bullet'></div>").css({"left":bulletX,"top":bulletY}).appendTo(stage);
		
	}
	//载入背景音乐
	// $("#mp3bg").play();
	// document.getElementById("mp3bg");
	var timerbgmusic = document.getElementById("mp3bg");
	//谷歌浏览器无法直接用play默认打开，解决方案：1.时间控件延时打开2.控件手动打开
	// setInterval(function(){
	// 	mp3bg.currentTime = 0;
	// 	mp3bg.play();
	// 	clearInterval(timerbgmusic);
	// },10)
	
	$("#btnmusic").click(function(){
		if($(this).html()=="开启音乐"){
			mp3bg.currentTime = 0;
			mp3bg.play();
			$(this).html("停止音乐");
		}else{
			mp3bg.pause();
			$(this).html("开启音乐");
		}
		// clearInterval(timerbgmusic);
	});
	// var timerkey1 = setInterval(function(){
	// 	$("#btmusic").click();
	// 	clearInterval(timerkey1);
	// },1000);
	//初始化游戏，在游戏开始界面上的动作
	function initGame(){
		$(".func").hide();

	}
	//开始游戏
	function startGame(){
		//更新游戏状态
		gamestaus=true;
		//载入背景音乐
		$("#mp3bg")[0].currentTime=0;
		$("#mp3bg")[0].play();
		//显示功能按钮
		$(".func").show();
		//隐藏游戏说明界面
		$(".gamedesc").hide();
		//碰撞检测开始
		timerkiss = monitorkiss();
		//生成玩家玩家飞机
		var timertmp = setInterval(function(){
			if(parseFloat($(plane).css("top"))<$(stage).height()-$(plane).height()*2){
				
				clearInterval(timertmp);
			}else
				plane.style.cssText="top:" + (parseFloat($(plane).css("top"))-5)+"px;left:"+($(stage).width()/2 - $(plane).width()/2+"px");
		},10);
	}
	function gameover(){
		//记录玩家分数
		var curplayer = localStorage.getItem("player"+localStorage.length);
		// // //获取玩家姓名
		var curplayName = curplayer.substring(0,curplayer.indexOf(","));
		// //存储分数
		localStorage.setItem("player"+localStorage.length,curplayName+","+playerscore);
		// //存储玩家信息
		var players=[];
		
		// //遍历存储的所有数据
		for(var i=1;i<=localStorage.length;i++){
			var strinfo = localStorage.getItem("player"+i)
			players.push(strinfo.split(","));//把”玩家，10“，分隔后变成一个数组【”玩家“，”10“】
		}
		players=players.sort(function(a,b){
			return a[1]-b[1];
		});
		var resulthtml="";
		// //从大到小排序
		var k =0
		for(var i = players.length-1;i>=0;i--){
			if(k<9){
				resulthtml += "<tr>\
								<th>"+(players.length-i)+"</th>\
								<th>"+players[i][0]+"</th>\
								<th>"+players[i][1]+"</th>\
							</tr>"
				k++;
			}else break;
			
		}
		// //覆盖至gamesort_tboby上的HTML
		$("#gamesort_tboby").html(resulthtml);
		//显示天梯
		
		$(".gamesort").show();
		//清除碰撞检测，检测停止
		clearInterval(timerkiss);
		//移除自动产生子弹
		clearInterval(timerfire);
		//移除所有敌机
		$(".enemy").remove();
		clearInterval(timerkiss);
		//游戏结束隐藏游戏说明
		$(".gamedes").hide();
		//游戏结束，移除玩家飞机(使用隐藏的方法)
		// plane.hidden = true;
		$(plane).hide();
		plane.style.cssText="top:"+$(stage).height()+"px;left:"+($(stage).width()/2 - $(plane).width()/2+"px");
		// if(confirm("再玩一次吗? ")){
		// 	startGame();
		// }
		
		//重置键盘方向
		pdirection = [0,0,0,0,0];
	}
});


//自定义函数
function myapp(a,b,c){
	
}