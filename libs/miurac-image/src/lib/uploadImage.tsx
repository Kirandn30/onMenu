import { Button, CircularProgress, Typography } from '@mui/material'
import { FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone';
import usePreviewImage from './hooks/previewHook';
import useStorage from './hooks/useStorage';
import UploadIcon from "./images/upload.svg"
import { stateUrl } from './miurac-image';

type Props = {
  editMode: boolean,
  setUrl: React.Dispatch<React.SetStateAction<stateUrl | null>>,
  app: FirebaseApp,
  getUrl: (url: string) => unknown | void,
  updateFirestore: boolean,
}


export default function UploadImage({ editMode, setUrl, app, getUrl, updateFirestore }: Props) {
  const [previewUpload, setpreviewUpload] = useState<null | string>(null)
  const user = getAuth(app).currentUser
  const { upload, loading } = useStorage({ app, updateFirestore })

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', ".svg", ".jpg", ".jpeg"]
    }
  });

  const previewUploads = usePreviewImage(acceptedFiles[0])
  const handlePreview = async () => {
    if (editMode) {
      setUrl({ url: previewUploads.preview, fileName: acceptedFiles[0]?.name })
    } else {
      try {
        const url = await upload({ file: acceptedFiles[0], path: `uploads/${user?.uid}/images`, fileName: acceptedFiles[0].name }) as string
        getUrl(url)
      } catch (err) {
        console.log(err);

      }
    }
  }
  useEffect(() => {
    if (previewUploads.preview) {
      handlePreview()
    }
  }, [previewUploads.preview])
  if (loading) return <CircularProgress />
  return (
    <div>
      {previewUpload ? (
        <div>
          <img height={200} width={200} src={previewUpload} alt="uploaded img" />
          <div style={{ display: "flex", columnGap: "20px", justifyContent: "center", paddingTop: "30px" }}>
            <Button variant='outlined' onClick={() => setpreviewUpload("")}>Cancel</Button>
            <Button variant='contained' >Save</Button>
          </div>
        </div>
      ) : (
        <section style={{ cursor: "pointer" }}>
          <div {...getRootProps({ className: 'dropzone' })} style={{ padding: "40px 30px 0px" }}>
            <input {...getInputProps()} />
            <div style={{ textAlign: "center" }}><img src={UploadIcon} alt="upload" /></div>
            <Typography variant='caption' display="block" color={'GrayText'} align='center'>click to upload or drop files to upload</Typography>
          </div>
        </section>
      )}
    </div>
  )
}