import { Tab, Tabs, Box } from '@mui/material'
import { FirebaseApp } from 'firebase/app'
import React, { useState } from 'react'
import { stateUrl } from './miurac-image'
import UploadImage from './uploadImage'
import UserImages from './userImages'
import { TabPanel } from './utils/tabPanel'

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {
  editMode: boolean,
  setUrl: React.Dispatch<React.SetStateAction<stateUrl | null>>,
  app: FirebaseApp,
  getUrl: (url: string) => unknown | void,
  updateFirestore: boolean,
}

// eslint-disable-next-line no-empty-pattern
export default function ManageImages({ editMode, setUrl, app, getUrl, updateFirestore }: Props) {
  const [tabIndex, setTabIndex] = useState(0)
  return (
    <div>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabIndex} onChange={(__: unknown, v: number) => setTabIndex(v)} textColor="primary">
            <Tab label="Upload" aria-controls='upload your image' sx={theme => ({
              color: 'black'
            })} />
            <Tab label="Recent uploads" aria-controls='browse your images and select' sx={theme => ({
              color: 'black'
            })} />
          </Tabs>
        </Box>
        <TabPanel value={tabIndex} index={0}>
          <UploadImage app={app} getUrl={getUrl} editMode={editMode} setUrl={setUrl} updateFirestore={updateFirestore} />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <UserImages getUrl={getUrl} setUrl={setUrl} editMode={editMode} app={app} />
        </TabPanel>
      </Box>

    </div>
  )
}