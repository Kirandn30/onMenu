import { Button, Dialog, IconButton } from '@mui/material';
import Clear from '@mui/icons-material/Clear';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import styles from "../styles/dish.add.form.module.scss";
import { v4 as uuidv4 } from 'uuid';
import _ from "lodash";
import './options.css'


export default function Options({ options, setOptions, ...rop }: any) {
    const { register: register2, handleSubmit: handleSubmit2, setValue: setValue2, getValues: getValues2, reset: reset2, formState: { errors: errors2 } } = useForm()
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [titleError, setTitleError] = useState(false)
    const [selectedindex, setSelectedindex] = useState(null)
    const [innerOptions, setInnerOptions] = useState<Array<any>>([])
    const [innerError, setInnerError] = useState(false)
    const [currentId, setCurrentId] = useState<string | null>(null)

    const addInner = (data: any) => {
        var id = uuidv4()
        if (!data.maxallow) {
            setInnerOptions([...innerOptions, { ...data, id, maxallow: 1 }])
        } else {
            setInnerOptions([...innerOptions, { ...data, id }])
        }
        reset2({ name: '', price: '' })
        setInnerError(false)
    }
    const resetFields = () => {
        reset2({ name: '', price: '', title: '', maxallow: '' })
        setInnerOptions([])
        setInnerError(false)
        setTitle('')
        setTitleError(false)
        setCurrentId(null)
    }
    useEffect(() => {
        if (!open) {
            resetFields()
        }
    }, [open])
    return (
        <div
        >
            {/* <div className={styles["pictorial"]} style={{ margin: "1.5rem auto",}}>
                <label style={{ fontSize: "1.5rem"}}>Options </label>
            </div> */}
            <div>
                {options.map((option: any, index: number) => (
                    <div style={{
                        display: "flex",
                        justifyContent: 'space-between',
                        fontSize: 16,
                        padding: 8,
                        borderRadius: 8,
                        border: '1px solid #0094ff',
                        backgroundColor: '#0094ff22',
                        color: '#0094ff',
                        width: 400,
                        marginTop: 12
                    }}>
                        <div
                            style={{ width: "100px " }}
                        >
                            {option.title}
                        </div>
                        <Button
                            style={{
                                width: 100,
                                display: "inline-block",
                                color: '#0094ff',
                                marginLeft: 50
                            }}
                        >
                            max allow : {option.maxallow}
                        </Button>
                        <div style={{ display: "flex", width: 150 }}>
                            <Button
                                style={{
                                    width: 50,
                                    display: "inline-block",
                                    color: '#0094ff'
                                }}
                                onClick={() => {
                                    setOpen(true)
                                    setTitle(option.title)
                                    setInnerOptions(option.innerOptions)
                                    setCurrentId(option.id)
                                    setValue2('maxallow', option.maxallow)
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                style={{
                                    width: 50,
                                    display: "inline-block",
                                    color: '#0094ff'
                                }}
                                onClick={() => {
                                    var target = options.filter((o: any) => o.id !== option.id)
                                    setOptions(target)
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
                <br />
                <br />
            </div>
            <div
                className={styles["fields-container"]}
            >
                <Button sx={{ width: 250 }} variant="contained"
                    onClick={() => {
                        setOpen(true)
                        setCurrentId(uuidv4())
                    }}>
                    Add Options
                </Button>
            </div>
            <Dialog
                // hideBackdrop
                open={open}
                onClose={() => setOpen(false)}
            >
                <div
                    style={{ minWidth: 500, padding: '16px 50px' }}
                >
                    <div style={{ textAlign: "center", fontSize: "1.5rem", marginBottom: "2.5rem" }} >
                        Add Options
                    </div>
                    <div
                        className={styles["variant__container--price"]}
                        style={{ display: "flex", justifyContent: "space-between", width: 400, margin: 'auto' }}>
                        <label>Title:</label>
                        <input
                            type="text"
                            // {...register(`title`, {
                            // required: true,
                            // min: 2,
                            // })}
                            className='option-input'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    {titleError &&
                        <div style={{ color: 'red' }} >
                            title is required. provide correct title
                        </div>
                    }
                    <br />
                    {(innerOptions.length > 0) &&
                        <>
                            <div
                                className={styles["variant__container--price"]}
                                style={{ display: "flex", justifyContent: "space-between", width: 400, margin: 'auto' }}>
                                <label>max allowed:</label>
                                {/* <select
                    type="number"
                    {...register(`maxallow`, {
                    required: true,
                    min: 1,
                    })}
                /> */}
                                <select
                                    {...register2(`maxallow`, {
                                        required: true,
                                    })}
                                    style={{ height: 28, width: 100 }}
                                    onChange={e => setValue2('maxallow', e.target.value)}
                                    className='option-input'
                                >
                                    {[...Array(innerOptions.length).keys()].map(num => (
                                        <option value={num + 1}>{num + 1}</option>
                                    ))}
                                </select>
                            </div>
                            {errors2['maxallow'] &&
                                <div style={{ color: 'red' }} >
                                    please select maximum allowed
                                </div>
                            }
                        </>
                    }
                    <br />
                    <table
                        style={{ margin: 'auto' }}
                    >
                        {(innerOptions.length > 0) && <thead
                        // style={{ display: "flex", justifyContent: "space-between"}}

                        >
                            <tr>

                                <td
                                    style={{ fontSize: "1.5rem", marginBottom: 16 }}
                                >
                                    Preference
                                </td>
                                <td
                                    style={{ fontSize: "1.5rem", marginBottom: 16 }}
                                >
                                    Name
                                </td>
                                <td
                                    style={{ fontSize: "1.5rem", marginBottom: 16 }}
                                >
                                    Price
                                </td>
                                <td>

                                </td>
                            </tr>
                        </thead>}
                        <tbody>

                            {innerOptions.map((inner, i) => (
                                <tr
                                // style={{ display: "flex", justifyContent: "space-between",alignItems:'flex-start'}}
                                >
                                    <td
                                        style={{ marginBottom: 16 }}
                                    >
                                        {inner.preference}
                                    </td>
                                    <td
                                        style={{ marginBottom: 16 }}
                                    >
                                        {inner.name}
                                    </td>
                                    <td
                                        style={{ marginBottom: 16 }}
                                    >
                                        {inner.price}
                                    </td>
                                    <td>
                                        <IconButton size='small'
                                            onClick={() => {
                                                var filtered = innerOptions.filter(v => v.id !== inner.id)
                                                setInnerOptions(filtered)
                                            }}

                                        >
                                            <Clear />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}

                        </tbody>

                    </table>
                    <br />
                    <br />
                    <div

                    >
                        <form


                        >
                            <div
                                className={styles["variant__container--price"]}
                                style={{ display: "flex", justifyContent: "center" }}
                            >
                                <div
                                // style={{margin:8}}
                                >
                                    <label>Option Name</label>
                                    <div>
                                        <input
                                            type="text"
                                            style={{ height: 28, }}
                                            {...register2(`name`, {
                                                required: true,
                                                min: 1,
                                            })}
                                            className='option-input'
                                        />
                                    </div>
                                </div>
                                <div
                                    style={{ width: 100 }}
                                >
                                    <label>Price</label>
                                    <div>
                                        <input
                                            type="number"
                                            style={{ height: 28, width: 96 }}
                                            {...register2(`price`, {
                                                required: true,
                                                min: 0,
                                            })}
                                            className='option-input'
                                        />
                                    </div>
                                </div>
                                <div
                                // style={{margin:8}}
                                >
                                    <label>&ensp;</label>
                                    <div>
                                        <input
                                            type="submit"
                                            value=' Add '
                                            style={{
                                                backgroundColor: '#0094ff',
                                                color: '#fff',
                                                height: 28,
                                                padding: '4px 8px',
                                                border: 'none',
                                                borderRadius: 4,
                                                margin: 1

                                            }}
                                            onClick={handleSubmit2(addInner)}
                                        // {...register(`maxallow`, {
                                        // required: true,
                                        // min: 1,
                                        // })}
                                        />
                                    </div>
                                </div>
                            </div>
                            {innerError && <div style={{ color: 'red' }}>
                                Add atleast one option before submit
                            </div>}
                        </form>
                        <br />
                        <br />
                        <br />

                    </div>
                    <div
                        style={{ display: 'flex', justifyContent: 'space-evenly' }}
                    >
                        <div>
                            <Button
                                variant='contained'
                                onClick={() => {
                                    setOpen(false)
                                    resetFields()
                                }}
                            >
                                Close
                            </Button>
                            &ensp;
                            &ensp;
                            <Button
                                variant='contained'
                                onClick={() => resetFields()}
                            >
                                reset
                            </Button>
                        </div>
                        <Button
                            variant='contained'
                            color='primary'
                            style={{ backgroundColor: '#0094ff' }}
                            onClick={() => {
                                if (innerOptions.length === 0) {
                                    setInnerError(true)
                                }
                                else if (!title) {
                                    setTitleError(true)
                                }
                                else {
                                    setTitleError(false)
                                    setInnerError(false)
                                    const newArray = innerOptions.map(({ maxallow, ...keepAttrs }) => keepAttrs)
                                    const target = {
                                        title,
                                        maxallow: getValues2("maxallow"),
                                        innerOptions: newArray,
                                        id: currentId,
                                    }
                                    var check = options.filter((o: any) => o.id === currentId)
                                    if (check.length > 0) {
                                        var index = options.findIndex((o: any) => o.id === currentId)
                                        // console.log(index);
                                        var copy = [...options]
                                        copy[index] = target
                                        setOptions(copy)
                                    } else {
                                        setOptions([...options, target])
                                    }
                                    setOpen(false)
                                    resetFields()

                                }
                            }}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}
