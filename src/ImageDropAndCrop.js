import React, { useEffect, useState, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import ReactAvatarEditor from 'react-avatar-editor'
import styled from 'styled-components'

const DropContainer = styled.div`
  border: 1px dotted black;
  margin-bottom: 15px;
  width: 400px;
  text-align: center;
  cursor: pointer;
`

const DropCopy = styled.p`
  padding-left: 15px;
  padding-right: 15px;
`

const ThumbContainer = styled.div`
  display: inline-flex;
  marginbottom: 8px;
  marginright: 8px;
  padding: 4;
  boxsizing: border-box;
`

const Controler = styled.div`
  margin-top: 20px;
  text-align: center;
`
const Input = styled.input`
  margin-left: 15px;
  margin-right: 20px;
`
const PreviewImg = styled.img`
  display: 'block';
  width: 'auto';
  height: '100%';
  margin-bottom: 15px;
`

const ImageDropAndCrop = (props) => {
  const [file, setFile] = useState([])
  const [scale, setScale] = useState(1)
  const [preview, setPreview] = useState(1)
  const [showEditor, setShowEditor] = useState(false)
  const editor = useRef(null)

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      const droppedFile = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
      setFile(droppedFile[0])
      setShowEditor(true)
    },
  })

  const handleScale = (e) => {
    const scale = parseFloat(e.target.value)
    setScale(scale)
  }

  const handleSave = (data) => {
    const img = editor.current.getImageScaledToCanvas().toDataURL()
    setPreview(img)
  }

  useEffect(
    () => () => {
      URL.revokeObjectURL(file.preview)
    },
    [file]
  )

  const uploadImage = () => {
    const canvas = editor.current.getImage()
    canvas.toBlob((blob) => {
      props.setImage(blob)
    })
    setShowEditor(false)
  }
  return (
    <div>
      {file && file.length === 0 && (
        <DropContainer {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <DropCopy>
            {' '}
            ️Drag 'n' drop files here, or click to select files
          </DropCopy>
        </DropContainer>
      )}
      {showEditor && (
        <ThumbContainer>
          <div key={file.name}>
            <ReactAvatarEditor
              ref={editor}
              scale={parseFloat(scale)}
              width={785}
              height={455}
              rotate={0}
              border={20}
              image={file.preview}
              className="editor-canvas"
            />
            <br />
            <Controler>
              Zoom:
              <Input
                name="scale"
                type="range"
                onChange={handleScale}
                min="1"
                max="3"
                step="0.01"
                defaultValue="1"
              />
              <button type="button" onClick={handleSave}>
                Preview
              </button>
            </Controler>
            <br />
            {preview !== 1 ? <PreviewImg src={preview} /> : ''}
            {preview !== 1 ? (
              <button type="button" onClick={uploadImage}>
                Upload Image
              </button>
            ) : (
              ''
            )}
          </div>
        </ThumbContainer>
      )}
    </div>
  )
}

export default ImageDropAndCrop
