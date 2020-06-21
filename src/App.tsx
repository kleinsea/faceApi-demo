import React, { useState, useEffect } from 'react'
import * as faceApi from "face-api.js"
import getUserMedia from "./utils/userMedia"
import { Spin, Divider, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { IsPC } from './utils/common'
import 'antd/dist/antd.css'
import "./App.css"

function App() {
  enum NetsType {
    tinyFaceDetector = "tinyFaceDetector",
    ssdMobilenetv1 = "ssdMobilenetv1",
    mtcnn = "mtcnn"
  }
  type Face = "detectSingleFace" | "detectAllFaces"
  const [loading, setLoading] = useState(false)
  const [netsType] = useState<NetsType>(NetsType.tinyFaceDetector)
  const [detectFace] = useState<Face>("detectSingleFace")
  // 加载model
  useEffect(() => {
    setLoading(true)
    async function loadModule() {
      await faceApi.nets[netsType].loadFromUri("/models")
    }
    loadModule() // 加载模型
    setLoading(false) // 模型加载完毕
  }, [netsType])

  useEffect(() => {
    loadModal()
  }, [])
  function loadModal() {
    Modal.confirm({
      title: '温馨提示',
      icon: <ExclamationCircleOutlined />,
      content: '当前页面需要访问您的相机设备，请选择允许',
      okText: '知道了',
      cancelText: '再看看',
      onOk() {
        handleOpenMediaClick()
      }
    })
  }

  // 打开摄像头
  function handleOpenMediaClick() {
    getUserMedia({
      video: { facingMode: IsPC() ? "user" : "environment" },
      audio: false
    }).then((stream: any) => {
      (document.getElementById("videoEl") as HTMLVideoElement).srcObject = stream
      readfile()
    }).catch(() => {
      message.error('打开摄像头失败')
    })
  }

  // 读取视频中的人
  async function readfile() {
    const videoEl = document.getElementById("videoEl")
    const canvasEl = document.getElementById("canvasEl") as HTMLCanvasElement
    setTimeout(readfile, 100)
    const result = await faceApi[detectFace](videoEl as faceApi.TNetInput, getOptions())
    if (result) {
      // 匹配尺寸
      const dims = faceApi.matchDimensions(canvasEl, videoEl as any, true)
      const resizeResults = faceApi.resizeResults(result, dims)
      resizeResults && faceApi.draw.drawDetections(canvasEl, resizeResults)
    } else {
      canvasEl.getContext("2d")!.clearRect(0, 0, canvasEl.width, canvasEl.height)
    }
  }

  // 设置faceApi需要的options
  function getOptions() {
    switch (netsType) {
      case NetsType.tinyFaceDetector:
        return new faceApi.TinyFaceDetectorOptions({
          inputSize: 608, // 160 224 320 416 512 608
          scoreThreshold: 0.5, // 0.1 ~ 0.9
        })
      case NetsType.ssdMobilenetv1:
        return new faceApi.SsdMobilenetv1Options({
          minConfidence: 0.5, // 0.1 ~ 0.9
        })
      case NetsType.mtcnn:
        return new faceApi.MtcnnOptions({
          minFaceSize: 20, // 0.1 ~ 0.9
          scaleFactor: 0.709, // 0.1 ~ 0.9
        })
    }
  }

  return (
    <Spin spinning={loading} tip="模型加载中">
      <div className="App">
        <Divider>face-api</Divider>
        <div className="container">
          <video id="videoEl" autoPlay muted playsInline />
          <canvas id="canvasEl" />
        </div>
      </div>
    </Spin>
  )
}

export default App
