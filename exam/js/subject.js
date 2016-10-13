/**
 * Created by jing on 2016/9/22.
 * 题目管理的模块
 */

angular.module("app.subject",["ng"])
    .controller("delSubjectController",["$routeParams","subjectsService","$location",function($routeParams,subjectsService,$location){
        var flag = confirm("确认删除吗？");
        if(flag){
            var id=$routeParams.id;
            subjectsService.delSubject(id,function(data){
                alert(data);
                $location.path("/AllSubject/a/0/b/0/c/0/d/0");
            })
        }else{
            $location.path("/AllSubject/a/0/b/0/c/0/d/0");
        }


    }])
    .controller("checkSubjectController",["$routeParams","subjectsService","$location",function($routeParams,subjectsService,$location){
        var id=$routeParams.id;
        var checkState=$routeParams.checkState;
        subjectsService.checkSubject(id,checkState,function(data){
            alert(data);
            $location.path("/AllSubject/a/0/b/0/c/0/d/0");
        })

    }])
    .controller("subjectController",["$scope","$location","commonService","subjectsService","$routeParams","$location",function ($scope,$location,commonService,subjectsService,$routeParams,$location) {
       //将路由参数绑定到作用域中
        $scope.params=$routeParams;
        console.log($routeParams);
        $scope.subject={
            typeId:1,
            levelId:1,
            departmentId:1,
            topicsId:1,
            stem:"",
            analysis:"",
            answer:"",
            choiceContent:[],
            choiceCorrect:[false,false,false,false]
        };
        $scope.submit=function(){
            subjectsService.saveSubject($scope.subject,function(data){
                alert(data);
            })
            //重置作用域中绑定的表单默认值
            var subject={
                typeId:1,
                levelId:1,
                departmentId:1,
                topicsId:1,
                stem:"",
                analysis:"",
                answer:"",
                choiceContent:[],
                choiceCorrect:[false,false,false,false]
            }
            angular.copy(subject,$scope.subject);
        };
        $scope.submitAndClose=function() {
            subjectsService.saveSubject($scope.subject, function (data) {
                alert(data);
            });
            $location.path("/AllSubject/a/0/b/0/c/0/d/0");
        }
        //获取所有题目类型,题目方向，题目知识点，题目级别，题目方向
        commonService.getAllSubjectType(function(data){
         $scope.data=data;
        });
        commonService.getAllDepartment(function(data){
            $scope.data1=data;
        });
        commonService.getAllTopics(function(data){
            $scope.data2=data;
        });
        commonService.getAllLevel(function(data){
            $scope.data3=data;
        });
        //获取所有题目信息
        subjectsService.getAllSubjects($routeParams,function(data){
                data.forEach(function(item){
                    //console.log(item.subjectType.id);
                    if(item.subjectType!=null){
                        if(item.subjectType.id!==3) {
                            var answer=[];
                            //为每个题目添加A B C D
                            item.choices.forEach(function(choice,index){
                                choice.no=commonService.convertIndexToNo(index);
                            });
                            //当前题目类型为单选或者多选是改变当前题目的answer
                            if(item.subjectType.id!==3){
                                item.choices.forEach(function(choice){
                                    if(choice.correct){
                                        answer.push(choice.no);
                                    }
                                });
                                item.answer = answer.toString();
                            }
                        }
                    }

                });
                $scope.data4 = data;
        });
    $scope.add=function(){
        $location.path("/addSubject");
    };
}])
    .service("subjectsService",function($http,$httpParamSerializer){
        this.checkSubject=function(id,checkState,handler){
            $http.get("http://172.16.0.5:7777/test/exam/manager/checkSubject.action",{
                params:{
                    "subject.id":id,
                    "subject.checkState":checkState
                }
            }).success(function(data){
                handler(data);
            })
        };
        this.delSubject=function(id,handler){
            $http.get("http://172.16.0.5:7777/test/exam/manager/delSubject.action",{
                params:{
                    "subject.id":id
                }
            }).success(function(data){
                handler(data);
            })
        };
        this.saveSubject=function(params,handler){
            var obj={};
            for(var key in params){
                var val =params[key];
                switch (key){
                    case "typeId":
                        obj['subject.subjectType.id'] = val;
                        break;
                    case "levelId":
                        obj['subject.subjectLevel.id'] = val;
                        break;
                    case "departmentId":
                        obj['subject.department.id'] = val;
                        break;
                    case "topicsId":
                        obj['subject.topic.id'] = val;
                        break;
                    case "stem":
                        obj['subject.stem'] = val;
                        break;
                    case "analysis":
                        obj['subject.analysis'] = val;
                        break;
                    case "answer":
                        obj['subject.answer'] = val;
                        break;
                    case "choiceContent":
                        obj["choiceContent"]=val;
                        break;
                    case "choiceCorrect":
                        obj["choiceCorrect"]=val;
                        break;
                }
            }
            //对obj对象进行表单格式的序列化操作（默认使用json格式）
            $http.post("http://172.16.0.5:7777/test/exam/manager/saveSubject.action",$httpParamSerializer(obj),{
                headers:{
                    "Content-type":"application/x-www-form-urlencoded"
                }
            }).success(function(data){
                handler(data);
            })
        }
        this.getAllSubjects=function(params,handler){
            var data={};
            for(var key in params){
                var val =params[key];
                if(val!=0){
                    switch(key){
                        case "a":
                            data['subject.subjectType.id']=val;
                            break;
                        case "b":
                            data['subject.subjectLevel.id']=val;
                            break;
                        case "c":
                            data['subject.department.id']=val;
                            break;
                        case "d":
                            data['subject.topic.id']=val;
                            break;
                    }
                }

            }
            // $http.get("data/question.json").success(function (data) {
            $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action",{
                params:data
            }).success(function(data) {
                handler(data);
            });
        };
})
    .factory("commonService",function ($http) {
        return {
            convertIndexToNo:function(index){
                return index==0?"A":(index==1?"B":(index==2?"C":(index==3?"D":"E")))
            },
            getAllSubjectType: function (handler) {
                // $http.get("data/type.json").success(function (data) {
                $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action").success(function (data) {
                    handler(data);
                });
            },
            getAllDepartment:function(handler){
                // $http.get("data/department.json").success(function(data1){
                $http.get("http://172.16.0.5:7777/test/exam/manager/getAllDepartmentes.action").success(function(data1){
                    handler(data1);
                })
            },
            getAllTopics:function(handler){
                //$http.get("data/topics.json").success(function(data2){
                $http.get("http://172.16.0.5:7777/test/exam/manager/getAllTopics.action").success(function(data2){
                    handler(data2);
                })
            },
            getAllLevel:function(handler){
                //$http.get("data/level.json").success(function(data3){
                $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectLevel.action").success(function(data3){
                    handler(data3);
                })
            }
        }
    })
    .directive("subtabs",function(){
        return {
            restrict:"AE",
            compile:function compile(){
                return {
                    post:function postLink(scope,element){
                        element.find("div").on("click",function(event){
                            if(event.target.nodeName=="A"){
                               if(!angular.element(event.target).hasClass("active3")){
                                    angular.element(event.target).addClass("active3").siblings().removeClass("active3");
                               }
                            }
                        })
                    }
                }
            }
        }
    }).filter("selectTopics",function(){
        //input要过滤的内容，方向id
        return function(input,id){
            if(input){
                //Array.prototype.filter进行过滤
                var result=input.filter(function(item){
                    return item.department.id==id;
                });
            }
            //将过滤后的内容返回
            return result;
        }
}).directive("selectOption",function(){
    return {
        restrict:"A",
        link:function(scope,element){
           element.on("change",function(){
               var type=$(this).attr("type");
               var val=$(this).val();
               alert(val);
               var input=$(this).prop("checked");
               console.log(input);
               //alert(val);
               //alert(type);
               if(type=="radio"){
                   scope.subject.choiceCorrect=[false,false,false,false];
                   for(var i=0;i<4;i++){
                       //console.log(i);
                       if(i==val){
                           scope.subject.choiceCorrect[i]=true;
                       }
                   }
               }else if(type="checkbox"){
                   for(var i=0;i<4;i++){
                       //console.log(i);
                       if(input){
                           if(i==val){
                               scope.subject.choiceCorrect[i]=true;
                           }
                       }else{
                           if(i==val){
                               scope.subject.choiceCorrect[i]=false;
                           }
                       }

                   }
               }

               //强制消化:
               scope.$digest();
           })


        }
    }
})
    // .provider("subjectService",function(){
    //     this.url="";
    //     this.setUrl=function(url){
    //         this.url=url;
    //     };
    //     this.$get=function($http){
    //         var self=this;
    //         return {
    //             getAllSubjectType:function(handler){
    //                 $http.get(self.url).success(function(data){
    //                     handler(data);
    //                 })
    //             },
    //             getAllDepartment:function(handler){
    //                 $http.get(self.url).success(function(data){
    //                     handler(data);
    //                 })
    //             },
    //             getAllTopics:function(handler){
    //                 $http.get(self.url).success(function(data){
    //                     handler(data);
    //                 })
    //             },
    //             getAllLevel:function(handler){
    //                 $http.get(self.url).success(function(data){
    //                     handler(data);
    //                 })
    //             }
    //         }
    //     }
    // })

