import Taro, { CameraContext, CameraFrameListener } from '@tarojs/taro'
// import { useCamera } from '@tarojs/taro'
import { View, Button, Camera, Canvas } from '@tarojs/components'
import React, { useRef } from 'react'

export default function CameraExample() {
  const cameraContext = useRef<CameraContext | null>(null);
  const listener = useRef<CameraFrameListener | null>(null);
  // const { camera } = useCamera()
  const thisRef = useRef(this);
  const flag = useRef(1);

  const [videoSrc, setVideoSrc] = React.useState('')
  const [imgUrl, setImageUrl] = React.useState('')

  // 录制视频
  async function startRecordVideo() {
    let that = this;
    try {
      cameraContext.current = Taro.createCameraContext();
      cameraContext.current.startRecord({
        success(res) {
          console.log('开始录制视频', res)
          flag.current = 0;
          listener.current = cameraContext.current?.onCameraFrame((frame) => {
            console.log(frame.data instanceof ArrayBuffer, frame.width, frame.height)
            let data = new Uint8Array(frame.data);
            let clamped = new Uint8ClampedArray(data);
            Taro.canvasPutImageData({
              canvasId: 'myCanvas',
              x: 0,
              y: 0,
              width: frame.width,
              height: frame.height,
              data: clamped,
              success(res) {
                Taro.canvasToTempFilePath({
                  x: 0,
                  y: 0,
                  width: frame.width,
                  height: frame.height,
                  canvasId: 'myCanvas',
                  fileType: 'jpg',
                  destWidth: frame.width,
                  destHeight: frame.height,
                  // 精度修改
                  quality: 0.8,
                  success(res) {
                    // 临时文件转base64
                    Taro.getFileSystemManager().readFile({
                      filePath: res.tempFilePath, //选择图片返回的相对路径
                      encoding: 'base64', //编码格式
                      success: res => {
                        // 保存base64
                        // that.data.mybase64 = res.data;
                        // setImageUrl(res.data);
                        console.log('====================================');
                        console.log(res.data);
                        console.log('====================================');
                      }
                    })
                  },
                  fail(res) {
                    console.log(res);
                  }
                })
              },
            }, thisRef.current || that)

          }) || null
          listener.current?.start();
        },
        fail(res) {
          console.log('开始录制视频失败', res)
        },
      })

    } catch (error) {
      console.error('录制视频失败', error)
    }
  }

  function stopRecordVideo() {
    cameraContext.current?.stopRecord({
      success: (res) => {
        listener.current?.stop();
        const video = res.tempVideoPath // 获取录像文件的临时路径
        console.log('录像文件:', video)
        setVideoSrc(video)
      },
    })
  }

  return (
    <View>
      <View style="width: 100%; height: 300px;">
        {/* <Camera id="camera" style="width: 100%; height: 100%;" devicePosition="front" frameSize="medium"></Camera> */}
      </View>
      <Button onClick={startRecordVideo}>录制视频233</Button>
      <Button onClick={stopRecordVideo}>停止录制</Button>
      {videoSrc && <View style={{ backgroundColor: 'red', width: '100%', height: '300px' }}>
        <video src={videoSrc} controls></video>
      </View>}
      <Canvas style='width: 300px; height: 200px;' canvasId='myCanvas' />
    </View>
  )
}
