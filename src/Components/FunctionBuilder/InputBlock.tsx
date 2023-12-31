import React, { useCallback, useState} from 'react';
import { data_types } from "../../engine/datatype_def"
import { Card, Input, CloseButton, CardSection, NavLink, Group, HoverCard} from '@mantine/core';

enum direction {
  'top'= 0,
  'bot',
  'left',
  'right'
}

const allDirs = [direction.top, direction.bot, direction.left, direction.right];

function InputBlock(props: any) {
  const [ id, name, type, typeOptions, editCB, removeCB ] = [props.blockId, props.inputName, props.inputType, props.inputTypeOptions, props.updateBlkCB, props.removeBlkCB]
  const [inputName, setName] = useState(name)
  const [inputType, setType] = useState(type)

  const outputCount: number = 1;
  const outputNodeInc: number = 100 / (outputCount + 1);
  const outputNodePos: string[] = [];

  // the side output nodes are on
  const [ outputNodeDir, setOutputNodeDir ] = useState(direction.right)

  const [ showSideMenu, setShowSideMenu ] = useState([true, true, true, true]);
  //const [ showSideMenu, setShowSideMenu ] = useState(false);

  // Is this even necessary?
  const changeOutputNodeDir : any = useCallback((newDir: direction) => {
    setOutputNodeDir(newDir);
  }, [setOutputNodeDir])

  // directions of the node menus
  const nodeMenuDir = allDirs.filter((dir) => dir !== outputNodeDir);

  for (let i = 1; i <= outputCount; i++) {
    outputNodePos.push(String(outputNodeInc * i) + '%')
  }

  const outputNodes = outputNodePos.map((offset: string) => {
    let node : any = null;
    const nodeStyle : any = {};
    if (outputNodeDir === direction.left) {
      nodeStyle.top = offset;
      nodeStyle.left = '0';
    } else if (outputNodeDir === direction.right) {
      nodeStyle.top = offset;
      nodeStyle.right = '0';
    } else if (outputNodeDir === direction.bot) {
      nodeStyle.left = offset;
      nodeStyle.bottom = '0';
    } else {
      nodeStyle.left = offset;
      nodeStyle.top = '0';
    }
    return (
      <>
        <div className='connection-handle' style={nodeStyle}>
        </div>
      </>
    )
  })

  function handleNameChange(e: any) {
    setName(e.target.value);
    editCB(id, e.target.value, inputType);
  }

  function handleTypeChange(e: any) {
    setType(e.target.value);
    editCB(id, inputName, e.target.value);
  }

  function handleRemoveBlock(e: any) {
    removeCB(id);
  }

  const data_types_options = typeOptions.map(([id, dt_name] : [data_types, string]) => (
    <option value={id}>{dt_name}</option>
  ))

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
  

  /**
   * <div className="input-block-id">{id}</div>
   */
  return (
    <div className='block-container'>
    <Card className="input-block func-builder-block" shadow='sm' padding='lg' radius='md' withBorder>
      <Card.Section className='block-header'>
        <div className="block-type-desc">Input Block</div>
        <CloseButton className='block-remove' onClick={handleRemoveBlock} />
      </Card.Section>
      <CardSection>
        <hr className='solid-divider' />
      </CardSection>
      <CardSection>
        <Input className="input-block-name" onChange={handleNameChange} value={inputName} variant="filled" placeholder="Input Name" />
      </CardSection>
      <Card.Section>
        <select className="input-block-type" value={inputType} onChange={handleTypeChange}>
          {data_types_options}
        </select>
      </Card.Section>
    </Card>
    {outputNodes}
    {sideMenus}
    </div>
  );
}

export default InputBlock;