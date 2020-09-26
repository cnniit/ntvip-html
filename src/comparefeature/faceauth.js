   var app = angular.module('myApp', [], angular.noop);
   app.directive('test', function(){
     var link = function($scope, $element, $attrs, $ctrl){
    console.log( $ctrl )
       $ctrl.$formatters.push(function(value){
         return value.join(',');
       });
       $ctrl.$parsers.push(function(value){
         return value.split(',');
       });
     }
     return {compile: function(){return link},
             require: 'ngModel',
             restrict: 'A'}
   });
   app.controller('CityController', function($scope,$http,$timeout){
     var remoteIP = "http://"+sessionStorage.addr+"/comparefeature";
     $scope.a = [];
     $scope.b = [];
     //$scope.a = [1,2,3];
     $scope.authReslut = "";
     $scope.message = "";
     $scope.show = function(){

        $scope.compareFace(); 
    };



      $scope.compareFace = function(){
        //清除文字
        $scope.message = "";
        $scope.authReslut = '';
        document.getElementById('result').innerHTML = '';
        var message = {"feature1":$scope.a,"feature2":$scope.b,"user_id":"gzntdemo"}
        $http({
                    method: 'post',
                    url: remoteIP,
                    data:message,
                    headers: {'Content-Type': "application/json"}
                }).success(function(data,status,headers,config){
                    if(data.result==0)
                    {
                        console.log("receive from service");
              $scope.message = "相似度 " + parseInt(data.score*100) + " %";
              if(data.score > 0.85){
                $scope.authReslut = "是否是同一个人: 可能性很高";
                }
              else if(data.score >0.5){
                $scope.authReslut = "是否是同一个人: 可能性一般";
                }else{
                $scope.authReslut = "是否是同一个人: 可能性很低";
                }
                $scope.timer = $timeout( function(){
                  $("#area1").val('');
                  $("#area2").val('');
                  sessionStorage.removeItem('idstr1');
                  sessionStorage.removeItem('idstr2');
                }, 5000);
                    }
                    else{
                      $scope.message = '';
                      $scope.authReslut = '';
                            var area1 = document.getElementById("area1").value;
                            var area2 = document.getElementById("area2").value;
                                  if(area1!='' && area2!=''){
                                    $.alertable.alert("比对失败: " + data.message);
                            }else if(area1==''){
                              $.alertable.alert('请粘贴第一个特征值')
                              return
                            }else if(area2==''){
                              $.alertable.alert('请粘贴第二个特征值')
                              return
                            }
                        //alert("比对失败: " + data.message);
                        $scope.timer = $timeout( function(){
                          $("#area1").val('');
                          $("#area2").val('');
                          sessionStorage.removeItem('idstr1');
                          sessionStorage.removeItem('idstr2');
                        }, 5000);
                    }

                    document.getElementById('result').innerHTML = $scope.format(angular.toJson(data),'')
                }).error(function(data,status,headers,config){
                    console.log("fail receive from service");

                    $.alertable.alert("网络连接出错！");
              });
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