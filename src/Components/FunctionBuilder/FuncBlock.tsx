import React, { ChangeEvent, useCallback, useRef, useState} from 'react';
import { Card, Input, CloseButton, CardSection, HoverCard, Button, Text, Group, NavLink, Divider, Popover, useCombobox, Combobox, InputBase} from '@mantine/core';
import Draggable, { DraggableEvent } from 'react-draggable';
import { data_types } from '../../engine/datatype_def';
import DotlessConnectPointsWrapper from '../DotlessConnectPointsWrapper';
import { FuncType } from './FuncBuilderMain'

const NODE_NAME_POPOVER_WIDTH : any = '40px';

enum direction {
  'top'= 0,
  'bot',
  'left',
  'right'
}

interface funcInfo {
  id: string;
  name: string;
}

interface StartAndEnd {
  start: string;
  end: string;
}


interface FuncProps {
  blockId: number;
  funcType: FuncType;
  funcId: string;
  funcName: string;
  funcOptions: funcInfo[];
  paramTypes: data_types[][];
  paramNames: string[];
  outputTypes: data_types[][];
  outputNames: string[];
  blockLocation: [number, number];
  updateBlkCB: (funcBlockId: number, funcType: FuncType | null, funcId: string | null) => void;
  removeBlkCB:  (id: number) => void;
  setArrows: React.Dispatch<React.SetStateAction<StartAndEnd[]>>;
  addArrow: (value: StartAndEnd) => void;
  removeArrow: (value: string[]) => void;
  updateBlkLoc: (blkId: number, blockLocation: [number, number]) => void;
}

const allDirs = [direction.top, direction.bot, direction.left, direction.right];

function FuncBlock(props: FuncProps) {
  const [ blkId, funcId, funcType, funcName, funcOptions, paramTypes, paramNames, 
          outputTypes, outputNames, blockLoc, editCB, removeCB, setArrows, addArrow, removeArrow, updateLoc] = [
    props.blockId, 
    props.funcId, 
    props.funcType,
    props.funcName, 
    props.funcOptions, 
    props.paramTypes, 
    props.paramNames, 
    props.outputTypes, 
    props.outputNames,
    props.blockLocation, 
    props.updateBlkCB, 
    props.removeBlkCB, 
    props.setArrows, 
    props.addArrow,
    props.removeArrow,
    props.updateBlkLoc
  ]

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

  const [ showSideMenu, setShowSideMenu ] = useState([true, true, true, true]);


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

  //const [func, setFunc] = useState(funcId);

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
    const handleId : string = blkId.toString() + 'i' + (index+1).toString();
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
              onClick={() => {removeArrow([handleId])}}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                if (e.dataTransfer.getData("arrow") === handleId + "") {
                  console.log(e.dataTransfer.getData("arrow"), handleId + "");
                } else {
                  const refs = { start: e.dataTransfer.getData("arrow"), end: handleId + "" };
                  addArrow(refs);
                  console.log("dropped!", refs);
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
    const handleId : string = blkId.toString() + 'o' + (index+1).toString();
    return (
      <>
        <Popover opened={showOutputNodeName} position={nodeNamePos} width={nodeNameWidth} styles={{
          dropdown: nodeNameStyle
        }}>
          <Popover.Target>
            <div
              style={nodeStyle}
              className='connection-handle-wrapper'
              onMouseEnter={() => setShowOutputNodeName(true)}
              onMouseLeave={() => setShowOutputNodeName(false)}
            >
              <div className='connection-handle connection-handle-out' id={handleId}>
                {faIcon}
              </div>
              <DotlessConnectPointsWrapper boxId={handleId} dragRef={dragRef} boxRef={boxRef} />

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
                changeParamNodeDir(dir)
                let tmp = showSideMenu.map(e => false);
                setShowSideMenu(tmp);
                setArrows(arrows => [...arrows]);
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
                changeOutputNodeDir(dir)
                let tmp = showSideMenu.map(e => false);
                setShowSideMenu(tmp);
                setArrows(arrows => [...arrows]);
              }}
              active
            />
          </div>  
        </>
    )

    const menuStyle: any = {};
    let menuDir: any = '';
    const sideMenuBtnStyle : any = {};
    sideMenuBtnStyle.svgW = 100;
    sideMenuBtnStyle.svgH = 10;
    const sideMenuStyle : any = {
      padding: '5px'
    };
    if (dir === direction.bot || dir === direction.top) {
      menuStyle.width = '100';
      menuStyle.height = '10';
      sideMenuBtnStyle.svgW = '100';
      sideMenuBtnStyle.svgH = '10';
      menuStyle.position = 'absolute';
      menuStyle.left = '26%';
      menuStyle.backgroundColor = '#fff';
      if (dir === direction.bot) {
        menuDir = 'bottom';
        menuStyle.bottom = '10px';
        sideMenuStyle.transform = 'translate(50px, 15px)'
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
        menuStyle.top = '0px';
        sideMenuStyle.transform = 'translateX(50px)'
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
        menuDir = 'left';
        menuStyle.left = '0px';
        sideMenuStyle.transform = 'translateY(50px)'
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
        menuStyle.right = '10px';
        sideMenuStyle.transform = 'translateY(50px)'
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
          <HoverCard width={100} shadow="md" position={menuDir} closeDelay={30} disabled={showSideMenu[dir] ? false : true}>
            <HoverCard.Target>
              <div className='node-menu-btn' style={menuStyle}>
                <svg width={sideMenuBtnStyle.svgW} height={sideMenuBtnStyle.svgH} className='func-svg' onMouseEnter={() => {
                  showSideMenu[dir] = true;
                  setShowSideMenu([...showSideMenu]);
                }}>
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
            <HoverCard.Dropdown style={sideMenuStyle}>
              {sideMenuSelections}
            </HoverCard.Dropdown>
          </HoverCard>
        </Group>
      </>
    )

    return sideMenu;
  })

  function handleFuncChange(e: any) {
    //setFunc(e.target.value);
    editCB(blkId, null, e);
  }

  function switchType() {
    if (funcType == FuncType.builtin) {
      editCB(blkId, FuncType.custom, null)
    } else {
      editCB(blkId, FuncType.builtin, null);
    }
  }

  function handleRemoveBlock(e: any) {
    removeCB(blkId);
  }

  const funcCombobox = useCombobox({
    //
  });

  const funcSelectOptions = funcOptions.map(({id, name} : funcInfo) => (
    //<option value={id}>{name}</option>
    <Combobox.Option value={id.toString()} key={id} active={id === funcId}>
      <Group gap="xs">
        <span>{name}</span>
      </Group>
    </Combobox.Option>
  ))
  
  return (
    <>
     <Draggable
        ref={dragRef}
        onDrag={(e: DraggableEvent, data) => {
          const x: number =  data.x;
          const y: number = data.y;

          const newLocation: [number, number] = [x, y];

          // Update the block location using the callback
          updateLoc(blkId, newLocation);
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
        styles={{
          root: {
            height: '150px',
            width: '200px'
          },
          section: {
            padding: '0px 3px 0px 3px'
          }
        }}>
        <Card.Section className='block-header'>

          <div className="block-type-desc">
            <Combobox>
              <Combobox.Target>
                <InputBase
                  component="button"
                  type="button"
                  pointer
                  rightSection={<Combobox.Chevron />}
                  rightSectionWidth={20}
                  onClick={() => {switchType()}}
                  className='func-block-type-switch'
                >
                  {funcType == FuncType.custom ? "Custom Function" : "Built-in Function"}
                </InputBase>
              </Combobox.Target>
              <Combobox.Dropdown>
                {}
              </Combobox.Dropdown>
            </Combobox>
          </div>
          <CloseButton className='block-remove' onClick={handleRemoveBlock} />
        </Card.Section>
        <Card.Section>
          <hr className='solid-divider' />
        </Card.Section>
        <Card.Section style={{
          display: 'flex',
          flexDirection: 'row'
        }}>
          <Combobox
            store={funcCombobox}
            dropdownPadding={4}
            onOptionSubmit={(val) => {
              handleFuncChange(val);
              funcCombobox.closeDropdown();
            }}
      
          >
            <Combobox.Target>
              <InputBase
                component="button"
                type="button"
                pointer
                rightSection={<Combobox.Chevron />}
                rightSectionWidth={20}
                onClick={() => {funcCombobox.toggleDropdown()}}
                className='func-block-func-name-select'
              >
                {funcName}
              </InputBase>
            </Combobox.Target>
            <Combobox.Dropdown>
              <Combobox.Options>{funcSelectOptions}</Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
          
        </Card.Section>
        <Card.Section>
          <div className="func-block-func-id">Current Function Id: {funcId}</div>
        </Card.Section>
        <Card.Section>
          
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

