
// Unityと連携するための関数群
let hoge = function () {
    return {
        // Unityからのメッセージを受け取るハンドラ登録
        InitializationEventListener: function () {
            window.addEventListener('message', function (event) {
                hoge.ExecuteJs(event.data);
                hoge.RegisterJS(event.data);
            }, false);
        },
        // 受け取ったメッセージから、evalを使って関数を呼び出す
        ExecuteJs: function (message) {
            if (typeof (message) !== "string" && !(message instanceof String) || message == "null") {
                return;
            }
            var parameterObject = JSON.parse(message);
            var methodName = parameterObject.MethodName;
            var arg = parameterObject.Arg;
            var gameObjectName = parameterObject.GameObject;
            if (!(gameObjectName == undefined || gameObjectName == "")) {
                return;
            }
            if (arg == undefined) {
                arg = "";
            }
            var evalString = methodName + '(' + arg + ')';
            eval(evalString);
        },
        // 受け取ったメッセージから、evalを使って関数を呼び出す
        RegisterJS: function (message) {
            if (typeof (message) !== "string" && !(message instanceof String) || message == "null") {
                return;
            }
            var parameterObject = JSON.parse(message);
            var methodName = parameterObject.MethodName;
            var gameObjectName = parameterObject.GameObject;
            if ((gameObjectName == undefined || gameObjectName == "")) {
                return;
            }
            methodsName.push(methodName);
            gameObjectsName.push(gameObjectName);
        }
    };
}();
hoge.InitializationEventListener();
