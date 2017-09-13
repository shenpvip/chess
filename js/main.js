var main = {
	chess:document.getElementById("chess"),
	context:this.chess.getContext("2d"),
	mask:document.getElementById("mask"),
	btnBox:document.getElementById("computer").parentNode,
	comBtn:document.getElementById("computer"),
	popBtn:document.getElementById("people"),
	reStart:document.getElementById("reStart"),
	me:true,          //角色
	chessBoard:[],    //棋盘数组
	wins:[],          //赢法数组          
	count:0,          //赢法种类的索引
	myWin:[],         //用户赢法统计
	computerWin:[],   //计算机赢法统计
	over:false,       //游戏开关
	gameModule:1,  //游戏模式

	/**
	 * [drawChess description]绘制棋盘
	 * @return {[type]} [description]
	 */
	drawChess:function(){
		var img = new Image();
		img.src = "./images/bg.jpg";
		main.context.strokeStyle = "#333";
		img.onload = function(){
			main.context.drawImage(img,0,0);
			for (var i = 0; i < 15; i++) {
				main.context.moveTo(15+i*30,15);
				main.context.lineTo(15+i*30,435);
				main.context.moveTo(15,15+i*30);
				main.context.lineTo(435,15+i*30);
				main.context.stroke();
			}
		}
	},
	/**
	 * [oneStep description]绘制棋子
	 * @param  {[type]} i  [description]
	 * @param  {[type]} j  [description]
	 * @param  {[type]} me [description]
	 * @return {[type]}    [description]
	 */
	oneStep:function(i,j,me){
		var grd = main.context.createRadialGradient(15+i*30+2,15+j*30-2,13,15+i*30,15+j*30,0);
		if(me){   //黑子
			grd.addColorStop(0,"#0a0a0a");
			grd.addColorStop(1,"#636766");
		}else{    //白子
			grd.addColorStop(0,"#d1d1d1");
			grd.addColorStop(1,"#f9f9f9");
		}
		main.context.fillStyle = grd;
		main.context.beginPath();
		main.context.arc(15+i*30,15+j*30,13,0,Math.PI*2);
		main.context.closePath();
		main.context.fill();
	},
	/**
	 * [onChess description]落子
	 * @return {[type]} [description]
	 */
	onChess:function(){
		//初始化赢法统计
		for (var i = 0; i < main.count; i++) {
			main.myWin[i] = 0;
			main.computerWin[i] = 0;
		}
		main.chess.onclick = function(e){
			e = e || event;
			if(!main.over){
				return;
			}
			if(main.gameModule == 1){   //人机对战
				if(!main.me){   
					return;
				}
			}
			var i =  Math.floor(e.offsetX / 30);
			var j =  Math.floor(e.offsetY / 30);
			if(main.chessBoard[i][j] == 0){
				main.oneStep(i,j,main.me);
				main.chessBoard[i][j] = 1;
				for (var k = 0; k < main.count; k++) {
					if(main.wins[i][j][k]){
						main.myWin[k]++;
						main.computerWin[k] = 6;
						if(main.myWin[k] == 5){
							alert("你赢了！");
							main.over = false;
							main.btnBox.style.display = "block";
							main.mask.style.display = "block";
							main.reStart.style.display = "block";
							main.popBtn.style.display = "none";
							main.comBtn.style.display = "none";
						}
					}
				}
				if(main.gameModule == 2){   //人人对战
					main.me = !main.me;
				}else if(main.gameModule == 1){
					if(main.over){
						main.computerAI();
						main.me = !main.me;
					}
				}
			}else{
				alert("该处已有棋子！");
			}
		}
	},
	/**
	 * [gameStart description]游戏开始
	 * @return {[type]} [description]
	 */
	gameStart:function(){
		var com = document.getElementById("computer");
		var pep = document.getElementById("people");
		var reStart = document.getElementById("reStart");
		com.onclick = function(){
			main.over = true;
			main.gameModule = 1;
			main.btnBox.style.display = "none";
			main.mask.style.display = "none";
			alert("人机对战开始！");
		}
		pep.onclick = function(){
			main.over = true;
			main.gameModule = 2;
			main.btnBox.style.display = "none";
			main.mask.style.display = "none";
			alert("人人对战开始！");
		}
		reStart.onclick = function(){
			window.location.reload();
		}
	},
	/**
	 * [computerAI description]电脑AI算法
	 * @return {[type]} [description]
	 */
	computerAI:function(){
		var myScore = [];
		var computerScore = [];
		var max = 0,
			u = 0,
			v = 0;
		//初始化数组
		for (var i = 0; i < 15; i++) {
			myScore[i] = [];
			computerScore[i] = [];
			for (var j = 0; j < 15; j++) {
				myScore[i][j] = 0;
				computerScore[i][j] = 0;
			}
		}
		for (var i = 0; i < 15; i++) {
			for (var j = 0; j < 15; j++) {
				if(main.chessBoard[i][j] == 0){    //当前位置无子
					for (var k = 0; k < main.count; k++) {  //遍历所有赢法
						if(main.wins[i][j][k]){      
							if(main.myWin[k] == 1){    //用户赢法积分
								myScore[i][j] += 200;
							}else if(main.myWin[k] == 2){
								myScore[i][j] += 400;
							}else if(main.myWin[k] == 3){
								myScore[i][j] += 2000;
							}else if(main.myWin[k] == 4){
								myScore[i][j] += 10000;
							}
							//计算机赢法积分
							if(main.computerWin[k] == 1){
								computerScore[i][j] += 220;
							}else if(main.computerWin[k] == 2){
								computerScore[i][j] += 420;
							}else if(main.computerWin[k] == 3){
								computerScore[i][j] += 2100;
							}else if(main.computerWin[k] == 4){
								computerScore[i][j] += 20000;
							}
						}
					}
					//用户得分最高的点
					if(myScore[i][j] > max){
						max = myScore[i][j];
						u = i;
						v = j;
					}else if(myScore[i][j] == max){
						if(computerScore[i][j] > computerScore[u][v]){
							u = i;
							v = j;
						}
					}
					//计算机得分最高的点
					if(computerScore[i][j] > max){
						max = computerScore[i][j];
						u = i;
						v = j;
					}else if(computerScore[i][j] == max){
						if(myScore[i][j] > myScore[u][v]){
							u = i;
							v = j;
						}
					}
				}		
			}
		}
		main.oneStep(u,v,false);
		main.chessBoard[u][v] = 2;

		for (var k = 0; k < main.count; k++) {
			if(main.wins[u][v][k]){
				main.computerWin[k]++;
				main.myWin[k] = 6;
				if(main.computerWin[k] == 5){
					alert("计算机赢了！");
					main.over = false;
					main.btnBox.style.display = "block";
					main.mask.style.display = "block";
					main.reStart.style.display = "block";
					main.popBtn.style.display = "none";
					main.comBtn.style.display = "none";
				}
			}
		}
		if(main.over){
			main.me = !main.me;
		}
	},
	/**
	 * [dataInit description]初始化数据
	 * @return {[type]} [description]
	 */
	dataInit:function(){
		for (var i = 0; i < 15; i++) {
			main.chessBoard[i] = [];      //初始化棋盘数组
			main.wins[i] = [];           //初始化赢法数组
			for (var j = 0; j < 15; j++) {
				main.chessBoard[i][j] = 0;   //没落子
				main.wins[i][j] = [];
			}
		}
	},
	/**
	 * [winsCount description]赢法统计
	 * @return {[type]} [description]
	 */
	winsCount:function(){
		//横向五颗子
		for (var i = 0; i < 15; i++) {
			for (var j = 0; j < 11; j++) {
				for (var k = 0; k < 5; k++) {
					main.wins[i][j+k][main.count] = true;
				}
				main.count++;
			}
		}
		//纵向五颗子
		for (var i = 0; i < 15; i++) {
			for (var j = 0; j < 11; j++) {
				for (var k = 0; k < 5; k++) {
					main.wins[j+k][i][main.count] = true;
				}
				main.count++;
			}
		}
		//斜线五颗子
		for (var i = 0; i < 11; i++) {
			for (var j = 0; j < 11; j++) {
				for (var k = 0; k < 5; k++) {
					main.wins[i+k][j+k][main.count] = true;
				}
				main.count++;
			}
		}
		//反斜线五颗子
		for (var i = 0; i < 11; i++) {
			for (var j = 14; j >3; j--) {
				for (var k = 0; k < 5; k++) {
					main.wins[i+k][j-k][main.count] = true;
				}
				main.count++;
			}
		}
	},
	_init:function(){
		this.drawChess();
		this.dataInit();
		this.winsCount();
		this.onChess();
		this.gameStart();
	}
};

main._init();