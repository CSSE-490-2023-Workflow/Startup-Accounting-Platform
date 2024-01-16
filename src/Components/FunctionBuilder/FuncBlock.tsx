import React, { ChangeEvent, useCallback, useRef, useState} from 'react';
import { id_to_builtin_func } from '../../engine/builtin_func_def'
import { Card, Input, CloseButton, CardSection, HoverCard, Button, Text, Group, NavLink, Divider, Popover} from '@mantine/core';
import { IconBoxMargin } from '@tabler/icons-react';
import Draggable from 'react-draggable';
import { data_types } from '../../engine/datatype_def';
import ConnectPointsWrapper from '../ConnectPointsWrapper';
import OutputDiv from './OutputDiv';

const NODE_NAME_POPOVER_WIDTH : any = '40px';

enum direction {
  'top'= 0,
  'bot',
  'left',
  'right'
}

interface funcInfo {
  id: number;
  name: string;
}

interface StartAndEnd {
  start: string;
  end: string;
}


interface FuncProps {
  blockId: number;
  funcId: number;
  funcName: string;
  funcOptions: funcInfo[];
  paramTypes: data_types[];
  paramNames: string[];
  outputTypes: data_types[];
  outputNames: string[];
  updateBlkCB: (funcBlockId: number, funcId: number) => void;
  removeBlkCB:  (id: number) => void;
  setArrows: React.Dispatch<React.SetStateAction<StartAndEnd[]>>;
  addArrow: (value: StartAndEnd) => void;
}

const allDirs = [direction.top, direction.bot, direction.left, direction.right];

function FuncBlock(props: FuncProps) {
  const [ blkId, funcId, funcName, funcOptions, paramTypes, paramNames, outputTypes, outputNames, editCB, removeCB, setArrows, addArrow, ] = [props.blockId, props.funcId, props.funcName, props.funcOptions, props.paramTypes, props.paramNames, props.outputTypes, props.outputNames, props.updateBlkCB, props.removeBlkCB, props.setArrows, props.addArrow]

  const dragRef = useRef<Draggable>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const paramCount: number = paramTypes.length;
  const paramNodeInc: number = 100 / (paramCount + 1);
  const paramNodePos: string[] = [];

  const outputCount: number = outputTypes.length;
  const outputNodeInc: number = 100 / (outputCount + 1);
  const outputNodePos: string[] = [];

  // the side param nodes are on
  const [ paramNodeDir, setParamNodeDir ] = useState(direction.left)

  // the side output nodes are on
  const [ outputNodeDir, setOutputNodeDir ] = useState(direction.right)

  const [ showParamNodeName, setShowParamNodeName ] = useState(false);

  const [ showOutputNodeName, setShowOutputNodeName ] = useState(false);


  const changeParamNodeDir : any = useCallback((newDir: direction) => {
    setParamNodeDir(newDir);
  }, [setParamNodeDir])

  const changeOutputNodeDir : any = useCallback((newDir: direction) => {
    setOutputNodeDir(newDir);
  }, [setOutputNodeDir])

  // directions of the node menus
  const nodeMenuDir = allDirs.filter((dir) => dir !== paramNodeDir && dir !== outputNodeDir);
  

  for (let i = 1; i <= paramCount; i++) {
    paramNodePos.push(String(paramNodeInc * i - 4) + '%')
  }

  for (let i = 1; i <= outputCount; i++) {
    outputNodePos.push(String(outputNodeInc * i - 4) + '%')
  }

  const [func, setFunc] = useState(funcId);

  function handleFuncChange(e: any) {
    setFunc(e.target.value);
    editCB(blkId, e.target.value);
  }

  const func_options = funcOptions.map(({id, name} : funcInfo) => (
    <option value={id}>{name}</option>
  ))

  function handleRemoveBlock(e: any) {
    removeCB(blkId);
  }

  const paramNodes = paramNodePos.map((offset: string, index: number) => {
    let node : any = null;
    const nodeStyle : any = {};
    let faIcon : any = '';
    let faIconStyle : any = {};
    let nodeNamePos : any = '';
    let nodeNameWidth : any = '100px';
    let nodeNameStyle : any = {};
    nodeNameStyle.padding = '1px';
    nodeNameStyle.fontSize = '12px';
    nodeNameStyle.wordWrap = 'break-word';
    if (paramNodeDir === direction.left) {
      nodeStyle.top = offset;
      nodeStyle.left = '0';
      nodeStyle.width = '10px';
      nodeStyle.height = '15px';
      nodeNamePos = 'left';
      nodeNameStyle.textAlign = 'right';
      faIconStyle.transform = 'translate(0px, -5px)'
      faIcon = <><i className="fa-solid fa-chevron-right fa-xs connection-handle-icon" style={faIconStyle}></i></>
    } else if (paramNodeDir === direction.right) {
      nodeStyle.top = offset;
      nodeStyle.right = '0';
      nodeStyle.width = '10px';
      nodeStyle.height = '15px';
      nodeNamePos = 'right';
      nodeNameStyle.textAlign = 'left';
      faIconStyle.transform = 'translate(0px, -5px)'
      faIcon = <><i className="fa-solid fa-chevron-left fa-xs connection-handle-icon" style={faIconStyle}></i></>
    } else if (paramNodeDir === direction.bot) {
      nodeStyle.left = offset;
      nodeStyle.bottom = '0';
      nodeStyle.width = '15px';
      nodeStyle.height = '10px';
      nodeNamePos = 'bottom';
      nodeNameWidth = NODE_NAME_POPOVER_WIDTH;
      faIconStyle.transform = 'translate(0px, -7px)'
      faIcon = <><i className="fa-solid fa-chevron-up fa-xs connection-handle-icon" style={faIconStyle}></i></>
    } else {
      nodeStyle.left = offset;
      nodeStyle.top = '0';
      nodeStyle.width = '15px';
      nodeStyle.height = '10px';
      nodeNamePos = 'top';
      nodeNameWidth = NODE_NAME_POPOVER_WIDTH;
      faIconStyle.transform = 'translate(0px, -7px)'
      faIcon = <><i className="fa-solid fa-chevron-down fa-xs connection-handle-icon" style={faIconStyle}></i></>
    }
    const handleId : string = blkId.toString() + 'i' + index;
    return (
      <>
        <Popover opened={showParamNodeName} position={nodeNamePos} width={nodeNameWidth} styles={{
          dropdown: nodeNameStyle
        }}> 
          <Popover.Target>
            <div 
              style={nodeStyle} 
              className='connection-handle-wrapper'
              onMouseEnter={() => {setShowParamNodeName(true)}}
              onMouseLeave={() => {setShowParamNodeName(false)}}
              onDragOver={e => e.preventDefault()} 
              onDrop={e => {
                if (e.dataTransfer.getData("arrow") === handleId + "") {
                  console.log(e.dataTransfer.getData("arrow"), handleId + "");
                } else {
                  const refs = { start: e.dataTransfer.getData("arrow"), end: handleId + "" };
                  addArrow(refs);
                  console.log("droped!", refs);
                }
              }}
            > 
              <div className='connection-handle connection-handle-out' id={handleId}>
                {faIcon}
              </div>
            </div>
          </Popover.Target>
          <Popover.Dropdown>
            {paramNames[index]}
          </Popover.Dropdown>
        </Popover>
      </>
    )
  })

  const outputNodes = outputNodePos.map((offset: string, index: number) => {
    let node : any = null;
    const nodeStyle : any = {};
    let faIcon : any = '';
    let faIconStyle : any = {};
    let nodeNamePos : any = '';
    let nodeNameWidth : any = '100px';
    let nodeNameStyle : any = {};
    nodeNameStyle.padding = '0';
    nodeNameStyle.fontSize = '12px';
    if (outputNodeDir === direction.left) {
      nodeStyle.top = offset;
      nodeStyle.left = '0';
      nodeStyle.width = '10px';
      nodeStyle.height = '15px';
      nodeNamePos = 'left';
      nodeNameStyle.textAlign = 'right';
      faIconStyle.transform = 'translate(0px, -5px)'
      faIcon = <><i className="fa-solid fa-chevron-left fa-xs connection-handle-icon" style={faIconStyle}></i></>
    } else if (outputNodeDir === direction.right) {
      nodeStyle.top = offset;
      nodeStyle.right = '0';
      nodeStyle.width = '10px';
      nodeStyle.height = '15px';
      nodeNamePos = 'right';
      nodeNameStyle.textAlign = 'left';
      faIconStyle.transform = 'translate(0px, -5px)'
      faIcon = <><i className="fa-solid fa-chevron-right fa-xs connection-handle-icon" style={faIconStyle}></i></>
    } else if (outputNodeDir === direction.bot) {
      nodeStyle.left = offset;
      nodeStyle.bottom = '0';
      nodeStyle.width = '15px';
      nodeStyle.height = '10px';
      nodeNamePos = 'bottom';
      nodeNameWidth = NODE_NAME_POPOVER_WIDTH;
      faIconStyle.transform = 'translate(0px, -7px)'
      faIcon = <><i className="fa-solid fa-chevron-down fa-xs connection-handle-icon" style={faIconStyle}></i></>
    } else {
      nodeStyle.left = offset;
      nodeStyle.top = '0';
      nodeStyle.width = '15px';
      nodeStyle.height = '10px';
      nodeNamePos = 'top';
      nodeNameWidth = NODE_NAME_POPOVER_WIDTH;
      faIconStyle.transform = 'translate(0px, -7px)'
      faIcon = <><i className="fa-solid fa-chevron-up fa-xs connection-handle-icon" style={faIconStyle}></i></>
    }
    const handleId : string = blkId.toString() + 'o' + index;
    return (
      <>
        <Popover opened={showOutputNodeName} position={nodeNamePos} width={nodeNameWidth} styles={{
          dropdown: nodeNameStyle
        }}> 
          <Popover.Target>
            <OutputDiv
              style={nodeStyle} 
              onMouseEnter={() => {setShowOutputNodeName(true)}}
              onMouseLeave={() => {setShowOutputNodeName(false)}}
              id={handleId}
              faIcon={faIcon}
              dragRef={dragRef}
             />      
          </Popover.Target>
          <Popover.Dropdown>
            {outputNames[index]}
          </Popover.Dropdown>
        </Popover>
      </>
    )
  })


  const sideMenus = nodeMenuDir.map((dir) => {

    const sideMenuSelections: any = (
        <>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <NavLink
              href="#required-for-focus"
              label="Inputs"
              variant="subtle"
              className='node-menu-item'
              onClick={() => {console.log('dir changed', dir); changeParamNodeDir(dir)}}
              active
            />  
            <hr className='solid-divider' />
            <NavLink
              href="#required-for-focus"
              label="Outputs"
              variant="subtle"
              className='node-menu-item'
              onClick={() => changeOutputNodeDir(dir)}
              active
            />
          </div>  
        </>
    )

    const menuStyle: any = {};
    const sideMenuBtnStyle : any = {};
    sideMenuBtnStyle.svgW = 100;
    sideMenuBtnStyle.svgH = 10;

    if (dir === direction.bot || dir === direction.top) {
      menuStyle.width = '100';
      menuStyle.height = '10';
      sideMenuBtnStyle.svgW = '100';
      sideMenuBtnStyle.svgH = '10';
      menuStyle.position = 'absolute';
      menuStyle.left = '26%';
      menuStyle.backgroundColor = '#fff';
      if (dir === direction.bot) {
        menuStyle.bottom = '10px';
        sideMenuBtnStyle.line1x1 = 75;
        sideMenuBtnStyle.line1y1 = 2;
        sideMenuBtnStyle.line1x2 = 50;
        sideMenuBtnStyle.line1y2 = 8;
        sideMenuBtnStyle.line2x1 = 25;
        sideMenuBtnStyle.line2y1 = 2;
        sideMenuBtnStyle.line2x2 = 50;
        sideMenuBtnStyle.line2y2 = 8;
      } else { // at top
        menuStyle.top = '0px';
        sideMenuBtnStyle.line1x1 = 50;
        sideMenuBtnStyle.line1y1 = 2;
        sideMenuBtnStyle.line1x2 = 75;
        sideMenuBtnStyle.line1y2 = 8;
        sideMenuBtnStyle.line2x1 = 25;
        sideMenuBtnStyle.line2y1 = 8;
        sideMenuBtnStyle.line2x2 = 50;
        sideMenuBtnStyle.line2y2 = 2;

      }
    } else { // left or right
      menuStyle.width = '10';
      menuStyle.height = '100';
      sideMenuBtnStyle.svgW = '10';
      sideMenuBtnStyle.svgH = '100'; 
      menuStyle.height = '100';
      menuStyle.position = 'absolute';
      menuStyle.top = '18%';
      menuStyle.backgroundColor = '#fff';
      if (dir === direction.left) {
        menuStyle.left = '0px';
        sideMenuBtnStyle.line1x1 = 8;
        sideMenuBtnStyle.line1y1 = 25;
        sideMenuBtnStyle.line1x2 = 2;
        sideMenuBtnStyle.line1y2 = 50;
        sideMenuBtnStyle.line2x1 = 8;
        sideMenuBtnStyle.line2y1 = 75;
        sideMenuBtnStyle.line2x2 = 2;
        sideMenuBtnStyle.line2y2 = 50;
      } else { // right
        menuStyle.right = '10px';
        sideMenuBtnStyle.line1x1 = 2;
        sideMenuBtnStyle.line1y1 = 25;
        sideMenuBtnStyle.line1x2 = 8;
        sideMenuBtnStyle.line1y2 = 50;
        sideMenuBtnStyle.line2x1 = 2;
        sideMenuBtnStyle.line2y1 = 75;
        sideMenuBtnStyle.line2x2 = 8;
        sideMenuBtnStyle.line2y2 = 50;

      }
    }

    const sideMenu = (
      <>
        <Group justify="center" className='node-menu'>
          <HoverCard width={100} shadow="md" position='top' closeDelay={100}>
            <HoverCard.Target>
              <div className='node-menu-btn' style={menuStyle}>
                <svg width={sideMenuBtnStyle.svgW} height={sideMenuBtnStyle.svgH}>
                  <line 
                    x1={sideMenuBtnStyle.line1x1} 
                    y1={sideMenuBtnStyle.line1y1} 
                    x2={sideMenuBtnStyle.line1x2} 
                    y2={sideMenuBtnStyle.line1y2} 
                    className='node-menu-trigger-line' 
                  />
                  <line 
                    x1={sideMenuBtnStyle.line2x1}
                    y1={sideMenuBtnStyle.line2y1}
                    x2={sideMenuBtnStyle.line2x2}
                    y2={sideMenuBtnStyle.line2y2} 
                    className='node-menu-trigger-line' 
                  />
                </svg>
              </div>
            </HoverCard.Target>
            <HoverCard.Dropdown style={{
              padding: '5px',
            }}>
              {sideMenuSelections}
            </HoverCard.Dropdown>
          </HoverCard>
        </Group>
      </>
    )

    return sideMenu;
  })
  
  return (
    <>
     <Draggable
        ref={dragRef}
        onDrag={e => {
          // console.log(e);
          setArrows((arrows) => [...arrows]);
        }}
      > 
      <div className='block-container'>
      <Card 
      id={blkId + ""}
      ref={boxRef}
      className="func-block func-builder-block" 
      shadow='sm' 
      padding='lg' 
      radius='md' 
      withBorder >
        <Card.Section className='block-header'>
          <div className="block-type-desc">Function Block</div>
          <CloseButton className='block-remove' onClick={handleRemoveBlock} />
        </Card.Section>
        <CardSection>
          <hr className='solid-divider' />
        </CardSection>
        <CardSection>
          <select className="func-block-func-select" value={funcId} onChange={handleFuncChange}>
            {func_options}
          </select>
        </CardSection>
        <Card.Section>
          <div className="func-block-func-id">Current Function Id: {funcId}</div>
        </Card.Section>
      </Card>
      {paramNodes}
      {outputNodes}
      {sideMenus}
      
      {/* <ConnectPointsWrapper boxId={blkId+""} handler={outputNodeDir} dragRef={dragRef} boxRef={boxRef} /> */}
      </div>
      </Draggable>
    </>
  );
}

export default FuncBlock;

