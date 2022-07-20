import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
import { Simplemodal } from 'apps/shop/src/components/modal'
import { RootState } from 'apps/shop/src/redux/store'
import InputField from 'apps/shop/src/ui-components/Input'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import _ from "lodash"
import { serviceType } from 'apps/shop/src/redux/services'
import { RecommendedServicesCard } from './recommendedServicesCard'

type RecommendedServices = {
    setRecommended: React.Dispatch<React.SetStateAction<any[]>>
    recommended: any[]
}

export const RecommendedServices = ({ setRecommended, recommended }: RecommendedServices) => {

    const { services } = useSelector((state: RootState) => state.branches)
    const [showRecommendedForm, setShowRecommendedForm] = useState(false)
    const [searchedService, setSearchedService] = useState<serviceType[] | undefined>(undefined)
    const [addedServices, setAddedServices] = useState<Array<serviceType>>(recommended)

    const searchService = (name: string) => {
        const result = _.filter(services, (s) => {
            return s.serviceName.toLowerCase().search(name.toLowerCase()) >= 0
        })
        setSearchedService(result)
    }

    setRecommended(addedServices)

    return (
        <div >
            <div style={{padding: "10px 0px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {addedServices.map(s => (
                    <RecommendedServicesCard s={s} />
                ))}
            </div>
            {addedServices.length >0 ?
                <Button variant='contained' sx={{ width: 180 }}
                    onClick={() => setShowRecommendedForm(true)}>
                    Edit
                </Button>
                : <Button variant='contained' sx={{ width: 180 }}
                    onClick={() => setShowRecommendedForm(true)}>
                    Add
                </Button>
            }

            <Simplemodal onClose={() => setShowRecommendedForm(false)} open={showRecommendedForm}>

                <InputField placeholder='Service Name'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => searchService(e.target.value)} />

                {/* Search card */}
                <div style={{ margin: "10px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10}}>
                    {searchedService?.map(s => (
                        <Card sx={{ maxWidth: 300 }}>
                            <CardMedia
                                component="img"
                                height="100"
                                image={s?.serviceImage}
                                alt={s?.serviceName}
                            />
                            <CardContent sx={{ padding: 0 }}>
                                <Typography variant="h5" component="div">
                                    {s?.serviceName}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                {addedServices.find(m => m.id === s.id) ?
                                    < Button variant='outlined' fullWidth size="medium" color='secondary'
                                        onClick={() => {
                                            setAddedServices(addedServices.filter(m => m.id !== s.id))
                                        }}
                                    > Cancel</Button> :
                                    < Button variant='contained' fullWidth size="medium"
                                        onClick={() => {
                                            setAddedServices([...addedServices, s])
                                        }}
                                    > Add</Button>}
                            </CardActions>
                        </Card>
                    ))
                    }
                </div>

            </Simplemodal>

        </div>
    )
}
