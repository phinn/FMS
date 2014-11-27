var versionInfo = {};
versionInfo.jquery = "1.11.1";
versionInfo.datajs = "1.0.3";
versionInfo.angularjs = "1.2.15";

var scripts = [
    //{ url: "Libs/jquery-" + versionInfo.jquery + ".min.js" },
    { url: "Libs/angularjs." + versionInfo.angularjs + ".min.js" }
    //{ url: "Libs/ODataClient/datajs-" + versionInfo.datajs + ".js" },
    //{ url: "Libs/ODataClient/odataclient.js" }
];

var styles = [
];

var path = window.location.pathname;

var isSubPath = false;

path = path.substring(1, path.length);
if (path.indexOf("/") != -1) {
    isSubPath = true;
}
else path = "/";

function loadCss(url, pos, async) {
    if (isSubPath) {
        url = "../../" + url;
    }
    document.write(['<link rel="stylesheet" href="', url, '" type="text/css">', '</link>'].join(""));
}

for (var idx = 0; styles[idx]; idx++) {
    styles[idx].url && loadCss(styles[idx].url, "head", false);
}



function loadJs(url, pos, async) {
    if (isSubPath) {
        url = "../../" + url;
    }

    document.write(['<script src="', url, '" type="text/javascript">', '</script>'].join(""));
}

for (var idx = 0; scripts[idx]; idx++) {
    scripts[idx].url && loadJs(scripts[idx].url, "head", false);
}