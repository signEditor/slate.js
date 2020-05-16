import React, { memo } from 'react'
import ToolWrapper from './toolComponent'
import { UploadImg } from '../lib/el'
import DropdownItem from './dropdownItem'
import { css } from 'emotion'
import DraggableIcon from './draggableIcon'
import { useDispatch } from 'redux-react-hook';
const DragableItem = ({providedDraggable, snapshot, snapshotDraggable, item, index, pageIndex, type}) => {
    const dispatch = useDispatch()
    return (
        <div>
            <div
                className={css`
                    display: flex;
                    justify-content: center;
                    position: relative;
                    &:hover > span {
                        opacity: ${snapshot.isDraggingOver ? '0' : '1'}
                    }
                    opacity: ${snapshotDraggable.isDragging ? '0.5' : '1'}
                `}
                ref={providedDraggable.innerRef}
                {...providedDraggable.draggableProps}
            >
                <ToolWrapper
                    item={item}
                    snapshot={snapshot}
                    pageIndex={pageIndex}
                    index={index}
                    type={type}
                />
                <DraggableIcon providedDraggable={providedDraggable} />
                {
                    type === 'addImage' ?
                        <div
                            className={css`
                                width: 716px;
                                box-sizing: border-box;
                                transition: all 0.15s;
                                margin: 5px 0;
                                padding: 5px;
                                box-shadow: ${item.showToolbar && !snapshot.isDraggingOver ? '0 0 0 1px #bee1c7' : 'none'};
                            `}
                        >
                            <UploadImg dispatch={dispatch} editor={item.editor} pageIndex={pageIndex} index={index} />
                        </div>
                        :
                        <DropdownItem
                            editor={item.editor}
                            value={item.content}
                            pageIndex={pageIndex}
                            isFocused={item.showToolbar && !snapshot.isDraggingOver}
                        />
                }
            </div>
        </div>
    )
}


export default memo(DragableItem) 