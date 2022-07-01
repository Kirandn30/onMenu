import { Button } from '@mui/material';
import { FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { ReactNode, useState } from 'react';
import EditImage from './editImage';
import ManageImages from './manageImages';
import './miurac-image.css';
import SimpleModal from './utils/simple-modal';

export type editConfigType = {
  aspectX: number,
  aspectY: number,
}
export interface MiuracImageProps {
  app: FirebaseApp,
  authComponent?: React.ReactElement,
  updateFirestore: boolean,
  editConfig: editConfigType | null,
  setUrlFunc: (url: string) => unknown | void,
  buttonComponent?: ReactNode

}

export type stateUrl = { url: string, fileName: string }

export function MiuracImage({ app, authComponent, updateFirestore, editConfig, setUrlFunc, buttonComponent }: MiuracImageProps) {
  const user = getAuth(app).currentUser
  const [url, setUrl] = useState<stateUrl | null>(null)
  const [open, setOpen] = useState(false)
  const editMode = Boolean(editConfig)

  const getUrl = (url: string) => {
    console.log("get")
    setUrlFunc(url)
    setUrl(null)
    setOpen(false)
  }
  if (user) {
    return <div >
      <SimpleModal open={open} onClose={() => setOpen(false)}>
        <ManageImages
          app={app}
          updateFirestore={updateFirestore}
          editMode={editMode}
          setUrl={setUrl}
          getUrl={getUrl}
        />
        {editConfig && url && url.url &&
          <SimpleModal open={Boolean(url)} onClose={() => setUrl(null)}>
            <EditImage
              url={url}
              updateFirestore={updateFirestore}
              editConfig={editConfig}
              getUrl={getUrl}
              app={app}
            />
          </SimpleModal>
        }
      </SimpleModal>
      {buttonComponent ? <div onClick={() => setOpen(true)}>{buttonComponent}</div> : <Button variant='contained' onClick={() => setOpen(true)}>Upload Image</Button>}

    </div>
  } else {
    return authComponent ?? <div></div>
  }


}

export default MiuracImage;



