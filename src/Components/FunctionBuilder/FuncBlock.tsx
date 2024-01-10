import React, { ChangeEvent, useCallback, useRef, useState} from 'react';
import { id_to_builtin_func } from '../../engine/builtin_func_def'
import { Card, Input, CloseButton, CardSection, HoverCard, Button, Text, Group, NavLink, Divider, Popover} from '@mantine/core';
import { IconBoxMargin } from '@tabler/icons-react';
import { nodeName } from 'jquery';
import Draggable from 'react-draggable';
import { data_types } from '../../engine/datatype_def';
import ConnectPointsWrapper from '../ConnectPointsWrapper';

const NODE_NAME_POPOVER_WIDTH : any = '40px';

enum direction {
  'top'= 0,
  'bot',
  'left',
  'right'
}

<<<<<<< HEAD
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
  outputTypes: data_types[];
  updateBlkCB: (funcBlockId: number, funcId: number) => void;
  removeBlkCB:  (id: number) => void;
  setArrows: React.Dispatch<React.SetStateAction<StartAndEnd[]>>;
  addArrow: (value: StartAndEnd) => void;
}

const allDirs = [direction.top, direction.bot, direction.left, direction.right];

function FuncBlock(props: FuncProps) {
  const [ blkId, funcId, funcName, funcOptions, paramTypes, outputTypes, editCB, removeCB, setArrows, addArrow ] = [props.blockId, props.funcId, props.funcName, props.funcOptions, props.paramTypes, props.outputTypes, props.updateBlkCB, props.removeBlkCB, props.setArrows, props.addArrow]
=======
const NODE_NAME_POPOVER_WIDTH : any = '40px';

const allDirs = [direction.top, direction.bot, direction.left, direction.right];

function FuncBlock(props: any) {
  const [ blkId, funcId, funcName, funcOptions, paramTypes, paramNames, outputTypes, outputNames, editCB, removeCB ] = [
    props.blockId, 
    props.funcId, 
    props.funcName, 
    props.funcOptions, 
    props.paramTypes, 
    props.paramNames,
    props.outputTypes, 
    props.outputNames,
    props.updateBlkCB, 
    props.removeBlkCB
  ]

  console.log(paramNames)
  console.log(outputNames)
>>>>>>> origin/QJFunctionBuilder

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

<<<<<<< HEAD
  const [ showParamNodeName, setShowParamNodeName ] = useState(false);

  const [ showOutputNodeName, setShowOutputNodeName ] = useState(false);

=======
  const [ showSideMenu, setShowSideMenu ] = useState([true, true, true, true]);
  //const [ showSideMenu, setShowSideMenu ] = useState(false);
>>>>>>> origin/QJFunctionBuilder

  const changeParamNodeDir : any = useCallback((newDir: direction) => {
    setParamNodeDir(newDir);
  }, [setParamNodeDir])

  const changeOutputNodeDir : any = useCallback((newDir: direction) => {
    setOutputNodeDir(newDir);
  }, [setOutputNodeDir])

  // directions of the node menus
  const nodeMenuDir = allDirs.filter((dir) => dir !== paramNodeDir && dir !== outputNodeDir);

  // controlls node name popover state
  const [ showParamNodeName, setShowParamNodeName ] = useState(false);

  const [ showOutputNodeName, setShowOutputNodeName ] = useState(false);
  

  for (let i = 1; i <= paramCount; i++) {
<<<<<<< HEAD
=======
    // applying a fixed translation to account for its size
>>>>>>> origin/QJFunctionBuilder
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
    return (
      <>
        <Popover opened={showParamNodeName} position={nodeNamePos} width={nodeNameWidth} styles={{
          dropdown: nodeNameStyle
        }}> 
          <Popover.Target>
            <div className='connection-handle connection-handle-in' 
              style={nodeStyle} 
              onMouseEnter={() => {setShowParamNodeName(true)}}
              onMouseLeave={() => {setShowParamNodeName(false)}}
            >
              {faIcon}
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
    return (
      <>
        <Popover opened={showOutputNodeName} position={nodeNamePos} width={nodeNameWidth} styles={{
          dropdown: nodeNameStyle
        }}> 
          <Popover.Target>
            <div className='connection-handle connection-handle-out' 
              style={nodeStyle} 
              onMouseEnter={() => {setShowOutputNodeName(true)}}
              onMouseLeave={() => {setShowOutputNodeName(false)}}
            >
              {faIcon}
            </div>
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
              onClick={() => {
                changeParamNodeDir(dir);
                let tmp = showSideMenu.map(e => false);
                setShowSideMenu(tmp);
                
              }}
              active
            />  
            <hr className='solid-divider' />
            <NavLink
              href="#required-for-focus"
              label="Outputs"
              variant="subtle"
              className='node-menu-item'
              onClick={() => {
                
                changeOutputNodeDir(dir);
                let tmp = showSideMenu.map(e => false);
                setShowSideMenu(tmp);
                
              }}
              active
            />
          </div>  
        </>
    )

    const sideMenuBtnWrapperStyle: any = {};
    const sideMenuBtnStyle : any = {};
    const sideMenuStyle : any = {
      padding: '5px'
    };
    let menuDir: any = '';
    sideMenuBtnStyle.svgW = 100;
    sideMenuBtnStyle.svgH = 10;

    if (dir === direction.bot || dir === direction.top) {
      sideMenuBtnWrapperStyle.width = '100';
      sideMenuBtnWrapperStyle.height = '10';
      sideMenuBtnStyle.svgW = '100';
      sideMenuBtnStyle.svgH = '10';
      sideMenuBtnWrapperStyle.position = 'absolute';
      sideMenuBtnWrapperStyle.left = '26%';
      sideMenuBtnWrapperStyle.backgroundColor = '#fff';
      if (dir === direction.bot) {
        menuDir = 'bottom';
        sideMenuStyle.transform = 'translate(50px, 15px)'
        sideMenuBtnWrapperStyle.bottom = '10px';
        sideMenuBtnStyle.line1x1 = 75;
        sideMenuBtnStyle.line1y1 = 2;
        sideMenuBtnStyle.line1x2 = 50;
        sideMenuBtnStyle.line1y2 = 8;
        sideMenuBtnStyle.line2x1 = 25;
        sideMenuBtnStyle.line2y1 = 2;
        sideMenuBtnStyle.line2x2 = 50;
        sideMenuBtnStyle.line2y2 = 8;
      } else { // at top
        menuDir = 'top';
        sideMenuStyle.transform = 'translateX(50px)'
        sideMenuBtnWrapperStyle.top = '0px';
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
      sideMenuBtnWrapperStyle.width = '10';
      sideMenuBtnWrapperStyle.height = '100';
      sideMenuBtnStyle.svgW = '10';
      sideMenuBtnStyle.svgH = '100'; 
      sideMenuBtnWrapperStyle.height = '100';
      sideMenuBtnWrapperStyle.position = 'absolute';
      sideMenuBtnWrapperStyle.top = '18%';
      sideMenuBtnWrapperStyle.backgroundColor = '#fff';
      if (dir === direction.left) {
        menuDir = 'left';
        sideMenuStyle.transform = 'translateY(50px)'
        sideMenuBtnWrapperStyle.left = '0px';
        sideMenuBtnStyle.line1x1 = 8;
        sideMenuBtnStyle.line1y1 = 25;
        sideMenuBtnStyle.line1x2 = 2;
        sideMenuBtnStyle.line1y2 = 50;
        sideMenuBtnStyle.line2x1 = 8;
        sideMenuBtnStyle.line2y1 = 75;
        sideMenuBtnStyle.line2x2 = 2;
        sideMenuBtnStyle.line2y2 = 50;
      } else { // right
        menuDir = 'right';
        sideMenuStyle.transform = 'translateY(50px)'
        sideMenuBtnWrapperStyle.right = '10px';
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
          <HoverCard width={100} shadow="md" position={menuDir} closeDelay={100} disabled={showSideMenu[dir] ? false : true}>
            <HoverCard.Target >
              <div className='node-menu-btn' style={sideMenuBtnWrapperStyle}>
                <svg 
                  width={sideMenuBtnStyle.svgW} 
                  height={sideMenuBtnStyle.svgH} 
                  onMouseEnter={() => {

                    //let tmp = showSideMenu.map(e => true);
                    //setShowSideMenu(tmp);
                    
                    showSideMenu[dir] = true;
                    setShowSideMenu([...showSideMenu]);
                    
                    //showSideMenu[dir] = true;
                    //setShowSideMenu(showSideMenu);
                  }}
                >
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
            <HoverCard.Dropdown style={sideMenuStyle} className='side-menu-dropdown'>
              {sideMenuSelections}
            </HoverCard.Dropdown>
          </HoverCard>
        </Group>
      </>
    )

    return sideMenu;
  })
  

const dragRef = useRef<Draggable>(null);
const boxRef = useRef<HTMLDivElement>(null);
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
      withBorder
      onDragOver={e => e.preventDefault()}
      onDrop={e => {
        if (e.dataTransfer.getData("arrow") === blkId + "") {
          console.log(e.dataTransfer.getData("arrow"), blkId + "");
        } else {
          const refs = { start: e.dataTransfer.getData("arrow"), end: blkId + "" };
          addArrow(refs);
          console.log("droped!", refs);
        }
      }}>
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
      <ConnectPointsWrapper boxId={blkId+""} handler={paramNodeDir} dragRef={dragRef} boxRef={boxRef} />
      </div>
      </Draggable>
    </>
  );
}

export default FuncBlock;

