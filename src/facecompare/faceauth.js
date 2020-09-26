angular.module('myApp',[])
	.controller("CityController",function($scope,$http){
		var remoteIP = "http://"+sessionStorage.addr+"/facecompare";

		$scope.reader = new FileReader();   //创建一个FileReader接口
		$scope.responseJson;
		$scope.authReslut;
		$scope.message;
		$scope.oDivSrc;
		$scope.nextimg=function(msg){

			// 查找所有img标签
			var imgs = document.getElementsByClassName('rectangle-14')[0].children;
			var length = imgs.length; // 查找到的个数
			var i = 0;

			// 处理图片点击事件
			function handleClick (e) {			

				
				target = e.target || Event.srcElement; // 兼容浏览器， ie9一下版本用后面的
				$scope.oDivSrc = target.getAttribute('src'); // 只获取src里的内容
			

				whichFace = msg;
				$scope.guid = (new Date()).valueOf();   //通过时间戳创建一个随机数，作为键名使用
							
				var img = new Image();

				img.crossOrigin = 'Anonymous'; // 允许image请求的图片应用到canvas，就像他们在同一个域
				img.onload = function() {
				
					$scope[whichFace].img_size.width = img.width;
					$scope[whichFace].img_size.height = img.height;
					var canvas = document.getElementById("myCanvas-" + whichFace);
					var context = canvas.getContext("2d");
					//获取canvas中心坐标
					var canvasCenterX = context.canvas.width/2;  
					var canvasCenterY = context.canvas.height/2;
					//获取绘图数据
					var drawObj = $scope.getDrawMsg(context,img.width,img.height);
					console.log(angular.toJson(drawObj));
					percent = drawObj.percent;
					//获取图像XY起点坐标
					var imageStartPointX = canvasCenterX - drawObj.width/2;  
					var imageStartPointY = canvasCenterY - drawObj.height/2;

					a(function () {////////
						
						b();
					});
			 		
					function a(callback) {

						document.getElementById("myCanvas-"+whichFace).style.opacity=0.2;
						document.getElementById("can-"+whichFace).style.display="block";
						setTimeout(function () {
					
					//清除原有图像
					context.clearRect(0,0,context.canvas.width,context.canvas.height);
					
							//绘图
					context.drawImage(img, imageStartPointX, imageStartPointY, drawObj.width, drawObj.height); //绘制图像，drawImage有多种重载函数，具体参考w3l，至此载入图片完毕
					console.log("图像X起点: " + imageStartPointX + ", 图像Y起点: " + imageStartPointY + ", 图像width: " + drawObj.width + ", 图像height: " + drawObj.height + ", 图像缩放比例: " + drawObj.percent);
					$scope[whichFace].hasDrawImage = true;
					$scope[whichFace].imageStartPointX = imageStartPointX;
					$scope[whichFace].imageStartPointY = imageStartPointY;
					$scope[whichFace].percent = percent;

					var aa=canvas.toDataURL('image/jpeg');
					$scope[whichFace].temp_img = aa.substr(aa.indexOf('base64,') + 'base64,'.length);

					if($scope.left.detection && $scope.right.detection){
						$scope.compareFace();
					}
							callback()//////////////
						}, 1000);
				
					}
					
					function b() {
						document.getElementById("myCanvas-"+whichFace).style.opacity=1;
						document.getElementById("can-"+whichFace).style.display="none";				
					}
				};			

				if (img.complete || img.complete === undefined) { // 确保对缓存的图片也触发img.onload事件
					img.src = $scope.oDivSrc;
				}
			}

			while (i < length) {
				imgs[i++].onclick = handleClick ;
			}				

		}

		$scope.$watch('$viewContentLoaded', function() {
			//whichFace = 'left';
			$scope.guid = (new Date()).valueOf();   //通过时间戳创建一个随机数，作为键名使用
						
			var img = new Image();

			img.crossOrigin = 'Anonymous'; // 允许image请求的图片应用到canvas，就像他们在同一个域
			img.onload = function() {
			
				$scope['left'].img_size.width = img.width;
				$scope['left'].img_size.height = img.height;
				var canvas = document.getElementById("myCanvas-" + 'left');
				var context = canvas.getContext("2d");
				
				//获取canvas中心坐标
				var canvasCenterX = context.canvas.width/2;  
				var canvasCenterY = context.canvas.height/2;
				//获取绘图数据
				var drawObj = $scope.getDrawMsg(context,img.width,img.height);
				console.log(angular.toJson(drawObj));
				percent = drawObj.percent;
				//获取图像XY起点坐标
				var imageStartPointX = canvasCenterX - drawObj.width/2;  
				var imageStartPointY = canvasCenterY - drawObj.height/2;
				//清除原有图像
				context.clearRect(0,0,context.canvas.width,context.canvas.height);

					a(function () {////////
						b();

					});
			 		
				function a(callback) {

					document.getElementById("myCanvas-left").style.opacity=0.2;
					document.getElementById("can-left").style.display="block";
					setTimeout(function () {
						//绘图
				context.drawImage(img, imageStartPointX, imageStartPointY, drawObj.width, drawObj.height); //绘制图像，drawImage有多种重载函数，具体参考w3l，至此载入图片完毕
				console.log("图像X起点: " + imageStartPointX + ", 图像Y起点: " + imageStartPointY + ", 图像width: " + drawObj.width + ", 图像height: " + drawObj.height + ", 图像缩放比例: " + drawObj.percent);
				$scope['left'].hasDrawImage = true;
				$scope['left'].imageStartPointX1 = imageStartPointX;
				$scope['left'].imageStartPointY1 = imageStartPointY;
				$scope['left'].percent = percent;

				var aa=canvas.toDataURL('image/jpeg');
				$scope.left.temp_img = aa.substr(aa.indexOf('base64,') + 'base64,'.length);

						callback()//////////////
					}, 1000);
			 
				}

				function b() {
					document.getElementById("myCanvas-left").style.opacity=1;

					document.getElementById("can-left").style.display="none";	

					if($scope.left.detection && $scope.right.detection){
						$scope.compareFace();
					}
				}

			};

		
			if (img.complete || img.complete === undefined) { // 确保对缓存的图片也触发img.onload事件
				img.src = "http://i2.bvimg.com/659442/c0892f8c51b85cdf.jpg";
				$scope['left'].detection = true; // 绘制完成，人脸识别成功
			}
			/////////////////////////////////////////////////////////////////////////////////////////////////////////////
			//whichFace = 'right';
			$scope.guid = (new Date()).valueOf();   //通过时间戳创建一个随机数，作为键名使用
						
			var img2 = new Image();

			img2.crossOrigin = 'Anonymous'; // 允许image请求的图片应用到canvas，就像他们在同一个域
			img2.onload = function() {
			
				$scope['right'].img_size.width = img2.width;
				$scope['right'].img_size.height = img2.height;
				var canvas2 = document.getElementById("myCanvas-" + 'right');
				var context2 = canvas2.getContext("2d");
				
				//获取canvas中心坐标
				var canvasCenterX = context2.canvas.width/2;  
				var canvasCenterY = context2.canvas.height/2;
				//获取绘图数据
				var drawObj = $scope.getDrawMsg(context2,img2.width,img2.height);
				console.log(angular.toJson(drawObj));
				percent = drawObj.percent;
				//获取图像XY起点坐标
				var imageStartPointX = canvasCenterX - drawObj.width/2;  
				var imageStartPointY = canvasCenterY - drawObj.height/2;
				//清除原有图像
				context2.clearRect(0,0,context2.canvas.width,context2.canvas.height);

					a(function () {////////
						b();

					});
			 		
				function a(callback) {

					document.getElementById("myCanvas-right").style.opacity=0.2;
					document.getElementById("can-right").style.display="block";
					setTimeout(function () {
						//绘图
				context2.drawImage(img2, imageStartPointX, imageStartPointY, drawObj.width, drawObj.height); //绘制图像，drawImage有多种重载函数，具体参考w3l，至此载入图片完毕
				console.log("图像X起点: " + imageStartPointX + ", 图像Y起点: " + imageStartPointY + ", 图像width: " + drawObj.width + ", 图像height: " + drawObj.height + ", 图像缩放比例: " + drawObj.percent);
				$scope['right'].hasDrawImage = true;
				$scope['right'].imageStartPointX2 = imageStartPointX;
				$scope['right'].imageStartPointY2 = imageStartPointY;
				$scope['right'].percent = percent;

				var bb=canvas2.toDataURL('image/jpeg');
				$scope.right.temp_img = bb.substr(bb.indexOf('base64,') + 'base64,'.length);
						callback()
					}, 1000);
			 
				}

				function b() {
					document.getElementById("myCanvas-right").style.opacity=1;

					document.getElementById("can-right").style.display="none";	

					if($scope.left.detection && $scope.right.detection){
						$scope.compareFace();
					}
				}

			};

			if (img2.complete || img2.complete === undefined) { // 确保对缓存的图片也触发img2.onload事件
				img2.src = "http://i2.bvimg.com/659442/e4408f7c860fb407.jpg";
				$scope['right'].detection = true; // 绘制完成，人脸识别成功
			}

	
		});
		

		// 初始化图片
		$scope.left = {
			img: "",
			temp_img: '',	// 临时储存图片
			faceInfo: '',	// 人脸识别结果
			img_size: {		// 图片的宽,高
				width: '',
				height: ''
			},
			detection: '',	// 人脸识别是否成功
			percentW: '',	// 百分比
			percentH: '',	// 百分比
			hasDrawImage: '', // 是否已经绘图
			imageStartPointX: '', // 是否已经绘图
			imageStartPointY: '', // 是否已经绘图
			imageStartPointX1: '', // 是否已经绘图
			imageStartPointY1: '' // 是否已经绘图
		}
		$scope.right = {
			img: "",
			temp_img: '',	// 临时储存图片
			faceInfo: '',	// 人脸识别结果
			img_size: {		// 图片的宽,高
				width: '',
				height: ''
			},
			detection: '',	// 人脸识别是否成功
			percentW: '',	// 百分比
			percentH: '',	// 百分比
			hasDrawImage: '', // 是否已经绘图
			imageStartPointX: '', // 是否已经绘图
			imageStartPointY: '', // 是否已经绘图
			imageStartPointX2: '', // 是否已经绘图
			imageStartPointY2: '' // 是否已经绘图
		}


		// 图片上传
		$scope.img_upload = function(msg,files) {       //单次提交图片的函数
			whichFace = msg;
			$scope.guid = (new Date()).valueOf();   //通过时间戳创建一个随机数，作为键名使用
			$scope.reader.readAsDataURL(files[0]);  //FileReader的方法，把图片转成base64
			$scope.reader.onload = function(ev) {
					var tempImg = {
						imgSrc : ev.target.result,  //接收base64
					}

					$scope[whichFace].temp_img = tempImg.imgSrc.substr(tempImg.imgSrc .indexOf('base64,') + 'base64,'.length);
					var image = new Image();
					image.onload = function(){
						$scope[whichFace].img_size.width = image.width;
						$scope[whichFace].img_size.height = image.height;
						var canvas = document.getElementById("myCanvas-" + whichFace);
						var context = canvas.getContext("2d");
						//获取canvas中心坐标
						var canvasCenterX = context.canvas.width/2;
						var canvasCenterY = context.canvas.height/2;
						//获取绘图数据
						var drawObj = $scope.getDrawMsg(context,image.width,image.height);
						console.log(angular.toJson(drawObj));
						//获取图像XY起点坐标
						//清除原有图像
						context.clearRect(0,0,context.canvas.width,context.canvas.height);

						//绘图
						context.drawImage(image, 0, 0, context.canvas.width, context.canvas.height);

						console.log("图像width缩放比例: " +  drawObj.percentW + ", 图像width缩放比例: " +  drawObj.percentH);
						$scope[whichFace].hasDrawImage = true;
						$scope[whichFace].percentW = drawObj.percentW;
						$scope[whichFace].percentH = drawObj.percentH;
					};
					image.src = tempImg.imgSrc;
					$scope[whichFace].detection = true; // 绘制完成，人脸识别成功

					// 两张图片都上传了，自动验证
					if($scope.left.detection && $scope.right.detection){
						$scope.compareFace();
					}
			};
		};

		// 画框框函数
		$scope.drawFrame = function(faceMsg,whichFace){
			//获取图像XY起点坐标和percent
			var percentW = $scope[whichFace].percentW;
			var percentH = $scope[whichFace].percentH;
			//获取框框坐标及宽高
			var x = faceMsg.x/percentW;
			var y = faceMsg.y/percentH;
			var width = faceMsg.width/percentW;
			var height = faceMsg.height/percentH;

			var canvas = document.getElementById("myCanvas-" + whichFace);
			// 画框框
			var context = canvas.getContext("2d");
			context.lineWidth = 2;
			context.strokeStyle= "rgb(74,171,232)";
			context.strokeRect(x, y, width, height);
		};


		$scope.compareFace = function(){
			$scope.message = '';
			$scope.authReslut = '';
			document.getElementById('result').innerHTML = '';
			var message = {"face1":$scope.left.temp_img,"face2":$scope.right.temp_img,"user_id":"gzntdemo"}
			$http({
	                method: 'post',
	                url: remoteIP,
	                data:message,
	                headers: {'Content-Type': "application/json"}
	            }).success(function(data,status,headers,config){
	                if(data.result==0)
	                {
	                    console.log("receive from service");
						$scope.message = "相似度 " + parseInt(data.score*100) + "%";
						if(data.score > 0.85){
							$scope.authReslut = "是否是同一个人: 可能性很高";
						  }
						else if(data.score >0.5){
							$scope.authReslut = "是否是同一个人: 可能性一般";
						  }else{
							$scope.authReslut = "是否是同一个人: 可能性很低";
						  }

					}
	                else{
						if($scope.left.detection && $scope.right.detection && data.result==-100){
							
						}else{
							$.alertable.alert("人脸识别失败: " + data.message);

						}
					}

					document.getElementById('result').innerHTML = $scope.format(angular.toJson(data),'')
	            }).error(function(data,status,headers,config){
	                console.log("fail receive from service");

	                $.alertable.alert("网络连接出错！");
            });
		};

			// 获取绘图数据
		$scope.getDrawMsg = function (context,imageWidth,imageHeight){
			//获得原有canvas长宽
			var cw = context.canvas.width;
			var ch = context.canvas.height;
			//获取图像对canvas的百分比
			var cwPercent = imageWidth/cw;
			var chPercent = imageHeight/ch;
			if(imageWidth<=cw && imageHeight<=ch){
				drawWidth = imageWidth;
				drawHeight = imageHeight;
				percent = 1;
			}else{
				if(cwPercent>chPercent){
					drawWidth = imageWidth/cwPercent;
					drawHeight = imageHeight/cwPercent;
					percent = cwPercent;
				}
				else{
					drawWidth = imageWidth/chPercent;
					drawHeight = imageHeight/chPercent;
					percent = chPercent;
				}
			}

			return {
				width: drawWidth,
				height: drawHeight,
				percent: percent
			}
		};

				//json格式化函数
				$scope.format = function(txt, compress) {
					var indentChar = '    ';
					if (/^\s*$/.test(txt)) {
						alert('数据为空,无法格式化! ');
						return;
					}
					try {
						var data = eval('(' + txt + ')');
					} catch(e) {
						alert('数据源语法错误,格式化失败! 错误信息: ' + e.description, 'err');
						return;
					};
					var draw = [],
					last = false,
					This = this,
					line = compress ? '': '\n',
					nodeCount = 0,
					maxDepth = 0;
		
					var notify = function(name, value, isLast, indent , formObj) {
						nodeCount++;
						for (var i = 0,
						tab = ''; i < indent; i++) tab += indentChar;
						tab = compress ? '': tab;
						maxDepth = ++indent;
						if (value && value.constructor == Array) {
							draw.push(tab + (formObj ? ('"' + name + '":') : '') + '[' + line);
							for (var i = 0; i < value.length; i++) notify(i, value[i], i == value.length - 1, indent, false);
							draw.push(tab + ']' + (isLast ? line: (',' + line)));
						} else if (value && typeof value == 'object') {
							draw.push(tab + (formObj ? ('"' + name + '":') : '') + '{' + line);
							var len = 0,
							i = 0;
							for (var key in value) len++;
							for (var key in value) notify(key, value[key], ++i == len, indent, true);
							draw.push(tab + '}' + (isLast ? line: (',' + line)));
						} else {
							if (typeof value == 'string') value = '"' + value + '"';
							draw.push(tab + (formObj ? ('"' + name + '":') : '') + value + (isLast ? '': ',') + line);
						};
					};
					var isLast = true,
					indent = 0;
					notify('', data, isLast, indent, false);
					return draw.join('');
				}
	});
