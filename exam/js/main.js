/**
 * Created by jing on 2016/9/22.
 */
$(function(){
    //左侧导航的动画效果
    $(".baseUI>li>a").off("click");
    $(".baseUI>li>a").on("click",function () {
        $(".baseUI>li>ul").slideUp();
        $(this).next().slideDown(300);
    });
    //所有的收起
    $(".baseUI>li>ul").slideUp();
    //默认收起全部，展示第一个
    $(".baseUI>li>a").first().trigger("click");
    $(".baseUI>li>ul>li").off();
    $(".baseUI>li>ul>li").on("click",function(){
        if(!$(this).hasClass("current")){
            $(".baseUI>li>ul>li").removeClass("current");
            $(this).addClass("current");
        }
    });
    //模拟点击
    $(".baseUI>li>ul>li>a").eq(0).trigger("click");
});
    //创建核心模块
    angular.module("app",["ng","ngRoute","app.subject","app.paper"])
        //核心模块控制器
        .controller("mainCtrl",["$scope",function ($scope) {

        }])
        //路由器的配置
        .config(["$routeProvider",function ($routeProvider) {
            $routeProvider.when("/AllSubject/a/:a/b/:b/c/:c/d/:d",{
                templateUrl:"tpl/subjectList.html",
                controller:"subjectController"
            }).when("/addSubject",{
                templateUrl:"tpl/addSubject.html",
                controller:"subjectController"
            }).when("/delSubject/id/:id",{
                templateUrl:"tpl/SubjectList.html",
                controller:"delSubjectController"
            }).when("/checkSubject/id/:id/checkState/:checkState",{
                templateUrl:"tpl/SubjectList.html",
                controller:"checkSubjectController"
            }).when("/paperList",{
                templateUrl:"tpl/paperManager.html",
                controller:"paperListController"
            }).when("/paperAdd/id/:id/stem/:stem/type/:type/topic/:topic/level/:level",{
                templateUrl:"tpl/paperAdd.html",
                controller:"paperAddController"
            }).when("/paperSubject",{
                templateUrl:"tpl/subject.html",
                controller:"subjectController"
            });
        }]);