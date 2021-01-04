window.addEventListener('unload', () => {
    console.log('xuanmiao unload')
})


/**
 * Created by xuanmiao on 2017/9/22.
 */
window.onload = function () {
    /*获取元素*/
    /*顶栏*/
    var topBar = document.body.getElementsByTagName('header')[0];
    /*顶栏正常面板*/
    var mainNormal = document.querySelector('#mainNormal');
    /*顶栏操作面板*/
    var mainSelect = document.querySelector('#mainSelect');
    /*取消选择按钮*/
    var selectBtn = mainSelect.querySelector('.select-btn');

    /*左侧导航栏*/
    var layoutAside = document.body.querySelector('.layout-aside');
    /*用户头像*/
    var user = document.querySelector('.user');

    /*左侧导航菜单栏*/
    var modMenu = document.querySelector('.mod-menu');
    /*主内容区域*/
    var layoutMain = document.querySelector('.layout-main');
    /*主内容头部区域*/
    var layoutMainHd = document.querySelector('.layout-main-hd');
    /*主内容列表区域*/
    var layoutMainBd = document.querySelector('.layout-main-bd');
    /*面包屑导航*/
    var modBreadcrumb = document.querySelector('.layout-main .breadcrumb');
    /*面包屑导航-微云*/
    var modBreadcrumbWeiYun = modBreadcrumb.querySelector('li:first-of-type');

    /*主内容区域*/
    var layoutBody = document.querySelector('.layout-body');
    /*获取文件列表*/
    var layoutMainBody = layoutBody.querySelector('.layout-main-bd');
    /*切换视图按钮*/
    var viewSwitch = document.querySelector(".view-switch");
    /*视图和排序按钮盒子*/
    var viewSortBox = document.querySelector('.view-sort-box');
    /*文件列表视图按钮*/
    var listView = viewSwitch.querySelector('.list-view');
    /*缩略图列表视图按钮*/
    var thumbView = viewSwitch.querySelector('.thumb-view');
    /*文件列表*/
    var listGroup = layoutMainBody.querySelector('.list-group');
    /*缩略图列表*/
    var thumbGroup = layoutBody.querySelector('.mod-thumb-group');
    /*获取缩略图视图文件夹列表*/
    var thumbFolderList = thumbGroup.querySelector('.thumb-folder-list');
    /*获取缩略图视图文件列表*/
    var figureList = thumbGroup.querySelector('.figure-list');

    /*全选框*/
    var allCheck = layoutMainHd.querySelector('.icon-check-s');
    /*顶栏的文件操作栏*/
    var modEditBar = mainSelect.querySelector('.mod-edit-bar');

    /*更多按钮*/
    var hasMoreBtn = modEditBar.querySelector('.has-more');

    /*移动到按钮*/
    var moveToBtn = hasMoreBtn.querySelector('.move-to').parentNode;

    /*选择的文件数*/
    var checkedNumber = document.querySelector(".j-edit-count-text");

    /*空目录提示*/
    var emptyFolderPrompt = document.getElementById('_disk_files_empty');

    /*选择的文件*/
    var checkedFiles = {
        listFile: [],
        thumbFile: []
    };

    /*当前列表数据*/
    var curListData = fileListData("1_0");

    /*初始化*/
    createNavMenu();
    layoutAsideAutoHeight();
    window.onresize = layoutAsideAutoHeight;
    pageRefresh();
    thumbFolderListItemClick();

    /*文件选择数*/
    mainSelect.selectedNumber = 0;

    /*获取元素*/
    /*列表视图选择框*/
    var iconCheckS = layoutMainBd.querySelectorAll('.icon-check-s');
    /*缩略图视图选择*/
    var iconCheckM = layoutMainBd.querySelectorAll('.icon-check-m');


    /*高度自动变化函数*/
    function layoutAsideAutoHeight() {
        /*左侧导航栏高度自动变化*/
        layoutAside.style.height = document.body.clientHeight - topBar.offsetHeight + "px";
        /*左侧导航栏菜单高度自动变化*/
        modMenu.style.height = layoutAside.clientHeight - user.offsetHeight + "px";
        /*文件列表高度自动变化*/
        layoutMainBd.style.height = layoutAside.clientHeight - layoutMainHd.offsetHeight + "px";
    }

    /*生成导航栏*/
    function createNavMenu() {
        modMenu.innerHTML = "";
        modMenu.innerHTML += '            <div class="vip-box">            <a href="javascript: void(0);" class="vip-btn"><span class="j-vip-txt">开通</span>会员</a>            </div>';
        for (var i = 0; i < fileStructureData.length; i++) {
            var menuItem = document.createElement('div');
            menuItem.className = "menu-item";
            /*是否有标题*/
            if (fileStructureData[i].title !== "null") {
                var div = document.createElement('div');
                div.className = "menu-item-hd";
                var h3 = document.createElement('h3');
                h3.className = "tit";
                h3.innerHTML = fileStructureData[i].title;
                div.appendChild(h3);
                menuItem.appendChild(div);
            }
            /*是否有子菜单*/
            if (fileStructureData[i].child.length !== 0) {
                var ul = document.createElement('ul');
                ul.className = "menu-list";
            }
            /*生成子菜单*/
            for (var j = 0; j < fileStructureData[i].child.length; j++) {
                var li = document.createElement('li');

                li.index = fileStructureData[i].child[j].id;
                li.parentIndex = fileStructureData[i].id;
                /*默认选中全部*/
                if (fileStructureData[i].child[j].type === "all")
                    li.className = "cur";
                li.cur = false;
                li.setAttribute("date-file-id", fileStructureData[i].child[j].route);
                li.onclick = modMenuItemClick;

                var a = document.createElement('a');
                a.href = "javascript: void(0);";
                /*生成图标*/
                var elementi = document.createElement('i');
                elementi.className = "icon icon-" + fileStructureData[i].child[j].type;
                a.appendChild(elementi);

                /*生成菜单标题*/
                var span = document.createElement('span');
                span.className = "menu-tit";
                span.innerHTML = fileStructureData[i].child[j].title;
                a.appendChild(span);

                li.appendChild(a);
                ul.appendChild(li);
                menuItem.appendChild(ul);
            }
            modMenu.appendChild(menuItem);
        }
    }

    /*列表视图使用生成元素时添加事件的思路*/
    function modMenuItemClick() {
        /*导航菜单切换图标*/
        var menuListItem = modMenu.querySelectorAll('li');
        for (var i = 0; i < menuListItem.length; i++) {
            menuListItem[i].className = "";
        }

        this.className = "cur";

        /*点击导航栏生成文件列表内容*/
        window.location.hash = "m=" + fileStructureData[this.parentIndex].child[this.index].type;

        /*只有点击全部显示面包屑导航*/
        if (this.querySelector('.menu-tit').innerHTML !== "全部") {
            layoutMainHd.style.display = "none";

            /*当点击不是全部菜单按钮时切换回列表视图*/
            listGroup.style.display = "block";
            thumbGroup.style.display = "none";
            viewSortBox.style.display = "none";
        } else {
            layoutMainHd.style.display = "block";
            viewSortBox.style.display = "inline-block";
        }

        createFileList(fileStructureData[this.parentIndex].child[this.index].child, this.parentIndex + "_" + this.index);
    }

    /*生成文件列表*/
    function createFileList(currentLevel, parent_route) {
        /*清空*/
        listGroup.innerHTML = "";

        /*判断目录是否为空*/
        if(currentLevel.length === 0){
            emptyFolderPrompt.style.display = "";
        }else{
            emptyFolderPrompt.style.display = "none";
        }
        /*生成文件列表*/
        for (var i = 0; i < currentLevel.length; i++) {
            var li = document.createElement('li');
            li.className = "list-group-item ui-draggable ui-droppable";
            li.index = i;
            // li.setAttribute("data-file-id",parent_route + "_" + i);
            li.setAttribute("data-file-id", currentLevel[i].route);
            if (currentLevel[i].type === "folder") {
                li.onclick = function () {
                    currentLevel = currentLevel[this.index].child;
                    createFileList(currentLevel, this.getAttribute("data-file-id"));
                    /*创建面包屑*/
                    createBreadCrumb(this.getAttribute("data-file-id"));

                    /*切换数据到当前文件夹位置*/
                    curListData = fileListData(this.getAttribute("data-file-id"));
                };
            }

            var div = document.createElement('div');
            div.className = "item-tit";

            /*不同文件不同图标*/
            var thumbIcon = typeToClassName(currentLevel[i].type);

            /*添加文件列表左侧*/
            div.innerHTML = '<div class="label"><i class="icon icon-check-s"></i></div><div class="thumb"><i class="icon icon-m ' + thumbIcon + '"></i></div><div class="info"><span class="tit" data-name="file_name" title="' + currentLevel[i].title + '">' + currentLevel[i].title + '</span></div>';
            li.appendChild(div);

            /*添加文件列表中间控制图标*/

            listGroup.appendChild(li);

        }

        /*选择框点击事件*/
        listFileSelect();

        /*清空全选*/
        clearAllChecked();

        /*选择框添加事件*/
        listFileSelect()
    }

    /*面包屑微云点击事件*/

    modBreadcrumbWeiYun.onmousedown = function (ev) {
        ev.cancelBubble = true;
        ev.stopPropagation();
        curListData = fileListData(this.getAttribute("data-file-id"));
    };

    modBreadcrumbWeiYun.onclick = modBreadcrumbWeiYunClick;
    modBreadcrumbWeiYun.addEventListener("click", thumBreadcrumbClick, true);
    /*?顺序*/
    /*如何保存数据*/

    function modBreadcrumbWeiYunClick() {
        while (this.nextElementSibling) {
            var nextEle = this.nextElementSibling;
            modBreadcrumb.removeChild(nextEle);
        }
        this.className += " cur";
        window.location.hash = "m=all";

        /*根据面包屑生成当前列表*/
        var breadCrumbItem = modBreadcrumb.getElementsByTagName('li');
        var fileData = breadCrumbItem[breadCrumbItem.length - 1].getAttribute("data-file-id");
        var obj = fileListData(fileData);
        createFileList(obj.content.child, fileData);

    }

    /*页面刷新*/
    function pageRefresh() {
        for (var i = 0; i < fileStructureData.length; i++) {
            for (var j = 0; j < fileStructureData[i].child.length; j++) {
                if (fileStructureData[i].child[j].type === window.location.hash.slice(1).split("=")[1]) {
                    createFileList(fileStructureData[i].child[j].child, i + "_" + j);
                    createThumbFileList(fileStructureData[i].child[j].child);

                } else {
                    createFileList(fileStructureData[1].child[0].child, 1 + "_" + 0);
                    createThumbFileList(fileStructureData[1].child[0].child);

                }
            }
        }
    }

    /*创建面包屑*/
    function createBreadCrumb(route) {

        /*将原先面包屑导航的粗体选项（当前状态）去掉*/
        var curItem = modBreadcrumb.querySelector('.cur');
        var classNameArr = curItem.className.split(' ');

        for (var j = 0; j < classNameArr.length;) {
            if (classNameArr[j] === "cur") {
                classNameArr.splice(j, 1);
            } else {
                j++;
            }
        }

        curItem.className = classNameArr.join(' ');

        /*添加面包屑*/
        var routeArr = route.split("_");
        var breadCrumbTitle = fileStructureData[routeArr[0]];

        /*找到要生成的面包屑数据*/
        for (var i = 1; i < routeArr.length; i++) {
            breadCrumbTitle = breadCrumbTitle.child[routeArr[i]];
        }

        var li = document.createElement('li');
        if (breadCrumbTitle.route) {
            li.setAttribute("data-file-id", breadCrumbTitle.route);
        }
        li.innerHTML = '<i class="icon icon-bread-next"></i><a href="javascript:void(0)">' + breadCrumbTitle.title + '</a>';

        /*将对应面包屑加粗*/
        li.className = "item cur";

        /*添加面包屑点击事件*/
        li.addEventListener("click", thumBreadcrumbClick, true);
        /*?顺序*/
        li.onclick = function () {
            /*将点击的面包屑后面的面包屑去掉*/
            var curEle = this;
            while (curEle.nextElementSibling) {
                var nextEle = curEle.nextElementSibling;
                modBreadcrumb.removeChild(nextEle);
            }

            /*加粗当前面包屑*/
            this.className += " cur";

            /*生成文件列表*/
            createFileList(findFileListData(route).child, route);
        };

        modBreadcrumb.appendChild(li);
    }

    /*寻找文件列表数据*/
    function findFileListData(route) {
        route = route.split("_");

        findData(fileStructureData, 0);
        // 递归函数
        var obj;

        function findData(dataJson, index) {
            if (index < route.length - 1) {
                findData(dataJson[route[index]].child, index + 1)
            } else {
                obj = dataJson[route[index]];
            }
        }

        return obj;//将找到文件列表返回
    }

    /*切换视图*/
    /*列表视图*/
    listView.onclick = function () {
        thumbView.className = "thumb-view";
        this.className = "list-view cur";

        this.style.className += "";
        listGroup.style.display = "block";
        thumbGroup.style.display = "none";

        /*创建导航*/
        createNavMenu();

        /*根据面包屑生成当前列表*/
        var breadCrumbItem = modBreadcrumb.getElementsByTagName('li');
        var fileData = breadCrumbItem[breadCrumbItem.length - 1].getAttribute("data-file-id");
        var obj = fileListData(fileData);
        createFileList(obj.content.child, fileData);

    };

    /*缩略图*/
    thumbView.onclick = function () {
        listView.className = "list-view";
        this.className = "thumb-view cur";
        listGroup.style.display = "none";
        thumbGroup.style.display = "block";

        /*创建导航*/
        createNavMenu();

        /*根据面包屑生成当前列表*/
        var breadCrumbItem = modBreadcrumb.getElementsByTagName('li');
        var fileData = breadCrumbItem[breadCrumbItem.length - 1].getAttribute("data-file-id");
        createThumbFileList(fileListData(fileData).content.child);
    };

    /*缩略图使用先生成列表，再获取列表元素添加事件的思路*/

    /*将每个li上的事件代理到modMenu上*/
    modMenu.onclick = function (ev) {
        var li = findEle(ev.target, 'nodeName', 'li');
        if (li.getAttribute("date-file-id") === "1_0") {
            /*获取指定触发元素的file-data-id，根据file-data-id获取子级列表数据*/
            var liFileDataId = li && li.getAttribute("date-file-id");
            if (liFileDataId) {
                var fileData = fileListData(liFileDataId);
                createThumbFileList(fileData.content.child);
            }
        }
    };

    /*找到想要触发事件的元素*/
    function findEle(ele, attr, value) {
        if (ele === null || ele.nodeType !== 1)
            return;
        if (ele.nodeName.toLowerCase() === value.toLowerCase()) {
            return ele;
        }
        return findEle(ele.parentNode, attr, value);
    }

    /*寻找子级数据*/
    function fileListData(route) {
        route = route.split('_');
        var obj = {
            content: "", /*要被显示的内容对象*/
            breadcrumb: '<li data-file-id="1_0" class="item cur"><a href="javascript:void(0)">微云</a></li>'
        };
        findData(fileStructureData, 0);

        function findData(data, index) {
            if (index > 1) {
                obj.breadcrumb += '<li data-file-id="' + data[route[index]].route + '" class="item"><i class="icon icon-bread-next"></i><a href="javascript:void(0)">' + data[route[index]].title + '</a></li>';
            }
            if (index < route.length - 1) {
                findData(data[route[index]].child, index + 1);
            } else {
                obj.content = data[route[index]];
            }
        }

        return obj;
    }

    /*显示面包屑*/
    function createThumbBreadCrumb(innerHtmlData) {
        modBreadcrumb.innerHTML = innerHtmlData;
        thumBreadcrumbClick();
    }

    /*缩略图视图生成文件列表*/
    function createThumbFileList(fileListData) {
        /*判断目录是否为空*/
        if(fileListData.length === 0){
            emptyFolderPrompt.style.display = "";
        }else{
            emptyFolderPrompt.style.display = "none";
        }

        thumbFolderList.innerHTML = "";
        figureList.innerHTML = "";
        for (var i = 0; i < fileListData.length; i++) {
            if (fileListData[i].type === "folder") {
                thumbFolderList.innerHTML += '<li class="thumb-folder-list-item" data-file-id="' + fileListData[i].route + '"><div class="wrap"><i class="icon icon-m icon-file-m"></i><span class="txt" data-name="file_name" title="' + fileListData[i].title + '">' + fileListData[i].title + '</span></div><i class="icon icon-check-m"></i></li>';
            } else {
                var thumbIconl = typeToClassNamel(fileListData[i].type);
                var thumbIcons = typeToClassNames(fileListData[i].type);
                figureList.innerHTML += '<li class="figure-list-item ui-draggable" data-file-id="' + fileListData[i].route + '" style="width: 199px;"><div class="figure-list-item-pic is-thumbnail" style="height: 149px;"><i class="icon icon-l ' + thumbIconl + '"></i><i class="icon icon-check-m"></i></div><div class="figure-list-item-txt"><p class="tit"><i class="icon icon-s ' + thumbIcons + '"></i><span class="txt" data-quick-drag="" data-name="file_name" title="' + fileListData[i].title + '">' + fileListData[i].title + '</span></p></div></li>';
            }
        }
        /*文件夹点击事件绑定*/
        thumbFolderListItemClick();

        /*选择框事件绑定*/
        thumbFileSelect();

        /*清空全选*/
        clearAllChecked();

        /*选择框添加事件*/
        thumbFileSelect();
    }

    function typeToClassName(type) {
        var thumbIcon;

        switch (type) {
            case "folder": {
                thumbIcon = "icon-file-m";
                break;
            }
            case "website": {
                thumbIcon = "icon-website-m";
                break;
            }
            case "word": {
                thumbIcon = "icon-doc-m";
                break;
            }
            case "excel": {
                thumbIcon = "icon-xls-m";
                break;
            }
            case "ppt": {
                thumbIcon = "icon-ppt-m";
                break;
            }
            case "pdf": {
                thumbIcon = "icon-pdf-m";
                break;
            }
            case "pic": {
                thumbIcon = "icon-pic-m";
                break;
            }
            case "video": {
                thumbIcon = "icon-video-m";
                break;
            }
            default: {
                thumbIcon = "icon-nor";
            }
        }
        return thumbIcon;
    }

    function typeToClassNamel(type) {
        var thumbIcon;

        switch (type) {
            case "folder": {
                thumbIcon = "icon-file-l";
                break;
            }
            case "website": {
                thumbIcon = "icon-website-l";
                break;
            }
            case "word": {
                thumbIcon = "icon-doc-l";
                break;
            }
            case "excel": {
                thumbIcon = "icon-xls-l";
                break;
            }
            case "ppt": {
                thumbIcon = "icon-ppt-l";
                break;
            }
            case "pdf": {
                thumbIcon = "icon-pdf-l";
                break;
            }
            case "pic": {
                thumbIcon = "icon-pic-l";
                break;
            }
            case "video": {
                thumbIcon = "icon-video-l";
                break;
            }
            default: {
                thumbIcon = "icon-nor-l";
            }
        }
        return thumbIcon;
    }

    function typeToClassNames(type) {
        var thumbIcon;

        switch (type) {
            case "folder": {
                thumbIcon = "icon-file-s";
                break;
            }
            case "website": {
                thumbIcon = "icon-website-s";
                break;
            }
            case "word": {
                thumbIcon = "icon-doc-s";
                break;
            }
            case "excel": {
                thumbIcon = "icon-xls-s";
                break;
            }
            case "ppt": {
                thumbIcon = "icon-ppt-s";
                break;
            }
            case "pdf": {
                thumbIcon = "icon-pdf-s";
                break;
            }
            case "pic": {
                thumbIcon = "icon-pic-s";
                break;
            }
            case "video": {
                thumbIcon = "icon-video-s";
                break;
            }
            default: {
                thumbIcon = "icon-nor-s";
            }
        }
        return thumbIcon;
    }

    /*文件夹点击事件*/
    function thumbFolderListItemClick() {
        /*获取缩略图列表的每一项*/
        var thumbFolderListItem = thumbFolderList.getElementsByTagName('li');
        for (var i = 0; i < thumbFolderListItem.length; i++) {
            thumbFolderListItem[i].onclick = function () {
                createThumbFileList(fileListData(this.getAttribute("data-file-id")).content.child);
                createThumbBreadCrumb(fileListData(this.getAttribute("data-file-id")).breadcrumb);
            };
        }
    }

    /*面包屑点击事件*/
    function thumBreadcrumbClick() {
        var breadCrumbItem = modBreadcrumb.getElementsByTagName('li');
        /*第一个面包屑微云会失效问题解决*/

        if (breadCrumbItem.length === 1) {
            breadCrumbItem[0].className = "item cur";
        } else {
            breadCrumbItem[0].className = "item";
        }
        breadCrumbItem[breadCrumbItem.length - 1].className += " cur";
        for (var i = 0; i < breadCrumbItem.length; i++) {
            breadCrumbItem[i].onclick = function () {
                curListData = fileListData(this.getAttribute("data-file-id"));
                createThumbFileList(fileListData(this.getAttribute("data-file-id")).content.child);
                createThumbBreadCrumb(fileListData(this.getAttribute("data-file-id")).breadcrumb);
            };
            breadCrumbItem[i].addEventListener("click", modBreadcrumbWeiYunClick);
        }
        modBreadcrumbWeiYun = breadCrumbItem[0];
        modBreadcrumbWeiYun.addEventListener("click", modBreadcrumbWeiYunClick);
    }

    /*选择*/
    /*列表视图文件选择*/
    function listFileSelect() {
        iconCheckS = layoutMainBd.querySelectorAll('.icon-check-s');
        for (var i = 0; i < iconCheckS.length; i++) {

            /*因为主要内容区域点击会清除所有状态故特加*/
            iconCheckS[i].onmousedown = function (ev) {
                ev.cancelBubble = true;
                ev.stopPropagation();
            };

            iconCheckS[i].onclick = function (ev) {
                ev.stopPropagation();
                ev.cancelBubble = true;
                if (this.checked === true) {

                    /*删除选择状态*/
                    this.checked = false;
                    /*删除act类*/
                    var classNameArr = findEle(this, "nodeName", "li").className.split(' ');
                    for (var j = 0; j < classNameArr.length;) {
                        if (classNameArr[j] === "act") {
                            classNameArr.splice(j, 1);
                        } else {
                            j++;
                        }
                    }
                    findEle(this, "nodeName", "li").className = classNameArr.join(' ');

                    /*将文件从选中的文件的数组中移除*/
                    for (var i = 0; i < checkedFiles.listFile.length;) {
                        if (checkedFiles.listFile[i] === findEle(this, "nodeName", "li")) {
                            checkedFiles.listFile.splice(i, 1);
                            break;
                        } else {
                            i++;
                        }
                    }
                } else {

                    /*添加选择状态*/
                    this.checked = true;
                    findEle(this, "nodeName", "li").className += " act";

                    /*将选中的文件添加到数组中*/
                    checkedFiles.listFile.push(findEle(this, "nodeName", "li"));
                }

                /*全选和面板是否显示判断*/
                judgeListFileAllCheckedStatus();
            };
        }
    }

    /*缩略图视图文件选择*/
    function thumbFileSelect() {
        /*缩略图视图选择*/
        iconCheckM = layoutMainBd.querySelectorAll('.icon-check-m');
        /*缩略图视图文件选择*/
        for (var i = 0; i < iconCheckM.length; i++) {

            /*因为主要内容区域点击会清除所有状态故特加*/
            iconCheckM[i].onmousedown = function (ev) {
                ev.cancelBubble = true;
                ev.stopPropagation();
            };

            iconCheckM[i].onclick = function(ev){
                ev.stopPropagation();
                ev.cancelBubble = true;
                iconCheckMClick(this);
            }
        }
    }

    /*缩略视图文件点击事件*/
    function iconCheckMClick(_this) {
        if (_this.checked === true) {

            /*删除选择状态*/
            _this.checked = false;
            /*删除act类*/
            var classNameArr = findEle(_this, "nodeName", "li").className.split(' ');
            for (var j = 0; j < classNameArr.length;) {
                if (classNameArr[j] === "act") {
                    classNameArr.splice(j, 1);
                } else {
                    j++;
                }
            }
            findEle(_this, "nodeName", "li").className = classNameArr.join(' ');

            /*将文件从选中的文件的数组中移除*/
            for (var i = 0; i < checkedFiles.thumbFile.length;) {
                if (checkedFiles.thumbFile[i] === findEle(_this, "nodeName", "li")) {
                    checkedFiles.thumbFile.splice(i, 1);
                    break;
                } else {
                    i++;
                }
            }
        } else {

            /*添加选择状态*/
            _this.checked = true;
            findEle(_this, "nodeName", "li").className += " act";

            /*将选中的文件添加到数组中*/
            checkedFiles.thumbFile.push(findEle(_this, "nodeName", "li"));
        }
        judgeThumbFileAllCheckedStatus();
    }

    /*全选和面板是否显示判断*/
    /*缩略图视图*/
    function judgeThumbFileAllCheckedStatus() {
        iconCheckM = layoutMainBd.querySelectorAll('.icon-check-m');

        /*显示文件数量*/
        checkedNumber.innerHTML = checkedFiles.thumbFile.length;

        /*判断是否全选*/
        if (checkedFiles.thumbFile.length === iconCheckM.length) {
            /*添加选择状态*/
            allCheck.checked = true;
            allCheck.parentNode.className += " act";
        }
        if (checkedFiles.thumbFile.length < iconCheckM.length) {
            /*删除选择状态*/
            allCheck.checked = false;
            /*删除act类*/
            var classNameArr = allCheck.parentNode.className.split(' ');
            for (var j = 0; j < classNameArr.length;) {
                if (classNameArr[j] === "act") {
                    classNameArr.splice(j, 1);
                } else {
                    j++;
                }
            }
            allCheck.parentNode.className = classNameArr.join(' ');
        }

        if (checkedFiles.thumbFile.length === 0) {

            allCheck.checked = false;
            /*删除act类*/
            var classNameArr = allCheck.parentNode.className.split(' ');
            for (var j = 0; j < classNameArr.length;) {
                if (classNameArr[j] === "act") {
                    classNameArr.splice(j, 1);
                } else {
                    j++;
                }
            }
            allCheck.parentNode.className = classNameArr.join(' ');

            /*没有选择时隐藏操作面板*/
            mainSelect.style.display = "none";
            mainNormal.style.display = "block";
        }

        if (checkedFiles.thumbFile.length > 0) {
            /*顶栏操作面板显示*/
            mainSelect.style.display = "block";
            mainNormal.style.display = "none";
        }
    }

    /*列表视图*/
    function judgeListFileAllCheckedStatus() {
        iconCheckS = layoutMainBd.querySelectorAll('.icon-check-s');

        /*显示文件数量*/
        checkedNumber.innerHTML = checkedFiles.listFile.length;

        /*判断是否全选*/
        if (checkedFiles.listFile.length === iconCheckS.length) {
            /*添加选择状态*/
            allCheck.checked = true;
            allCheck.parentNode.className += " act";
        } else {
            /*删除选择状态*/
            allCheck.checked = false;
            /*删除act类*/
            var classNameArr = allCheck.parentNode.className.split(' ');
            for (var j = 0; j < classNameArr.length;) {
                if (classNameArr[j] === "act") {
                    classNameArr.splice(j, 1);
                } else {
                    j++;
                }
            }
            allCheck.parentNode.className = classNameArr.join(' ');
        }

        if (checkedFiles.listFile.length === 0) {
            /*没有选择时隐藏操作面板*/
            mainSelect.style.display = "none";
            mainNormal.style.display = "block";
        }

        if (checkedFiles.listFile.length > 0) {
            /*顶栏操作面板显示*/
            mainSelect.style.display = "block";
            mainNormal.style.display = "none";
        }
    }

    /*全选*/
    allCheck.onclick = function () {
        if (this.checked === true) {
            clearAllChecked();
        } else {
            allChecked();
        }
        /*因为主要内容区域点击会清除所有状态故特加*/
        this.onmousedown = function (ev) {
            ev.cancelBubble = true;
            ev.stopPropagation();
        };
    };

    /*清除全选*/
    function clearAllChecked() {
        /*重新获取列表视图选择框*/
        iconCheckS = layoutMainBd.querySelectorAll('.icon-check-s');
        /*重新获取缩略图视图选择*/
        iconCheckM = layoutMainBd.querySelectorAll('.icon-check-m');

        /*删除选择状态*/
        allCheck.checked = false;
        /*删除act类*/
        var classNameArr = allCheck.parentNode.className.split(' ');
        for (var j = 0; j < classNameArr.length;) {
            if (classNameArr[j] === "act") {
                classNameArr.splice(j, 1);
            } else {
                j++;
            }
        }
        allCheck.parentNode.className = classNameArr.join(' ');


        /*数据清空*/

        checkedFiles.listFile = [];
        checkedFiles.thumbFile = [];

        /*全选数量显示*/
        checkedNumber.innerHTML = 0;

        /*清除所有选择框*/
        /*列表视图*/
        for (var i = 0; i < iconCheckS.length; i++) {
            /*删除选择状态*/
            iconCheckS[i].checked = false;
            /*删除act类*/
            var classNameArr = findEle(iconCheckS[i], "nodeName", "li").className.split(' ');
            for (var j = 0; j < classNameArr.length;) {
                if (classNameArr[j] === "act") {
                    classNameArr.splice(j, 1);
                } else {
                    j++;
                }
            }
            findEle(iconCheckS[i], "nodeName", "li").className = classNameArr.join(' ');
        }
        /*缩略图视图*/
        for (var i = 0; i < iconCheckM.length; i++) {
            /*删除选择状态*/
            iconCheckM[i].checked = false;
            /*删除act类*/
            var classNameArr = findEle(iconCheckM[i], "nodeName", "li").className.split(' ');
            for (var j = 0; j < classNameArr.length;) {
                if (classNameArr[j] === "act") {
                    classNameArr.splice(j, 1);
                } else {
                    j++;
                }
            }
            findEle(iconCheckM[i], "nodeName", "li").className = classNameArr.join(' ');
        }

        /*顶栏操作面板隐藏*/
        mainSelect.style.display = "none";
        mainNormal.style.display = "block";
    }

    /*全部选择*/
    function allChecked() {

        /*先清空，防止多添加*/
        checkedFiles.listFile = [];
        checkedFiles.thumbFile = [];

        /*重新获取列表视图选择框*/
        iconCheckS = layoutMainBd.querySelectorAll('.icon-check-s');
        /*重新获取缩略图视图选择*/
        iconCheckM = layoutMainBd.querySelectorAll('.icon-check-m');

        /*全选数量显示*/
        checkedNumber.innerHTML = iconCheckS.length;

        /*添加选择状态*/
        allCheck.checked = true;
        allCheck.parentNode.className += " act";

        for (var i = 0; i < iconCheckS.length; i++) {
            /*添加选择状态*/
            iconCheckS[i].checked = true;
            findEle(iconCheckS[i], "nodeName", "li").className += " act";


            /*将选中的文件添加到数组中*/
            checkedFiles.listFile.push(findEle(iconCheckS[i], "nodeName", "li"));
        }

        for (var i = 0; i < iconCheckM.length; i++) {
            /*添加选择状态*/
            iconCheckM[i].checked = true;
            findEle(iconCheckM[i], "nodeName", "li").className += " act";
            /*将选中的文件添加到数组中*/
            checkedFiles.thumbFile.push(findEle(iconCheckM[i], "nodeName", "li"));
        }

        /*顶栏操作面板显示*/
        mainSelect.style.display = "block";
        mainNormal.style.display = "none";
    }

    /*取消选择按钮*/
    selectBtn.onclick = function () {

        /*列表视图选择框*/
        var iconCheckS = layoutMainBd.querySelectorAll('.icon-check-s');
        /*缩略图视图选择*/
        var iconCheckM = layoutMainBd.querySelectorAll('.icon-check-m');

        /*隐藏操作面板*/
        mainSelect.style.display = "none";
        mainNormal.style.display = "block";

        /*数据清空*/

        checkedFiles.listFile = [];
        checkedFiles.thumbFile = [];


        /*删除全选状态*/
        allCheck.checked = false;
        /*删除act类*/
        var classNameArr = allCheck.parentNode.className.split(' ');
        for (var j = 0; j < classNameArr.length;) {
            if (classNameArr[j] === "act") {
                classNameArr.splice(j, 1);
            } else {
                j++;
            }
        }
        allCheck.parentNode.className = classNameArr.join(' ');

        /*列表视图文件删除*/
        for (var i = 0; i < iconCheckS.length; i++) {
            /*删除选择状态*/
            iconCheckS[i].checked = false;
            /*删除act类*/
            var classNameArr = findEle(iconCheckS[i], "nodeName", "li").className.split(' ');
            for (var j = 0; j < classNameArr.length;) {
                if (classNameArr[j] === "act") {
                    classNameArr.splice(j, 1);
                } else {
                    j++;
                }
            }
            findEle(iconCheckS[i], "nodeName", "li").className = classNameArr.join(' ');
        }

        /*缩略图视图文件全选*/
        for (var i = 0; i < iconCheckM.length; i++) {
            /*删除选择状态*/
            iconCheckM[i].checked = false;
            /*删除act类*/
            var classNameArr = findEle(iconCheckM[i], "nodeName", "li").className.split(' ');
            for (var j = 0; j < classNameArr.length;) {
                if (classNameArr[j] === "act") {
                    classNameArr.splice(j, 1);
                } else {
                    j++;
                }
            }
            findEle(iconCheckM[i], "nodeName", "li").className = classNameArr.join(' ');

        }


    };

    /*主要内容区域点下时，会清除所有状态*/
    layoutMain.onmousedown = function (ev) {
        // if(ev.target === this){/*?*/
            clearAllChecked();
        // }
        ev.preventDefault();
        document.activeElement.blur();
        return false;
    };

    /*框选*/
    /*框选时鼠标滚轮不能滚动?*/
    boxSelect(layoutMain);
    function boxSelect(ele) {
        ele.addEventListener("mousedown", function (ev) {
            /*不是左键点击时，退出*/
            if (ev.button !== 0) return;

            //记录鼠标点下的位置
            var x1 = ev.clientX;
            var y1 = ev.clientY;

            /*创建框*/
            var div = document.createElement('div');
            div.className = "mod-selectable-helper";
            div.style.position = "fixed";
            div.style.zIndex = "412";
            div.style.backgroundColor = "#00a4ff";
            div.style.opacity = ".08";

            document.body.appendChild(div);
            /*移动操作*/
            document.onmousemove = function (ev) {

                //鼠标移动后的位置
                var x2 = ev.clientX;
                var y2 = ev.clientY;
                /*框选器的宽高*/
                var W = Math.abs(x2 - x1);
                var H = Math.abs(y2 - y1);
                div.style.width = W + "px";
                div.style.height = H + "px";

                /*鼠标移动后的位置,选择点下位置和当前位置中比较小的*/
                div.style.left = Math.min(x1, x2) + "px";
                div.style.top = Math.min(y1, y2) + "px";

                if (thumbGroup.style.display === "none")
                    var e1 = listGroup.querySelectorAll("li");
                else {
                    var e1 = thumbGroup.querySelectorAll("li");
                }

                boom(e1, div, function (ele) {
                    switch (ele.className) {
                        case "list-group-item ui-draggable ui-droppable": {
                            ele.className = "list-group-item ui-draggable ui-droppable act";
                            break;
                        }
                        case "thumb-folder-list-item": {
                            ele.className = "thumb-folder-list-item act";
                            break;
                        }
                        case "figure-list-item ui-draggable": {
                            ele.className = "figure-list-item ui-draggable act";
                            break;
                        }
                    }

                    ele.checked = true;

                    /*添加数据*/
                    var existFlag = false;

                    if (thumbGroup.style.display === "none"){
                        for(var i = 0 ; i < checkedFiles.listFile.length; i++){
                            if(ele.getAttribute("data-file-id") === checkedFiles.listFile[i].getAttribute("data-file-id")){
                                existFlag = true;
                                break;
                            }
                        }
                        if(!existFlag){
                            checkedFiles.listFile.push(ele);
                        }
                    }
                    else {
                        for(var i = 0 ; i < checkedFiles.thumbFile.length; i++){
                            if(ele.getAttribute("data-file-id") === checkedFiles.thumbFile[i].getAttribute("data-file-id")){
                                existFlag = true;
                                break;
                            }
                        }
                        if(!existFlag){
                            checkedFiles.thumbFile.push(ele);
                        }
                    }



                }, function (ele) {
                    switch (ele.className) {
                        case "list-group-item ui-draggable ui-droppable act": {
                            ele.className = "list-group-item ui-draggable ui-droppable";
                            break;
                        }
                        case "thumb-folder-list-item act": {
                            ele.className = "thumb-folder-list-item";
                            break;
                        }
                        case "figure-list-item ui-draggable act": {
                            ele.className = "figure-list-item ui-draggable";
                            break;
                        }
                    }
                });

                return false;
            };

            document.onmouseup = function () {
                /*检测全部选中*/

                /*鼠标抬起时删除当前的框选器*/
                document.body.removeChild(div);
                document.onmousemove = null;
                document.onmouseup = null;
                if (thumbGroup.style.display === "none"){
                    judgeListFileAllCheckedStatus();
                }
                else {
                    judgeThumbFileAllCheckedStatus();
                }

            };
        });
    }

    /*碰撞检测方法*/
    function boom(e1, e2, callback1, callback2) {
        /*
         * 1.e1表示元素1，e2表示元素2
         * 2.最小碰撞距离: minW = e1.offsetWidth/2 + e2.offsetWidth/2;
         *               minWH= e1.offsetHeight/2 + e2.offsetHeight/2;
         *
         * 3.e1的中心点：  x1 = e1.offsetLeft + e1.offsetWidth/2;
         *                y1 = e1.offsetTop + e1.offsetHeight/2;
         *
         * 4.e1的中心点：  x2 = e2.offsetLeft + e2.offsetWidth/2;
         *                y2 = e2.offsetTop + e2.offsetHeight/2;
         * 5.碰撞检测判断条件：
         *               Math.abs(x1-x2)<minW && Math.abs(y1-y2)<minH
         *               true  ==> 碰撞
         *               false ==> 没碰
         * */

        /*为了统一将e1变成数组*/
        if (!e1.length) {
            e1 = [e1];
        }

        var e2_x2 = getElementLeft(e2) + e2.offsetWidth / 2 + document.documentElement.scrollLeft;
        var e2_y2 = getElementTop(e2) + e2.offsetHeight / 2;
        for (var i = 0; i < e1.length; i++) {
            var minW = e1[i].offsetWidth / 2 + e2.offsetWidth / 2;
            var minH = e1[i].offsetHeight / 2 + e2.offsetHeight / 2;

            var e1_x1 = getElementLeft(e1[i]) + e1[i].offsetWidth / 2 - layoutMainBody.scrollLeft;
            var e1_y1 = getElementTop(e1[i]) + e1[i].offsetHeight / 2 - layoutMainBody.scrollTop;

            if (Math.abs(e1_x1 - e2_x2) < minW && Math.abs(e1_y1 - e2_y2) < minH) {
                callback1 && callback1(e1[i]);
            } else {
                callback2 && callback2(e1[i]);
            }
        }
    }

    /*获取元素在网页上的绝对位置*/
    function getElementLeft(element) {
        var actualLeft = element.offsetLeft;
        var current = element.offsetParent;
        while (current !== null && current !== undefined) {
            actualLeft += (current.offsetLeft + current.clientLeft);
            current = current.offsetParent;
        }
        return actualLeft;
    }

    function getElementTop(element) {
        var actualTop = element.offsetTop;
        var current = element.offsetParent;
        while (current !== null && current !== undefined) {
            actualTop += (current.offsetTop + current.clientTop);
            current = current.offsetParent;
        }
        return actualTop;
    }

    renameFile();
    /*重命名*/
    function renameFile() {
        var renameBtn = document.querySelectorAll('.rename');
        for (var i = 0; i < renameBtn.length; i++) {

            renameBtn[i].onclick = function () {
                var curViewCheckedFiles;
                if (thumbGroup.style.display === "none")
                    curViewCheckedFiles = checkedFiles.listFile;
                else {
                    curViewCheckedFiles = checkedFiles.thumbFile;
                }
                for (var i = 0; i < curViewCheckedFiles.length; i++) {
                    var title = curViewCheckedFiles[i].querySelector('span');
                    var titleTxt = title.innerHTML;
                    title.style.display = "none";

                    var input = document.createElement('input');
                    input.style.width = "86px";
                    input.value = titleTxt;

                    /*失去焦点将标题值写入当前页面数据中*/
                    input.onblur = function () {
                        var parentLi = findEle(this, "nodeName", "li");
                        var curRoute = parentLi.getAttribute("data-file-id");
                        for (var i = 0; i < curListData.content.child.length; i++) {
                            if (curRoute === curListData.content.child[i].route) {
                                curListData.content.child[i].title = this.value;
                            }
                        }

                        var fileTitle = parentLi.querySelector('span[data-name="file_name"]');
                        fileTitle.innerHTML = this.value;
                        fileTitle.style.display = "inline-block";

                        this.parentNode.removeChild(this);
                    };

                    /*阻止默认事件防止进入子菜单和清除选择状态*/
                    input.onclick = input.onmousedown = function (ev) {
                        ev.cancelBubble = true;
                        ev.stopPropagation();
                    };
                    title.parentNode.insertBefore(input, title);
                }

                curViewCheckedFiles[0].querySelector('input').focus();

            };
        }
    }

    /*当input失去焦点*/
    function replaceFileTitle() {
        /*为什么移出来出问题*/
    }

    /*新建文件夹*/
    /*获取添加按钮*/
    createFolder();
    function createFolder() {
        var createFolderBtns = document.querySelectorAll('.create-folder');
        for(var i = 0; i < createFolderBtns.length; i++){
            createFolderBtns[i].onclick = function (ev) {
                var obj = {
                    "id":curListData.content.child.length,
                    "route":curListData.content.route + "_" + curListData.content.child.length,
                    "title":"null",
                    "type":"folder",
                    "parent":curListData.title,
                    "child":[]
                };
                if(thumbGroup.style.display === "none"){
                    /*列表视图生成文件*/
                    var li = document.createElement('li');
                    li.className = "list-group-item ui-draggable ui-droppable";
                    li.setAttribute("data-file-id",curListData.content.route + "_" + curListData.content.child.length);
                    li.onclick = function () {
                        createFileList(findFileListData(this.getAttribute("data-file-id")).child, this.getAttribute("data-file-id"));
                        /*创建面包屑*/
                        createBreadCrumb(this.getAttribute("data-file-id"));
                    };

                    li.innerHTML = '<div class="item-tit"><div class="label"><i class="icon icon-check-s"></i></div><div class="thumb"><i class="icon icon-m icon-file-m"></i></div><div class="info"><input style="width:95%;"><span class="tit" data-name="file_name" title=""></span></div></div>';

                    listGroup.insertBefore(li,listGroup.firstElementChild);
                    var input = li.querySelector('input');
                    input.focus();

                    input.onmousedown = function (ev) {
                        ev.cancelBubble = true;
                        ev.stopPropagation();
                    };
                    input.onblur = function () {
                        this.nextElementSibling.innerHTML = input.value;
                        this.parentNode.removeChild(this);

                        /*数据设置*/
                        if(input.value.trim() === ""){
                            li.parentNode.removeChild(li);
                            return;
                        }

                        obj.title = input.value;
                        curListData.content.child.push(obj);
                    };
                }else{
                    /*缩略图视图生成文件*/
                    var li = document.createElement('li');
                    li.className = "thumb-folder-list-item";
                    li.setAttribute("data-file-id",curListData.content.route + "_" + curListData.content.child.length);
                    li.onclick = function () {
                        createFileList(findFileListData(this.getAttribute("data-file-id")).child, this.getAttribute("data-file-id"));
                        /*创建面包屑*/
                        createBreadCrumb(this.getAttribute("data-file-id"));
                    };
                    li.innerHTML = '<div class="wrap"><i class="icon icon-m icon-file-m"></i><input style="width:45%;"><span class="txt" data-name="file_name" title=""></span></div>';

                    thumbFolderList.insertBefore(li,thumbFolderList.firstElementChild);
                    var input = li.querySelector('input');
                    input.focus();

                    input.onmousedown = function (ev) {
                        ev.cancelBubble = true;
                        ev.stopPropagation();
                    };
                    input.onblur = function () {
                        this.nextElementSibling.innerHTML = input.value;
                        this.parentNode.removeChild(this);

                        /*数据设置*/
                        if(input.value.trim() === ""){
                            li.parentNode.removeChild(li);
                            return ;
                        }

                        obj.title = input.value;
                        curListData.content.child.push(obj);
                    };

                    obj.title = this.value;
                }

                ev.preventDefault();
                return false;
            };
        }
    }


    deleteFile ();
    /*删除文件*/
    function deleteFile () {
        var deleteBtn = document.querySelectorAll('.delete');
        for(var i = 0; i < deleteBtn.length; i++){
            deleteBtn[i].onclick = function () {
                /*判断是列表视图还是缩略图视图*/
                var curViewCheckedFiles;
                if (thumbGroup.style.display === "none")
                    curViewCheckedFiles = checkedFiles.listFile;
                else {
                    curViewCheckedFiles = checkedFiles.thumbFile;
                }

                for (var i = 0; i < curViewCheckedFiles.length; ) {
                    var dataFileId = curViewCheckedFiles[i].getAttribute("data-file-id");
                    var spDataFileId  = dataFileId.split("_");
                    var dataIndex = spDataFileId.slice(spDataFileId.length - 1,spDataFileId.length)[0];
                    var parentRoute = spDataFileId.slice(0,spDataFileId.length - 1).join("_");
                    /*从视图删除*/
                    curViewCheckedFiles[i].parentNode.removeChild(curViewCheckedFiles[i]);
                    checkedFiles.listFile = [];
                    checkedFiles.thumbFile = [];
                    /*从数据删除*/
                    for(var j = 0; j < findFileListData(parentRoute).child.length; j++){
                        if(dataFileId === findFileListData(parentRoute).child[j].route){
                            findFileListData(parentRoute).child.splice(j,1);
                            i++;
                            break;
                        }
                    }
                }
                sortExistFile();
            };
        }
    }

    function sortExistFile() {
        var existFiles;
        if (thumbGroup.style.display === "none")
            existFiles = listGroup.querySelectorAll("li");
        else {
            existFiles = thumbGroup.querySelectorAll("li");
        }

        for(var i =0; i < existFiles.length; i++){
            var dataFileId = existFiles[i].getAttribute("data-file-id");
            var spDataFileId  = dataFileId.split("_");
            var parentRoute = spDataFileId.slice(0,spDataFileId.length - 1).join("_");

            existFiles[i].setAttribute("data-file-id",parentRoute+ "_" + i);

            /*修改数据*/

            for(var j = 0; j < findFileListData(parentRoute).child.length; j++){
                if(dataFileId === findFileListData(parentRoute).child[j].route){
                    findFileListData(parentRoute).child[j].route = parentRoute+ "_" + j;
                    break;
                }
            }
        }
    }

    /*添加任务文件和文件夹区别*/
    var fileUp = topBar.querySelector('.add-wrap .file-upload');

    /*移动到*/
    moveToBtn.addEventListener("click",moveTo,false);
    function moveTo() {

        var div = document.createElement('div');
        div.className = "select-move-position full-pop full-pop-medium";
        div .innerHTML = '<div data-no-selection="" class="select-move-position full-pop full-pop-medium" style="display: block; position: fixed; left: 50%; top: 50%; margin-left: -226px; margin-top: -231.5px;" role="alertdialog"> <h3 class="full-pop-header"> <div class="inner __title">选择存储位置</div> </h3> <div class="full-pop-content __content"> <div class="mod-dirbox"> <div class="dirbox-file"> <span class="fileimg"> <i data-id="icon" class="filetype icon icon-m icon-file-m"></i> </span> <span class="filename">图片                                    <em>等 14 个文件</em>                <br><em class="size"></em></span> </div> <div class="dirbox-dirs"> <div class="dirbox-dir dirbox-curdir"> <label>移动到：</label> <label id="_file_move_paths_to" title="微云\图片" tabindex="0">微云\图片</label> </div> <div data-id="tree-container" class="dirbox-tree" style=""> <ul class="_tree dirbox-tree-body"> <li data-level="0" id="_file_move_box_node_b4e2504df0a739ae12b58dcd423dce4a" data-dir-name="微云" data-file-id="b4e2504df0a739ae12b58dcd423dce4a" data-file-pid="b4e2504df338fdcb41c5dfa52b9ed888" data-loaded="true"> <a href="#" hidefocus="on" style="padding-left:0px;" class="expand"><span class="ui-text"><i class="_expander" data-tj-action="btn-adtag-tj" data-tj-value="52109"></i>微云</span></a> <ul class="dirbox-sub-tree" style="display: block;"> <li data-level="1" id="_file_move_box_node_b4e2504d7f412613a1683b7a78b2d467" data-dir-name="图片" data-file-id="b4e2504d7f412613a1683b7a78b2d467" data-file-pid="b4e2504df0a739ae12b58dcd423dce4a"> <a href="#" hidefocus="on" style="padding-left:20px;"><span class="ui-text"><i class="_expander" data-tj-action="btn-adtag-tj" data-tj-value="52109"></i>图片</span></a> </li> <li data-level="1" id="_file_move_box_node_b4e2504d0d1d449e475a62762a96049b" data-dir-name="QQ" data-file-id="b4e2504d0d1d449e475a62762a96049b" data-file-pid="b4e2504df0a739ae12b58dcd423dce4a"> <a href="#" hidefocus="on" style="padding-left:20px;"><span class="ui-text"><i class="_expander" data-tj-action="btn-adtag-tj" data-tj-value="52109"></i>QQ</span></a> </li> <li data-level="1" id="_file_move_box_node_b4e2504db5fd98e93030dee4aff7a4fe" data-dir-name="专业知识学习" data-file-id="b4e2504db5fd98e93030dee4aff7a4fe" data-file-pid="b4e2504df0a739ae12b58dcd423dce4a"> <a href="#" hidefocus="on" style="padding-left:20px;"><span class="ui-text"><i class="_expander" data-tj-action="btn-adtag-tj" data-tj-value="52109"></i>专业知识学习</span></a> </li> <li data-level="1" id="_file_move_box_node_b4e2504d06d71b98660cd389cc2cab06" data-dir-name="软件" data-file-id="b4e2504d06d71b98660cd389cc2cab06" data-file-pid="b4e2504df0a739ae12b58dcd423dce4a"> <a href="#" hidefocus="on" style="padding-left:20px;"><span class="ui-text"><i class="_expander" data-tj-action="btn-adtag-tj" data-tj-value="52109"></i>软件</span></a> </li> <li data-level="1" id="_file_move_box_node_b4e2504d728a7174fcff97a406e52d67" data-dir-name="QQ音乐" data-file-id="b4e2504d728a7174fcff97a406e52d67" data-file-pid="b4e2504df0a739ae12b58dcd423dce4a"> <a href="#" hidefocus="on" style="padding-left:20px;"><span class="ui-text"><i class="_expander" data-tj-action="btn-adtag-tj" data-tj-value="52109"></i>QQ音乐</span></a> </li> <li data-level="1" id="_file_move_box_node_b4e2504dff8bd21d3ae77e9718ce3053" data-dir-name="群共享文件" data-file-id="b4e2504dff8bd21d3ae77e9718ce3053" data-file-pid="b4e2504df0a739ae12b58dcd423dce4a"> <a href="#" hidefocus="on" style="padding-left:20px;"><span class="ui-text"><i class="_expander" data-tj-action="btn-adtag-tj" data-tj-value="52109"></i>群共享文件</span></a> </li> <li data-level="1" id="_file_move_box_node_b4e2504dba9c89e59a72840e09b22a83" data-dir-name="QQ邮箱" data-file-id="b4e2504dba9c89e59a72840e09b22a83" data-file-pid="b4e2504df0a739ae12b58dcd423dce4a"> <a href="#" hidefocus="on" style="padding-left:20px;"><span class="ui-text"><i class="_expander" data-tj-action="btn-adtag-tj" data-tj-value="52109"></i>QQ邮箱</span></a> </li> <li data-level="1" id="_file_move_box_node_b4e2504d77c92765438ca4ef1d170515" data-dir-name="QQ网盘" data-file-id="b4e2504d77c92765438ca4ef1d170515" data-file-pid="b4e2504df0a739ae12b58dcd423dce4a"> <a href="#" hidefocus="on" style="padding-left:20px;"><span class="ui-text"><i class="_expander" data-tj-action="btn-adtag-tj" data-tj-value="52109"></i>QQ网盘</span></a> </li> </ul> </li> </ul> </div> </div> </div> </div> <div class="full-pop-btn __buttons"> <span class="__msg infor err">文件已经在该文件夹下了</span> <a data-id="button" data-btn-id="OK" class="g-btn g-btn-blue" href="javascript:void(0);" disabled="disabled"> <span class="btn-inner disabled">确定</span> </a> <a data-id="button" data-btn-id="CANCEL" class="g-btn g-btn-gray" href="javascript:void(0);"> <span class="btn-inner">取消</span> </a> </div> <a data-btn-id="CANCEL" href="javascript:void(0)" class="full-pop-close" title="关闭">×</a> </div>';

        /*确定*/
        var okBtn = div.querySelector('.g-btn.g-btn-blue');
        document.body.appendChild(div);
        okBtn.addEventListener('click',function () {
            document.body.removeChild(div);
        });

        /*取消*/
        var cancelBtn = div.querySelector('.g-btn.g-btn-gray');
        cancelBtn.addEventListener('click',function () {
            document.body.removeChild(div);
        });
    }
    /*空文件提示*/
};


