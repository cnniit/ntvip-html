angular.module('myApp',[])
	.controller("CityController",function($scope,$http){
		var remoteIP = "http://"+sessionStorage.addr+"/delface";

		$scope.reader = new FileReader();   //创建一个FileReader接口
		$scope.responseJson;
		$scope.imageDataBase64;
		$scope.uid;
		$scope.authReslut = "22";

		// 初始化图片
		$scope.left ={
			img: "",
			temp_img: '',	// 临时储存图片
			faceInfo: '',	// 人脸识别结果
			img_size: {		// 图片的宽,高
				width: '',
				height: ''
			},
			detection: '',	// 人脸识别是否成功
			percent: '',	// 百分比
			hasDrawImage: '', // 是否已经绘图
			imageStartPointX: '', // 是否已经绘图
			imageStartPointY: '' // 是否已经绘图
		};

		// 图片上传
		$scope.img_upload = function(msg,files) {       //单次提交图片的函数
			whichFace = msg;
			$scope.guid = (new Date()).valueOf();   //通过时间戳创建一个随机数，作为键名使用
			$scope.reader.readAsDataURL(files[0]);  //FileReader的方法，把图片转成base64
			$scope.reader.onload = function(ev) {
					var tempImg = {
						imgSrc : ev.target.result,  //接收base64
					}

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
						percent = drawObj.percent;
						//获取图像XY起点坐标
						var imageStartPointX = canvasCenterX - drawObj.width/2;
						var imageStartPointY = canvasCenterY - drawObj.height/2;
						//清除原有图像
						context.clearRect(0,0,context.canvas.width,context.canvas.height);
						//绘图
						context.drawImage(image, imageStartPointX, imageStartPointY, drawObj.width, drawObj.height); //绘制图像，drawImage有多种重载函数，具体参考w3l，至此载入图片完毕
						//context.drawImage(image, 0, 0, context.canvas.width, context.canvas.height);
						console.log("图像X起点: " + imageStartPointX + ", 图像Y起点: " + imageStartPointY + ", 图像width: " + drawObj.width + ", 图像height: " + drawObj.height + ", 图像缩放比例: " + drawObj.percent);
						$scope[whichFace].hasDrawImage = true;
						$scope[whichFace].imageStartPointX = imageStartPointX;
						$scope[whichFace].imageStartPointY = imageStartPointY;
						$scope[whichFace].percent = percent;
					};
					image.src = tempImg.imgSrc;

					$scope.imageDataBase64 = tempImg.imgSrc .substr(tempImg.imgSrc .indexOf('base64,') + 'base64,'.length);

					$scope[whichFace].temp_img = tempImg.imgSrc;


					var message = {"uid":$scope.uid,"user_id":"gzntdemo"};

			        $scope.delface(message);
				};
		};

		$scope.delface = function(message){
			var message = {"uid":$scope.uid,"user_id":"gzntdemo"};
			$http({
	                method: 'post',
	                url: remoteIP,
	                data:message,
	                headers: {'Content-Type': "application/json"}
	            }).success(function(data,status,headers,config){
	                if(data.result==0)
	                {
	                    console.log("receive from service");
	                    var faceid = document.getElementById("faceid");
	                    faceid.value=''
						$.alertable.alert('删除成功!');
	                }
	                else{
						$.alertable.alert("人脸删除失败: " + data.message);
	                }
	            }).error(function(data,status,headers,config){
	                console.log("fail receive from service");
					$.alertable.alert("网络连接出错！");
            });
		}

		// 画框框函数
		$scope.drawFrame = function(faceMsg,whichFace){
			//获取图像XY起点坐标和percent
			var imageStartPointX = $scope[whichFace].imageStartPointX;
			var imageStartPointY = $scope[whichFace].imageStartPointY;
			var percent = $scope[whichFace].percent;
			//console.log("图像X起点: " + imageStartPointX + ", 图像Y起点: " + imageStartPointY + ", 图像缩放比例: " + percent);
			//获取框框坐标及宽高
			var x = imageStartPointX + faceMsg.x/percent;
			var y = imageStartPointY + faceMsg.y/percent;
			var width = faceMsg.width/percent;
			var height = faceMsg.height/percent;
			console.log("方框 x:" + x + ', y:' + y + ', width:' + width + ', height:' + height+ ', whichFace:' + whichFace);

			var canvas = document.getElementById("myCanvas-" + whichFace);
			// 画框框
			var context = canvas.getContext("2d");
			context.lineWidth = 2;
			context.strokeStyle= "rgb(74,171,232)";
			context.strokeRect(x, y, width, height);
			$scope[whichFace].detection = true; // 绘制完成
			// 两张图片都上传了，自动验证
			if($scope.left.detection && $scope.right.detection){
				$scope.authByFeature();
			}
		}

		// 特征1比1比对
		$scope.authByFeature = function(){
			if($scope.left.detection && $scope.right.detection){
				if($scope.left.faceInfo.feature && $scope.right.faceInfo.feature){
					var data = {
						'feature1': $scope.left.faceInfo.feature,
						'feature2': $scope.right.faceInfo.feature
					}
					var url = remoteIP + "/face/featureauth";
					$http({
						url : url,
						data : data,
						method : 'post',
						timeout:4000,
						headers:{
							'contentType' : "application/json;charset=UTF-8",
							'Access-Control-Allow-Origin': '*',
						}
					}).success(function(data,status,headers,config){
						console.log("receive from service");
						console.log(angular.toJson(data));
						if(data.result.retcode == 0){
							$scope.authReslut = "是否是同一个人: 可能性很高";
						}else{
							$scope.authReslut = "是否是同一个人: 可能性很低";
						}
						$scope.responseJson = $scope.format(angular.toJson(data));
						console.log($scope.format(angular.toJson(data)));
					}).error(function(data,status,headers,config){
						console.log("fail receive from service");
						alert("网络连接出错！");
					});
				}else{
					// 右边图片为空
					if($scope.left.faceInfo.feature){
						alert("右边图片feature缺失");
					}else if($scope.right.faceInfo.feature){
						alert("左边图片feature缺失");
					}
				}
			}
			else{
				// 图片未加载
				if($scope.left.detection){
					alert("右边图片未加载");
				}else if($scope.right.detection){
					alert("左边图片未加载");
				}
			}
		}

		/*// 1比1认证
		$scope.authByFace = function(){
			var data = new FormData();      //以下为像后台提交图片数据
			data.append('file1', $scope.temp_left_img);
			data.append('file2', $scope.temp_right_img);
			var url = "http://112.74.169.162:5500/face/onlineauth";
			$http({
				method: 'post',
				url: url,
				data:data,
				headers: {'Content-Type': undefined},
				transformRequest: angular.identity
			}).success(function(data,status,headers,config){
					console.log("receive from service");
					console.log(angular.toJson(data));
			}).error(function(data,status,headers,config){
				console.log("fail receive from service");
			});
		}*/

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
		}

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
