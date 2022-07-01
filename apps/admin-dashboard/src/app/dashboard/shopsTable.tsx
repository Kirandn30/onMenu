import React, { useEffect, useRef, useState } from 'react'
import DataTable from "react-data-table-component"
import { Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { db } from '../../../firebase';
import { collection, doc, DocumentData, getDoc, getDocs, limit, onSnapshot, orderBy, query, QueryDocumentSnapshot, startAfter, Unsubscribe, updateDoc, where, writeBatch } from 'firebase/firestore';
import { CSVLink } from "react-csv";
import FileDownloadIcon from '@mui/icons-material/FileDownload';

type ShopsTableProps = {
    filterValue: string | null
    filter: string
}

export const ShopsTable = ({ filterValue, filter }: ShopsTableProps) => {

    const navigate = useNavigate()
    const [shops, setShops] = useState<RootObject[]>([])
    const [loading, setLoading] = useState(true)
    const shopsCollectionRef = collection(db, "admin")
    const [shopsCount, setShopsCount] = useState(0)
    // const [rowsCount, setRowsCount] = useState(10)
    const [lastVisibleRecords, setlastVisibleRecords] = useState<QueryDocumentSnapshot<DocumentData>[]>([])
    const shopsRef = collection(db, "admin")
    const [currentPage, setCurrentPage] = useState(1)


    // useDidMountEffect(() => {
    //     if (filterValue === "") getDos()
    //     getFilterValues()
    // }, [filterValue, rowsCount])

    let unsub: Unsubscribe
    useDidMountEffect(() => {
        // if (!filterValue) return

        if (filterValue) {
            const strlength = filterValue.length
            const strFrontCode = filterValue.slice(0, strlength - 1)
            const strEndCode = filterValue.slice(strlength - 1, filterValue.length)
            const endcode = strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1)
            const q = query(shopsCollectionRef, where(filter, ">=", filterValue), where(filter, "<", endcode), limit(10))
            unsub = onSnapshot(q, (querySnapshot) => {
                const Doc = querySnapshot.docs.map((shops: any) => ({ ...shops.data(), id: shops.id }))
                setShops(Doc)
                const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
                setlastVisibleRecords([lastVisible])
            })
        } else if (!filterValue || filterValue === "") {
            const first = query(shopsRef, orderBy("created"), limit(10))
            unsub = onSnapshot(first, (querySnapshot) => {
                const Doc = querySnapshot.docs.map((shop: any) => ({ ...shop.data(), id: shop.id }))
                const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
                setlastVisibleRecords([...lastVisibleRecords, lastVisible])
                setShops(Doc)
                setLoading(false)
            });
        }

        return () => unsub()

    }, [filterValue])

    useEffect(() => {
        getCount()
    }, [])


    const getCount = async () => {
        const docRef = doc(db, "additional Info", "count")
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return
        setShopsCount(docSnap.data()['count'])
    }

    // let unsub: Unsubscribe
    useEffect(() => {
        if (currentPage > 1) {
            const next = query(shopsRef, orderBy("created"), startAfter(lastVisibleRecords[currentPage - 2]), limit(10))
            // eslint-disable-next-line react-hooks/exhaustive-deps
            unsub = onSnapshot(next, (querySnapshot) => {
                const Doc = querySnapshot.docs.map((shops: any) => ({ ...shops.data(), id: shops.id }))
                const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
                setlastVisibleRecords([...lastVisibleRecords, lastVisible])
                setShops(Doc)
                console.log(Doc);

                setLoading(false)
            });
        } else {
            const first = query(shopsRef, orderBy("created"), limit(10))
            unsub = onSnapshot(first, (querySnapshot) => {
                const Doc = querySnapshot.docs.map((shop: any) => ({ ...shop.data(), id: shop.id }))
                const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
                setlastVisibleRecords([...lastVisibleRecords, lastVisible])
                setShops(Doc)
                setLoading(false)
            });
        }

        return () => unsub()
    }, [currentPage])


    // const handlePageChange = async (page: number) => {
    //     // if (page > 1) {
    //     //     const next = query(shopsRef,
    //     //         orderBy("created"),
    //     //         startAfter(lastVisibleRecords[page - 2]),
    //     //         limit(rowsCount));
    //     //     const querySnapshot = await getDocs(next)
    //     //     const Doc = querySnapshot.docs.map((shop: any) => ({ ...shop.data(), id: shop.id }))
    //     //     const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
    //     //     setlastVisibleRecords([...lastVisibleRecords, lastVisible])
    //     //     setShops(Doc)
    //     //     setLoading(false)

    //     // } else {
    //     //     // getDos()
    //     // }
    // }



    const customStyles = {
        rows: {
            style: {
                minHeight: '60px',
                paddingLeft: "15px"
            },
        },
        headCells: {
            style: {
                minHeight: "80px",
                paddingLeft: '20px',
                paddingRight: '8px',
                textAlign: "center",
            },
        },
        cells: {
            style: {
                paddingLeft: '10px',
                paddingRight: '10px',
                textAlign: "center",
            },
        },
    };


    const columns = [
        {
            name: <Typography style={{ color: "#3c3c43" }} variant='h6'>Shops</Typography>,
            cell: (data: RootObject) => <Typography style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
            }}>{data.shopName}</Typography>,
            grow: 0.5,
            sortable: true,

        },
        {
            name: <Typography style={{ color: "#3c3c43" }} variant='h6'>Email</Typography>,
            cell: (data: RootObject) => <Typography style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
            }} variant='subtitle2'>{data.adminEmail}</Typography>,
            grow: 0.5,
            // sortable: true,
        },
        {
            name: <Typography style={{ color: "#3c3c43" }} variant='h6'>URL</Typography>,
            cell: (data: RootObject) =>
                <Typography variant='subtitle2' style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                }}><a style={{ textDecoration: "none", color: "#3c3c43" }} href={data.url}>{data.url}</a> </Typography>,
            grow: 1,
        },
        {
            name: <Typography style={{ color: "#3c3c43" }} variant='h6'>Remarks</Typography>,
            cell: (data: RootObject) => <Typography style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
            }} variant='subtitle2'>{data.remarks}</Typography>,
            grow: 0.5,
            // sortable: true,
        },
        {
            name: <Typography style={{ color: "#3c3c43" }} align='center' variant='h6'>Actions</Typography>,
            cell: (data: RootObject) => <div style={{ display: "flex", gap: "10px" }}>
                <Button onClick={() => navigate(`/edit/${data.id}`)} variant='outlined'>Edit</Button>
                <Button color={data.enabled ? "error" : "primary"} variant='contained' onClick={() => change(data.shopId, data.enabled)}>{data.enabled ? "Disable" : "enable"}</Button>
            </div>,
            grow: 0.5,
            // sortable: true,
        },
        {
            name: <Typography style={{ color: "#3c3c43" }} variant='h6'>Start Date</Typography>,
            cell: (data: any) => <Typography style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
            }} variant='subtitle2'>{data.startDate.toDate().toLocaleString()}</Typography>,
            grow: 0.5,
            // sortable: true,
        },
        {
            name: <Typography style={{ color: "#3c3c43" }} variant='h6'>End Date</Typography>,
            cell: (data: any) => <Typography style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
            }} variant='subtitle2'>{data.endDate.toDate().toLocaleString()}</Typography>,
            grow: 0.5,
            // sortable: true,
        }
    ]

    const change = async (id: string, enabled: boolean) => {
        try {
            const batch = writeBatch(db)
            batch.update(doc(db, "admin", id), {
                enabled: !enabled
            });
            batch.update(doc(db, "roles", id), {
                enabled: !enabled
            });
            batch.update(doc(db, "shops", id), {
                enabled: !enabled
            });
            await batch.commit()
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div style={{
            margin: "auto", width: "95vw",
            borderRadius: "20px", padding: "0px 0px 0px",
            boxShadow: "0px 4px 8px rgba(154, 207,255,0.15)"
        }}>
            {/* <Export shops={shops} /> */}
            <DataTable
                columns={columns}
                data={shops}
                customStyles={customStyles}
                progressPending={loading}
                fixedHeader
                fixedHeaderScrollHeight='65vh'
                paginationComponentOptions={{ noRowsPerPage: true }}
                highlightOnHover
                pagination
                paginationTotalRows={shopsCount}
                paginationServer
                onChangePage={(page) => setCurrentPage(page)}
            // onChangeRowsPerPage={(count) => setRowsCount(count)}
            />
        </div>
    )
}


const Export = ({ shops }: any) => {

    return <CSVLink style={{ color: "black" }} data={shops}>
        <FileDownloadIcon />
    </CSVLink>
}



export interface OnBoardDate {
    seconds: number;
    nanoseconds: number;
}

export interface DueDate {
    seconds: number;
    nanoseconds: number;
}

export interface EndDate {
    seconds: number;
    nanoseconds: number;
}

export interface StartDate {
    seconds: number;
    nanoseconds: number;
}

export interface Created {
    seconds: number;
    nanoseconds: number;
}

export interface RootObject {
    url: string;
    adminEmail: string;
    onBoardDate: OnBoardDate;
    premium: number;
    razorpayId: string;
    qrImage: string;
    area: string;
    city: string;
    dueDate: DueDate;
    shopId: string;
    role: string;
    businessType: string;
    endDate: EndDate;
    longitude: number;
    latitude: number;
    registered: boolean;
    address: string;
    shopName: string;
    startDate: StartDate;
    created: Created;
    enabled: boolean;
    remarks: string;
    id: string;
}

const useDidMountEffect = (func: any, deps: any) => {
    const didMount = useRef(false);

    useEffect(() => {
        if (didMount.current) func();
        else didMount.current = true;
    }, deps);
}
