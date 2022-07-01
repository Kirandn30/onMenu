import { Button, CircularProgress, ImageList, ImageListItem, Typography } from '@mui/material'
import { FirebaseApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { collection, getDocs, getFirestore, limit, orderBy, query, startAfter } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import { usePagination } from './hooks/pagination'
import { stateUrl } from './miurac-image'


type Props = {
  app: FirebaseApp,
  getUrl: (url: string) => void
  setUrl: React.Dispatch<React.SetStateAction<stateUrl | null>>,
  editMode: boolean
}

const queryLimit = 12
export default function UserImages({ app, getUrl, setUrl, editMode }: Props) {

  const { loadMore } = usePagination(app)

  const [lastVisibleRecord, setLastVisibleRecord] = useState<any>(null)
  const [imagesList, setImagesList] = useState<any>([])
  const [dosExists, setDosExists] = useState(false)
  const [loading, setLoading] = useState(true)
  const endRef = useRef<HTMLDivElement>(null)
  const db = getFirestore(app)
  const user = getAuth(app).currentUser


  useEffect(() => {
    getRecentlyUploaded()
  }, [])

  const getRecentlyUploaded = async () => {
    const q = query(collection(db, `uploads/${user?.uid}/images`), orderBy("createdAt", 'desc'), limit(queryLimit));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length === queryLimit) {
      setDosExists(true)
    }
    setImagesList(querySnapshot.docs.map((data) => ({ ...data.data(), id: data.id })))
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
    setLastVisibleRecord(lastVisible)
    setLoading(false)
  }

  if (loading) return <CircularProgress />
  return (
    <div>
      {imagesList.length > 0 ?
        <ImageList sx={{ width: "100%", height: 400 }} cols={6} rowHeight={100}>
          {imagesList.map((item: any) => (
            <ImageListItem
              key={item.id}
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (editMode) {
                  console.log('edit mode');

                  setUrl({ url: item.url, fileName: item.name })
                } else {
                  getUrl(item.url)
                }
              }}
            >
              <img
                className='images'
                loading="lazy"
                src={item.url}
                alt="recent upload"
              />
            </ImageListItem>
          ))}
        </ImageList>
        :
        <Typography align='center' variant='h6' color='GrayText' >
          upload your first picture...
        </Typography>
      }
      <div ref={endRef} />
      <div style={{ display: "flex", gap: "50px", justifyContent: "center" }}>
        {dosExists && <Button
          variant='outlined'
          onClick={() => loadMore({
            lastVisibleRecord, setLastVisibleRecord, setDosExists, setImagesList, queryLimit, setLoading
          })}
        >Load More</Button>}
      </div>
    </div >
  )
}