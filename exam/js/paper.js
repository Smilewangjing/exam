/**
 * Created by jing on 2016/9/28.
 *试卷模块
 */
angular.module("app.paper",["ng","app.subject"])
    //试卷查询控制器
    .controller("paperListController",["$scope",function($scope){

    }])
    //试卷添加控制器
    .controller("paperAddController",["$scope","commonService","paperModel","$routeParams","paperService",function($scope,commonService,paperModel,$routeParams,paperService){
        commonService.getAllDepartment(function(data){
            //将全部方向绑定到添加作用域中
            $scope.dps=data;
        });
        //双向绑定的模板
        $scope.model=paperModel.model;
        var subjectId=$routeParams.id;
        if(subjectId!=0){
            paperModel.subjectId(subjectId);
            paperModel.subject(angular.copy($routeParams));
        }
        $scope.submit1=function(){
            paperService.savePaper($scope.model,function(data){
                alert(data);
            })
        }
    }])
    //试卷删除控制器
    .controller("paperDelController",["$scope",function($scope){

    }])
    .factory("paperService",function($httpParamSerializer,$http){
        return {
            savePaper:function(params,handler){
                var obj={};
                for(var key in params){
                    var val =params[key];
                    switch (key){
                        case "title":
                            obj['paper.title']=val;
                            break;
                        case "departmentId":
                            obj['paper.department.id']=val;
                            break;
                        case "desc":
                            obj['paper.description']=val;
                            break;
                        case "answerTime":
                            obj['paper.answerQuestionTime']=val;
                            break;
                        case "total":
                            obj['paper.totalPoints']=val;
                            break;
                        case "scores":
                            obj['scores']=val;
                            break;
                        case "subjectIds":
                            obj['subjectIds']=val;
                            break;
                    }
                }
                //对obj对象进行表单格式的序列化操作（默认使用json格式）
                $http.post("http://172.16.0.5:7777/test/exam/manager/saveExamPaper.action",$httpParamSerializer(obj),{
                    headers:{
                        "Content-type":"application/x-www-form-urlencoded"
                    }
                }).success(function(data){
                    handler(data);
                })
            }
        }
})
    .factory("paperModel",function(){
        return {
            //模板单例
            model:{
                title:"",     //试卷标题
                departmentId:1, //方向id
                desc:"",   //试卷描述
                answerTime:0,  //考试时间
                total:0,  //考试总分
                scores:[],  //每个题目的分数
                subjectIds:[], //每个题目的id
                subjects:[]
            },
            subjectId:function(id){
                this.model.subjectIds.push(id);
            },
            subject:function(params){
                this.model.subjects.push(params);
            }
        }
})