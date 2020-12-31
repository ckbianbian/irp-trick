const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property({
        type: cc.Button
    })
    btn = null;

    fileUrl = '../../resources/json/Bullet';

    onLoad(): void {

    }

    start(): void {

    }

    btnCallFunc(): void {
        let url = cc.url.raw('resources/zip/config.zip');
        // let url = 'zip/success.zip';
        cc.loader.load({ url: url, type: "binary" }, (err: Error, zipData: ArrayBuffer) => {
            // cc.resources.load(url, 'binary', (err, zipData) => {
            //2.1.3在安卓平台下会出现load不到资源的情况
            if (err) {
                let httpUrl = `资源服务地址${url}`;
                console.log('loadConfigZip httpUrl: ', httpUrl);
                let oReq = new XMLHttpRequest();
                oReq.open("GET", httpUrl, true);
                oReq.responseType = "arraybuffer";

                oReq.onload = function (oEvent) {
                    let arrayBuffer = oReq.response; // 注意:不是oReq.responseText
                    if (arrayBuffer) {
                        console.log('LoadConfig::unzip 0');
                        this.unzip(arrayBuffer);
                    }
                };
                oReq.send(null);
            }
            else {
                this.unzip(zipData);
            }
        });
    }

    unzip(zipData) {
        let newZip = new JSZip(); // 因为将jszip导入为插件，所以可以全局直接访问
        cc.log(zipData);
        newZip.loadAsync(zipData).then(zip => {
            zip.file('test.txt').async('uint8array').then(data => {
                cc.log('data--->', data);
                this.createFile(data);
                // let json = JSON.parse(data);
            });
        });
    }

    saveForBrowser(textToWrite, fileNameToSaveAs) {
        if (cc.sys.isBrowser) {
            console.log("浏览器");
            let textFileAsBlob = new Blob([textToWrite], { type: 'application/json' });
            let downloadLink = document.createElement("a");
            downloadLink.download = fileNameToSaveAs;
            downloadLink.innerHTML = "Download File";
            if (window.webkitURL != null) {
                // Chrome allows the link to be clicked
                // without actually adding it to the DOM.
                downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
            }
            else {
                // Firefox requires the link to be added to the DOM
                // before it can be clicked.
                downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                downloadLink.onclick = destroyClickedElement;
                downloadLink.style.display = "none";
                document.body.appendChild(downloadLink);
            }
            downloadLink.click();
        }
    }

    createFile(binArray) {
        // jsb.fileUtils获取全局的工具类的实例, cc.director;
        // 如果是在电脑的模拟器上，就会是安装路径下模拟器的位置;
        // 如果是手机上，那么就是手机OS为这个APP分配的可以读写的路径; 
        // jsb --> javascript binding --> jsb是不支持h5的
        var writeable_path = jsb.fileUtils.getWritablePath();
        console.log(writeable_path);

        writeable_path = 'd:/';

        // 要在可写的路径先创建一个文件夹
        var new_dir = writeable_path + "new_dir";
        // 路径也可以是 外部存储的路径，只要你有可写外部存储的权限;
        // getWritablePath这个路径下，会随着我们的程序卸载而删除,外部存储除非你自己删除，否者的话，卸载APP数据还在;
        if (!jsb.fileUtils.isDirectoryExist(new_dir)) {
            jsb.fileUtils.createDirectory(new_dir);
        }
        else {
            console.log("dir is exist!!!");
        }

        // // 读写文件我们分两种,文本文件, 二进制文件;
        // // (1)文本文件的读,返回的是一个string对象
        // var str_data = jsb.fileUtils.getStringFromFile(new_dir + "/test_str_read.txt");
        // console.log(str_data);
        // let str_data = "hello test_write !!!!!"
        // jsb.fileUtils.writeStringToFile(binArray, new_dir + "/test.txt");
        // // (2)二进制文件的读写, Uint8Array --> js对象
        // var bin_array = jsb.fileUtils.getDataFromFile(new_dir + "/test_bin_read.png");
        // console.log(bin_array[0], bin_array[1]); // 使用这个就能访问二进制的每一个字节数据;
        // jsb.fileUtils.writeDataToFile(bin_array, new_dir + "/test_bin_write.png");
        jsb.fileUtils.writeDataToFile(binArray, new_dir + "/test.txt");
        // // end 

        // 删除文件和文件夹
        // jsb.fileUtils.removeFile(new_dir + "/test_bin_write.png"); 
        // jsb.fileUtils.removeDirectory(new_dir);
    }

}
