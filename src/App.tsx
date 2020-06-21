import React, { useState, useEffect } from 'react'
import * as faceApi from "face-api.js"
import getUserMedia from "./utils/userMedia"
import { Spin, Divider, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { IsPC } from './utils/common'
import 'antd/dist/antd.css'
import "./app.css"
function App() {
  type NetsType = "tinyFaceDetector" | "ssdMobilenetv1"
  const [loading, setLoading] = useState(false)
  const [netsType] = useState<NetsType>("tinyFaceDetector")
  const options = new faceApi.TinyFaceDetectorOptions({
    inputSize: 608, // 160 224 320 416 512 608
    scoreThreshold: 0.5, // 0.1 ~ 0.9
  })
  // 页面初始化
  useEffect(() => {
    setLoading(true)
    async function loadModule () {
      await faceApi.nets[netsType].loadFromUri("/models")
    }
    loadModule()
    setTimeout(() => setLoading(false), 300)
    Modal.confirm({
      title: '温馨提示',
      icon: <ExclamationCircleOutlined />,
      content: '当前页面需要访问您的相机设备，请选择允许',
      okText: '知道了',
      cancelText: '再看看',
      onOk() {
        handleOpenMediaClick()
      }
    });
  }, [netsType])

  function handleOpenMediaClick() {
    console.log(IsPC())
    getUserMedia({
      video: { facingMode: IsPC() ? "user" : "environment" },
      audio: false
    }).then((stream: any) => {
      (document.getElementById("videoEl") as HTMLVideoElement).srcObject = stream;
      readfile()
    }).catch(() => {
      message.error('打开摄像头失败')
    })
  }

  // 读取视频中的人
  const readfile = async () => {
    const videoEl = document.getElementById("videoEl")
    const canvasEl = document.getElementById("canvasEl") as HTMLCanvasElement
    let result
    setTimeout(() => readfile(), 100)
    try {
      result = await faceApi["detectSingleFace"](videoEl as faceApi.TNetInput, options)
    } catch (error) {
      console.log(error)
    }
    if (result) {
      const dims = faceApi.matchDimensions(canvasEl, videoEl as any, true)
      const resizeResults = faceApi.resizeResults(result, dims)
      resizeResults && faceApi.draw.drawDetections(canvasEl, resizeResults)
    }
  }

  return (
    <Spin spinning={loading} tip="模型加载中">
      <div className="App">
      <Divider>face-api</Divider>
        <div className="see">
          <video id="videoEl" autoPlay muted playsInline></video>
          <canvas id="canvasEl" />
        </div>
      </div>
    </Spin>
  )
}

export default App
