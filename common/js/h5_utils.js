define(function(require, exports, module) {

    //#var $ = require('./jquery-2.1.4.min.js');

    var self = exports;
    /*
     测试
     内网
     * */
//      var apiBaseUrl = "https://api.yuanyuedu.com/";
//      var apiBaseUrl = "http://106.14.241.115:8000/";
    /*
     测试
     外网
     * */
    var apiBaseUrl = "https://139.196.3.125:8443/";

    //生产内网
    //  var apiBaseUrl = "https://bjhzxapi.yuanyuedu.com/";
    //生产外网
    //  var apiBaseUrl = "https://mcpapi.iyuyun.net:18443/";
    self.getBaseUrl = function() {
        return apiBaseUrl;
    };

    self.ajaxGet = function(url, data, success, error) {
        self.ajax(url, "GET", data, success, error);
    };

    self.ajaxPost = function(url, data, success, error) {
        self.ajax(url, "POST", data, success, error);
    };

    self.ajaxDelete = function(url, data, success, error) {
        self.ajax(url, "DELETE", data, success, error);
    };

    self.ajaxPut = function(url, data, success, error) {
        self.ajax(url, "PUT", data, success, error);
    };

    self.ajax = function(url, method, data, success, error) {
        /*
         if("undefined" == typeof headers) {
         headers = {
         "Content-Type": "application/json"
         }
         } else {
         //headers.Content-Type = "application/json";
         }
         */

        var requestUrl;
        var index1 = url.indexOf('http://');
        var index2 = url.indexOf('https://');
        if(index1 == 0 || index2 == 0) {
            requestUrl = url;
        } else {
            requestUrl = apiBaseUrl + url;
        }

        var headers = self.buildAjaxHeaders();
        var funName;
        var processData = false;
        var sendData = data;
        if(method == "GET") {
            funName = "ajaxGet";
            processData = true;
        } else if(method == "POST") {
            funName = "ajaxPost";
            sendData = JSON.stringify(data);
        } else if(method == "PUT") {
            funName = "ajaxPut";
            sendData = JSON.stringify(data);
        } else if(method == "DELETE") {
            funName = "ajaxDelete";
            sendData = JSON.stringify(data);
        } else {
            console.log("ajax unknow method");
            return;
        }

        console.log(funName + " url=" + requestUrl);
        console.log(funName + " header=" + JSON.stringify(headers));
        console.log(funName + " data=" + JSON.stringify(data));

        function onSuccess(data, textStatus, xhr) {
            console.log(funName + " success:" + JSON.stringify(data));
            if(!success) {
                return;
            }
            success(data, textStatus, xhr);
        };

        function onError(xhr, errorMsg, errorThrown) {
            console.log(funName + " errorMsg:" + errorMsg);
            console.log(funName + " errorThrown:" + errorThrown);
            if(!error) {
                return;
            }
            error(xhr, errorMsg, errorThrown);
        };

        $.ajax({
            type: method,
            url: requestUrl,
            contentType: "application/json",
            headers: headers,
            processData: processData,
            data: sendData,
            dataType: "json",
            timeout: 10000,
            error: onError,
            success: onSuccess
        });
    };

    /**
     * 获取App的基本信息
     * @param {String} appId
     * @param {Function} success
     * @param {Function} error
     */
    self.getAppBasicInfo = function(appId, success, error) {
        var url = "home/app/" + appId + "/extra";
        self.ajaxGet(url, {}, success, error);
    };

    /**
     * 发送获取app设置的请求
     * @param {String} appId
     * @param {Function} success
     * @param {Function} error
     */
    self.getAppSettings = function(appId, success, error) {
        var url = "home/app/" + appId + "/settings";
        self.ajaxGet(url, null, success, error);
    };

    /**
     * 发送保存app设置的请求
     */
    self.saveAppSettings = function(appId, data, success, error) {
        var url = "home/app/" + appId + "/settings";
        self.ajaxPut(url, data, success, error);
    };

    /**
     * 构建http请求的header信息，目前发送的都是从native获取的用户信息
     */
    self.buildAjaxHeaders = function() {
        var userInfo = self.getSessionItem("user_info", true);
        if(!userInfo) {
            return {};
        }
        var headers = {
            "token": userInfo.token,
            "account_id": userInfo.account_id,
            "master_key": userInfo.master_key,
            "school_id": userInfo.school_id,
            "union_id": userInfo.union_id
        };
        return headers;
    }

    self.isToday = function(aDate) {
        var today = new Date();
        return self.isSameDay(aDate, today);
    };

    self.isYestoday = function(aDate) {
        var yestoday = new Date();
        yestoday.setTime(yestoday.getTime() - 24 * 60 * 60 * 1000);
        return self.isSameDay(aDate, yestoday);
    };

    self.isSameDay = function(date1, date2) {
        if(date1.getYear() == date2.getYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate()) {
            return true;
        } else {
            return false;
        }
    }

    bridgeInit = false;

    self.setupWebViewJavascriptBridge = function(callback) {
        if(window.WebViewJavascriptBridge) {
            if(!bridgeInit) {
                if(WebViewJavascriptBridge.init) {
                    WebViewJavascriptBridge.init();
                }
                bridgeInit = true;
            }

            return callback(WebViewJavascriptBridge);
        } else {
            document.addEventListener(
                'WebViewJavascriptBridgeReady',
                function() {
                    console.log("bridge is ready");
                    if(!bridgeInit) {
                        if(WebViewJavascriptBridge.init) {
                            WebViewJavascriptBridge.init();
                        }
                        bridgeInit = true;
                    }
                    callback(WebViewJavascriptBridge)
                },
                false
            );
        }

        if(window.WVJBCallbacks) {
            return window.WVJBCallbacks.push(callback);
        }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() {
            document.documentElement.removeChild(WVJBIframe)
        }, 0)
    };

    self.callNative = function(funcName, data, callback) {
        console.log("call native:" + funcName);
        console.log("call native:" + JSON.stringify(data));

        self.setupWebViewJavascriptBridge(function(bridge) {
            bridge.callHandler(funcName, data, function(rsp) {
                console.log("call " + funcName + " returned");
                console.log("bridge rsp type:" + typeof rsp);
                if(typeof rsp == "object") {
                    console.log("value :" + JSON.stringify(rsp));
                } else {
                    console.log("value :" + rsp);
                }
                try {
                    if(typeof rsp == "string") {
                        rsp = JSON.parse(rsp);
                    }
                } catch(e) {
                    console.log(e.message);
                }
                callback(rsp);
            });
        });
    };

    self.setupNativeMenu = function(menu, selectedCallback) {
        self.setupWebViewJavascriptBridge(function(bridge) {
            console.log("set native menu: " + JSON.stringify(menu));
            bridge.callHandler('AppSetMenu', menu, function(response) {});
            bridge.registerHandler('JSMenuSelected', function(data, responseCallback) {
                console.log("native menu selected: " + data);
                selectedCallback(data);
            })
        });
    };

    /**
     *清除标题栏的菜单，很多app，进入二级页面后，是不需要菜单的
     */
    self.clearNativeMenu = function() {
        self.setupNativeMenu([], null);
    };

    /**
     * 调用native方法获取用户登录信息
     *
     * @param {Object} forceLogin  是否必须登录  1--是  0--否
     * @param {Object} callback  回调方法，从native收到回应后通过此方法来通知调用者
     */
    self.getUserInfo = function(forceLogin, callback) {
        console.log("getUserInfo");

        var param = {
            "force_login": forceLogin
        };

        self.callNative('AppGetLoginInfo', param, function(info) {
            var userInfo = info;
            self.putSessionItem("user_info", userInfo);
            callback(info);
        });

        var userInfo = {
            "token": "add218b6275d8b3c59fa13a4f8c1c79c",
            "account_id": "7158963567335573488",
            "master_key": "abcdefghijkopqrstuvwxyz123456",
            "X-Api-Version": "1.0.0",
            "school_id": "1003",
            "name": "陈冬平",
            "union_id": "13729"
        };
        self.putSessionItem("user_info", userInfo);
        callback(userInfo);
    };

    /**
     * 从session中获取一个项目
     * @param {String} key  主键
     * @param {Object} asObject true--把value转为Object，否则直接返回String
     */
    self.getSessionItem = function(key, asObject) {
        var value = sessionStorage.getItem(key);
        if(!asObject) {
            return value;
        }

        try {
            return JSON.parse(value);
        } catch(e) {
            console.error("getSessionItemObject exception:" + e.message);
        }
        return null;
    };

    /**
     * 在session中添加一个键值对，js的session只能存string，所以如果item是一个对象，
     * 会转成json来存储。
     * @param {String} key
     * @param {Object} item
     */
    self.putSessionItem = function(key, item) {
        sessionStorage.removeItem(key);
        try {
            if(typeof item == "string") {
                sessionStorage.setItem(key, item);
            } else {
                sessionStorage.setItem(key, JSON.stringify(item));
            }
        } catch(e) {
            console.error("setSessionItemObject exception: " + e.message);
        }
    };

    /**
     * 显示原生的加载中界面
     * @param {boolean} isShow
     * @param {string} text
     */
    self.showNativeLoading = function(isShow, text) {
        (isShow == true) ? action = "show": action = "hide";
        var param = {
            action: action,
            delay_hide: 0,
            mode: "loading",
            text: text
        };
        self.callNative("AppProcessHud", param, null);
    };

    /**
     * 调用原生的Toast界面
     * @param {string} mode text：文字；success：成功图片；failed：失败图片
     * @param {string} text
     * @param {boolean} update 如果前面先展示了加载中界面，设为true，否则就是false
     */
    self.showNativeToast = function(mode, text, update) {
        (update) ? action = "change": action = "show";
        var param = {
            action: action,
            delay_hide: 1,
            mode: mode,
            text: text
        };
        self.callNative("AppProcessHud", param, null);
    }

    /**
     * 通知原生，关闭浏览器窗口
     */
    self.exitApp = function() {
        self.callNative("AppExit", {}, null);
    }

    /**
     * 通知原生在新窗口中显示url对应的页面
     * @param {String} url 可以是绝对url，也可以相对于当前网页的url
     */
    self.openNewWindow = function(url, params) {
        var index1 = url.indexOf('http://');
        var index2 = url.indexOf('https://');
        if(index1 == 0 || index2 == 0) {
            requestUrl = url;
        } else {
            requestUrl = self.getAbsoluteUrl(url);
        }

        if(!params) {
            params = {};
        }
        params.new_window = true

        for(var key in params) {
            requestUrl = urlUpdateParams(requestUrl, key, params[key]);
        }

        var param = {
            'url': requestUrl
        };

        self.callNative("AppOpenWindow", param, null);
    };

    /**
     * 返回一个相对url的绝对地址，这个url是相对于调用者当前网页来说的
     * @param {string} targetUrl  相对地址，比如"abc.html"
     */
    self.getAbsoluteUrl = function(targetUrl) {
        var url = window.location.href;
        var index = url.lastIndexOf("/");
        url = url.substring(0, index);
        url = url + "/" + targetUrl;
        return url;
    }

    /**
     * 获取url里面的查询参数
     * @param {String} paramName
     */
    self.getQueryParam = function(paramName) {
        var reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if(r != null) {
            return decodeURI(r[2]);
        }
        return null;
    }

    var urlUpdateParams = function(url, name, value) {
        var r = url;
        if(r != null && r != 'undefined' && r != "") {
            value = encodeURIComponent(value);
            var reg = new RegExp("(^|)" + name + "=([^&]*)(|$)");
            var tmp = name + "=" + value;
            if(url.match(reg) != null) {
                r = url.replace(eval(reg), tmp);
            } else {
                if(url.match("[\?]")) {
                    r = url + "&" + tmp;
                } else {
                    r = url + "?" + tmp;
                }
            }
        }
        return r;
    };

    /**
     * 根据不同的加载状态显示不同的提示
     */
    /**
     * 根据不同的加载状态显示不同的提示
     * @param {string} parent  refresh组件的父节点，如果一个页面有多个刷新组件，就需要通过父节点来区分
     * @param {string} state  loading--加载中  error--加载出错  nodata--无数据  data--数据
     */
    self.showLoadState = function(parent, state) {
        $(parent + ".loading").hide();
        $(parent + ".load_failed").hide();
        $(parent + ".no_data").hide();
        $(parent + ".content").hide();

        switch(state) {
            case "loading":
                $(parent + ".loading").show();
                break;
            case "error":
                $(parent + ".load_failed").show();
                break;
            case "nodata":
                $(parent + ".no_data").show();
                break;
            default:
                $(parent + ".content").show();
                break;
        }
    };

    /**
     * 给String对象增加format方法
     * var str = "arg0={0} arg1={1}"
     * str.format("a","b")
     */
    String.prototype.format = function(args) {
        if(arguments.length > 0) {
            var result = this;
            if(arguments.length == 1 && typeof(args) == "object") {
                for(var key in args) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            } else {
                for(var i = 0; i < arguments.length; i++) {
                    if(arguments[i] == undefined) {
                        result = result.replace(reg, "undefined");
                    } else {
                        var reg = new RegExp("({[" + i + "]})", "g");
                        result = result.replace(reg, arguments[i]);
                    }
                }
            }
            return result;
        } else {
            return this;
        }
    };

    /**
     * 在页面中载入支持显示数据加载状态的页面组件, 可以显示加载中,加载失败,无数据的提示
     * @param {string} container 主页面中用来包含主键的节点, 如"#container", ".container"
     * @param {Object} reloadFunc 加载失败后的刷新按钮处理方法,可以为空
     * @param {Object} pulluprefresh 上拉加载的处理方法
     * @param {Object} callback 组件加载完成后的回调,可以继续做初始化等动作,最后开始加载数据
     */
    self.loadRefreshContainer = function(container, reloadFunc, pulluprefresh, callback) {
        $(container).load("../../common/html/load_more_container.html", function() {
            if(reloadFunc != undefined) {
                $(container).on("click", "#reload_btn", function() {
                    reloadFunc();
                });
            }

            mui(container + ' #pullrefresh').pullRefresh({
                container: container + ' #pullrefresh',
                up: {
                    contentrefresh: '正在加载...',
                    contentnomore: '没有更多数据了',
                    callback: pulluprefresh
                }
            });
            //加载完成,执行回调
            callback();
        });
    };

    /**
     * 从Date原型链上拓展format方法
     * .fmt("yyyy-MM-dd hh:mm:ss")
     */
    Date.prototype.fmt = function(fmt) { //
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if(/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for(var k in o) {
            if(new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }
});