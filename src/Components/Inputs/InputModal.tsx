import { Button, FileInput, Modal, NativeSelect } from "@mantine/core";
import { useEffect, useState, useRef, useCallback} from "react";
import { allowed_stack_components, data_types } from "../../engine/datatype_def";
import DoubleSeriesInput from "./DoubleSeriesInput";
import SeriesInput from "./SeriesInput";
import NumberInput from "./NumberInput";
import { useDisclosure } from "@mantine/hooks";
import CsvImportModal from "./CsvImportModal";
import { types } from "util";

function InputModal(props: any) {
  //const handleStateChange = props.handleStateChange
  const id = props.blockId
  const [ val, setVal ] = [props.val, props.setVal]
  const valCap = props.valCap
  const type = props.inputType
  const name = props.inputName
  const editCB = props.editCB
  let inputInterface = undefined
  const [isCsvImportModalOpen, {open: openCsvImportModal, close: closeCsvImportModal}] = useDisclosure(false)

  let csvImportBtn = <></>
  if (type != data_types.dt_number) {
    csvImportBtn = <>
      <Button variant="default" onClick={openCsvImportModal} style={{
        'marginTop': '10px'
      }}>Import from CSV</Button>
    </>
  }
  

  if (type == data_types.dt_multi_series) {
    inputInterface = (
      <>
        <h3>{name}</h3>
        <DoubleSeriesInput 
          handleStateChange={editCB} 
          inputId={id} 
          val={val} 
          inputValueCap={valCap} 
        />
      </>
    )
  } else if (type == 2) {
    //console.log(val)
    inputInterface = (
      <>
        <h3>{name}</h3>
        
        <SeriesInput 
          handleStateChange={editCB} 
          inputId={id} 
          inputValueCap={valCap} 
          val={val}
          setVal={setVal}
        />
      </>
    )
  } else if (type == data_types.dt_number) {
    inputInterface = (
      <>
        <h3>{name}</h3>
        
        <NumberInput 
          handleStateChange={editCB} 
          inputIdx={null} 
          inValue={val as number} 
          inputId={id}
        />
      </>
    )
  } else {
    //console.log('else')
  }

  const csvImportCB = (vals: any) => {
    editCB(id, null, null, null, vals)
    //console.log(vals)
    setVal(vals)
  }
  //console.log(type == data_types.dt_number)

  const title = `${name}`
  return (
    <Modal opened={props.isInputModalOpen} 
      onClose={() => {props.onClose(); props.onCloseCB()}} 
      title={title}
    >
      {inputInterface}
      {csvImportBtn}

      <CsvImportModal
        editCB={csvImportCB}
        inputType={type}
        isCsvImportModalOpen={isCsvImportModalOpen}
        closeCsvImportModal={closeCsvImportModal}
        disabled={type == data_types.dt_number}
      />
      
    </Modal>
  )
}

export default InputModal