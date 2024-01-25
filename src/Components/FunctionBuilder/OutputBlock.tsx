import React, { useCallback, useRef, useState} from 'react';
import { data_types, data_type_enum_name_pairs} from "../../engine/datatype_def"
import { Card, Input, CloseButton, CardSection, NavLink, Group, HoverCard, Popover, Pagination, useCombobox, Combobox, InputBase } from '@mantine/core';
import Draggable from 'react-draggable';

enum direction {
  'top'= 0,
  'bot',
  'left',
  'right'
}

interface StartAndEnd {
  start: string;
  end: string;
}

const allDirs = [direction.top, direction.bot, direction.left, direction.right];

interface OutProps {
  blockId: number;
  outputName: string;
  outputType: data_types | undefined; //undefined if not connected to another block
  outputIdx: number[]; //the first element is the index of the block. The second element is the # of output blocks (i.e. maximum index)
  updateBlkCB: (blkId: number, outputName: string | null, outputType: data_types | null, idx: number | null) => void;
  removeBlkCB: (blkId: number) => void;
  addArrow: (value: StartAndEnd) => void;
  //addArrow: (value: Arrow) => void;
  setArrows: React.Dispatch<React.SetStateAction<StartAndEnd[]>>;
  //setArrows: React.Dispatch<React.SetStateAction<Arrow[]>>;
  removeArrow: (value: string[]) => void;
}

function OutputBlock(props: OutProps) {
  const [ outputId, outputName, oType, [outputIdx, maxIdx], editCB, removeCB, addArrow, setArrows, removeArrow] = [
    props.blockId, 
    props.outputName, 
    props.outputType,
    props.outputIdx,
    props.updateBlkCB, 
    props.removeBlkCB, 
    props.addArrow, 
    props.setArrows,
    props.removeArrow
  ];
  //const [ outputName, setName] = useState(name);
  //const [ outputType, setOutputType ] = useState(oType);
  //const [ outputIdx, setOutputIdx ] = useState(idx);

  const dragRef = useRef<Draggable>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const paramCount: number = 1;
  const paramNodeInc: number = 100 / (paramCount + 1);
  const paramNodePos: string[] = [];

  // the side output nodes are on
  const [ paramNodeDir, setParamNodeDir ] = useState(direction.left)
  
  // whether to show side menus 
  const [ showSideMenu, setShowSideMenu ] = useState([true, true, true, true]);

  // controlls node name popover state
  const [ showNodeName, setShowNodeName ] = useState(false);

  // Is this even necessary?
  const changeParamNodeDir : any = useCallback((newDir: direction) => {
    setParamNodeDir(newDir);
  }, [setParamNodeDir])

  // directions of the node menus
  const nodeMenuDir = allDirs.filter((dir) => dir !== paramNodeDir);

  for (let i = 1; i <= paramCount; i++) {
    paramNodePos.push(String(paramNodeInc * i - 4) + '%')
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
      nodeNameWidth = '50px';
      faIconStyle.transform = 'translate(0px, -7px)'
      faIcon = <><i className="fa-solid fa-chevron-up fa-xs connection-handle-icon" style={faIconStyle}></i></>
    } else {
      nodeStyle.left = offset;
      nodeStyle.top = '0';
      nodeStyle.width = '15px';
      nodeStyle.height = '10px';
      nodeNamePos = 'top';
      nodeNameWidth = '50px';
      faIconStyle.transform = 'translate(0px, -7px)'
      faIcon = <><i className="fa-solid fa-chevron-down fa-xs connection-handle-icon" style={faIconStyle}></i></>
    }
    const handleId : string = outputId.toString() + 'i1'
    return (
      <>
        <Popover opened={showNodeName} position={nodeNamePos} width={nodeNameWidth} styles={{
          dropdown: nodeNameStyle
        }}> 
          <Popover.Target>
            <div 
              style={nodeStyle} 
              className='connection-handle-wrapper'
              onMouseEnter={() => {setShowNodeName(true)}}
              onMouseLeave={() => {setShowNodeName(false)}}
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
              }}>
              <div className='connection-handle connection-handle-out' id={handleId}>
                {faIcon}
              </div>
            </div>
          </Popover.Target>
          <Popover.Dropdown>
            {outputName}
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
          <HoverCard width={100} shadow="md" position={menuDir} closeDelay={30} disabled={showSideMenu[dir] ? false : true}>
            <HoverCard.Target >
              <div className='node-menu-btn' style={sideMenuBtnWrapperStyle}>
                <svg 
                  width={sideMenuBtnStyle.svgW} 
                  height={sideMenuBtnStyle.svgH}
                  className='func-svg'
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

  function handleNameChange(e: any) {
    //setName(e.target.value);
    editCB(outputId, e.target.value, null, null);
  }

  function handleRemoveBlock(e: any) {
    removeCB(outputId);
  }

  function handleIdxChange(i: number) {
    //setOutputIdx(e.target.value);
    editCB(outputId, null, null, i);
  }

  const typeCombobox = useCombobox({
    //onDropdownClose: () => combobox.resetSelectedOption()
  });

  const idxCombobox = useCombobox({

  })

  const idxOptions = [...Array(maxIdx).keys()].map(idx => idx+1).map(i => (
    <Combobox.Option value={i.toString()} key={i} active={i === outputIdx}>
      <Group gap="xs">
        <span>{i}</span>
      </Group>
    </Combobox.Option>
  ))

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
    <Card className="output-block func-builder-block" shadow='sm' padding='lg' radius='md' withBorder styles={{
      root: {
        height: '150px',
        width: '200px'
      },
      section: {
        padding: '0px 3px 0px 3px'
      }
    }}>
      <Card.Section className='block-header'>
        <div className="block-type-desc">Output Block</div>
        <CloseButton className='block-remove' onClick={handleRemoveBlock} />
      </Card.Section>
      <CardSection>
        <hr className='solid-divider' />
      </CardSection>
      <Card.Section>
        <Input className="output-block-name" onChange={handleNameChange} value={outputName} variant="filled" placeholder="Output Name" />
      </Card.Section>
      <CardSection>
        <hr className='solid-divider' />
      </CardSection>
      <Card.Section style={{
        display: 'flex',
        flexDirection: 'row'
      }}>
        <Combobox
          store={typeCombobox}
        >
          <Combobox.Target>
            <InputBase
              component="button"
              type="button"
              pointer
              rightSection={<Combobox.Chevron />}
              rightSectionWidth={20}
              className='output-block-type-input'
            >
              {oType == undefined ? 'undefined' : data_type_enum_name_pairs[oType][1]}
            </InputBase>
          </Combobox.Target>
          <Combobox.Dropdown>
            {}
          </Combobox.Dropdown>
        </Combobox>
        <Combobox
          onOptionSubmit={(val) => {
            handleIdxChange(Number(val));
            idxCombobox.closeDropdown();
          }
          }
          store={idxCombobox}
          dropdownPadding={4}
        >
          <Combobox.Target>
            <InputBase
              component="button"
              type="button"
              pointer
              onClick={() => {idxCombobox.toggleDropdown()}}
              className='output-block-idx-input'
            >
              {outputIdx}
            </InputBase>
          </Combobox.Target>
          <Combobox.Dropdown>
            <Combobox.Options>{idxOptions}</Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
      </Card.Section>
    </Card>
    {paramNodes}
    {sideMenus}
    </div>
    </Draggable>
    </>
  );
}

export default OutputBlock;
