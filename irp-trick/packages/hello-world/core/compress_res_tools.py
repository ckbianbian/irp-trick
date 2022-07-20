# -*- coding:UTF-8 -*-
#该脚本用于压缩png图片 使用python3以上版本解释执行
__author__ = "Jiaofeng"
 
import os
import time
import sys
import CmdUtil
import platform
CUR_DIR = os.path.abspath(os.path.dirname(__file__))
print("cur_dir:",CUR_DIR)

_PNGSIG = bytes([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a])
_JPGSIG = bytes([0xff,0xd8,0xff])
 #获取filesig是否是png
def isPNGSig(bytes_8):
    return bytes_8 == _PNGSIG

def isPNG(absPath):#判断是否是PNG图片
    """
    :param absPath: 文件的绝对路径
    :return: {Bool}
    """
    isFile = os.path.isfile(absPath)
    hasPNGSig = False
    fileExt = os.path.splitext(absPath)[1]
    isPngExt = (fileExt == ".png" or fileExt == ".PNG")
    if isFile and isPngExt:
        with open(absPath,"rb") as file:
            hasPNGSig = isPNGSig(file.read(8)[:8])
    return isFile and isPngExt and hasPNGSig

 #获取filesig是否是png
def isJPGSig(bytes_3):
    return bytes_3 == _JPGSIG

def isJPG(absPath):#判断是否是PNG图片
    """
    :param absPath: 文件的绝对路径
    :return: {Bool}
    """
    isFile = os.path.isfile(absPath)
    hasJPGSig = False
    fileExt = os.path.splitext(absPath)[1]
    isJPGExt = (fileExt == ".jpg" or fileExt == ".jpeg")
    if isFile and isJPGExt:
        with open(absPath,"rb") as file:
            hasJPGSig = isJPGSig(file.read(3)[:3])
    return isFile and isJPGExt and hasJPGSig

    
# 设置运行权限
def setRunAuthority (file):
    cmd = "chmod u+x %s"%file
    err=CmdUtil.executeCmd(cmd,None)

def compressPng(filePath):
    """
    参数文档： https://pngquant.org/
    """
    # 图像质量
    global filenum
    global fileErrorNum
    pngurl = ""
    if(sys.platform == "win32"):
        pngurl = os.path.join(CUR_DIR, 'tools/pngquant/pngquant.exe')
        # pngurl = os.path.join(CUR_DIR, 'tools/pngquant/pngcrush_1_8_11_w64.exe')
    elif(sys.platform == "darwin"):
        pngurl = os.path.join(CUR_DIR, 'tools/pngquant/pngquant')
        setRunAuthority(pngurl)
    quality = "70-95"
    speed = 4
    cmd = "%s --transbug --force 256 --output %s --quality %s %s"%(pngurl,filePath,quality,filePath)
    # cmd = "%s --ow --q --warn %s"%(pngurl,filePath)
    print("////////////////////compressPng:",filePath)
    filenum = filenum + 1
    err=CmdUtil.executeCmd(cmd,None)
    if(err != None):
        fileErrorNum = fileErrorNum + 1
        print("compressPng error:",err)

def compressJpg(filePath):
    """
    let imageminJpegRecompress = {
        accurate: true,//高精度模式
        quality: "high",//图像质量:low, medium, high and veryhigh;
        method: "smallfry",//网格优化:mpe, ssim, ms-ssim and smallfry;
        min: 70,//最低质量
        loops: 0,//循环尝试次数, 默认为6;
        progressive: false,//基线优化
        subsample: "default"//子采样:default, disable;
    };
    参数文档： https://linux.die.net/man/1/jpegtran
    """
    global filenum
    global fileErrorNum
    jpgurl = ""
    if (sys.platform == 'darwin'):
        jpgurl = os.path.join(CUR_DIR, 'tools/jpegtran/jpegtran')
        setRunAuthority(jpgurl)
    elif (sys.platform == 'win32'):
        # Possible values are: 'arm', 'arm64', 'ia32', 'mips','mipsel', 'ppc', 'ppc64', 's390', 's390x', 'x32', and 'x64'
        if (platform.machine().find('64') != -1):
            jpgurl = os.path.join(CUR_DIR, 'tools/jpegtran/win/x64/jpegtran.exe')
        else:
            jpgurl = os.path.join(CUR_DIR, 'tools/jpegtran/win/x86/jpegtran.exe')
    cmd = "%s -copy none -optimize -perfect -progressive -outfile %s %s"%(jpgurl,filePath,filePath)
    err=CmdUtil.executeCmd(cmd,None)
    filenum = filenum + 1
    if(err != None):
        fileErrorNum = fileErrorNum + 1
        print("compressJpg error:",err)

def traverseDir(absDir):#遍历当前目录以及递归的子目录，找到所有的png图片
    """
    :param absDir: 要遍历的路径
    :return: None
    """
    assert (os.path.isdir(absDir) and os.path.isabs(absDir))
    dirName = absDir
    for fileName in os.listdir(absDir):
        absFileName = os.path.join(dirName,fileName)
        # print("isPNG:",absFileName)
        if os.path.isdir(absFileName):#递归查找文件夹
            traverseDir(absFileName)
        elif isPNG(absFileName):
            compressPng(absFileName)
        # elif isJPG(absFileName):
        #     compressJpg(absFileName)
        else:
            # print("////////////////////pass:",absFileName)
            pass

 #------------------- 主函数-------------------------#
start_clock = time.time()
filenum = 0
fileErrorNum = 0
print(len(sys.argv))
if len(sys.argv) >= 2:
    traverseDir(sys.argv[1])
    end_clock = time.time()
    time = (end_clock - start_clock)*1000
    print("compress %d Png Pictures"%filenum)
    print("compress %d Png Pictures error"%fileErrorNum)
    print("use time %fms"%time)
    print("tar_dir:",sys.argv[1])
    print("***************compress success***************")
else:
    print("***************compress fail Missing path arg[1]***************")
