import { Button, FileInput, Modal, NativeSelect } from "@mantine/core";
import { each } from "jquery";
import { useEffect, useState, useRef} from "react";

function CsvImportModal(props: any) {
  const [csvFile, setCsvFile] = useState<File | null>(null)
  // true: parse by row; false: parse by column
  const parseBy = useRef<String>('row')
  const parsing = useRef<boolean>(false)
  const parseMethods = ['row', 'column']

  const [inputIdxMap, inputEditCB] = [
    props.inputIdxMap,
    props.inputEditCB
  ]

  useEffect(() => {
    
  }, [csvFile]) 

  async function parse() {
    
    (csvFile as File).text().then(res => {
      
      console.log(res.split('\n'))
    })
    
  }

  return (
    <Modal opened={props.isCsvImportDialogOpen} onClose={() => {setCsvFile(null); props.closeCsvImportDialog()}} title="Import from csv">
          
      <FileInput clearable={true} 
        accept=".csv" 
        label="Read inputs from a csv file" 
        placeholder=".csv" 
        onChange={setCsvFile}
      />
      <NativeSelect 
        label="Parse by"
        onChange={(e) => {
          parseBy.current = e.currentTarget.value
        }}
        data={parseMethods}
      />
      <Button variant='default' style={{margin: '10px 0px'}} onClick=
      {() => {
        parsing.current = true
        parse().then(() => {
          parsing.current = false
        })
      }}>Parse</Button>
    </Modal>
  )
}

export default CsvImportModal