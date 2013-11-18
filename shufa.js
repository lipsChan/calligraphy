var ShuFa = {
	//公用变量
	context : null,//canvas
	blush1 : null,//撇
	blush1path : "img/blush.png",
	blush2 : null,//点
	blush2path : "img/point.png",
	instance : null,//实例
	oldX : 0,
	oldY : 0,
	oldScale : 0,
	defaultScale : 0.6,//缺省笔触大小
	cx : 0.01,//粗细变化参数
	brushMin : 0.08,//最小笔触限制
	midu : 1,//笔刷密度
	brushAlpha : 0.3,
	moShuiDefault: 600,//默认墨水
	oldMoShui : 600,//目前墨水
	
	createNew : function(board){
		var obj = {};
		//私有变量定义
		obj.board = board;
		ShuFa.context = obj.board.getContext("2d");
		ShuFa.instance  = obj;
		//图片加载
		ShuFa.blush = new Image();
  		ShuFa.blush.src = ShuFa.blush1path;
  		ShuFa.blush.onload = function(){
  			//添加监听
  			ShuFa.addListenerSet();
  		}
  		
		return obj;
	},
	addListenerSet : function(){
		ShuFa.instance.board.addEventListener("mousedown",ShuFa.mouseDownHandler);
	},
	mouseDownHandler : function(evt){
		ShuFa.instance.board.addEventListener("mouseup",ShuFa.mouseUpHandler);
		ShuFa.instance.board.addEventListener("mousemove",ShuFa.addBlush);
				
		//记录变量
		ShuFa.oldX = evt.offsetX;
		ShuFa.oldY = evt.offsetY;
		//ShuFa.oldMoShui = ShuFa.moShuiDefault;
	},
	addBlush : function(evt){
			if(ShuFa.oldMoShui<=0)return;
			//计算距离
			var disX = evt.offsetX - ShuFa.oldX;
			var disY = evt.offsetY - ShuFa.oldY;
			var dis = Math.sqrt(disX * disX + disY * disY);
			//改变笔触的大小,越快越小
			if (dis > 0) {
				var scale = ShuFa.defaultScale - dis * ShuFa.cx;
				if (scale > 1) {
					scale = 1;
				}else if (scale < ShuFa.brushMin) {
					scale = ShuFa.brushMin;
				}
				  scale = (ShuFa.oldScale + scale) / 2;
			}

			//ShuFa.context.drawImage(ShuFa.blush,evt.offsetXscale,evt.offsetY/scale);

			//填充
			var count = Math.floor(dis / ShuFa.midu);
  			var scaleBili = (ShuFa.oldScale-scale) / count;
  			var scaleCount;
 			//count = count>ShuFa.maxCount?ShuFa.maxCount:count;
			for (var i=0; i<count-1; i++,ShuFa.oldMoShui--) {
				scaleCount = ShuFa.oldScale-scaleBili*i*(ShuFa.oldMoShui/ShuFa.moShuiDefault);
				ShuFa.oldMoShui-=scaleCount;//减掉墨水
				if(ShuFa.oldMoShui<0)break;
				ShuFa.context.globalAlpha = ShuFa.brushAlpha*ShuFa.oldMoShui;
				ShuFa.context.setTransform(scaleCount,0,0,scaleCount,0,0);
				ShuFa.context.drawImage(ShuFa.blush,((disX/count)*(i+1)
								+ShuFa.oldX)/(scaleCount),((disY/count)*(i+1)+ShuFa.oldY)/(scaleCount));
			}
			
			ShuFa.oldScale = ShuFa.oldScale-scaleBili*(ShuFa.oldMoShui/ShuFa.moShuiDefault)*count;
			ShuFa.oldX = evt.offsetX;
			ShuFa.oldY = evt.offsetY;
	},
	mouseUpHandler : function(evt){
		ShuFa.instance.board.removeEventListener("mousemove",ShuFa.addBlush);
		ShuFa.instance.board.removeEventListener("mouseup",ShuFa.mouseUpHandler);
		ShuFa.oldMoShui = ShuFa.moShuiDefault;
	}
}

