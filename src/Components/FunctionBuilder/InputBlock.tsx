import React, { ChangeEvent, useCallback, useRef, useState} from 'react';
import { data_types } from "../../engine/datatype_def"
import { StartAndEnd, Arrow } from './FuncBuilderMain'
import { Card, Input, CloseButton, CardSection, NavLink, Group, HoverCard, Popover, Pagination, Combobox, CheckIcon, useCombobox, InputBase} from '@mantine/core';
import '../../assets/font-awesome/css/all.css'
import Draggable, { DraggableEvent } from 'react-draggable';
import DotlessConnectPointsWrapper from "../DotlessConnectPointsWrapper";

enum direction {
  'top'= 0,
  'bot',
  'left',
  'right'
}


// interface StartAndEnd {
//   start: string;
//   end: string;
// }

const allDirs = [direction.top, direction.bot, direction.left, direction.right];

interface InputProps {
  blockId: number;
  inputName: string;
  inputType: data_types;
  inputTypeOptions: [data_types, string][];
  inputIdx: number[]; //the first entry is the current index. The second entry is the # of input blocks (i.e. maximum index)
  blockLocation: [number, number];
  updateBlkCB: (funcBlockId: number, inputName: string | null, inputType: data_types | null, idx: number | null) => void;
  removeBlkCB:  (id: number) => void;
  setArrows: React.Dispatch<React.SetStateAction<StartAndEnd[]>>;
  updateBlkLoc: (blkId: number, blockLocation: [number, number]) => void;
  //setArrows: React.Dispatch<React.SetStateAction<Arrow[]>>;
}

function InputBlock(props: InputProps) {
  const [ inputId, inputName, inputType, typeOptions, [inputIdx, maxIdx], blockLoc, editCB, removeCB , setArrows, updateLoc] = [
    props.blockId, 
    props.inputName, 
    props.inputType, 
    props.inputTypeOptions, 
    props.inputIdx,
    props.blockLocation,
    props.updateBlkCB, 
    props.removeBlkCB, 
    props.setArrows,
    props.updateBlkLoc
  ]
  
  const dragRef = useRef<Draggable>(null);
  const boxRef =  useRef<HTMLDivElement>(null);
  
  //const [ inputName, setName ] = useState(name);
  //const [ inputType, setType ] = useState(type);
  //const [ inputIdx, setInputIdx ] = useState(idx);

  const outputCount: number = 1;
  const outputNodeInc: number = 100 / (outputCount + 1);
  const outputNodePos: string[] = [];

  // the side output nodes are on
  const [ outputNodeDir, setOutputNodeDir ] = useState(direction.right)

  // whether to show side menus. Used to disable side menu rendering when menu position changes
  const [ showSideMenu, setShowSideMenu ] = useState([true, true, true, true]);

  // controlls node name popover state
  const [ showNodeName, setShowNodeName ] = useState(false);

  // Is this even necessary?
  const changeOutputNodeDir : any = useCallback((newDir: direction) => {
    setOutputNodeDir(newDir);
  }, [setOutputNodeDir])

  // directions of the node menus
  const nodeMenuDir = allDirs.filter((dir) => dir !== outputNodeDir);

  for (let i = 1; i <= outputCount; i++) {
    outputNodePos.push(String(outputNodeInc * i - 4) + '%')
  }

  const outputNodes = outputNodePos.map((offset: string) => {
    let node : any = null;
    const nodeStyle : any = {};
    let faIcon : any = '';
    let faIconStyle : any = {};
    let nodeNamePos : any = '';
    let nodeNameWidth : any = '100px';
    let nodeNameStyle : any = {};
    nodeNameStyle.padding = '0';
    nodeNameStyle.fontSize = '12px';
    //nodeNameStyle.background = 'rgba(0,0,0,0.1)';
    nodeNameStyle.width = 'auto'
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
      faIconStyle.transform = 'translate(0px, -5px)';
      faIcon = <><i className="fa-solid fa-chevron-right fa-xs connection-handle-icon" style={faIconStyle}></i></>
    } else if (outputNodeDir === direction.bot) {
      nodeStyle.left = offset;
      nodeStyle.bottom = '0';
      nodeStyle.width = '15px';
      nodeStyle.height = '10px';
      nodeNamePos = 'bottom';
      faIconStyle.transform = 'translate(0px, -7px)'
      nodeNameWidth = '50px'
      faIcon = <><i className="fa-solid fa-chevron-down fa-xs connection-handle-icon" style={faIconStyle}></i></>
    } else {
      nodeStyle.left = offset;
      nodeStyle.top = '0';
      nodeStyle.width = '15px';
      nodeStyle.height = '10px';
      nodeNamePos = 'top';
      faIconStyle.transform = 'translate(0px, -7px)'
      nodeNameWidth = '50px'
      faIcon = <><i className="fa-solid fa-chevron-up fa-xs connection-handle-icon" style={faIconStyle}></i></>
    }

    const handleId : string = inputId.toString() + 'o1';
    return (
      <>
        <Popover opened={showNodeName} arrowSize={3} position={nodeNamePos} width={nodeNameWidth} styles={{
          dropdown: nodeNameStyle
        }}> 
          <Popover.Target>

            <div
              style={nodeStyle} 
              className='connection-handle-wrapper'
              onMouseEnter={() => {setShowNodeName(true)}}
              onMouseLeave={() => {setShowNodeName(false)}}
            >
              <div className='connection-handle connection-handle-out' id={handleId}>
              {faIcon}
              </div>
              {/* <ConnectPointsWrapper boxId={id} handler={1} dragRef={dragRef} boxRef={boxRef} /> */}
              <DotlessConnectPointsWrapper boxId={handleId} dragRef={dragRef} boxRef={boxRef} />
            </div>
    
          </Popover.Target>
          <Popover.Dropdown>
            {inputName}
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
                setArrows(arrows => [...arrows]);
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
    editCB(inputId, e.target.value, null, null);
  }

  function handleTypeChange(t: number) {
    //setType(t);
    editCB(inputId, null, t, null);
  }

  function handleRemoveBlock(e: any) {
    removeCB(inputId);
  }

  function handleIdxChange(i: number) {
    //setInputIdx(i);
    editCB(inputId, null, null, i);
  }

  const typeCombobox = useCombobox({
    //onDropdownClose: () => combobox.resetSelectedOption()
  });

  const idxCombobox = useCombobox({

  })

  const daat = typeOptions.map(([id, dt_name] : [data_types, string]) => (
    <option value={id}>{dt_name}</option>
  ))

  const dataTypeOptions = typeOptions.map(([typeId, dt_name]) => (
    <Combobox.Option value={typeId.toString()} key={dt_name} active={typeId === inputType}>
      <Group gap="xs">
        {typeId === inputType && <CheckIcon size={8} />}
        <span>{dt_name}</span>
      </Group>
    </Combobox.Option>
  ));
  
  // the 1st map is because we need to change to 1-based indexing
  const idxOptions = [...Array(maxIdx).keys()].map(idx => idx+1).map(idx => (
    <Combobox.Option value={idx.toString()} key={idx} active={idx === idx}>
      <Group gap="xs">
        <span>{idx}</span>
      </Group>
    </Combobox.Option>
  ))

  /**
   * <div className="input-block-id">{id}</div>
   */
  return (
    <>
    {/* <Draggable cancel='.connection-handle-icon'
        ref={dragRef}
        onDrag={(e: DraggableEvent, data) => {
          const x: number =  data.x;
          const y: number = data.y;

          const newLocation: [number, number] = [x, y];

          // Update the block location using the callback
          updateLoc(inputId, newLocation);
          setArrows((arrows) => [...arrows]);
        }}
      >  */}
    <div className='block-container'>
    <Card className="input-block func-builder-block" shadow='sm' padding='lg' radius='md' withBorder styles={{
      root: {
        height: '150px',
        width: '200px'
      },
      section: {
        padding: '0px 5px 0px 5px'
      }
    }}>
      <Card.Section className='block-header'>
        <div className="block-type-desc">Input Block</div>
        <CloseButton className='block-remove' onClick={handleRemoveBlock} />
      </Card.Section>
      <CardSection>
        <hr className='solid-divider' />
      </CardSection>
      <Card.Section>
        <Input className="input-block-name" onChange={handleNameChange} value={inputName} variant="filled" placeholder="Input Name"/>
      </Card.Section>
      <CardSection>
        <hr className='solid-divider' />
      </CardSection>
      <Card.Section>
        {/* <select className="input-block-type" value={inputType} onChange={handleTypeChange}>
          {data_types_options}
        </select> */}
      </Card.Section>
      <Card.Section style={{
        display: 'flex',
        flexDirection: 'row'
      }}>
        <Combobox
          onOptionSubmit={(val) => {
            handleTypeChange(Number(val));
            typeCombobox.closeDropdown();
          }
          }
          store={typeCombobox}
          dropdownPadding={4}
        >
          <Combobox.Target>
            <InputBase
              component="button"
              type="button"
              pointer
              rightSection={<Combobox.Chevron />}
              rightSectionWidth={20}
              onClick={() => {typeCombobox.toggleDropdown()}}
              className='input-block-type-input'
            >
              {typeOptions[inputType][1]}
            </InputBase>
          </Combobox.Target>
          <Combobox.Dropdown>
            <Combobox.Options>{dataTypeOptions}</Combobox.Options>
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
              className='input-block-idx-input'
            >
              {inputIdx}
            </InputBase>
          </Combobox.Target>
          <Combobox.Dropdown>
            <Combobox.Options>{idxOptions}</Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
      </Card.Section>
    </Card>
    {outputNodes}
    {sideMenus}
    </div>
    </>
    
  );
}

export default InputBlock;
