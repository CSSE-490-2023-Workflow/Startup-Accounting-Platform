import { Button, FileInput, Modal, NativeSelect } from "@mantine/core";
import { useEffect, useState, useRef, useCallback} from "react";
import { allowed_stack_components, data_types } from "../../engine/datatype_def";
import DoubleSeriesInput from "./DoubleSeriesInput";
import SeriesInput from "./SeriesInput";
import NumberInput from "./NumberInput";
import { useDisclosure } from "@mantine/hooks";
import CsvImportModal from "./CsvImportModal";

function InputModal(props: any) {
  //const handleStateChange = props.handleStateChange
  const id = props.blockId
  const tmp = props.val
  console.log(tmp)
  const [ val, setVal ] = useState(tmp)
  const valCap = props.valCap
  const type = props.inputType
  const name = props.inputName
  const editCB = props.editCB
  let inputInterface = undefined
  const [isCsvImportModalOpen, {open: openCsvImportModal, close: closeCsvImportModal}] = useDisclosure(false)

  const csvImportBtn = <>
    <Button variant="default" onClick={openCsvImportModal} style={{
      'marginTop': '10px'
    }}>Import from CSV</Button>
  </>

  if (type == data_types.dt_double_series) {
    inputInterface = (
      <>
        <h3>{name}</h3>
        <DoubleSeriesInput 
          handleStateChange={editCB} 
          inputId={id} 
          inValues={val as number[][]} 
          inputValueCap={valCap} 
        />
      </>
    )
  } else if (type == 2) {
    console.log(val)
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
    console.log('else')
  }

  const csvImportCB = (vals: any) => {
    editCB(id, null, null, null, vals)
    setVal(vals)
  }
  console.log(props)

  const title = `Specify Input Value`
  return (
    <Modal opened={props.isInputModalOpen} 
      onClose={() => {props.closeInputModal()}} 
      title={title}
    >
      {inputInterface}
      {csvImportBtn}

      <CsvImportModal
        editCB={csvImportCB}
        isCsvImportModalOpen={isCsvImportModalOpen}
        closeCsvImportModal={closeCsvImportModal}
      />
      <h3>{val}</h3>
    </Modal>
  )
}

export default InputModal