import { Component, PropsWithChildren, useEffect } from 'react'
import { connect } from 'react-redux'
import { View, Button, Text } from '@tarojs/components'
import CameraPage from './components/VideoRecorder'
import { add, minus, asyncAdd } from '../../actions/counter'

import './index.less'
import Taro from '@tarojs/taro'


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

@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add() {
    dispatch(add())
  },
  dec() {
    dispatch(minus())
  },
  asyncAdd() {
    dispatch(asyncAdd())
  }
}))
class Index extends Component<PropsWithChildren> {
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  componentDidMount(): void {
    Taro.request({
      url: '/api/environment/river',
      data: {
        key: 'b6f0832fc64a4a8790225aa612864da5',
        page: 20
      },
      success(result) {
        console.log('====================================');
        console.log(result);
        console.log('====================================');
      },
    })
  }

  render() {
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

    return (
      <View className='index'>
        <Button className='add_btn' onClick={this.props.add}>+</Button>
        <Button className='dec_btn' onClick={this.props.dec}>-</Button>
        <Button className='dec_btn' onClick={this.props.asyncAdd}>async</Button>
        <View><Text>{this.props.counter.num}</Text></View>
        <View><Text>Hello, World2</Text></View>
        <View><Text>录制视频</Text></View>
        <CameraPage />
        {/* <Button className='startRecord' onClick={() => {
          recordVideo();
        }}>RecordVideo</Button> */}
      </View>
    )
  }
}

export default Index

