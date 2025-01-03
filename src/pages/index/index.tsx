import { Component, PropsWithChildren, useEffect, useRef, useState } from 'react'
import { View, Button, Text } from '@tarojs/components'
import CameraPage from './components/VideoRecorder'
import Taro, { CameraFrameListener } from '@tarojs/taro'
import './index.less'


// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {
  counter: {
    num: number
  }
}

type PageDispatchProps = {
  add: () => void
  dec: () => void
  asyncAdd: () => any
}

type PageOwnProps = {}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

function Index(props: IProps) {
  const listen = useRef<CameraFrameListener | null>(null);
  const [num, setNum] = useState(0);
  function recordVideo() {
    return Taro.chooseVideo({
      sourceType: ['camera'], // 指定使用摄像头录制
      // camera: 'back', // 指定使用后置摄像头，可选值有front、back
      maxDuration: 60, // 最大录制时长（秒）
      camera: 'front', // 录制视频使用前置或后置摄像头
    }).then(res => {
      // 获取视频录制完成后的临时文件路径
      const tempFilePath = res.tempFilePath
      console.log('录制的视频文件路径:', tempFilePath);
      // 处理视频文件，例如上传到服务器或本地保存等
    }).catch(err => {
      // 处理错误情况
      console.error('录制视频失败:', err)
    })
  }

  const callBack = (res: Taro.faceDetect.SuccessCallbackOption, frame: Taro.CameraContext.OnCameraFrameCallbackResult) => {
    console.log(res);
    if (res.confArray.global < 0.99) {
      setNum(1);
    }else{
      setNum(0);
    }
  }

  const startFace = () => {
    const cameraContext = Taro.createCameraContext();
    Taro.initFaceDetect({
      success: () => {
        listen.current = cameraContext.onCameraFrame((frame) => {
          Taro.faceDetect({
            frameBuffer: frame.data,
            width: frame.width,
            height: frame.height,
            enablePoint: true,
            enableConf: true,
            success(res) {
              callBack(res, frame);
            },
          })
        })
        listen.current.start();
      },
      fail: (res) => {
        console.log(res);
      }
    })

  }

  return (
    <View className='index'>
      <View><Text>Hello, World2</Text></View>
      <View><Text>录制视频</Text></View>
      <CameraPage />
      <Button type={num === 0 ? 'primary' : num === 1 ? 'warn' : 'default'}
        onClick={() => {
          listen.current?.stop();
          Taro.stopFaceDetect({});
        }}
      >重置识别状态</Button>
      <Button onClick={() => {
        startFace();
      }}>开始人脸识别</Button>
      <Button className='startRecord' onClick={() => {
        recordVideo();
      }}>RecordVideo</Button>
    </View>
  )
}

export default Index

