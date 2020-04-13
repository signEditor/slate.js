import React, { memo, useCallback, useRef, useEffect } from 'react'
import { Upload, Icon, message, Button,Pagination } from 'antd';
import { css } from 'emotion'
import axios from 'axios'
import { jsonTomyJson } from '../lib/jsonTOmyJson'
import { addPageAction, setValAction,jumpPageAction } from '../store/action'
import { useDispatch ,useMappedState} from 'redux-react-hook';
const { Dragger } = Upload;
const UploadFile = props => {
    let dispatch = useDispatch()
    let addPage = useCallback(() => {
        const action = addPageAction()
        dispatch(action)
    }, [])
    let state=useMappedState(state=>state.state)
    let junpPage=useCallback((pageNumber)=>{
        console.log(pageNumber)
        if(state[pageNumber]){
            const action = jumpPageAction(pageNumber)
            dispatch(action)
        }
    })
    const componentProps = {
        name: 'file',
        multiple: false,
        showUploadList: false,
        // accept: '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        beforeUpload(file) {
            // if(!file) return
            // let { type } = file
            // if(/(document|doc|docx)$/i.test(type)) {
            //     return Promise.resolve(file)
            // } else {
            //     message.error('文件类型错误')
            //     return Promise.reject('error')
            // }
        },
        async customRequest(info) {
            let { file } = info
            let fd = new FormData()
            fd.append('docFile', file)
            console.log(file)
            let res = await axios({
                url: 'http://112.44.251.136:8090/doc/conversionDocx',
                method: 'POST',
                data: fd,
                headers: {
                    'Content-Type': 'mutipart/form-data'
                }
            })
            let { data: { code, data } } = res
            console.log(data);
            
            let json = jsonTomyJson(data)
            console.log(json)
            const action = setValAction(json)
            dispatch(action)
        },
        onChange(info) {
            const { status } = info.file;
            if (status === 'uploading') {
                message.loading('开始上传')
            }
            if (status === 'done') {
                message.success(`${info.file.name}上传成功`);
            } else if (status === 'error') {
                message.error(`${info.file.name}上传失败`);
            }
        },
    };

    let pageLength=useMappedState(state=>state.state.length)
    let pageNumber = useMappedState(state => state.pageNumber || 0)
    return (
        <div className={css`
            padding: 0 10%;
            margin-top: 30px;
        `}>
            <Dragger {...componentProps}>
                <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">点击文件上传</p>
                <p className="ant-upload-hint">
                    支持word文件
                </p>
            </Dragger>
            <Button 
            onClick={addPage}
            className={css`
                margin-top:  20px;
            `}>添加一页</Button>
            
            <Pagination className={css`
                margin-top:  20px;
            `} current={pageNumber} defaultPageSize={1}  simple total={pageLength} onChange={(e)=>{junpPage(e)}} />
            
        </div>
    )
}

export default memo(UploadFile)